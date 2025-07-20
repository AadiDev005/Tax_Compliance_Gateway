package cache

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "sync"
    "time"
    
    "github.com/go-redis/redis/v8"
)

type CacheEntry struct {
    Value     interface{} `json:"value"`
    ExpiresAt time.Time   `json:"expires_at"`
    HitCount  int         `json:"hit_count"`
    CreatedAt time.Time   `json:"created_at"`
}

type IntelligentCache struct {
    l1Cache     *sync.Map
    redisClient *redis.Client
    l1TTL       time.Duration
    l2TTL       time.Duration
    stats       *CacheStats
    mu          sync.RWMutex
}

type CacheStats struct {
    L1Hits   int64 `json:"l1_hits"`
    L2Hits   int64 `json:"l2_hits"`
    Misses   int64 `json:"misses"`
    Sets     int64 `json:"sets"`
    Deletes  int64 `json:"deletes"`
}

type CacheHitInfo struct {
    Found bool   `json:"found"`
    Layer string `json:"layer"`
    TTL   int64  `json:"ttl_seconds"`
}

func NewIntelligentCache(redisClient *redis.Client) *IntelligentCache {
    return &IntelligentCache{
        l1Cache:     &sync.Map{},
        redisClient: redisClient,
        l1TTL:       5 * time.Minute,   // Hot cache
        l2TTL:       30 * time.Minute,  // Warm cache
        stats:       &CacheStats{},
    }
}

func (c *IntelligentCache) Get(ctx context.Context, key string) (interface{}, CacheHitInfo) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    
    // L1 Cache (In-Memory) - Fastest
    if value, exists := c.l1Cache.Load(key); exists {
        entry := value.(CacheEntry)
        if time.Now().Before(entry.ExpiresAt) {
            // Update hit count
            entry.HitCount++
            c.l1Cache.Store(key, entry)
            c.stats.L1Hits++
            
            log.Printf("CACHE_L1_HIT: %s (hits: %d)", key, entry.HitCount)
            return entry.Value, CacheHitInfo{
                Found: true,
                Layer: "L1_MEMORY",
                TTL:   int64(time.Until(entry.ExpiresAt).Seconds()),
            }
        }
        c.l1Cache.Delete(key)
    }
    
    // L2 Cache (Redis) - Distributed
    if c.redisClient != nil {
        result, err := c.redisClient.Get(ctx, key).Result()
        if err == nil {
            var entry CacheEntry
            if json.Unmarshal([]byte(result), &entry) == nil {
                // Promote to L1 for faster access
                c.l1Cache.Store(key, CacheEntry{
                    Value:     entry.Value,
                    ExpiresAt: time.Now().Add(c.l1TTL),
                    HitCount:  1,
                    CreatedAt: time.Now(),
                })
                c.stats.L2Hits++
                
                log.Printf("CACHE_L2_HIT: %s (promoted to L1)", key)
                return entry.Value, CacheHitInfo{
                    Found: true,
                    Layer: "L2_REDIS",
                    TTL:   int64(time.Until(entry.ExpiresAt).Seconds()),
                }
            }
        }
    }
    
    // Cache miss
    c.stats.Misses++
    log.Printf("CACHE_MISS: %s", key)
    return nil, CacheHitInfo{Found: false, Layer: "MISS", TTL: 0}
}

func (c *IntelligentCache) Set(ctx context.Context, key string, value interface{}) error {
    c.mu.Lock()
    defer c.mu.Unlock()
    
    // Store in L1 Cache
    l1Entry := CacheEntry{
        Value:     value,
        ExpiresAt: time.Now().Add(c.l1TTL),
        HitCount:  0,
        CreatedAt: time.Now(),
    }
    c.l1Cache.Store(key, l1Entry)
    
    // Store in L2 Cache (Redis)
    if c.redisClient != nil {
        l2Entry := CacheEntry{
            Value:     value,
            ExpiresAt: time.Now().Add(c.l2TTL),
            HitCount:  0,
            CreatedAt: time.Now(),
        }
        entryJSON, err := json.Marshal(l2Entry)
        if err == nil {
            c.redisClient.Set(ctx, key, entryJSON, c.l2TTL)
        }
    }
    
    c.stats.Sets++
    log.Printf("CACHE_SET: %s (stored in L1 + L2)", key)
    return nil
}

func (c *IntelligentCache) Delete(ctx context.Context, key string) error {
    c.mu.Lock()
    defer c.mu.Unlock()
    
    c.l1Cache.Delete(key)
    if c.redisClient != nil {
        c.redisClient.Del(ctx, key)
    }
    c.stats.Deletes++
    log.Printf("CACHE_DELETE: %s", key)
    return nil
}

func (c *IntelligentCache) GetStats() map[string]interface{} {
    c.mu.RLock()
    defer c.mu.RUnlock()
    
    l1Count := 0
    c.l1Cache.Range(func(key, value interface{}) bool {
        l1Count++
        return true
    })
    
    total := c.stats.L1Hits + c.stats.L2Hits + c.stats.Misses
    hitRate := 0.0
    if total > 0 {
        hitRate = float64(c.stats.L1Hits+c.stats.L2Hits) / float64(total) * 100
    }
    
    return map[string]interface{}{
        "l1_cache_entries": l1Count,
        "l1_hits":          c.stats.L1Hits,
        "l2_hits":          c.stats.L2Hits,
        "cache_misses":     c.stats.Misses,
        "cache_sets":       c.stats.Sets,
        "cache_deletes":    c.stats.Deletes,
        "hit_rate_percent": fmt.Sprintf("%.2f", hitRate),
        "l1_ttl_minutes":   c.l1TTL.Minutes(),
        "l2_ttl_minutes":   c.l2TTL.Minutes(),
        "total_requests":   total,
    }
}

func (c *IntelligentCache) Clear(ctx context.Context) error {
    c.mu.Lock()
    defer c.mu.Unlock()
    
    c.l1Cache = &sync.Map{}
    if c.redisClient != nil {
        c.redisClient.FlushDB(ctx)
    }
    c.stats = &CacheStats{}
    log.Printf("CACHE_CLEARED: All caches cleared")
    return nil
}

// Intelligent cache warming
func (c *IntelligentCache) WarmCache(ctx context.Context, commonKeys []string, valueFunc func(string) interface{}) {
    for _, key := range commonKeys {
        if value := valueFunc(key); value != nil {
            c.Set(ctx, key, value)
        }
    }
    log.Printf("CACHE_WARMED: %d keys pre-loaded", len(commonKeys))
}

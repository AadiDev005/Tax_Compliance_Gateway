package health

import (
	"context"
	"database/sql"
	"net/http"
	"tax-compliance-gateway/internal/config"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CheckHandler(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		status := CheckServices(context.Background(), cfg.PostgresURL, cfg.MongoURL, cfg.RedisURL)
		c.JSON(http.StatusOK, gin.H{
			"services": status,
			"status":   "healthy",
		})
	}
}

func CheckServices(ctx context.Context, postgresURL, mongoURL, redisURL string) map[string]string {
	status := make(map[string]string)

	// Check Postgres
	db, err := sql.Open("postgres", postgresURL)
	if err != nil {
		status["postgres"] = "error: " + err.Error()
	} else {
		defer db.Close()
		if err := db.PingContext(ctx); err != nil {
			status["postgres"] = "error: " + err.Error()
		} else {
			status["postgres"] = "healthy"
		}
	}

	// Check MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURL))
	if err != nil {
		status["mongodb"] = "error: " + err.Error()
	} else {
		defer client.Disconnect(ctx)
		if err := client.Ping(ctx, nil); err != nil {
			status["mongodb"] = "error: " + err.Error()
		} else {
			status["mongodb"] = "healthy"
		}
	}

	// Check Redis
	redisClient := redis.NewClient(&redis.Options{
		Addr: redisURL,
	})
	if _, err := redisClient.Ping(ctx).Result(); err != nil {
		status["redis"] = "error: " + err.Error()
	} else {
		status["redis"] = "healthy"
	}
	redisClient.Close()

	return status
}

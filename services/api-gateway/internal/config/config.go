package config

type Config struct {
    AppEnv      string
    PostgresURL string
    MongoURL    string
    RedisURL    string
}

func GetConfig() *Config {
    return &Config{
        AppEnv:      "development",
        PostgresURL: "postgres://tax_user:tax_password@postgres:5432/tax_compliance?sslmode=disable",
        MongoURL:    "mongodb://mongodb:27017/tax_compliance",
        RedisURL:    "redis:6379",
    }
}

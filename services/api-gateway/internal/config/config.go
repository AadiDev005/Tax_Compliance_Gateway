package config

import (
    "github.com/spf13/viper"
    "log"
)

type Config struct {
    PostgresURL  string `mapstructure:"POSTGRES_URL"`
    MongoURL     string `mapstructure:"MONGO_URL"`
    RedisURL     string `mapstructure:"REDIS_URL"`
    KafkaBrokers string `mapstructure:"KAFKA_BROKERS"`
    AppEnv       string `mapstructure:"APP_ENV"`
}

func LoadConfig() *Config {
    viper.SetConfigFile(".env")
    viper.AddConfigPath("../../..") // Look for .env in project root
    viper.AutomaticEnv()

    if err := viper.ReadInConfig(); err != nil {
        log.Fatalf("Error reading config file: %v", err)
    }

    var config Config
    if err := viper.Unmarshal(&config); err != nil {
        log.Fatalf("Error unmarshaling config: %v", err)
    }

    return &config
}

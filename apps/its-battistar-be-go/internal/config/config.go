package config

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

type Config struct {
	Auth AuthConfig
	DB   DBConfig
	HTTP HTTPConfig
}

func New() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Panic(fmt.Errorf("error loading .env file: %w", err))
	}

	return &Config{
		Auth: *LoadAuthConfig(),
		DB:   *LoadDBConfig(),
		HTTP: *LoadHTTPConfig(),
	}
}

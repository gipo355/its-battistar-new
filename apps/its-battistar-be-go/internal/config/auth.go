package config

import "os"

type AuthConfig struct {
	AccessTokenSecret  string
	RefreshTokenSecret string
}

func LoadAuthConfig() *AuthConfig {
	return &AuthConfig{
		AccessTokenSecret:  os.Getenv("ACCESS_TOKEN_SECRET"),
		RefreshTokenSecret: os.Getenv("REFRESH_TOKEN_SECRET"),
	}
}

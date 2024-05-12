package db

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/gipo355/its-battistar-be-go/internal/config"
)

func Init(cfg *config.Config) *gorm.DB {
	dataSourceName := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Rome",
		cfg.DB.Host,
		cfg.DB.User,
		cfg.DB.Password,
		cfg.DB.Name,
		cfg.DB.Port,
	)

	log.Println("Connecting to database...")

	db, err := gorm.Open(postgres.Open(dataSourceName), &gorm.Config{})
	if err != nil {
		log.Panic("failed to connect to database: %w", err)
	}

	// TODO: add seeders

	return db
}

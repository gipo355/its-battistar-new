package app

import (
	"log"

	"github.com/gipo355/its-battistar-be-go/internal/config"
	"github.com/gipo355/its-battistar-be-go/internal/server"
)

func Start(cfg *config.Config) {
	app := server.New(cfg)

	// TODO: add routes

	log.Panic(app.Start(cfg.HTTP.Port))
}

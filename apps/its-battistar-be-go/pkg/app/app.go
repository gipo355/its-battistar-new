package app

import (
	"github.com/gipo355/its-battistar-be-go/internal/config"
	"github.com/gipo355/its-battistar-be-go/internal/server"
)

func Start(cfg *config.Config) {
	app := server.New(cfg)

	// TODO: add routes

	err := app.Start(cfg.HTTP.Port)
	if err != nil {
		// panic tries to end all defer functions and then it stops the execution of the program
		// it can also recover
		panic(err)
	}
}

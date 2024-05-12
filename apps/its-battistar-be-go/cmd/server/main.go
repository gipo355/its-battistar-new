package main

import (
	"github.com/gipo355/its-battistar-be-go/internal/config"
	"github.com/gipo355/its-battistar-be-go/pkg/app"
)

//	@title			Echo Battistar API
//	@version		1.0
//	@description	Echo Battistar API

//	@contact.name	gipo355
//	@contact.url	github.com/gipo355
//	@contact.email	github.com/gipo355

//	@securityDefinitions.apikey	ApiKeyAuth
//	@in							header
//	@name						Authorization

// @BasePath	/.
func main() {
	cfg := config.New()

	// TODO: add swagger

	app.Start(cfg)
}

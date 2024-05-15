//nolint:godot // ignore godot for swagger
package main

import (
	"fmt"

	"github.com/gipo355/its-battistar-be-go/docs"
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

// @BasePath	/
func main() {
	cfg := config.New()

	docs.SwaggerInfo.Host = fmt.Sprintf("%s:%s", cfg.HTTP.Host, cfg.HTTP.Port)

	app.Start(cfg)
}

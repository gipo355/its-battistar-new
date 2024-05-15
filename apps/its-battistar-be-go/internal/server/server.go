package server

import (
	"fmt"

	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
	"gorm.io/gorm"

	"github.com/gipo355/its-battistar-be-go/db"
	"github.com/gipo355/its-battistar-be-go/internal/config"
)

type Server struct {
	Echo   *echo.Echo
	DB     *gorm.DB
	Config *config.Config
}

func New(cfg *config.Config) *Server {
	return &Server{
		Echo:   echo.New(),
		DB:     db.Init(cfg),
		Config: cfg,
	}
}

func (s *Server) Start(port string) error {
	// start on /swagger/index.html
	s.Echo.GET("/swagger/*", echoSwagger.WrapHandler)

	err := s.Echo.Start(":" + port)

	// wrap the error
	return fmt.Errorf("server error: %w", err)
}

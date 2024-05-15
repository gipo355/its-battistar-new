package responses

import (
	"fmt"
	"log/slog"

	"github.com/labstack/echo/v4"
)

type Error struct {
	Error string `json:"error"`
	Code  int    `json:"code"`
}

type Data struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}

// context.Writer.Header().Set("Access-Control-Allow-Origin", "*")
// context.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
// context.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization").
func Response(c echo.Context, statusCode int, data interface{}) error {
	err := c.JSON(statusCode, data)
	if err != nil {
		slog.Error(fmt.Sprintf("Error while sending response: %v", err))
	}
	return fmt.Errorf("Error while sending response: %w", err)
}

func MessageResponse(c echo.Context, statusCode int, message string) error {
	return Response(c, statusCode, Data{
		Code:    statusCode,
		Message: message,
	})
}

func ErrorResponse(c echo.Context, statusCode int, message string) error {
	return Response(c, statusCode, Error{
		Code:  statusCode,
		Error: message,
	})
}

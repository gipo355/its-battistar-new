package requests

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type BasicAuth struct {
	Email    string `json:"email"    validate:"required" example:"john.doe@example.com"`
	Password string `json:"password" validate:"required" example:"11111111"`
}

func (ba *BasicAuth) Validate() error {
	// TODO: move to a global validator for caching
	validate := validator.New(validator.WithRequiredStructEnabled())

	err := validate.Struct(ba)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		if len(errors) == 0 {
			return fmt.Errorf("validation error: %w", err)
		}

		return fmt.Errorf("validation error: %w", errors)
	}

	return nil
}

type LoginRequest struct {
	BasicAuth
}

type RegisterRequest struct {
	BasicAuth
	Name string `json:"name" validate:"required" example:"John Doe"`
}

func (rr RegisterRequest) Validate() error {
	err := rr.BasicAuth.Validate()
	if err != nil {
		return err
	}

	// TODO: move to a global validator for caching
	validate := validator.New(validator.WithRequiredStructEnabled())

	err = validate.Struct(rr)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		if len(errors) == 0 {
			return fmt.Errorf("validation error: %w", err)
		}

		return fmt.Errorf("validation error: %w", errors)
	}

	return nil
}

type RefreshRequest struct {
	Token string `json:"token" validate:"required" example:"refresh_token"`
}

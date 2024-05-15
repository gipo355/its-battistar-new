package requests

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type BasicPost struct {
	Title   string `json:"title"   validate:"required" example:"Echo"`
	Content string `json:"content" validate:"required" example:"Echo is nice!"`
}

func (bp *BasicPost) Validate() error {
	// TODO: move to a global validator for caching
	validate := validator.New(validator.WithRequiredStructEnabled())

	err := validate.Struct(bp)
	if err != nil {
		errors := err.(validator.ValidationErrors)
		if len(errors) == 0 {
			return fmt.Errorf("validation error: %w", err)
		}

		return fmt.Errorf("validation error: %w", errors)
	}

	return nil
}

type CreatePostRequest struct {
	BasicPost
}

type UpdatePostRequest struct {
	BasicPost
}

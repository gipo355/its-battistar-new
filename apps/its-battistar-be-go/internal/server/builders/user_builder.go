package builders

import "github.com/gipo355/its-battistar-be-go/internal/models"

type UserBuilder struct {
	email    string
	name     string
	password string
}

func NewUserBuilder() *UserBuilder {
	return &UserBuilder{
		email:    "",
		name:     "",
		password: "",
	}
}

func (userBuilder *UserBuilder) SetEmail(email string) *UserBuilder {
	userBuilder.email = email
	return userBuilder
}

func (userBuilder *UserBuilder) SetName(name string) *UserBuilder {
	userBuilder.name = name
	return userBuilder
}

func (userBuilder *UserBuilder) SetPassword(password string) *UserBuilder {
	userBuilder.password = password
	return userBuilder
}

func (userBuilder *UserBuilder) Build() models.User {
	user := models.User{
		Email:    userBuilder.email,
		Name:     userBuilder.name,
		Password: userBuilder.password,
	}

	return user
}

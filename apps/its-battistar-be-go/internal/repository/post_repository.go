package repositories

import (
	"gorm.io/gorm"

	"github.com/gipo355/its-battistar-be-go/internal/models"
)

type PostRepositoryQ interface {
	GetPosts(posts *[]models.Post)
	GetPost(post *models.Post, id int)
}

type PostRepository struct {
	DB *gorm.DB
}

func NewPostRepository(db *gorm.DB) *PostRepository {
	return &PostRepository{DB: db}
}

func (postRepository *PostRepository) GetPosts(posts *[]models.Post) {
	postRepository.DB.Preload("User").Find(posts)
}

func (postRepository *PostRepository) GetPost(post *models.Post, id int) {
	postRepository.DB.Where("id = ? ", id).Find(post)
}
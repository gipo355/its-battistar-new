package responses

import "github.com/gipo355/its-battistar-be-go/internal/models"

type PostResponse struct {
	Title    string `json:"title"    example:"Echo"`
	Content  string `json:"content"  example:"Echo is nice!"`
	Username string `json:"username" example:"John Doe"`
	ID       uint   `json:"id"       example:"1"`
}

func NewPostResponse(posts []models.Post) *[]PostResponse {
	postResponse := make([]PostResponse, len(posts))

	for i := range posts {
		postResponse[i] = PostResponse{
			Title:    posts[i].Title,
			Content:  posts[i].Content,
			Username: posts[i].User.Name,
			ID:       posts[i].ID,
		}
	}

	return &postResponse
}

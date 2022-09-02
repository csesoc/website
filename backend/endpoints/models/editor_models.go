package models

import "github.com/google/uuid"

// ValidEditRequest represents a valid request that can be send to the editor endpoint
type (
	ValidEditRequest struct {
		DocumentID uuid.UUID
	}
)

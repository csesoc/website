package models

import (
	"mime/multipart"

	"github.com/google/uuid"
)

// Request models outline the general model that an incoming request to a handler must satisfy
type (
	// ValidImageUploadRequest is the request model for an handler that uploads an IMAGE to a docker volume
	ValidImageUploadRequest struct {
		Parent      uuid.UUID
		LogicalName string `schema:"LogicalName,required"`
		OwnerGroup  int    `schema:"OwnerGroup,required"`
		Image       multipart.File
	}

	// ValidImageUploadRequest is the request model for an handler that uploads an IMAGE to a docker volume
	ValidDocumentUploadRequest struct {
		Parent       uuid.UUID `schema:"Parent,required"`
		DocumentName string    `schema:"DocumentName,required"`
		Content      string    `schema:"Content,required"` // TODO: Add check that content is valid JSON
	}

	// ValidPublishDocumentRequest is the request model for any handler that publishes a document
	ValidPublishDocumentRequest struct {
		DocumentID uuid.UUID `schema:"DocumentID,required"`
	}

	// ValidGetPublishedDocumentRequest is the response model for any handler that fetches information from
	// the published volume
	ValidGetPublishedDocumentRequest struct {
		DocumentID uuid.UUID `schema:"DocumentID,required"`
	}
)

package models

import "mime/multipart"

// Request models outline the general model that an incoming request to a handler must satisfy
type (
	// ValidImageUploadRequest is the request model for an handler that uploads an IMAGE to a docker volume
	ValidImageUploadRequest struct {
		Parent      int
		LogicalName string `schema:"LogicalName,required"`
		OwnerGroup  int    `schema:"OwnerGroup,required"`
		Image       multipart.File
	}

	// ValidPublishDocumentRequest is the request model for any handler that publishes a document
	ValidPublishDocumentRequest struct {
		DocumentID int `schema:"DocumentID,required"`
	}

	// ValidGetPublishedDocumentRequest is the response model for any handler that fetches information from
	// the published volume
	ValidGetPublishedDocumentRequest struct {
		DocumentID int `schema:"DocumentID,required"`
	}
)

// Response models outline the general format a HTTP handler response follows
type (
	// DocumentRetrievalResponse is just the returned response for any handler that fetches the contents of a docker volume
	DocumentRetrievalResponse struct {
		Contents string
	}
)

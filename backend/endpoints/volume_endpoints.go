package endpoints

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strings"

	"cms.csesoc.unsw.edu.au/database/repositories"
	. "cms.csesoc.unsw.edu.au/endpoints/models"
)

// UploadImage takes an image from a request and uploads it to the published docker volume
func UploadImage(form ValidImageUploadRequest, df DependencyFactory) handlerResponse[NewEntityResponse] {
	unpublishedVol := df.GetUnpublishedVolumeRepo()
	repository := df.GetFilesystemRepo()
	log := df.GetLogger()

	// Remember to close all multipart forms
	defer form.Image.Close()

	entityToCreate := repositories.FilesystemEntry{
		LogicalName: form.LogicalName, ParentFileID: form.Parent,
		IsDocument: false, OwnerUserId: form.OwnerGroup,
	}

	// Push the new entry into the repository
	e, err := repository.CreateEntry(entityToCreate)
	if err != nil {
		log.Write("failed to create a repository entry")
		log.Write(err.Error())
		return handlerResponse[NewEntityResponse]{
			Status: http.StatusNotAcceptable,
		}
	}

	// Create and get a new entry in docker file system
	unpublishedVol.AddToVolume(e.EntityID.String())
	if dockerFile, err := unpublishedVol.GetFromVolume(e.EntityID.String()); err != nil {
		return handlerResponse[NewEntityResponse]{Status: http.StatusInternalServerError}
	} else if _, err := io.Copy(dockerFile, form.Image); err != nil {
		log.Write("failed to write image to docker container")
		log.Write(err.Error())
		return handlerResponse[NewEntityResponse]{
			Status: http.StatusInternalServerError,
		}
	}

	log.Write(fmt.Sprintf("created new entity %v", entityToCreate))
	return handlerResponse[NewEntityResponse]{
		Response: NewEntityResponse{NewID: e.EntityID},
		Status:   http.StatusOK,
	}
}

// UploadImage takes an image from a request and uploads it to the published docker volume
func UploadDocument(form ValidDocumentUploadRequest, df DependencyFactory) handlerResponse[NewEntityResponse] {
	unpublishedVol := df.GetUnpublishedVolumeRepo()
	log := df.GetLogger()

	// fetch the target file form the unpublished volume
	filename := form.DocumentID.String()
	file, err := unpublishedVol.GetFromVolume(filename)
	if err != nil {
		log.Write(fmt.Sprintf("failed to get file: %s from volume", filename))
		log.Write(err.Error())
		return handlerResponse[NewEntityResponse]{
			Status: http.StatusNotFound,
		}
	}

	bytes, err := file.WriteString(form.Content)
	if (bytes == 0 && len(form.Content) != 0) || err != nil {
		log.Write("was an error writing to file")
		log.Write(err.Error())
		return handlerResponse[NewEntityResponse]{
			Status: http.StatusInternalServerError,
		}
	}

	return handlerResponse[NewEntityResponse]{
		Response: NewEntityResponse{NewID: form.DocumentID},
		Status:   http.StatusOK,
	}
}

// PublishDocument takes in DocumentID and transfers the document from unpublished to published volume if it exists
func PublishDocument(form ValidPublishDocumentRequest, df DependencyFactory) handlerResponse[empty] {
	unpublishedVol := df.GetUnpublishedVolumeRepo()
	publishedVol := df.GetPublishedVolumeRepo()
	log := df.GetLogger()

	// fetch the target file form the unpublished volume
	filename := form.DocumentID.String()
	file, err := unpublishedVol.GetFromVolume(filename)
	if err != nil {
		log.Write(fmt.Sprintf("failed to get file: %s from volume", filename))
		log.Write(err.Error())
		return handlerResponse[empty]{
			Status: http.StatusNotFound,
		}
	}

	// Copy over to the target volume
	err = publishedVol.CopyToVolume(file, filename)
	if err != nil {
		log.Write("failed to copy file to published volume")
		log.Write(err.Error())
		return handlerResponse[empty]{
			Status: http.StatusInternalServerError,
		}
	}
	return handlerResponse[empty]{}
}

const emptyFile string = "{}"

// GetPublishedDocument retrieves the contents of a published document from the published docker volume
func GetPublishedDocument(form ValidGetPublishedDocumentRequest, df DependencyFactory) handlerResponse[[]byte] {
	publishedVol := df.GetPublishedVolumeRepo()
	log := df.GetLogger()

	// Get file from published volume
	filename := form.DocumentID.String()
	file, err := publishedVol.GetFromVolume(filename)
	if err != nil {
		log.Write(fmt.Sprintf("failed to get file: %s from volume", filename))
		log.Write(err.Error())
		return handlerResponse[[]byte]{
			Status: http.StatusNotFound,
		}
	}
	defer file.Close()

	// Read from the file setting it to empty on error
	buf := &bytes.Buffer{}
	bytes, err := buf.ReadFrom(file)
	if err != nil || bytes == 0 {
		log.Write("failed to read from the requested file")
		log.Write(err.Error())
		buf.WriteString(emptyFile)
	}

	// Will return "text/..." if file contains text / json
	contentType := http.DetectContentType(buf.Bytes())

	// TODO: Remove this if statement and modify frontend to account for changed API
	if strings.Contains(contentType, "text") {
		wrappedContent := "{Contents: " + strings.TrimSpace(buf.String()) + "}"
		buf.Reset()
		buf.WriteString(wrappedContent)
	}
	return handlerResponse[[]byte]{
		Status:      http.StatusOK,
		Response:    buf.Bytes(),
		ContentType: contentType,
	}
}

package endpoints

import (
	"bytes"
	"fmt"
	"io"
	"net/http"

	"cms.csesoc.unsw.edu.au/database/repositories"
	. "cms.csesoc.unsw.edu.au/endpoints/models"
)

// UploadImage takes an image from a request and uploads it to the published docker volume
func UploadImage(form ValidImageUploadRequest, df DependencyFactory) handlerResponse[NewEntityResponse] {
	dockerRepository := df.GetUnpublishedVolumeRepo()
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
		return handlerResponse[NewEntityResponse]{
			Status: http.StatusNotAcceptable,
		}
	}

	// Create and get a new entry in docker file system
	dockerRepository.AddToVolume(e.EntityID.String())
	if dockerFile, err := dockerRepository.GetFromVolume(e.EntityID.String()); err != nil {
		return handlerResponse[NewEntityResponse]{Status: http.StatusInternalServerError}
	} else {
		_, err := io.Copy(dockerFile, form.Image)
		if err != nil {
			log.Write("failed to write image to docker container")
			return handlerResponse[NewEntityResponse]{
				Status: http.StatusInternalServerError,
			}
		}
	}

	log.Write(fmt.Sprintf("created new entity %v", entityToCreate))
	return handlerResponse[NewEntityResponse]{
		Response: NewEntityResponse{NewID: e.EntityID},
		Status:   http.StatusOK,
	}
}

// PublishDocument takes in DocumentID and transfers the document from unpublished to published volume if it exists
func PublishDocument(form ValidPublishDocumentRequest, df DependencyFactory) handlerResponse[empty] {
	unpublishedVol := df.GetUnpublishedVolumeRepo()
	publishedVol := df.GetPublishedVolumeRepo()

	// fetch the target file form the unpublished volume
	filename := form.DocumentID.String()
	file, err := unpublishedVol.GetFromVolume(filename)
	if err != nil {
		return handlerResponse[empty]{
			Status: http.StatusNotFound,
		}
	}

	// Copy over to the target volume
	if publishedVol.CopyToVolume(file, filename) != nil {
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
	file, err := publishedVol.GetFromVolume(form.DocumentID.String())
	if err != nil {
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
		buf.WriteString(emptyFile)
	}
	contentType := http.DetectContentType(buf.Bytes())
	return handlerResponse[[]byte]{
		Status:      http.StatusOK,
		Response:    buf.Bytes(),
		ContentType: contentType,
	}
}

package endpoints

import (
	"mime/multipart"
	"net/http"
	"net/url"
	"reflect"

	"github.com/gorilla/schema"
)

// ParseParamsToSchema parses a simple request struct, it expects the target to be a pointer
func ParseParamsToSchema(r *http.Request, acceptingMethod string, target interface{}) int {
	if r.ParseForm() != nil {
		return http.StatusBadRequest
	} else {
		form, status := getForm(r, acceptingMethod)
		if status != http.StatusOK {
			return status
		}

		decoder := schema.NewDecoder()
		if decoder.Decode(target, form) != nil {
			return http.StatusBadRequest
		}
	}
	return http.StatusOK
}

// ParseMultiPartFormToSchema parses a multipart form into a request schema, note that it replaces all instances of
// multipart.file with the actual parsed file, like ParseParamsToSchema it expects the target to be a pointer
func ParseMultiPartFormToSchema(r *http.Request, acceptingMethod string, target interface{}) int {
	var maxUploadSize int64 = 10 << 20
	if r.ParseMultipartForm(maxUploadSize) != nil {
		return http.StatusBadRequest
	} else {
		form, status := getForm(r, acceptingMethod)
		if status != http.StatusOK {
			return status
		}

		decoder := schema.NewDecoder()
		if decoder.Decode(target, form) != nil || parseFormFiles(r, target) != nil {
			return http.StatusBadRequest
		}
	}

	return http.StatusOK
}

// parseFormFiles parses any form files in our target struct
func parseFormFiles(r *http.Request, target interface{}) error {
	v := reflect.ValueOf(target).Elem()
	formFileType := reflect.TypeOf((*multipart.File)(nil)).Elem()

	// Iterate over the incoming target and extract any form files
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)

		if field.Type() == formFileType {
			// Parse the incoming form file
			fileName := v.Type().Field(i).Name
			uploadedFile, _, err := r.FormFile(fileName)
			if err != nil {
				return err
			}

			v.Field(i).Set(reflect.ValueOf(uploadedFile))
		}
	}

	return nil
}

// parseForm returns the form underlying a request as a convenient struct
func getForm(r *http.Request, acceptingMethod string) (url.Values, int) {
	if acceptingMethod != r.Method {
		return nil, http.StatusMethodNotAllowed
	}

	switch r.Method {
	case "POST":
		return r.PostForm, http.StatusOK
	default:
		return r.Form, http.StatusOK
	}
}

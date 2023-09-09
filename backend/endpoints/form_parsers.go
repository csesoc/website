package endpoints

import (
	"errors"
	"mime/multipart"
	"net/http"
	"net/url"
	"reflect"

	"github.com/gorilla/schema"
)

// ParseParamsToSchema parses a simple request struct, it expects the target to be a pointer
func ParseParamsToSchema(r *http.Request, acceptingMethod string, target interface{}) (int, error) {
	if err := r.ParseForm(); err != nil {
		return http.StatusBadRequest, err
	}
	form, status := getForm(r, acceptingMethod)
	if status != http.StatusOK {
		return status, errors.New("invalid form")
	}

	decoder := schema.NewDecoder()
	if err := decoder.Decode(target, form); err != nil {
		return http.StatusBadRequest, err
	}
	return http.StatusOK, nil
}

// ParseMultiPartFormToSchema parses a multipart form into a request schema, note that it replaces all instances of
// multipart.file with the actual parsed file, like ParseParamsToSchema it expects the target to be a pointer
func ParseMultiPartFormToSchema(r *http.Request, acceptingMethod string, target interface{}) (int, error) {
	var maxUploadSize int64 = 10 << 20
	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		return http.StatusBadRequest, err
	}

	form, status := getForm(r, acceptingMethod)
	if status != http.StatusOK {
		return status, errors.New("invalid form")
	}

	decoder := schema.NewDecoder()
	if err := decoder.Decode(target, form); err != nil {
		return http.StatusBadRequest, err
	}
	if err := parseFormFiles(r, target); err != nil {
		return http.StatusBadRequest, err
	}
	return http.StatusOK, nil
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
			uploadedFile, _, err := r.FormFile(field.Type().Name())
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

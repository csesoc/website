package cmsmodel

import (
	"errors"
	"reflect"
)

// @implements the Component interface
type Image struct {
	ImageDocumentID string
	ImageSource     string
}

// Get returns the reflect.Value corresponding to a specific field
func (i Image) Get(field string) (reflect.Value, error) {
	return reflect.ValueOf(i).FieldByName(field), nil
}

// Set sets a reflect.Value given a specific field
func (i Image) Set(field string, value reflect.Value) error {
	reflectionField := reflect.ValueOf(i).FieldByName(field)
	if reflectionField.IsValid() {
		reflectionField.Set(value)
		return nil
	}

	return errors.New("invalid field provided")
}

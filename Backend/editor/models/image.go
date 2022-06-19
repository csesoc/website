package models

import "reflect"

// @implements the Component interface
type Image struct {
	ImageDocumentID string
	ImageSource     string
}

// Get returns the reflect.Value corresponding to a specific field
func (i *Image) Get(field string) (reflect.Value, error) {
	return reflect.ValueOf(i).FieldByName(field), nil
}

// Set sets a reflect.Value given a specific field
func (i *Image) Set(field string, value reflect.Value) error {
	reflectionField := reflect.ValueOf(i).FieldByName(field)
	reflectionField.Set(value)
	return nil
}

package data

import (
	"reflect"

	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels"
	"github.com/pkg/errors"
)

// File contains all the atomic operations we can apply to a datamodel

// Add update text field
func TextEditUpdate(model datamodels.DataModel, path []int, start int, end int, data string) error {
	result, err := GetOperationTargetSite(model, path)
	if err != nil {
		return err
	}
	// Target must be a string (text)
	if result.Type().Kind() != reflect.String {
		return errors.Errorf("Target is not of text type.")
	}
	target := result.Interface().(string)
	result.Set(reflect.ValueOf(target[:start] + data + target[end:]))
	return nil
}

// Remove text field
func TextEditRemove(model datamodels.DataModel, path []int, start int, end int) error {
	return nil
}

// keyEdit functions

// Add data field
func KeyEditInsert(model datamodels.DataModel, path []int, data interface{}) error {
	return nil
}

// Remove data field
func KeyEditRemove(model datamodels.DataModel, path []int) error {
	return nil
}

// Update element in array at "index" position
func ArrayEditUpdate(model datamodels.DataModel, path []int, index int, data interface{}) error {
	return nil
}

// Remove element in array at "index" position
func ArrayEditRemove(model datamodels.DataModel, path []int, index int) error {
	return nil
}

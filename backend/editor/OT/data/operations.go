package data

import (
	"cms.csesoc.unsw.edu.au/editor/OT/data/datamodels"
)

// File contains all the atomic operations we can apply to a datamodel

// Add update text field
func TextEditUpdate(model datamodels.DataModel, path []int, start int, end int, data string) error {
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

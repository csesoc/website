package data

import "cms.csesoc.unsw.edu.au/editor/data/datamodels"

// File contains all the atomic operations we can apply to a datamodel

// Add update text field
func textEditUpdate(model datamodels.DataModel, path string, start int, end int, data string) error {
	return nil
}

// Remove text field
func textEditRemove(model datamodels.DataModel, path string, start int, end int) error {
	return nil
}

// keyEdit functions

// Add data field
func keyEditInsert(model datamodels.DataModel, path string, data interface{}) error {
	return nil
}

// Remove data field
func keyEditRemove(model datamodels.DataModel, path string) error {
	return nil
}

// Update element in array at "index" position
func arrayEditUpdate(model datamodels.DataModel, path string, index int, data interface{}) error {
	return nil
}

// Remove element in array at "index" position
func arrayEditRemove(model datamodels.DataModel, path string, index int) error {
	return nil
}

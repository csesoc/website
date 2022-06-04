package model

import (
	"reflect"
	"strings"
)

type Document struct {
	document_name string
	document_id   string
	content       []Element
}

type Element interface {
	GetKey(string) (interface{}, reflect.Type, error)
	SetKey(string, interface{}) error
}

// func (d *Document) getContentElement(path string) (interface{}, reflect.Type, error) {
// 	// Find correct element to edit
// 	for _, element := range d.content {
// 		object, objectType, err := element.GetKey(path)
// 		if err != nil {
// 			return object, objectType, nil
// 		}
// 	}
// 	return nil, nil, errors.New("Cannot find the element inside document content")
// }

// TODO: Wait for editType to come
func (d *Document) addKeyValPair(path string, op string, editType string) {
	subpaths := strings.Split(path, "/")
	if len(subpaths) < 1 {
		panic("Invalid path provided")
	}

	// Assumes first path will always be an index since content is stored as an array
	for i := 1; i < len(subpaths); i++ {

	}
}

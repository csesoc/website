package cmsmodel

import (
	"errors"
	"reflect"
)

// @implements Component
// TODO: How do take in specific types words for ParagraphAlign?
type Paragraph struct {
	ParagraphID       string
	ParagraphAlign    string
	ParagraphChildren []Text
}

type Text struct {
	Text      string
	Link      string
	Bold      bool
	Italic    bool
	Underline bool
}

// Get returns the reflect.Value corresponding to a specific field
func (p Paragraph) Get(field string) (reflect.Value, error) {
	return reflect.ValueOf(p).FieldByName(field), nil
}

// Set sets a reflect.Value given a specific field
func (p Paragraph) Set(field string, value reflect.Value) error {
	inputType := value.Kind()
	if field == "ParagraphAlign" {
		fieldValue := value.String()
		isValidAllignment := inputType == reflect.String &&
			(fieldValue == "left" || fieldValue == "right" || fieldValue == "center")
		if !isValidAllignment {
			return errors.New("ParagraphAlign data must be a string of 'left', 'right' or 'center'")
		}
	}
	reflectionField := reflect.ValueOf(p).FieldByName(field)
	reflectionField.Set(value)
	return nil
}

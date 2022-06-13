package models

import (
	"reflect"

	"cms.csesoc.unsw.edu.au/internal/cmsjson"
)

// models contains all the data models for the editor
// this is the configuration required for the cmsjson module
// cmsjson is a custom marshaller/unmarshaller that supports interface types
// cmsjson works with arbtirary schemas so this model can be changed on a whim
// note that cmsjson does not check that the provided types implement the interface
// so please check that everything works prior to running the CMS
var config = cmsjson.Configuration{
	RegisteredTypes: map[reflect.Type]map[string]reflect.Type{
		reflect.TypeOf((*Component)(nil)).Elem(): {
			"image":     reflect.TypeOf(Image{}),
			"paragraph": reflect.TypeOf(Paragraph{}),
		},

		reflect.TypeOf((*Payload)(nil)).Elem(): {
			"textEdit":  reflect.TypeOf(TextEdit{}),
			"keyEdit":   reflect.TypeOf(KeyEdit{}),
			"arrayEdit": reflect.TypeOf(ArrayEdit{}),
		},
	},
}

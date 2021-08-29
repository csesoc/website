package service

import (
	"cms.csesoc.unsw.edu.au/internal/document"
	"github.com/google/uuid"
)

// This file is an example of how to go about implementing an extension :)
// the idea is that there is some base functionality you can inherit
// by embedding some structures into your extension :)
// these provide both a partial implementation (document.StrippedClient)
// and an ability to interface with the document manager (document.DocManagerAdmin)

const EXAMPLE_EXTENSION_NAME string = "extension.my_extension"

var requiredExtensions []string = []string{"extension.another_extension",
	"extension.a_cool_extension"}

type MyExtension struct {
	document.StrippedClient  // base functionality
	document.DocManagerAdmin // access level
}

// Creates a new Instance of your extension
func NewMyExtension() *MyExtension {
	return &MyExtension{
		document.StrippedClient{
			Name:        EXAMPLE_EXTENSION_NAME,
			Shadow:      "",
			TrackingDoc: uuid.Nil,
		},
		document.DocManagerAdmin{},
	}
}

// Construct marks the begining of the life for our "example extension"
// we can do runtime extenion loading here :)
func (e *MyExtension) Construct(connectedDoc uuid.UUID) {

	// Load in the extensions we want :)
	e.DocManagerAdmin.LoadExtensions(connectedDoc, AllocateExtensions(
		requiredExtensions...,
	)...)
}

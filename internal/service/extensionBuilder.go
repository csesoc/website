package service

import "cms.csesoc.unsw.edu.au/internal/document"

// extensionBuilder exposes a method to allocate extensions on the heap
// given their extension name
func AllocateExtensions(requiredExtensions ...string) []document.Extension {
	extensions := []document.Extension{}

	for _, name := range requiredExtensions {
		switch name {
		case EXAMPLE_EXTENSION_NAME:
			extensions = append(extensions, NewMyExtension())
		}
	}

	return extensions
}

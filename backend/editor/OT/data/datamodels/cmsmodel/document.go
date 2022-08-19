package cmsmodel

// Document is the main datamodel type of the CMS model, it implements the DataModel interface
type Document struct {
	DocumentName string
	DocumentId   string
	Content      []Component
}

// IsExposed is the required registration for our type
func (d Document) IsExposed() bool { return true }

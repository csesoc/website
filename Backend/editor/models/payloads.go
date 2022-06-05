package models

type Payload interface {
	GetType() string
}

// @implements Payload
type TextEdit struct {
	value string
	start int
	end   int
}

func (t TextEdit) GetType() string { return "TextEdit" }

// @implements Payload
type KeyEdit struct {
	valueType string
	newValue  string
}

func (k KeyEdit) GetType() string { return "KeyEdit" }

// @implements Payload
type ArrayEdit struct {
	valueType string
	newValue  string
}

func (a ArrayEdit) GetType() string { return "ArrayEdit" }

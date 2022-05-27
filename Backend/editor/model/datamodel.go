package model

import "reflect"

type Document struct {
}

type Element interface {
	GetKey(string) (interface{}, reflect.Type, error)
	SetKey(string, interface{}) error
}

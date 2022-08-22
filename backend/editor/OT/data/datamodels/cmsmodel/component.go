package cmsmodel

import (
	"errors"
	"reflect"
)

type Component interface {
	Get(string) (reflect.Value, error)
	Set(string, reflect.Value) error
	SetField(int, reflect.Value)
}

func FieldSetter(interfaceValue reflect.Value, fieldIdx int, content reflect.Value) error {
	field := interfaceValue.FieldByIndex([]int{fieldIdx})
	if !field.IsValid() {
		return errors.New("invalid field index")
	}
	if field.Type() != content.Type() {
		return errors.New("invalid type of field and content")
	}
	setter := interfaceValue.MethodByName("SetField")
	setter.Call([]reflect.Value{reflect.ValueOf(fieldIdx), reflect.ValueOf(content)})
	return nil
}

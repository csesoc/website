package model

import (
	"errors"
	"reflect"
)

type Image struct {
	url string
}

func (i Image) GetKey(key string) (interface{}, reflect.Type, error) {
	// TODO: Check if key exists
	r := reflect.ValueOf(i)
	f := reflect.Indirect(r).FieldByName(key)

	return f.Interface(), f.Type(), nil
}

func (i Image) SetKey(key string, value interface{}) error {
	r := reflect.ValueOf(i)
	f := reflect.Indirect(r).FieldByName(key)

	v := reflect.ValueOf(value).Elem()
	if v.Type() != f.Type() {
		return errors.New("Invalid types for SetKey")
	}

	f.Set(v)
	return nil
}

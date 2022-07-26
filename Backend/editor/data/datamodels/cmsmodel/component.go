package cmsmodel

import "reflect"

type Component interface {
	Get(string) (reflect.Value, error)
	Set(string, reflect.Value) error
}

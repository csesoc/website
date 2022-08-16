package cmsjson

import "reflect"

// What is this? Well the default go marshaller does not support interface types
// this is a partial custom implementation that adds the support for interface types
// accepted types are defined in the RegisteredType field in the configuration
// for the most part this is just a bunch of reflection bashing + using a better json parser

type Configuration struct {
	// registeredTypes maps registered interface types to their implementation
	// forcing registration restricts the set of types we can marshall into thus
	// improving security
	RegisteredTypes map[reflect.Type]map[string]reflect.Type
}

type typeCategory int

const (
	_primitive = iota
	_interface
	_struct
	_array
	_slice
)

// resolveType takes a reflection field and determines what "type category" it falls into
// we have differing logic for differing type categories
func resolveType(t reflect.Type) typeCategory {
	switch t.Kind() {
	case reflect.Struct:
		return _struct
	case reflect.Interface:
		return _interface
	case reflect.Slice:
		return _slice
	case reflect.Array:
		return _array
	}

	return _primitive
}

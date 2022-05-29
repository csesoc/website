package marshaller

// What is this? Well the default go marshaller does not support interface types
// this is a partial custom implementation that adds the support for interface types
// accepted types are defined in the RegisteredType field in the configuration
// for the most part this is just a bunch of reflection bashing + using a better json parser

import (
	"reflect"

	"github.com/tidwall/gjson"
)

type Configuration struct {
	// registeredTypes maps registered interface types to their implementation
	// forcing registration restricts the set of types we can marshall into thus
	// improving security
	RegisteredTypes map[reflect.Type]map[string]reflect.Type
}

// unmarshall some json into a destination struct, the idea behind this
// is that we use reflection to iterate over the members of dest and match them
// with the top level members of the parsed json
func (c Configuration) Unmarshall(json []byte, dest interface{}) error {
	base := gjson.Parse(string(json))
	v := reflect.ValueOf(dest)
	c.parseStruct(base, reflect.ValueOf(dest).Elem().Type(), v.Elem())
	return nil
}

// the base helper function, this function calls itself several times recursively
// and is invoked by the bigger unmarshall method
func (c Configuration) parseStruct(root gjson.Result, primitiveType reflect.Type, v reflect.Value) {
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		element := root.Get(v.Type().Field(i).Name)
		underylingType := resolveType(field.Type())

		var out reflect.Value
		c.parseCore(element, field.Type(), &out)

		if underylingType == _array || underylingType == _slice {
			if underylingType == _array {
				field.Set(out.Elem())
			} else {
				field.Set(out)
			}
		} else {
			c.parseCore(element, field.Type(), &out)
			field.Set(out)
		}
	}
}

// parseArray generates an array using reflection based on reflection and
// some gjson.Result, it can also optionally create a slice
func (c Configuration) parseArray(result gjson.Result, primitiveType reflect.Type, isSlice bool) reflect.Value {
	elements := result.Array()
	var out reflect.Value
	var toWrite reflect.Value
	if isSlice {
		out = reflect.MakeSlice(reflect.SliceOf(primitiveType), len(elements), len(elements))
		toWrite = out
	} else {
		out = reflect.New(reflect.ArrayOf(len(elements), primitiveType))
		toWrite = out.Elem()
	}

	// finally iterate over all members of the json array and construct
	// reflect.Types
	for i, element := range elements {
		var output reflect.Value
		c.parseCore(element, primitiveType, &output)
		toWrite.Index(i).Set(output)
	}
	return out
}

// parseInterface is rather tricky as it requires actually resolving the struct value
// that the interface points to :O, this is done via the type registration within the configuration
// note: unliked parseStruct the actual output of parseInterface is written to reflect.Value
func (c Configuration) parseInterface(root gjson.Result, primitiveType reflect.Type, v *reflect.Value) {
	targetType := root.Get("$type").String()
	typeRegistration := c.RegisteredTypes[primitiveType]

	*v = reflect.New(typeRegistration[targetType])
	c.parseStruct(root, typeRegistration[targetType], (*v).Elem())
}

// parseCore is the core method for parsing (really its just a way to reduce code duplication)
func (c Configuration) parseCore(result gjson.Result, primitiveType reflect.Type, output *reflect.Value) {
	underylingType := resolveType(primitiveType)

	if underylingType == _primitive {
		*output = c.parsePrimitive(result, primitiveType)
	} else if underylingType == _array || underylingType == _slice {
		*output = c.parseArray(result, primitiveType.Elem(), underylingType == _slice)
	} else if underylingType == _struct {
		out := reflect.New(primitiveType)
		c.parseStruct(result, primitiveType, out.Elem())
		*output = out.Elem()
	} else if underylingType == _interface {
		var out reflect.Value
		c.parseInterface(result, primitiveType, &out)
		*output = out.Elem()
	}
}

// parse just parses a gjosn result and returns a reflect.Value
func (c Configuration) parsePrimitive(result gjson.Result, expected reflect.Type) reflect.Value {
	var value interface{}
	switch expected.Kind() {
	case reflect.String:
		value = result.String()
	case reflect.Int:
		value = result.Int()
	default:
		value = nil
	}
	// This is in order to deal with typecasts between integers
	// namely ints and int64s
	return reflect.ValueOf(value).Convert(expected)
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

package cmsjson

import (
	"errors"
	"reflect"

	"github.com/tidwall/gjson"
)

// Unmarshall unmarshalls some json into a destination struct, the idea behind this
// is that we use reflection to iterate over the members of dest and match them
// with the top level members of the parsed json
func Unmarshall[T any](c Configuration, json []byte) (*T, error) {
	base := gjson.Parse(string(json))
	var dest T

	result, err := c.parseStruct(base, reflect.TypeOf(dest))
	if err != nil {
		return nil, err
	}

	reflect.ValueOf(&dest).Elem().Set(result)
	return &dest, nil
}

// the base helper function, this function calls parseCore which recursively evaluates the json
func (c Configuration) parseStruct(root gjson.Result, underlyingType reflect.Type) (reflect.Value, error) {
	v := reflect.New(underlyingType).Elem()

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		element := root.Get(v.Type().Field(i).Name)
		underlyingType := resolveType(field.Type())

		out, err := c.parseCore(element, field.Type())
		if err != nil {
			return reflect.Value{}, err
		}

		if underlyingType == _array {
			field.Set(out.Elem())
		} else {
			field.Set(out)
		}
	}

	return v, nil
}

// parseArray generates an array using reflection based on reflection and
// some gjson.Result, it can also optionally create a slice
func (c Configuration) parseArray(result gjson.Result, underlyingType reflect.Type) (reflect.Value, error) {
	elements := result.Array()
	var arrayPointer reflect.Value
	var array reflect.Value

	isSlice := resolveType(underlyingType) == _slice
	primitiveType := underlyingType.Elem()

	if isSlice {
		// for a slice the "array" (the thing we can write to) is the slice itself
		arrayPointer = reflect.MakeSlice(reflect.SliceOf(primitiveType), len(elements), len(elements))
		array = arrayPointer
	} else {
		// for an array, reflect.New returns a pointer to an array, hence the .Elem invocation
		arrayPointer = reflect.New(reflect.ArrayOf(len(elements), primitiveType))
		array = arrayPointer.Elem()
	}

	// finally iterate over all members of the json array and construct
	// reflect.Types
	for i, element := range elements {
		element, err := c.parseCore(element, primitiveType)
		if err != nil {
			return reflect.Value{}, err
		}

		array.Index(i).Set(element)
	}

	return arrayPointer, nil
}

// parseInterface is rather tricky as it requires actually resolving the struct value
// that the interface points to :O, this is done via the type registration within the configuration
// note: unlike parseStruct the actual output of parseInterface is written to reflect.Value
func (c Configuration) parseInterface(root gjson.Result, underlyingType reflect.Type) (reflect.Value, error) {
	targetType := root.Get("$type").String()
	typeRegistration := c.RegisteredTypes[underlyingType]

	return c.parseStruct(root, typeRegistration[targetType])
}

// parseCore is the core method for parsing (really its just a way to reduce code duplication)
func (c Configuration) parseCore(result gjson.Result, primitiveType reflect.Type) (reflect.Value, error) {
	underlyingType := resolveType(primitiveType)

	switch underlyingType {
	case _primitive:
		return c.parsePrimitive(result, primitiveType)
	case _array, _slice:
		return c.parseArray(result, primitiveType)
	case _struct:
		return c.parseStruct(result, primitiveType)
	case _interface:
		return c.parseInterface(result, primitiveType)
	}

	return reflect.Value{}, errors.New("unable to parse input, unrecognised base type")
}

// parse just parses a gjson result and returns a reflect.Value
func (c Configuration) parsePrimitive(result gjson.Result, expected reflect.Type) (reflect.Value, error) {
	var value interface{}
	switch expected.Kind() {
	case reflect.String:
		value = result.String()
	case reflect.Int:
		value = result.Int()
	case reflect.Float32, reflect.Float64:
		value = result.Float()
	default:
		value = nil
	}

	// This is in order to deal with typecasts between integers
	// namely ints and int64s
	return reflect.ValueOf(value).Convert(expected), nil
}

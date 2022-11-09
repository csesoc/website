package cmsjson

import (
	"errors"
	"reflect"

	"github.com/tidwall/gjson"
)

// Unmarshall unmarshalls some json into a destination struct, the idea behind this
// is that we use reflection to iterate over the members of dest and match them
// with the top level members of the parsed json
func Unmarshall[T any](c Configuration, dest interface{}, json []byte) error {
	if reflect.TypeOf(dest).Kind() != reflect.Pointer {
		return errors.New("unmarshal expects a pointer type")
	}

	var instance T
	base := gjson.Parse(string(json))

	err := c.parseStruct(base, reflect.TypeOf(instance), reflect.ValueOf(dest).Elem())
	if err != nil {
		return err
	}

	return nil
}

// when users request partial AST un-marshalling they just add this type to their struct field
var astMarshallRequestType = reflect.TypeOf((*AstNode)(nil)).Elem()

// the base helper function, this function calls parseCore which recursively evaluates the json
func (c Configuration) parseStruct(root gjson.Result, underlyingType reflect.Type, dest reflect.Value) error {
	// Iterate over all fields in the underlyingType struct
	for i := 0; i < underlyingType.NumField(); i++ {
		field := underlyingType.Field(i)
		element := root.Get(field.Name)
		destField := dest.Field(i)

		if destField.Type() == astMarshallRequestType {
			unmarshalledAst, err := c.parseASTCore(element, field.Name, field.Type)
			if err != nil {
				return err
			}

			destField.Set(reflect.ValueOf(unmarshalledAst))
		} else {
			err := c.parseCore(element, field.Type, destField)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

// parseArray generates an array using reflection based on reflection and
// some gjson.Result, it can also optionally create a slice
func (c Configuration) parseArray(result gjson.Result, underlyingType reflect.Type, dest reflect.Value) error {
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
		elementDest := array.Index(i)

		err := c.parseCore(element, primitiveType, elementDest)
		if err != nil {
			return err
		}
	}

	// finally set the destination reflect.Value
	dest.Set(array)
	return nil
}

// parseInterface is rather tricky as it requires actually resolving the struct value
// that the interface points to :O, this is done via the type registration within the configuration
// note: unlike parseStruct the actual output of parseInterface is written to reflect.Value
func (c Configuration) parseInterface(root gjson.Result, underlyingType reflect.Type, dest reflect.Value) error {
	targetType := root.Get("$type").String()
	typeRegistration := c.RegisteredTypes[underlyingType]
	alternativeDest := reflect.New(typeRegistration[targetType]).Elem()
	if err := c.parseStruct(root, typeRegistration[targetType], alternativeDest); err != nil {
		return err
	}

	dest.Set(alternativeDest)
	return nil
}

// parseCore is the core method for parsing (really its just a way to reduce code duplication)
func (c Configuration) parseCore(result gjson.Result, primitiveType reflect.Type, dest reflect.Value) error {
	underlyingType := resolveType(primitiveType)

	switch underlyingType {
	case _primitive:
		return c.parsePrimitive(result, primitiveType, dest)
	case _array, _slice:
		return c.parseArray(result, primitiveType, dest)
	case _struct:
		return c.parseStruct(result, primitiveType, dest)
	case _interface:
		return c.parseInterface(result, primitiveType, dest)
	}

	return errors.New("unable to parse input, unrecognised base type")
}

// parse just parses a gjson result and returns a reflect.Value
func (c Configuration) parsePrimitive(result gjson.Result, expected reflect.Type, dest reflect.Value) error {
	var value interface{}
	switch expected.Kind() {
	case reflect.String:
		value = result.String()
	case reflect.Int:
		value = result.Int()
	case reflect.Float32, reflect.Float64:
		value = result.Float()
	case reflect.Bool:
		value = result.Bool()
	default:
		value = nil
	}

	if value != nil {
		dest.Set(reflect.ValueOf(value).Convert(expected))
		return nil
	}

	return errors.New("unrecognised primitive type")
}

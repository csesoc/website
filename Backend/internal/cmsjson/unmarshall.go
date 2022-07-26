package cmsjson

import (
	"reflect"

	"github.com/tidwall/gjson"
)

// unmarshall some json into a destination struct, the idea behind this
// is that we use reflection to iterate over the members of dest and match them
// with the top level members of the parsed json
func (c Configuration) Unmarshall(json []byte, dest interface{}) error {
	base := gjson.Parse(string(json))
	v := reflect.ValueOf(dest)
	c.parseStruct(base, reflect.ValueOf(dest).Elem().Type(), v.Elem())
	return nil
}

// the base helper function, this function calls parseCore which recursively evaluates the json
func (c Configuration) parseStruct(root gjson.Result, primitiveType reflect.Type, v reflect.Value) {
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		element := root.Get(v.Type().Field(i).Name)
		underlyingType := resolveType(field.Type())

		var out reflect.Value
		c.parseCore(element, field.Type(), &out)

		if underlyingType == _array {
			field.Set(out.Elem())
		} else {
			field.Set(out)
		}
	}
}

// parseArray generates an array using reflection based on reflection and
// some gjson.Result, it can also optionally create a slice
func (c Configuration) parseArray(result gjson.Result, primitiveType reflect.Type, isSlice bool) reflect.Value {
	elements := result.Array()
	var arrayPointer reflect.Value
	var array reflect.Value
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
		var output reflect.Value
		c.parseCore(element, primitiveType, &output)
		array.Index(i).Set(output)
	}
	return arrayPointer
}

// parseInterface is rather tricky as it requires actually resolving the struct value
// that the interface points to :O, this is done via the type registration within the configuration
// note: unlike parseStruct the actual output of parseInterface is written to reflect.Value
func (c Configuration) parseInterface(root gjson.Result, primitiveType reflect.Type, v *reflect.Value) {
	targetType := root.Get("$type").String()
	typeRegistration := c.RegisteredTypes[primitiveType]

	*v = reflect.New(typeRegistration[targetType])
	c.parseStruct(root, typeRegistration[targetType], (*v).Elem())
}

// parseCore is the core method for parsing (really its just a way to reduce code duplication)
func (c Configuration) parseCore(result gjson.Result, primitiveType reflect.Type, output *reflect.Value) {
	underlyingType := resolveType(primitiveType)

	switch underlyingType {
	case _primitive:
		*output = c.parsePrimitive(result, primitiveType)
	case _array, _slice:
		*output = c.parseArray(result, primitiveType.Elem(), underlyingType == _slice)
	case _struct:
		out := reflect.New(primitiveType)
		c.parseStruct(result, primitiveType, out.Elem())
		*output = out.Elem()
	case _interface:
		var out reflect.Value
		c.parseInterface(result, primitiveType, &out)
		*output = out.Elem()
	}
}

// parse just parses a gjson result and returns a reflect.Value
func (c Configuration) parsePrimitive(result gjson.Result, expected reflect.Type) reflect.Value {
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
	return reflect.ValueOf(value).Convert(expected)
}

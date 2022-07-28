package cmsjson

import (
	"fmt"
	"reflect"
	"strings"
)

// Marshall can potentially be a rather expensive operation
// why? Strings in go are immutable, if we recursively modify
// a string each invocation ends up allocation a new string on the heap
// resulting in GC overhead :P
func (c Configuration) Marshall(source interface{}) string {
	return c.marshallStruct(reflect.ValueOf(source))
}

// marshallStruct takes a struct and marshalls it into a string
func (c Configuration) marshallStruct(v reflect.Value) string {
	// iterate over each field
	marshalledString := strings.Builder{}
	marshalledString.WriteByte('{')

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		underlyingType := resolveType(field.Type())
		isNestedField := underlyingType != _primitive

		if !isNestedField {
			marshalledString.WriteString(c.marshallKeyValuePair(field, v.Type().Field(i)))
		} else {
			marshalledString.WriteString(
				fmt.Sprintf(
					`"%s": %s`,
					v.Type().Field(i).Name,
					c.marshallCore(field),
				),
			)
		}

		// if this isnt the last field we require a comma deliminater
		if i != v.NumField()-1 {
			marshalledString.WriteByte(',')
		}
	}

	marshalledString.WriteByte('}')
	return marshalledString.String()
}

// marshallArray takes an array and marshalls it into a string
func (c Configuration) marshallArray(source reflect.Value) string {
	marshalledString := strings.Builder{}
	marshalledString.WriteByte('[')

	for i := 0; i < source.Len(); i++ {
		elementValue := source.Index(i)
		marshalledString.WriteString(c.marshallCore(elementValue))

		// if this isnt the last field we require a comma delimiter
		if i != source.Len()-1 {
			marshalledString.WriteByte(',')
		}
	}

	marshalledString.WriteByte(']')
	return marshalledString.String()
}

// marshallInterface takes an interface, resolves the types and marshalls it into a
// string
func (c Configuration) marshallInterface(source reflect.Value) string {
	typeMappings := c.RegisteredTypes[source.Type()]
	implementingType := source.Elem().Type()
	var typeName string = ""

	// just locate the required name for this struct
	for key, v := range typeMappings {
		if v == implementingType {
			typeName = key
		}
	}

	// this is some hacky string manipulation, basically chop the opening brace
	// so we can insert a type annotation in
	generatedJson := c.marshallStruct(source.Elem())
	generatedJson = generatedJson[1:]

	return fmt.Sprintf(`{"$type": "%s", %s`, typeName, generatedJson)
}

// Helper type constants just to make conversion a little cleaner
var (
	toFloat  = func(v reflect.Value) float64 { return v.Convert(reflect.TypeOf(float64(0.3))).Float() }
	toInt    = func(v reflect.Value) int64 { return v.Convert(reflect.TypeOf(int64(0))).Int() }
	toString = func(v reflect.Value) string { return v.Convert(reflect.TypeOf("string")).String() }
)

// marshallKeyValuePair parses a key value pair within a struct
func (c Configuration) marshallKeyValuePair(field reflect.Value, structEntry reflect.StructField) string {
	switch field.Type().Kind() {
	case reflect.Int:
		return fmt.Sprintf(`"%s": %d`, structEntry.Name, toInt(field))
	case reflect.Float32, reflect.Float64:
		return fmt.Sprintf(`"%s": %f`, structEntry.Name, toFloat(field))
	case reflect.String:
		return fmt.Sprintf(`"%s": "%s"`, structEntry.Name, toString(field))
	default:
		return ""
	}
}

// parsePrimitive just parses a lone primitive
// parseKeyValuePair parses a key value pair within a struct
func (c Configuration) marshallPrimitive(field reflect.Value) string {
	switch field.Type().Kind() {
	case reflect.Int:
		return fmt.Sprintf(`%d`, toInt(field))
	case reflect.Float32, reflect.Float64:
		return fmt.Sprintf(`%f`, toFloat(field))
	case reflect.String:
		return fmt.Sprintf(`"%s"`, toString(field))
	default:
		return ""
	}
}

// marshallCore marshalls the value within source
func (c Configuration) marshallCore(source reflect.Value) string {
	underlyingType := resolveType(source.Type())
	switch underlyingType {
	case _primitive:
		return c.marshallPrimitive(source)
	case _array, _slice:
		return c.marshallArray(source)
	case _struct:
		return c.marshallStruct(source)
	case _interface:
		return c.marshallInterface(source)
	default:
		return ""
	}
}

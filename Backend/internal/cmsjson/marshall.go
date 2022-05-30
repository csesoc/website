package cmsjson

import (
	"fmt"
	"reflect"
)

// Marshall can potentially be a rather expensive operation
// why? Strings in go are immutable, if we recursively modify
// a string each invocation ends up allocation a new string on the heap
// resulting in GC overhead :P
func (c Configuration) Marshall(source interface{}) string {
	return string(c.marshallStruct(reflect.ValueOf(source)))
}

// marshallStruct takes a struct and marshalls it into a string
func (c Configuration) marshallStruct(v reflect.Value) []byte {
	// iterate over each field
	result := []byte{'{'}
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		underlyingType := resolveType(field.Type())

		if underlyingType == _primitive {
			result = append(result, c.marshallKeyValuePair(field, v.Type().Field(i))...)
		} else {
			result = append(result, fmt.Sprintf(`"%s": %s`, v.Type().Field(i).Name, c.marshallCore(field))...)
		}

		// if this isnt the last field we require a comma deliminater
		if i != v.NumField()-1 {
			result = append(result, ',')
		}
	}

	return append(result, '}')
}

// marshallArray takes an array and marshalls it into a string
func (c Configuration) marshallArray(source reflect.Value) []byte {
	result := []byte{'['}

	for i := 0; i < source.Len(); i++ {
		elementValue := source.Index(i)
		result = append(result, c.marshallCore(elementValue)...)

		// if this isnt the last field we require a comma delimiter
		if i != source.Len()-1 {
			result = append(result, ',')
		}
	}

	return append(result, ']')
}

// marshallInterface takes an interface, resolves the types and marshalls it into a
// string
func (c Configuration) marshallInterface(source reflect.Value) []byte {
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

	return []byte(fmt.Sprintf(`{"$type": "%s", %s`, typeName, generatedJson))
}

// marshallKeyValuePair parses a key value pair within a struct
func (c Configuration) marshallKeyValuePair(field reflect.Value, structEntry reflect.StructField) []byte {
	if field.Type().Kind() == reflect.Int {
		return []byte(fmt.Sprintf(`"%s": %d`, structEntry.Name,
			field.Convert(reflect.TypeOf(3)).Int()))
	} else if field.Type().Kind() == reflect.Float32 || field.Type().Kind() == reflect.Float64 {
		return []byte(fmt.Sprintf(`"%s": %f`, structEntry.Name,
			field.Convert(reflect.TypeOf(float64(0.3))).Float()))
	} else if field.Type().Kind() == reflect.String {
		return []byte(fmt.Sprintf(`"%s": "%s"`, structEntry.Name,
			field.Convert(reflect.TypeOf("string")).String()))
	}
	return nil
}

// parsePrimitive just parses a lone primitive
// parseKeyValuePair parses a key value pair within a struct
func (c Configuration) marshallPrimitive(field reflect.Value) []byte {
	if field.Type().Kind() == reflect.Int {
		return []byte(fmt.Sprintf(`%d`, field.Convert(reflect.TypeOf(3)).Int()))
	} else if field.Type().Kind() == reflect.Float32 || field.Type().Kind() == reflect.Float64 {
		return []byte(fmt.Sprintf(`%f`, field.Convert(reflect.TypeOf(float64(0.3))).Float()))
	} else if field.Type().Kind() == reflect.String {
		return []byte(fmt.Sprintf(`"%s"`, field.Convert(reflect.TypeOf("string")).String()))
	}
	return nil
}

// marshallCore marshalls the value within source
func (c Configuration) marshallCore(source reflect.Value) []byte {
	underlyingType := resolveType(source.Type())

	if underlyingType == _primitive {
		return c.marshallPrimitive(source)
	} else if underlyingType == _array || underlyingType == _slice {
		return c.marshallArray(source)
	} else if underlyingType == _struct {
		return c.marshallStruct(source)
	} else if underlyingType == _interface {
		return c.marshallInterface(source)
	}

	return nil
}

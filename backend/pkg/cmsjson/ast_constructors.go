package cmsjson

import (
	"reflect"
	"strconv"
)

// TODO: in the future we really need to refactor this entire package to use some kind of visitor pattern instead of repeatedly coding this same logic up

// ASTFromInterface takes some interface value x and constructs an AST from it, this is a helper method that is mostly used
// by the operation methods to convert a struct into an AST
func ASTFromValue(x interface{}) AstNode {
	return astFromCore("root", reflect.ValueOf(x))
}

// astFromStruct constructs an AST from the reflect.type for a syntax tree
func astFromStruct(key string, underlyingValue reflect.Value) *jsonNode {
	childrenArray := []*jsonNode{}
	underlyingType := underlyingValue.Type()

	for i := 0; i < underlyingType.NumField(); i++ {
		fieldName := underlyingType.Field(i).Name
		fieldValue := underlyingValue.Field(i)

		childrenArray = append(childrenArray, astFromCore(fieldName, fieldValue))
	}

	return newJsonObject(key, childrenArray, underlyingType)
}

// astFromArray constructs a new AST from a reflect.type corresponding to an array
func astFromArray(key string, underlyingValue reflect.Value) *jsonNode {
	underlyingType := underlyingValue.Type()
	arrayType := underlyingType.Elem()

	childrenArray := []*jsonNode{}
	for i := 0; i < underlyingValue.Len(); i++ {
		field := underlyingValue.Index(i)
		childrenArray = append(childrenArray, astFromCore(strconv.Itoa(i), field))
	}

	return newJsonArray(key, childrenArray, arrayType)
}

// astFromPrimitive constructs a new AST from a primitive type
func astFromPrimitive(key string, underlyingValue reflect.Value) *jsonNode {
	return newJsonPrimitive(key, underlyingValue.Interface(), underlyingValue.Type())
}

// astFromCore is the main function for parsing AST elements
func astFromCore(key string, underlyingValue reflect.Value) *jsonNode {
	underlyingType := resolveType(underlyingValue.Type())

	switch underlyingType {
	case _primitive:
		return astFromPrimitive(key, underlyingValue)
	case _array, _slice:
		return astFromArray(key, underlyingValue)
	case _struct:
		return astFromStruct(key, underlyingValue)
	case _interface:
		return astFromStruct(key, underlyingValue.Elem())
	}

	return nil
}

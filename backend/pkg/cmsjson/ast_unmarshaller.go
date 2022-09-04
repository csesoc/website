package cmsjson

import (
	"errors"
	"fmt"
	"reflect"
	"strconv"

	"github.com/tidwall/gjson"
)

func UnmarshallAST[T any](c Configuration, source string) (AstNode, error) {
	base := gjson.Parse(source)
	underlyingType := reflect.TypeOf(*new(T))
	return c.parseASTCore(base, "root", underlyingType)
}

// visitStructAST constructs an AST by visiting a struct type
func (c Configuration) visitStructAST(node gjson.Result, key string, underlyingType reflect.Type) (*jsonNode, error) {
	// childrenArray is the array of jsonNode kids we will construct
	childrenArray := []*jsonNode{}
	var rollingErrors error = nil

	for i := 0; i < underlyingType.NumField(); i++ {
		fieldName := underlyingType.Field(i).Name
		parsedField, err := c.parseASTCore(node.Get(fieldName), fieldName, underlyingType.Field(i).Type)

		// we want to maintain a rolling list of errors that ocurred when attempting to parse the incoming reflect type
		if err != nil {
			if rollingErrors != nil {
				rollingErrors = errors.New("failed to parse incoming structure failure reasons: ")
			}
			rollingErrors = fmt.Errorf("%v\n	[failed to parse field %s]: %v", rollingErrors, underlyingType.Field(i).Name, err)
		} else {
			childrenArray = append(childrenArray, parsedField)
		}
	}

	if rollingErrors != nil {
		return nil, rollingErrors
	}

	return newJsonObject(key, childrenArray, underlyingType), nil
}

// visitInterfaceAST visits a gjson.Result under the assumption that its an interface type
func (c Configuration) visitInterfaceAST(node gjson.Result, key string, underlyingType reflect.Type) (*jsonNode, error) {
	targetType := node.Get("$type").String()
	typeRegistration := c.RegisteredTypes[underlyingType]

	parsedStruct, err := c.visitStructAST(node, key, typeRegistration[targetType])
	if err != nil {
		return nil, fmt.Errorf("attempted to parse node into type %s but failed with %v", targetType, err)
	}

	return parsedStruct, nil
}

// visitArrayAST constructs an AST from an array type
func (c Configuration) visitArrayAST(node gjson.Result, key string, underlyingType reflect.Type) (*jsonNode, error) {
	elements := node.Array()
	arrayType := underlyingType.Elem()

	// we return on the first instance of an error for visiting an array
	childrenArray := []*jsonNode{}
	for i, element := range elements {
		childAst, err := c.parseASTCore(element, strconv.Itoa(i), arrayType)
		if err != nil {
			return nil, err
		}

		childrenArray = append(childrenArray, childAst)
	}

	return newJsonArray(key, childrenArray, arrayType), nil
}

// visitPrimitive visits an AST primitive
func (c Configuration) visitPrimitiveAST(node gjson.Result, key string, underlyingType reflect.Type) (*jsonNode, error) {
	if !verifyPrimitive(node, underlyingType) {
		return nil, fmt.Errorf("failed to parse primitive for %v as it is not an instance of %v", node, underlyingType)
	}

	return newJsonPrimitive(key, node.Value(), underlyingType), nil
}

// verifyPrimitive verifies an incoming AST primitive and returns false of its not valid
func verifyPrimitive(node gjson.Result, underlyingType reflect.Type) bool {
	verifiers := map[gjson.Type]func() bool{
		gjson.True:  func() bool { return underlyingType.Kind() == reflect.Bool },
		gjson.False: func() bool { return underlyingType.Kind() == reflect.Bool },

		gjson.String: func() bool { return underlyingType.Kind() == reflect.String },
		gjson.Null:   func() bool { return underlyingType.AssignableTo(reflect.TypeOf(nil)) },
		gjson.Number: func() bool {
			return underlyingType.Kind() == reflect.Int ||
				underlyingType.Kind() == reflect.Float32 ||
				underlyingType.Kind() == reflect.Float64
		},
	}

	verifier, hasVerifier := verifiers[node.Type]
	return hasVerifier && verifier()
}

// parseCore is the core method for parsing (really its just a way to reduce code duplication)
func (c Configuration) parseASTCore(result gjson.Result, key string, primitiveType reflect.Type) (*jsonNode, error) {
	underlyingType := resolveType(primitiveType)

	switch underlyingType {
	case _primitive:
		return c.visitPrimitiveAST(result, key, primitiveType)
	case _array, _slice:
		return c.visitArrayAST(result, key, primitiveType)
	case _struct:
		return c.visitStructAST(result, key, primitiveType)
	case _interface:
		return c.visitInterfaceAST(result, key, primitiveType)
	}

	return nil, fmt.Errorf("failed to parse node %v into %v, unidentified primitive type", result, primitiveType)
}

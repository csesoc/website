package cmsjson

import (
	"fmt"
	"reflect"
)

type (
	// jsonNode is the internal implementation of AstNode, *jsonNode @implements AstNode
	// AstNode is a simple interface that represents a node in our JSON AST, we have a few important constraints that should be enforced by any implementation of the AstNode, those constraints are:
	//	- An ASTNode is either a: JsonPrimitive, JsonObject or a JsonArray
	//		- GetKey can return nil indicating that it is JUST a value
	//		- Since a node can be either a JsonPrimitive, JsonObject or a JsonArray:
	// 			- 2 of the three functions: JsonPrimitive(), JsonObject(), JsonArray() will return nil (indicating the node is not of that type) while one will return an actual value
	//			- We are guaranteed that one of these functions will return a value
	//	- All implementations of AstNode must conform to this specification (there is no way within the Go type system to enforce this unfortunately :( )
	//	- Note that the reflect.Type returned by JsonArray is the type of the array, ie if it was an array of integers then the reflect.type is an integer
	//  - Note that jsonNode implements AstNode (indirectly), AstNode is of the form:
	AstNode interface {
		GetKey() string
		// JsonPrimitive() (interface{}, reflect.Type)
		// JsonObject() ([]AstNode, reflect.Type)
		// JsonArray() ([]AstNode, reflect.Type)
	}
	jsonNode struct {
		// key could be nil (according to the AstNode definition)
		key string

		// either value or children can be nil (according to the AstNode definition)
		value    interface{}
		children []*jsonNode

		// underlying type is the type modelled by this jsonNode, isObject allows us distinguish between arrays and objects
		underlyingType reflect.Type
		isObject       bool
	}

	// jsonPrimitives is a generic constraint for json primitive values
	jsonPrimitives interface {
		~int | ~float64 | ~bool | ~string
	}
)

// Interface implementations for AstNode

// GetKey returns the key of the underlying jsonNode
func (node *jsonNode) GetKey() string { return node.key }

// JsonPrimitive returns the underlying primitive value in a jsonNode, it either returns the value or nil in accordance with the
// definition of the AstNode
func (node *jsonNode) GetPrimitive() (interface{}, reflect.Type) {
	node.validateNode()
	if node.value != nil {
		return node.value, node.underlyingType
	}

	return nil, nil
}

// JsonObject returns the underlying json object in a jsonNode, it either returns the value or nil in accordance with the
// definition of the AstNode
func (node *jsonNode) JsonObject() ([]*jsonNode, reflect.Type) {
	node.validateNode()
	if node.children != nil && node.isObject {
		return node.children, node.underlyingType
	}

	return nil, nil
}

// JsonArray returns the underlying json array in a jsonNode, it either returns the value or nil in accordance with the
// definition of the AstNode
func (node *jsonNode) JsonArray() ([]*jsonNode, reflect.Type) {
	node.validateNode()
	if node.children != nil && !node.isObject {
		return node.children, node.underlyingType
	}

	return nil, nil
}

// validateNode determines if the current node configuration was corrupted or not
func (node *jsonNode) validateNode() {
	if (node.value == nil && node.children == nil) || (node.value != nil && node.children != nil) {
		panic(fmt.Errorf("the provided error configuration: %v was corrupted somehow", *node))
	}
}

// General functions for creating instances of jsonNode

// newJsonArray constructs a new instance of a JsonArray given the array of json values it contains
// note that there is no validation to ensure that the fields match the incoming
// underlyingType
func newJsonArray(key string, values []*jsonNode, underlyingType reflect.Type) *jsonNode {
	return &jsonNode{
		key:   key,
		value: nil,

		children:       values,
		underlyingType: underlyingType,
		isObject:       false,
	}
}

// newJsonObject instantiates a new instance of a JsonObject type, note that there is no validation to ensure that the fields match the incoming
// underlyingType
func newJsonObject(key string, values []*jsonNode, underlyingType reflect.Type) *jsonNode {
	return &jsonNode{
		key:   key,
		value: nil,

		children:       values,
		underlyingType: underlyingType,
		isObject:       true,
	}
}

// newJsonPrimitive instantiates a new instance of a jsonPrimitive type, note that this method has no validation logic (perhaps we can add it in the future)
func newJsonPrimitive(key string, value interface{}, underlyingType reflect.Type) *jsonNode {
	return &jsonNode{
		key:   key,
		value: value,

		children:       nil,
		underlyingType: underlyingType,
		isObject:       false,
	}
}

// InsertOrUpdate inserts a secondary json node into a jsonNode given the index in which it needs to be inserted, note that it also does type validation :D
func (node *jsonNode) InsertOrUpdate(toInsert *jsonNode, location int) error {
	node.validateNode()
	if node.children != nil {
		return fmt.Errorf("node is a terminal primitive value %v, primitive values cannot have children", *node)
	}

	// validInsertions are characterized by inserting into a struct at the correct type of
	validInsert := (getStructFieldType(node.underlyingType, location) == toInsert.underlyingType && location < len(node.children)) ||
		(node.underlyingType == toInsert.underlyingType && location <= len(node.children))

	if validInsert {
		switch location {
		case len(node.children):
			node.children = append(node.children, toInsert)
		default:
			node.children = append(append(node.children[:location], toInsert), node.children[location:]...)
		}

		return nil
	}

	return fmt.Errorf("the insertion for %v index %d was invalid", *node, location)
}

// NewPrimitiveFromValue constructs a new jsonNode from a primitive value
func NewPrimitiveFromValue[T jsonPrimitives](key string, value T) *jsonNode {
	return &jsonNode{
		key:   key,
		value: value,

		children:       nil,
		underlyingType: reflect.TypeOf(value),
		isObject:       false,
	}
}

// getStructFieldType fetches the field type of a struct given its index
func getStructFieldType(structType reflect.Type, index int) reflect.Type {
	if structType.Kind() != reflect.Struct {
		return nil
	}

	return structType.FieldByIndex([]int{index}).Type
}

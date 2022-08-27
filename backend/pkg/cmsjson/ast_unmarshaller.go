package cmsjson

import (
	"reflect"

	"github.com/tidwall/gjson"
)

func (c Configuration) UnmarshallAST[T, V any](dest *V) *jsonNode {
	
}

// parseCore is the core method for parsing (really its just a way to reduce code duplication)
func (c Configuration) parseASTCore(result gjson.Result, primitiveType reflect.Type, output *reflect.Value) {
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

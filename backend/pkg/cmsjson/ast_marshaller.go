package cmsjson

import (
	"fmt"
	"strconv"
	"strings"
)

// Marshall can potentially be a rather expensive operation
// why? Strings in go are immutable, if we recursively modify
// a string each invocation ends up allocation a new string on the heap
// resulting in GC overhead :P
func (c Configuration) MarshallAST(source AstNode) string {
	asPrimitive, _ := source.JsonPrimitive()
	asObject, _ := source.JsonObject()
	asArray, _ := source.JsonArray()

	switch {
	case asPrimitive != nil:
		return stringifyPrimitive(asPrimitive)
	case asObject != nil:
		result := strings.Builder{}
		for _, node := range asObject {
			result.WriteString(fmt.Sprintf("\"%s\": %s", node.GetKey(), c.MarshallAST(node)))
		}

		return fmt.Sprintf("{%s}", result.String())
	default:
		result := strings.Builder{}
		for _, node := range asArray {
			result.WriteString(c.MarshallAST(node) + ",")
		}

		return fmt.Sprintf("[%s]", result.String())
	}
}

func stringifyPrimitive(primitive interface{}) string {
	switch parsedPrimitive := primitive.(type) {
	case string:
		return "\"" + parsedPrimitive + "\""
	case bool:
		return strconv.FormatBool(parsedPrimitive)
	default:
		return strconv.FormatInt(parsedPrimitive.(int64), 10)
	}
}

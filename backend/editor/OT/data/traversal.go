package data

import (
	"fmt"

	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// Traverse returns the second last value and the last value pointed at by a specific path
func Traverse(document cmsjson.AstNode, subpaths []int) (cmsjson.AstNode, cmsjson.AstNode, error) {
	curr := document
	var prev cmsjson.AstNode = nil
	lastNode := len(subpaths) - 1

	for pathIndex, pathValue := range subpaths {
		prev = curr
		// If not last node
		if node, _ := curr.JsonObject(); node != nil {
			curr = node[pathValue]
		} else if node, _ := curr.JsonArray(); node != nil {
			curr = node[pathValue]
		} else if node, _ := curr.JsonPrimitive(); node != nil {
			if pathIndex != lastNode {
				return nil, nil, fmt.Errorf("primitive types must appear at the end of the path")
			}
		}
	}

	return prev, curr, nil
}

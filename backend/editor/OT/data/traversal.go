package data

import (
	"fmt"

	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// Traverse returns the second last value and the last value pointed at by a specific path
func Traverse(document cmsjson.AstNode, subpaths []int) (cmsjson.AstNode, cmsjson.AstNode, error) {
	curr := document
	prev := curr
	lastNode := len(subpaths) - 1
	for nodeCount, index := range subpaths {
		prev = curr
		// If not last node
		if node, _ := curr.JsonObject(); node != nil {
			curr = node[index]
		} else if node, _ := curr.JsonArray(); node != nil {
			curr = node[index]
		} else if node, _ := curr.JsonPrimitive(); node != nil {
			if nodeCount != lastNode {
				return nil, nil, fmt.Errorf("Primitive types must appear at the end of the path!")
			}
		}
	}
	return prev, curr, nil
}

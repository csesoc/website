package data

import (
	"fmt"
	"reflect"
	"strconv"
	"strings"

	"cms.csesoc.unsw.edu.au/editor/data/datamodels"
)

// Traverse returns the second last value and the last value pointed at by a specific path
func Traverse(document datamodels.DataModel, subpaths []string) (reflect.Value, reflect.Value, error) {
	prev := reflect.Value{}
	curr := reflect.ValueOf(document)
	fullPath := subpaths

	for len(subpaths) > 0 {
		prev, curr, subpaths = consumeField(prev, curr, subpaths)
		prev, curr, subpaths = tryConsumeArrayElement(prev, curr, subpaths)

		if !prev.IsValid() || !curr.IsValid() {
			consumedPath := fullPath[:len(fullPath)-len(subpaths)]
			return reflect.Value{}, reflect.Value{}, fmt.Errorf("invalid path, couldn't find subpath %s", strings.Join(consumedPath, "/"))
		}
	}

	return prev, curr, nil
}

// tryConsumeArrayElement attempts to consume the head of the path, the assumption is that the current value is an
// array value, if this is not the case then the function returns the prev, current and path unchanged, if it was capable
// of consuming the head then it returns the subpath minus the head
func tryConsumeArrayElement(prev, curr reflect.Value, path []string) (reflect.Value, reflect.Value, []string) {
	// If we are at an array, we attempt to "index" into that array directly, this implies consuming the next element of our path
	// which should be a regular array index
	atEndOfPath := len(path) < 1
	canConsumeArrayIndex := !atEndOfPath &&
		curr.IsValid() &&
		(curr.Kind() == reflect.Array || curr.Kind() == reflect.Slice)

	if canConsumeArrayIndex {
		targetIndex := path[0]
		field := getValueAtIndex(curr, targetIndex)
		if !field.IsValid() {
			return curr, reflect.Value{}, path
		}

		return curr, dereference(field), path[1:]
	}

	// Looks like we couldn't consume an array but thats ok :D
	return prev, curr, path
}

// consumeField consumes a regular field from a path, it pops the head off the path slice and if it was able
// to consume something then it retuns the path minus the head :D
func consumeField(prev, curr reflect.Value, path []string) (reflect.Value, reflect.Value, []string) {
	field := curr.FieldByName(path[0])
	if curr.IsValid() {
		return curr, dereference(field), path[1:]
	}

	return prev, reflect.Value{}, path
}

// getValueAtIndex fetches the value at the provided index in the array or slice pointed at by reflect.Value
// note it is assumed that index is a string
func getValueAtIndex(array reflect.Value, i string) reflect.Value {
	index, err := strconv.Atoi(i)
	if err != nil || index >= array.Len() || index < 0 {
		return reflect.Value{}
	}

	return array.Index(index)
}

// dereference unpacks a reflect.Value that points to an interface, it returns the inner struct, this is because
// reflection returns "structs" as wrapped like: interface -> struct
// thus we must dereference them before leaving
func dereference(curr reflect.Value) reflect.Value {
	if curr.Kind() == reflect.Interface && curr.IsValid() {
		curr = curr.Elem()
	}

	return curr
}

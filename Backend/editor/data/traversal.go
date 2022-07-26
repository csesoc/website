package data

import (
	"errors"
	"reflect"
	"strconv"

	"cms.csesoc.unsw.edu.au/editor/data/datamodels"
)

// Traverse returns the second last value and the last value pointed at by a specific path
func Traverse(document datamodels.DataModel, subpaths []string) (reflect.Value, reflect.Value, error) {
	prev := reflect.Value{}
	curr := reflect.ValueOf(document)

	for i := 0; i < len(subpaths); i++ {
		var err error = nil
		subpath := subpaths[i]
		field := curr.FieldByName(subpath)

		if field.IsValid() {
			prev = curr
			curr = field

			endOfPath := i == len(subpaths)-1
			canConsumeArrayIndex := !endOfPath && (field.Kind() == reflect.Array || field.Kind() == reflect.Slice)

			if canConsumeArrayIndex {
				targetIndex := subpaths[i+1]
				prev = field
				curr, err = getValueAtIndex(field, targetIndex)
				// Skip the next subpath as we just consumed that index
				i += 1
			}

			curr = dereference(curr)
		} else {
			err = errors.New("invalid path, couldn't find subpath " + subpath)
		}

		if err != nil {
			return reflect.Value{}, reflect.Value{}, err
		}
	}

	return prev, curr, nil
}

// getValueAtIndex fetches the value at the provided index in the array pointed at by reflect.Value, note it is assumed that index
// is a string
func getValueAtIndex(array reflect.Value, i string) (reflect.Value, error) {
	index, err := strconv.Atoi(i)
	if err != nil || index >= array.Len() || index < 0 {
		return reflect.Value{}, errors.New("invalid target index")
	}

	return array.Index(index), nil
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

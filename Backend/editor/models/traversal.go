package models

import (
	"reflect"
	"strconv"
)

// Returns the second last pointer because it points to the data structure where
// each individual helper function can directly add/get/remove/update from
func traverse(d Document, subpaths []string) reflect.Value {
	var curr reflect.Value
	curr = reflect.ValueOf(d)
	length := len(subpaths) - 1
	for i := 0; i < length; i++ {
		// Iterate through the fields of the curr struct
		subpath := subpaths[i]
		for j := 0; j < curr.NumField(); j++ {
			field := curr.Field(j)
			if field.Type().Field(j).Name == subpath {
				// Handle arrays and slices
				if field.Kind() == reflect.Array || field.Kind() == reflect.Slice {
					// If we are not at the end of the paths, then grab the index
					// TODO: Add an error check here to see its actually an int
					if i < length-1 {
						i++
						index, _ := strconv.ParseInt(subpaths[i], 10, 32)
						curr = field.Elem().Index(int(index))
					}
				} else {
					curr = field
				}
				break
			}
		}
		// TODO: If we didn't find anything then throw error here
	}
	return curr
}

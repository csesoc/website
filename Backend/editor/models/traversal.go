package models

import (
	"reflect"
	"strconv"
)

// Returns the second last pointer because it points to the data structure where
// each individual helper function can directly add/get/remove/update from
func Traverse(d Document, subpaths []string) reflect.Value {
	var curr reflect.Value
	curr = reflect.ValueOf(d)
	length := len(subpaths) - 1
	for i := 0; i < length; i++ {
		// Iterate through the fields of the curr struct
		subpath := subpaths[i]
		for j := 0; j < curr.NumField(); j++ {
			field := curr.Field(j)
			if curr.Type().Field(j).Name == subpath {
				// We should realistically only have 3 types of DS we can traverse:
				// structs, arrays or slices. This if statement must guarantee
				// that the next iteration of the for loop will have a struct since
				// .NumField() must be available. Thus we must lookahead for indices
				// or keys to enforce this.

				curr = field
				// Handle arrays or slices lookahead logic (if needed)
				switch fieldType := field.Kind(); fieldType {
				case reflect.Array, reflect.Slice:
					// If we are not at the end of the paths, then grab the index
					// TODO: Add an error check here to see its actually an int
					if i < length-1 {
						i++
						index, _ := strconv.ParseInt(subpaths[i], 10, 32)
						if fieldType == reflect.Slice {
							curr = field.Index(int(index))
						} else {
							curr = field.Elem().Index(int(index))
						}
					}
				}
				// Reflection returns a wrapper to a pointer to the interface of the struct
				// Need to deference like so: interface -> ptr -> struct
				if curr.Kind() == reflect.Interface {
					curr = curr.Elem().Elem()
				}
				break
			}
		}
		// TODO: If we didn't find anything then throw error here
	}
	return curr
}

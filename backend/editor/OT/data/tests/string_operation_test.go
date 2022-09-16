package tests

import (
	"log"
	"math"
	"testing"

	"cms.csesoc.unsw.edu.au/editor/OT/data"
	"github.com/stretchr/testify/assert"
)

func TestInsertInsertNonOverlap(t *testing.T) {
	str := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: "2"}
	o1_t, o2_t := o1.TransformAgainst(o2, data.Insert)

	assert := assert.New(t)
	assert.True(apply(o1_t, apply(o2_t, str)) == apply(o2_t, apply(o1_t, str)))
}

// TODO: In the case that they are the same location, we need vector clock / ID to determine which operation is done first
// UNCOMMENT TEST WHEN THIS IS IMPLEMENTED
// func TestInsertInsertSameLocation(t *testing.T) {
// 	str := "abcde"
// 	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
// 	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "2"}
// 	o1_t, o2_t := o1.TransformAgainst(o2, data.Insert)

// 	assert := assert.New(t)
// 	assert.True(apply(o1_t, apply(o2_t, str)) == apply(o2_t, apply(o1_t, str)))
// }

func TestInsertInsertOverlap(t *testing.T) {
	str := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: "11"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 4, NewValue: "22"}
	o1_t, o2_t := o1.TransformAgainst(o2, data.Insert)

	assert := assert.New(t)
	assert.True(commutative(str, o1_t, o2_t))
}

func TestInsertDeleteNonOverlap(t *testing.T) {
	str := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t, o2_t := o1.TransformAgainst(o2, data.Delete)

	assert := assert.New(t)
	assert.True(commutative(str, o1_t, o2_t))
}

func TestInsertDeleteNonSameLocation(t *testing.T) {
	str := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
	o1_t, o2_t := o1.TransformAgainst(o2, data.Delete)

	assert := assert.New(t)
	assert.True(commutative(str, o1_t, o2_t))
}

func TestInsertDeleteOverlapInsertBeforeDelete(t *testing.T) {
	str := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: "12"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t, o2_t := o1.TransformAgainst(o2, data.Delete)

	assert := assert.New(t)
	assert.True(commutative(str, o1_t, o2_t))
}

func TestInsertDeleteOverlapDeleteBeforeInsert(t *testing.T) {
	str := "abcde"
	o1 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: ""}
	o1_t, o2_t := o1.TransformAgainst(o2, data.Delete)

	assert := assert.New(t)
	assert.True(commutative(str, o1_t, o2_t))
}

func TestDeleteDeleteNonOverlap(t *testing.T) {
	str := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t, o2_t := o1.TransformAgainst(o2, data.Delete)

	assert := assert.New(t)
	assert.True(commutative(str, o1_t, o2_t))
}

func TestDeleteDeleteSame(t *testing.T) {
	str := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
	o1_t, o2_t := o1.TransformAgainst(o2, data.Delete)

	assert := assert.New(t)
	assert.True(commutative(str, o1_t, o2_t))
}

func TestDeleteDeleteOverlap(t *testing.T) {
	str := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: ""}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t, o2_t := o1.TransformAgainst(o2, data.Delete)

	assert := assert.New(t)
	assert.True(commutative(str, o1_t, o2_t))
}

// Return if two operations result in same output regardless of order applied
func commutative(s string, o1 data.OperationModel, o2 data.OperationModel) bool {
	return apply(o1, apply(o2, s)) == apply(o2, apply(o1, s))
}

// Apply an operational model to a string if it is a string operation else fail
func apply(o data.OperationModel, s string) string {
	so, ok := o.(data.StringOperation)
	if !ok {
		log.Fatalf("Failed to convert operation to string operation")
	}
	end := int(math.Min(float64(len(s)), float64(so.RangeEnd)))
	return (s[:so.RangeStart] + so.NewValue + s[end:])
}

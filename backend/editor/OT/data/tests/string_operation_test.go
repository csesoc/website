package tests

import (
	"log"
	"math"
	"testing"

	"cms.csesoc.unsw.edu.au/editor/OT/data"
	"github.com/stretchr/testify/assert"
)

func TestInsertInsertNonOverlap(t *testing.T) {
	s := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: "2"}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Insert)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a1b2cde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal(apply(o1_t1, apply(o2_t1, s)), apply(o2_t2, apply(o1_t2, s)))
}

// TODO: In the case that they are the same location, we need vector clock / ID to determine which operation is done first
// UNCOMMENT TEST WHEN THIS IS IMPLEMENTED
// func TestInsertInsertSameLocation(t *testing.T) {
// 	s := "abcde"
// 	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
// 	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "2"}
// 	o1_t, o2_t := o1.TransformAgainst(o2, data.Insert)

// 	assert := assert.New(t)
//  assert.Equal(apply(o1_t, apply(o2_t, s)), apply(o2_t, apply(o1_t, s)))
// }

func TestInsertInsertOverlap(t *testing.T) {
	s := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: "11"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 4, NewValue: "22"}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Insert)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a11b22cde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal(apply(o1_t1, apply(o2_t1, s)), apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteNonOverlap(t *testing.T) {
	s := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a1bde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal(apply(o1_t1, apply(o2_t1, s)), apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteSameLocation(t *testing.T) {
	s := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 0, RangeEnd: 1, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("1bcde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal(apply(o1_t1, apply(o2_t1, s)), apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteOverlapInsertBeforeDelete(t *testing.T) {
	s := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: "12"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a12bde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal(apply(o1_t1, apply(o2_t1, s)), apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteOverlapDeleteBeforeInsert(t *testing.T) {
	s := "abcde"
	o1 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a1de", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal(apply(o1_t1, apply(o2_t1, s)), apply(o2_t2, apply(o1_t2, s)))
}

func TestDeleteDeleteNonOverlap(t *testing.T) {
	s := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Delete)

	assert := assert.New(t)
	assert.Equal("ade", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal(apply(o1_t1, apply(o2_t1, s)), apply(o2_t2, apply(o1_t2, s)))
}

// TODO: SAME THING WITH TestInsertInsertSameLocation
// func TestDeleteDeleteSame(t *testing.T) {
// 	s := "abcde"
// 	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
// 	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
// 	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
// 	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Delete)

// 	assert := assert.New(t)
// 	assert.Equal("acde", apply(o1_t1, apply(o2_t1, s)))
// 	assert.Equal(apply(o1_t1, apply(o2_t1, s)), apply(o2_t2, apply(o1_t2, s)))
// }

func TestDeleteDeleteOverlap(t *testing.T) {
	s := "abcde"
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: ""}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Delete)

	assert := assert.New(t)
	assert.Equal("ade", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal(apply(o1_t1, apply(o2_t1, s)), apply(o2_t2, apply(o1_t2, s)))
}

func TestDelete(t *testing.T) {
	s := "abcde"
	o1 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}

	assert := assert.New(t)
	assert.Equal("abde", apply(o1, s))
}

// Apply an operational model to a string if it is a string operation else fail
func apply(o data.OperationModel, s string) string {
	so, ok := o.(data.StringOperation)
	if !ok {
		log.Fatalf("Failed to convert operation to string operation")
	}
	start := int(math.Min(float64(len(s)), float64(so.RangeStart)))
	var end = start
	if so.NewValue == "" {
		end = so.RangeEnd
	}
	return (s[:start] + so.NewValue + s[end:])
}

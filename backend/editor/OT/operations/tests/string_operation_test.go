package tests

import (
	"log"
	"math"
	"testing"

	"cms.csesoc.unsw.edu.au/editor/OT/data"
	"github.com/stretchr/testify/assert"
)

const s string = "abcde"

func TestInsertInsertNonOverlap(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: "2"}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Insert)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a1b2cde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("a1b2cde", apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertInsertSameLocation(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "2"}
	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Insert)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a12bcde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("a12bcde", apply(o2_t2, apply(o1_t2, s)))

	o1 = data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: "34"}
	o2 = data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: "12"}
	o1_t1, o2_t1 = o1.TransformAgainst(o2, data.Insert)
	o1_t2, o2_t2 = o2.TransformAgainst(o1, data.Insert)

	assert.Equal("a1234bcde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("a1234bcde", apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertInsertOverlap(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: "11"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 4, NewValue: "22"}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Insert)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a11b22cde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("a11b22cde", apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteNonOverlap(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a1bde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("a1bde", apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteSameLocation(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 0, RangeEnd: 1, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("1bcde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("1bcde", apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteOverlapInsertBeforeDelete(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: "12"}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a12bde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("a12bde", apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteOverlapDeleteBeforeInsert(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("a1de", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("a1de", apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteLessInsertThanDelete(t *testing.T) {
	// Test what happens when the range for delete encompasses insert
	o1 := data.StringOperation{RangeStart: 0, RangeEnd: 1, NewValue: "1"}
	o2 := data.StringOperation{RangeStart: 0, RangeEnd: 5, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("1", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("1", apply(o2_t2, apply(o1_t2, s)))
}

func TestInsertDeleteMoreInsertThanDelete(t *testing.T) {
	// Test what happens when the range for insert encompasses delete
	o1 := data.StringOperation{RangeStart: 0, RangeEnd: 5, NewValue: "11111"}
	o2 := data.StringOperation{RangeStart: 0, RangeEnd: 1, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Insert)

	assert := assert.New(t)
	assert.Equal("11111bcde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("11111bcde", apply(o2_t2, apply(o1_t2, s)))
}

func TestDeleteDeleteNonOverlap(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Delete)

	assert := assert.New(t)
	assert.Equal("ade", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("ade", apply(o2_t2, apply(o1_t2, s)))
}

func TestDeleteDeleteSameOperations(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
	o2 := data.StringOperation{RangeStart: 1, RangeEnd: 2, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Delete)

	assert := assert.New(t)
	assert.Equal("acde", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("acde", apply(o2_t2, apply(o1_t2, s)))

	o1 = data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: ""}
	o2 = data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 = o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 = o2.TransformAgainst(o1, data.Delete)

	assert.Equal("ade", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("ade", apply(o2_t2, apply(o1_t2, s)))
}

func TestDeleteDeleteOverlap(t *testing.T) {
	o1 := data.StringOperation{RangeStart: 1, RangeEnd: 3, NewValue: ""}
	o2 := data.StringOperation{RangeStart: 2, RangeEnd: 3, NewValue: ""}
	o1_t1, o2_t1 := o1.TransformAgainst(o2, data.Delete)
	o1_t2, o2_t2 := o2.TransformAgainst(o1, data.Delete)

	assert := assert.New(t)
	assert.Equal("ade", apply(o1_t1, apply(o2_t1, s)))
	assert.Equal("ade", apply(o2_t2, apply(o1_t2, s)))
}

// Sanity check for which characters delete effects
func TestDelete(t *testing.T) {
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

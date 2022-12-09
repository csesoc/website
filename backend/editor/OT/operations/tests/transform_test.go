package tests

import (
	"testing"

	"cms.csesoc.unsw.edu.au/editor/OT/operations"
	"github.com/stretchr/testify/assert"
)

func TestTransformPoint(t *testing.T) {
	pos1 := []int{1, 2, 3}
	pos2 := []int{1, 2, 4}
	assert.Equal(t, operations.TransformPoint(pos1, pos2), 2)

	pos3 := []int{1, 0}
	pos4 := []int{1, 0, 3, 2}
	assert.Equal(t, operations.TransformPoint(pos3, pos4), 1)
}

func TestEffectIndependence(t *testing.T) {
	// Effect independence condition 1 (refer to https://arxiv.org/pdf/1512.05949.pdf)
	pos1 := []int{2, 2, 3, 4}
	pos2 := []int{1, 2, 4, 4}
	assert.Equal(t, operations.EffectIndependent(pos1, pos2, operations.TransformPoint(pos1, pos2)), true)

	// Effect independence condition 2
	pos3 := []int{1, 2}
	pos4 := []int{1, 0, 3, 2}
	assert.Equal(t, operations.EffectIndependent(pos3, pos4, operations.TransformPoint(pos3, pos4)), true)

	// Effect independence condition 3
	pos5 := []int{1, 0, 3, 2}
	pos6 := []int{1, 2}
	assert.Equal(t, operations.EffectIndependent(pos5, pos6, operations.TransformPoint(pos5, pos6)), true)

	// Not effect independent
	pos7 := []int{1, 2, 3, 4}
	pos8 := []int{1, 2, 3, 4}
	assert.Equal(t, operations.EffectIndependent(pos7, pos8, operations.TransformPoint(pos7, pos8)), false)
}

func TestTransformInserts(t *testing.T) {
	pos1 := []int{1, 2, 3, 4}
	pos2 := []int{1, 2, 3, 3}
	TP1 := operations.TransformPoint(pos1, pos2)
	pos1, pos2, _ = operations.TransformInserts(pos1, pos2, TP1)
	assert.Equal(t, []int{1, 2, 3, 5}, pos1)
	assert.Equal(t, pos2, []int{1, 2, 3, 3})

	pos3 := []int{1, 2, 3, 3}
	pos4 := []int{1, 2, 3, 4}
	TP2 := operations.TransformPoint(pos3, pos4)
	pos3, pos4, _ = operations.TransformInserts(pos3, pos4, TP2)
	assert.Equal(t, pos4, []int{1, 2, 3, 5})
	assert.Equal(t, pos3, []int{1, 2, 3, 3})

	pos5 := []int{1, 2, 3, 4, 5, 6}
	pos6 := []int{1, 2, 3, 4}
	TP3 := operations.TransformPoint(pos5, pos6)
	pos5, pos6, _ = operations.TransformInserts(pos5, pos6, TP3)
	assert.Equal(t, []int{1, 2, 3, 5, 5, 6}, pos5)
	assert.Equal(t, pos6, []int{1, 2, 3, 4})

	pos7 := []int{1, 2, 3, 4}
	pos8 := []int{1, 2, 3, 4, 5, 6}
	TP4 := operations.TransformPoint(pos7, pos8)
	pos7, pos8, _ = operations.TransformInserts(pos7, pos8, TP4)
	assert.Equal(t, []int{1, 2, 3, 5, 5, 6}, pos8)
	assert.Equal(t, pos7, []int{1, 2, 3, 4})
}

func TestTransformDeletes(t *testing.T) {
	pos1 := []int{1, 2, 3, 4}
	pos2 := []int{1, 2, 3, 3}
	TP1 := operations.TransformPoint(pos1, pos2)
	pos1, pos2 = operations.TransformDeletes(pos1, pos2, TP1)
	assert.Equal(t, []int{1, 2, 3, 3}, pos1)
	assert.Equal(t, pos2, []int{1, 2, 3, 3})

	pos3 := []int{1, 2, 3, 3}
	pos4 := []int{1, 2, 3, 4}
	TP2 := operations.TransformPoint(pos3, pos4)
	pos3, pos4 = operations.TransformDeletes(pos3, pos4, TP2)
	assert.Equal(t, []int{1, 2, 3, 3}, pos4)
	assert.Equal(t, pos3, []int{1, 2, 3, 3})

	pos5 := []int{1, 2, 3, 4, 5, 6}
	pos6 := []int{1, 2, 3, 4}
	TP3 := operations.TransformPoint(pos5, pos6)
	pos5, pos6 = operations.TransformDeletes(pos5, pos6, TP3)
	assert.Nil(t, pos5)
	assert.Equal(t, pos6, []int{1, 2, 3, 4})

	pos7 := []int{1, 2, 3, 4}
	pos8 := []int{1, 2, 3, 4, 5, 6}
	TP4 := operations.TransformPoint(pos7, pos8)
	pos7, pos8 = operations.TransformDeletes(pos7, pos8, TP4)
	assert.Nil(t, pos8)
	assert.Equal(t, pos7, []int{1, 2, 3, 4})

	pos9 := []int{1, 2, 3, 4, 5, 6}
	pos10 := []int{1, 2, 3, 4, 5, 6}
	TP5 := operations.TransformPoint(pos9, pos10)
	pos9, pos10 = operations.TransformDeletes(pos9, pos10, TP5)
	assert.Nil(t, pos9)
	assert.Nil(t, pos10)
}

func TestTransformInsertDelete(t *testing.T) {
	pos1 := []int{1, 2, 3, 4}
	pos2 := []int{1, 2, 3, 3}
	TP1 := operations.TransformPoint(pos1, pos2)
	pos1, pos2 = operations.TransformInsertDelete(pos1, pos2, TP1)
	assert.Equal(t, pos1, []int{1, 2, 3, 3})
	assert.Equal(t, pos2, []int{1, 2, 3, 3})

	pos3 := []int{1, 2, 3, 3}
	pos4 := []int{1, 2, 3, 4}
	TP2 := operations.TransformPoint(pos3, pos4)
	pos3, pos4 = operations.TransformInsertDelete(pos3, pos4, TP2)
	assert.Equal(t, pos4, []int{1, 2, 3, 5})
	assert.Equal(t, pos3, []int{1, 2, 3, 3})

	pos5 := []int{1, 2, 3, 4, 5, 6}
	pos6 := []int{1, 2, 3, 4}
	TP3 := operations.TransformPoint(pos5, pos6)
	pos5, pos6 = operations.TransformInsertDelete(pos5, pos6, TP3)
	assert.Nil(t, pos5)
	assert.Equal(t, pos6, []int{1, 2, 3, 4})

	pos9 := []int{1, 2, 3, 4, 5, 6}
	pos10 := []int{1, 2, 3, 4, 5, 6}
	TP5 := operations.TransformPoint(pos9, pos10)
	pos9, pos10 = operations.TransformInsertDelete(pos9, pos10, TP5)
	assert.Equal(t, pos9, []int{1, 2, 3, 4, 5, 6})
	assert.Equal(t, pos10, []int{1, 2, 3, 4, 5, 7})
}

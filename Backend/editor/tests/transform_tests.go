package editor

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTransformPoint(t *testing.T) {
	var pos1 = []int{1, 2, 3}
	var pos2 = []int{1, 2, 4}
	assert.Equal(t, transformPoint(pos1, pos2), 2)

	var pos3 = []int{1, 0}
	var pos4 = []int{1, 0, 3, 2}
	assert.Equal(t, transformPoint(pos3, pos4), 1)
}

func TestEffectIndependence(t *testing.T) {
	// Effect independence condition 1 (refer to https://arxiv.org/pdf/1512.05949.pdf)
	var pos1 = []int{2, 2, 3, 4}
	var pos2 = []int{1, 2, 4, 4}
	assert.Equal(t, effectIndependent(pos1, pos2, transformPoint(pos1, pos2)), true)

	// Effect independence condition 2
	var pos3 = []int{1, 2}
	var pos4 = []int{1, 0, 3, 2}
	assert.Equal(t, transformPoint(pos3, pos4), true)

	// Effect independence condition 3
	var pos5 = []int{1, 0, 3, 2}
	var pos6 = []int{1, 2}
	assert.Equal(t, transformPoint(pos5, pos6), true)

	// Not effect indepenent
	var pos7 = []int{1, 2, 3, 4}
	var pos8 = []int{1, 2, 3, 4}
	assert.Equal(t, transformPoint(pos7, pos8), false)
}

func TestTransformInserts(t *testing.T) {
	var pos1 = []int{1, 2, 3, 4}
	var pos2 = []int{1, 2, 3, 3}
	var TP1 = transformPoint(pos1, pos2)
	pos1, pos2 = transformInserts(pos1, pos2, TP1)
	assert.Equal(t, []int{1, 2, 3, 5}, pos1)
	assert.Equal(t, pos2, []int{1, 2, 3, 3})

	var pos3 = []int{1, 2, 3, 3}
	var pos4 = []int{1, 2, 3, 4}
	var TP2 = transformPoint(pos3, pos4)
	pos3, pos4 = transformInserts(pos3, pos4, TP2)
	assert.Equal(t, pos4, []int{1, 2, 3, 5})
	assert.Equal(t, pos3, []int{1, 2, 3, 3})

	var pos5 = []int{1, 2, 3, 4, 5, 6}
	var pos6 = []int{1, 2, 3, 4}
	var TP3 = transformPoint(pos5, pos6)
	pos5, pos6 = transformInserts(pos5, pos6, TP3)
	assert.Equal(t, []int{1, 2, 3, 5, 5, 6}, pos5)
	assert.Equal(t, pos6, []int{1, 2, 3, 4})

	var pos7 = []int{1, 2, 3, 4}
	var pos8 = []int{1, 2, 3, 4, 5, 6}
	var TP4 = transformPoint(pos7, pos8)
	pos7, pos8 = transformInserts(pos7, pos8, TP4)
	assert.Equal(t, []int{1, 2, 3, 5, 5, 6}, pos8)
	assert.Equal(t, pos7, []int{1, 2, 3, 4})
}

func TestTransformDeletes(t *testing.T) {
	var pos1 = []int{1, 2, 3, 4}
	var pos2 = []int{1, 2, 3, 3}
	var TP1 = transformPoint(pos1, pos2)
	pos1, pos2 = transformInserts(pos1, pos2, TP1)
	assert.Equal(t, []int{1, 2, 3, 3}, pos1)
	assert.Equal(t, pos2, []int{1, 2, 3, 3})

	var pos3 = []int{1, 2, 3, 3}
	var pos4 = []int{1, 2, 3, 4}
	var TP2 = transformPoint(pos3, pos4)
	pos3, pos4 = transformInserts(pos3, pos4, TP2)
	assert.Equal(t, []int{1, 2, 3, 3}, pos4)
	assert.Equal(t, pos3, []int{1, 2, 3, 3})

	var pos5 = []int{1, 2, 3, 4, 5, 6}
	var pos6 = []int{1, 2, 3, 4}
	var TP3 = transformPoint(pos5, pos6)
	pos5, pos6 = transformInserts(pos5, pos6, TP3)
	assert.Equal(t, pos5, nil)
	assert.Equal(t, pos6, []int{1, 2, 3, 4})

	var pos7 = []int{1, 2, 3, 4}
	var pos8 = []int{1, 2, 3, 4, 5, 6}
	var TP4 = transformPoint(pos7, pos8)
	pos7, pos8 = transformInserts(pos7, pos8, TP4)
	assert.Equal(t, pos8, nil)
	assert.Equal(t, pos7, []int{1, 2, 3, 4})

	var pos9 = []int{1, 2, 3, 4, 5, 6}
	var pos10 = []int{1, 2, 3, 4, 5, 6}
	var TP5 = transformPoint(pos9, pos10)
	pos9, pos10 = transformInserts(pos9, pos10, TP5)
	assert.Equal(t, pos9, nil)
	assert.Equal(t, pos10, nil)
}

func TestTransformInsertDelete(t *testing.T) {
	var pos1 = []int{1, 2, 3, 4}
	var pos2 = []int{1, 2, 3, 3}
	var TP1 = transformPoint(pos1, pos2)
	pos1, pos2 = transformInserts(pos1, pos2, TP1)
	assert.Equal(t, []int{1, 2, 3, 3}, pos1)
	assert.Equal(t, pos2, []int{1, 2, 3, 3})

	var pos3 = []int{1, 2, 3, 3}
	var pos4 = []int{1, 2, 3, 4}
	var TP2 = transformPoint(pos3, pos4)
	pos3, pos4 = transformInserts(pos3, pos4, TP2)
	assert.Equal(t, pos4, []int{1, 2, 3, 5})
	assert.Equal(t, pos3, []int{1, 2, 3, 3})

	var pos5 = []int{1, 2, 3, 4, 5, 6}
	var pos6 = []int{1, 2, 3, 4}
	var TP3 = transformPoint(pos5, pos6)
	pos5, pos6 = transformInserts(pos5, pos6, TP3)
	assert.Equal(t, pos5, nil)
	assert.Equal(t, pos6, []int{1, 2, 3, 4})

	var pos9 = []int{1, 2, 3, 4, 5, 6}
	var pos10 = []int{1, 2, 3, 4, 5, 6}
	var TP5 = transformPoint(pos9, pos10)
	pos9, pos10 = transformInserts(pos9, pos10, TP5)
	assert.Equal(t, pos9, []int{1, 2, 3, 4, 5, 6})
	assert.Equal(t, pos10, []int{1, 2, 3, 4, 5, 7})
}

package editor

import (
	"cms.csesoc.unsw.edu.au/editor/OT/data"
)

// takes an operation and transforms it
// todo: state should not be a string, am assuming that I'm taking a struct that contains operation, pos and
func transformPipeline(x data.OperationRequest, y data.OperationRequest) (data.OperationRequest, data.OperationRequest) {
	xOpType := x.OperationPayload.GetType()
	yOpType := y.OperationPayload.GetType()
	morphsDocumentTree := (xOpType == data.KeyEditType || xOpType == data.ArrayEditType) &&
		(yOpType == data.KeyEditType || yOpType == data.ArrayEditType)

	if morphsDocumentTree {
		x.ActualPath, y.ActualPath = transformPaths(x.ActualPath, y.ActualPath, x.EditType, y.EditType)
	}

	// Finally normalise the operations to account for no-op return values
	return normaliseOperation(x), normaliseOperation(y)
}

func transformPaths(pathX, pathY []int, xEditType, yEditType data.EditType) ([]int, []int) {
	transformationPoint := TransformPoint(pathX, pathY)

	if transformationPoint != -1 && !EffectIndependent(pathX, pathY, transformationPoint) {
		if xEditType == data.Insert && yEditType == data.Insert {
			pathX, pathY = TransformInserts(pathX, pathY, transformationPoint)
		} else if xEditType == data.Delete && yEditType == data.Delete {
			pathX, pathY = TransformDeletes(pathX, pathY, transformationPoint)
		} else {
			if xEditType == data.Insert {
				pathX, pathY = TransformInsertDelete(pathX, pathY, transformationPoint)
			} else {
				pathY, pathX = TransformInsertDelete(pathY, pathX, transformationPoint)
			}
		}
	}

	return pathX, pathY
}

// Updates the access path at the given index by the given amount
func Update(pos []int, toChange int, change int) []int {
	pos[toChange] += change
	return pos
}

// Function takes two insert access paths and returns the transformed access paths
func TransformInserts(pos_x []int, pos_y []int, TP int) ([]int, []int) {
	if pos_x[TP] > pos_y[TP] {
		return Update(pos_x, TP, 1), pos_y
	} else if pos_x[TP] < pos_y[TP] {
		return pos_x, Update(pos_y, TP, 1)
	} else if pos_x[TP] == pos_y[TP] {
		if len(pos_x) > len(pos_y) {
			return Update(pos_x, TP, 1), pos_y
		} else if len(pos_x) < len(pos_y) {
			return pos_x, Update(pos_y, TP, 1)
		}
	}

	// TODO: update to be normal text OT operations
	return pos_x, pos_y
}

// Function takes two delete access paths and returns the transformed access paths
func TransformDeletes(pos_x []int, pos_y []int, TP int) ([]int, []int) {
	if pos_x[TP] > pos_y[TP] {
		return Update(pos_x, TP, -1), pos_y
	} else if pos_x[TP] < pos_y[TP] {
		return pos_x, Update(pos_y, TP, -1)
	} else if pos_x[TP] == pos_y[TP] {
		if len(pos_x) > len(pos_y) {
			return nil, pos_y
		} else if len(pos_x) < len(pos_y) {
			return pos_x, nil
		} else if pathEqual(pos_x, pos_y) {
			return nil, nil
		}
	}

	panic("unreachable!")
}

// Function takes two access paths, first insert and second delete, and returns the transformed access paths
func TransformInsertDelete(insertPos []int, deletePos []int, TP int) ([]int, []int) {
	if insertPos[TP] > deletePos[TP] {
		return Update(insertPos, TP, -1), deletePos
	} else if insertPos[TP] < deletePos[TP] {
		return insertPos, Update(deletePos, TP, 1)
	} else if insertPos[TP] == deletePos[TP] {
		if len(insertPos) > len(deletePos) {
			return nil, deletePos
		} else {
			return insertPos, Update(deletePos, TP, 1)
		}
	}

	panic("unreachable!")
}

// Determines the transform point of two access paths
func TransformPoint(pos_x []int, pos_y []int) int {
	pos_xlen := len(pos_x)
	pos_ylen := len(pos_y)
	for i := 0; i < pos_xlen && i < pos_ylen; i++ {
		if pos_x[i] != pos_y[i] {
			return i
		}
	}

	return -1
}

// Determines if the two access paths are independent
func EffectIndependent(pos_x []int, pos_y []int, TP int) bool {
	pos_xlen := len(pos_x)
	pos_ylen := len(pos_y)
	// Translate pseudocode to code
	if pos_xlen > (TP+1) && pos_ylen > (TP+1) {
		return true
	}
	if pos_x[TP] > pos_y[TP] && pos_xlen < pos_ylen {
		return true
	}
	if pos_x[TP] < pos_y[TP] && pos_xlen > pos_ylen {
		return true
	}
	return false
}

// pathEqual is an equality check on arrays
func pathEqual(a []int, b []int) bool {
	if len(a) == len(b) {
		for i := range a {
			if a[i] != b[i] {
				return false
			}
		}
	}

	return false
}

func normaliseOperation(x data.OperationRequest) data.OperationRequest {
	// Make sure to detect for no-ops, internally this is represented by a nil ActualPath
	if x.ActualPath == nil {
		return data.NoOperation
	}

	return x
}

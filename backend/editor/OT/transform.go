package editor

import (
	"cms.csesoc.unsw.edu.au/editor/OT/data"
)

// transformPipeline takes an operation and transforms it according to our transformation specification
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

// transformPaths takes two paths and transforms it according to the paper's tree OT specification
func transformPaths(pathX, pathY []int, xEditType, yEditType data.EditType) ([]int, []int) {
	transformationPoint := TransformPoint(pathX, pathY)

	if !EffectIndependent(pathX, pathY, transformationPoint) {
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
func TransformDeletes(pathX []int, pathY []int, transformationPoint int) ([]int, []int) {
	if pathX[transformationPoint] > pathY[transformationPoint] {
		return Update(pathX, transformationPoint, -1), pathY
	} else if pathX[transformationPoint] < pathY[transformationPoint] {
		return pathX, Update(pathY, transformationPoint, -1)
	} else {
		if len(pathX) > len(pathY) {
			return nil, pathY
		} else if len(pathX) < len(pathY) {
			return pathX, nil
		} else if pathEqual(pathX, pathY) {
			return nil, nil
		}
	}

	return pathX, pathY
}

// TransformInsertDelete takes two access paths, first insert and second delete, and returns the transformed access paths
// note that this is a direct implementation of the code in the paper
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

	// TODO: not this.
	panic("unreachable!")
}

// TransformPoint determines the transform point of two access paths
// the transform point is simply just the first location in which the paths differ
func TransformPoint(pathX []int, pathY []int) int {
	end := min(len(pathX), len(pathY))
	for i := 0; i < end; i++ {
		if pathX[i] != pathY[i] {
			return i
		}
	}

	return end - 1
}

// EffectIndependent determines if the two access paths are independent
func EffectIndependent(pathX []int, pathY []int, transformationPoint int) bool {
	return (len(pathX) > (transformationPoint+1) && len(pathY) > (transformationPoint+1)) ||
		(pathX[transformationPoint] > pathY[transformationPoint] && len(pathX) < len(pathY)) ||
		(pathX[transformationPoint] < pathY[transformationPoint] && len(pathX) > len(pathY))
}

// pathEqual is an equality check on paths
func pathEqual(a []int, b []int) bool {
	if len(a) == len(b) {
		for i := range a {
			if a[i] != b[i] {
				return false
			}
		}
	}

	return true
}

// min is just a simple minimum utility, computes the minimum of two numbers
func min(a, b int) int {
	if a > b {
		return b
	}

	return a
}

// normaliseOperation converts operations containing nil invalid paths to no-operations
// no-operations are not applied by the rest of the system to the document :D
func normaliseOperation(x data.OperationRequest) data.OperationRequest {
	// Make sure to detect for no-ops, internally this is represented by a nil ActualPath
	if x.ActualPath == nil {
		return data.NoOperation
	}

	return x
}
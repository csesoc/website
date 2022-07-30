package editor

// functions for operational transform

// takes an operation and transforms it
// todo: state should not be a string, am assuming that I'm taking a struct that contains operation, pos and
func transformPipeline(x format, y format) (format, format) {
	// IDK how to get type of transform and pos_x pos_y yet
	pos_x = x.path
	pos_y = y.path
	TP = transformPoint(pos_x, pos_y)
	if effectIndependent(pos_x, pos_y, TP) {
		return x, y
	} else if x.operation == "insert" && y.operation == "insert" {
		// both are insert
		pos_x, pos_y = transformInserts(pos_x, pos_y)
	} else if x.operation == "delete" && y.operation == "delete" {
		pos_x, pos_y = transformDeletes(pos_x, pos_y)
		// How to handle nill returns?
	} else {
		if x.operation == "insert" {
			pos_x, pos_y = transformInsertDelete(pos_x, pos_y)
		} else {
			pos_y, pos_x = transformInsertDelete(pos_y, pos_x)
		}

	}
	// Assign new pos_x and pos_y to the oeprations and return operations
	x.path = pos_x
	y.path = pos_y
	return x, y
}

// Updates the access path at the given index by the given amount
func update(pos []int, toChange int, change int) []int {
	pos[toChange] += change
	return pos
}

// Function takes two insert access paths and returns the transformed access paths
func transformInserts(pos_x []int, pos_y []int, TP int) ([]int, []int) {
	if pos_x[TP] > pos_y[TP] {
		return update(pos_x, TP, 1), pos_y
	} else if pos_x[TP] < pos_y[TP] {
		return pos_x, update(pos_y, TP, 1)
	} else if pos_x[TP] == pos_y[TP] {
		if len(pos_x) > len(pos_y) {
			return update(pos_x, TP, 1), pos_y
		} else if len(pos_x) < len(pos_y) {
			return pos_x, update(pos_y, TP, 1)
		}
		// Idk wat application dependent properties are
	}
}

// Function takes two delete access paths and returns the transformed access paths
func transformDeletes(pos_x []int, pos_y []int, TP int) ([]int, []int) {
	if pos_x[TP] > pos_y[TP] {
		return update(pos_x, TP, -1), pos_y
	} else if pos_x[TP] < pos_y[TP] {
		return pos_x, update(pos_y, TP, -1)
	} else if pos_x[TP] == pos_y[TP] {
		if len(pos_x) > len(pos_y) {
			return nil, pos_y
		} else if len(pos_x) < len(pos_y) {
			return pos_x, nil
		} else if pos_x == pos_y {
			return nil, nil
		}
	}
}

// Function takes two access paths, first insert and second delete, and returns the transformed access paths
func transformInsertDelete(insertPos []int, deletePos []int, TP int) ([]int, []int) {
	if insertPos[TP] > deletePos[TP] {
		return update(insertPos, TP, -1), deletePos
	} else if insertPos[TP] < deletePos[TP] {
		return insertPos, update(deletePos, TP, 1)
	} else if insertPos[TP] == deletePos[TP] {
		if len(pos_x) > len(deletePos) {
			return nil, deletePos
		} else {
			return insertPos, update(deletePos, TP, 1)
		}
	}
}

// Determines the transform point of two access paths
func transformPoint(pos_x []int, pos_y []int) int {
	pos_xlen := len(pos_x)
	pos_ylen := len(pos_y)
	for i := 0; i < pos_xlen && i < pos_ylen; i++ {
		if pos_x[i] != pos_y[i] {
			return i
		}
	}
}

// Determines if the two access paths are independent
func effectIndependent(pos_x []int, pos_y []int, TP int) bool {
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

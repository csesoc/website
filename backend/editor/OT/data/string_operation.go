package data

import (
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// StringOperation represents an operation on a string type
// @implements OperationModel
type StringOperation struct {
	RangeStart, RangeEnd int
	NewValue             string
}

// If NewValue == "", delete every character between RangeStart and RangeEnd
// Else RangeEnd = RangeStart + len(NewValue), and insert NewValue starting at RangeStart

// TransformAgainst is the StringOperation implementation of the operationModel interface
func (stringOp StringOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	othStringOp, ok := operation.(StringOperation)
	if !ok {
		return stringOp, operation
	}
	if stringOp.NewValue != "" {
		if applicationType == Insert {
			return insertInsert(othStringOp, stringOp), insertInsert(stringOp, othStringOp)
		} else {
			return insertDelete(stringOp, othStringOp), deleteInsert(othStringOp, stringOp)
		}
	} else {
		if applicationType == Insert {
			return deleteInsert(stringOp, othStringOp), insertDelete(othStringOp, stringOp)
		} else {
			return deleteDelete(othStringOp, stringOp), deleteDelete(stringOp, othStringOp)
		}
	}
	// If the operation to transform it against is not a StringOperation, do nothing
	// Else transform it by adjusting RangeStart / RangeEnd values to account for other edit
	// https://srijancse.medium.com/operational-transformation-the-real-time-collaborative-editing-algorithm-bf8756683f66
	// Then return (transformedOperation, operation)
}

// Apply is the StringOperation implementation of the OperationModel interface, it does nothing
func (stringOp StringOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) cmsjson.AstNode {
	return parentNode
}

// Transform o2 when o1 is an insert, and o2 is a insert
func insertInsert(o1 StringOperation, o2 StringOperation) StringOperation {
	if o1.RangeStart >= o2.RangeStart {
		// If other insert happens before our insert, shift insert right
		length := o2.RangeEnd - o2.RangeStart
		o1.RangeStart, o1.RangeEnd = o1.RangeStart+length, o1.RangeEnd+length
	}
	return o1
}

// Transform o1 when o1 is an insert, and o2 is a delete
func insertDelete(o1 StringOperation, o2 StringOperation) StringOperation {
	if o1.RangeStart <= o2.RangeStart {
		// If insert happens before the delete, do nothing to insert op
		return o1
	} else if o1.RangeStart > o2.RangeEnd {
		// If the insert happens after the delete, shift insert left
		length := o2.RangeEnd - o2.RangeStart
		o1.RangeStart, o1.RangeEnd = o1.RangeStart-length, o1.RangeEnd-length
	} else {
		// Overlap
		if o2.RangeStart <= o1.RangeStart {
			// If delete comes before shift insert to start of delete
			shift := o1.RangeStart - o2.RangeStart
			o1.RangeStart, o1.RangeEnd = o1.RangeStart-shift, o1.RangeEnd-shift
		}
	}
	return o1
}

// Transform o1 when o1 is an delete, and o2 is a insert
func deleteInsert(o1 StringOperation, o2 StringOperation) StringOperation {
	// Do nothing as cases are all handled by insertDelete
	return o1
}

// Transform o1 when o1 is an delete, and o2 is a delete
func deleteDelete(o1 StringOperation, o2 StringOperation) StringOperation {
	if o2.RangeStart >= o1.RangeEnd {
		return o1
	} else if o1.RangeStart >= o2.RangeEnd {
		length := o2.RangeEnd - o2.RangeStart
		o1.RangeStart, o1.RangeEnd = o1.RangeStart-length, o1.RangeEnd-length
	} else {
		if o2.RangeStart <= o1.RangeStart {
			// o2 starts before or at o1
			if o1.RangeEnd <= o2.RangeEnd {
				// o2 is bigger or same as o1 so o1 becomes noop
				o1.RangeEnd = o1.RangeStart
			} else {
				// o1 ends after o2, so delete everything inbetween o1 and o2
				o1.RangeStart = o2.RangeEnd
			}
		} else {
			// o1 starts before o2
			if o2.RangeEnd <= o1.RangeEnd {
				// o1 is bigger or same as o1 so do nothing
				return o1
			} else {
				// o2 ends after o1, so delete everything inbetween o1 and o2
				o1.RangeEnd = o2.RangeStart
			}
		}
	}
	return o1
}

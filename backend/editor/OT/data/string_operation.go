package data

import (
	"cms.csesoc.unsw.edu.au/pkg/cmsjson"
)

// StringOperation represents an operation on a string type
// @implements OperationModel
type StringOperation struct {
	rangeStart, rangeEnd int
	newValue             string
}

// If newValue == "", delete every character between rangeStart and rangeEnd
// Else rangeEnd = rangeStart + len(newValue), and insert newValue starting at rangeStart

// TransformAgainst is the StringOperation implementation of the operationModel interface
func (stringOp StringOperation) TransformAgainst(operation OperationModel, applicationType EditType) (OperationModel, OperationModel) {
	othStringOp, ok := operation.(StringOperation)
	if !ok {
		return stringOp, operation
	}
	if othStringOp.newValue != "" {
		if applicationType == Insert {
			return insertInsert(othStringOp, stringOp), insertInsert(stringOp, othStringOp)
		} else {
			return insertDelete(othStringOp, stringOp), insertDelete(stringOp, othStringOp)
		}
	} else {
		if applicationType == Insert {
			return deleteInsert(othStringOp, stringOp), deleteInsert(stringOp, othStringOp)
		} else {
			return deleteDelete(othStringOp, stringOp), deleteDelete(stringOp, othStringOp)
		}
	}
	// If the operation to transform it against is not a StringOperation, do nothing
	// Else transform it by adjusting rangeStart / rangeEnd values to account for other edit
	// https://srijancse.medium.com/operational-transformation-the-real-time-collaborative-editing-algorithm-bf8756683f66
	// Then return (transformedOperation, operation)
}

// Apply is the StringOperation implementation of the OperationModel interface, it does nothing
func (stringOp StringOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) cmsjson.AstNode {
	return parentNode
}

// Transform o2 when o1 is an insert, and o2 is a insert
func insertInsert(o1 StringOperation, o2 StringOperation) StringOperation {
	if o1.rangeStart >= o2.rangeStart {
		// If other insert happens before our insert, shift insert right
		length := o2.rangeEnd - o2.rangeStart
		o1.rangeStart, o1.rangeEnd = o1.rangeStart+length, o1.rangeEnd+length
	}
	return o1
}

// Transform o1 when o1 is an insert, and o2 is a delete
func insertDelete(o1 StringOperation, o2 StringOperation) StringOperation {
	if o1.rangeStart <= o2.rangeStart {
		// If insert happens before the delete, do nothing to insert op
		return o1
	} else if o1.rangeStart >= o2.rangeEnd {
		// If the insert happens after the delete, shift insert left
		length := o2.rangeEnd - o2.rangeStart
		o1.rangeStart, o1.rangeEnd = o1.rangeStart-length, o1.rangeEnd-length
	} else {
		// Overlap case FUCK FUCK FUCK
		o1.rangeStart = o2.rangeStart
	}
	return o1
}

// Transform o1 when o1 is an delete, and o2 is a insert
func deleteInsert(o1 StringOperation, o2 StringOperation) StringOperation {
	if o2.rangeStart < o1.rangeEnd {
		// If delete happens after the insert, do nothing to delete op
		return o1
	} else if o1.rangeStart >= o2.rangeStart {
		// If delete happens after insert, shift delete right
		length := o2.rangeEnd - o2.rangeStart
		o1.rangeStart, o1.rangeEnd = o1.rangeStart+length, o1.rangeEnd+length
	}
	if o1.rangeEnd < o2.rangeStart {
		// Overlap case FUCK FUCK FUCK
		o1.rangeStart = o2.rangeStart
	}
	return o1
}

// Transform o2 when o1 is an delete, and o2 is a delete
func deleteDelete(o1 StringOperation, o2 StringOperation) StringOperation {
	if o2.rangeStart >= o1.rangeEnd {
		return o1
	} else if o1.rangeStart >= o2.rangeEnd {
		length := o2.rangeEnd - o2.rangeStart
		o1.rangeStart, o2.rangeEnd = o1.rangeStart+length, o1.rangeEnd+length
	} else {
		// Overlap case FUCK FUCK FUCK
	}
	return o1
}

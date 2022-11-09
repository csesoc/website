package operations

import (
	"errors"
	"fmt"

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
	// If the operation to transform it against is not a StringOperation, do nothing
	// Else transform it by adjusting RangeStart / RangeEnd values to account for other edit
	// https://srijancse.medium.com/operational-transformation-the-real-time-collaborative-editing-algorithm-bf8756683f66
	// Then return (transformedOperation, operation)
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
			return deleteDelete(othStringOp, stringOp, false), deleteDelete(stringOp, othStringOp, true)
		}
	}
}

// Apply is the ArrayOperation implementation of the OperationModel interface, it does nothing
func (arrOp StringOperation) Apply(parentNode cmsjson.AstNode, applicationIndex int, applicationType EditType) (cmsjson.AstNode, error) {
	if children, _ := parentNode.JsonPrimitive(); children != nil {
		return nil, errors.New("parent node cannot be a primitive")
	}

	children, _ := parentNode.JsonObject()
	if children == nil {
		children, _ = parentNode.JsonArray()
	}

	maxIndex := len(children) - 1
	if applicationIndex < 0 || applicationIndex > maxIndex {
		return nil, fmt.Errorf("application index must be between 0 and %d", maxIndex)
	}

	resultText, _ := children[applicationIndex].JsonPrimitive()
	if resultText == nil {
		return nil, errors.New("child at application index must be a primitive")
	}

	switch applicationType {
	case Insert:
		resultText = resultText.(string)[:arrOp.RangeStart] + arrOp.NewValue + resultText.(string)[arrOp.RangeEnd+1:]
	case Delete:
		resultText = resultText.(string)[:arrOp.RangeStart] + resultText.(string)[arrOp.RangeEnd+1:]
	default:
		return nil, fmt.Errorf("invalid edit type")
	}

	children[applicationIndex].UpdateOrAddPrimitiveElement(cmsjson.ASTFromValue(resultText))
	return parentNode, nil
}

// Transform o2 when o1 is an insert, and o2 is a insert
func insertInsert(o1 StringOperation, o2 StringOperation) StringOperation {
	if o1.RangeStart > o2.RangeStart {
		// If other insert happens before our insert, shift insert right
		length := o2.RangeEnd - o2.RangeStart
		o1.RangeStart, o1.RangeEnd = o1.RangeStart+length, o1.RangeEnd+length
	}
	return o1
}

// Transform o1 when o1 is an insert, and o2 is a delete
func insertDelete(o1 StringOperation, o2 StringOperation) StringOperation {
	if o1.RangeStart <= o2.RangeStart {
		return o1
	} else if o1.RangeStart > o2.RangeEnd {
		// If the insert happens after the delete, shift insert left
		length := o2.RangeEnd - o2.RangeStart
		o1.RangeStart, o1.RangeEnd = o1.RangeStart-length, o1.RangeEnd-length
	} else if o2.RangeStart <= o1.RangeStart {
		// If delete comes before shift insert to start of delete and overlap
		shift := o1.RangeStart - o2.RangeStart
		o1.RangeStart, o1.RangeEnd = o1.RangeStart-shift, o1.RangeEnd-shift
	}
	return o1
}

// Transform o1 when o1 is an delete, and o2 is a insert
func deleteInsert(o1 StringOperation, o2 StringOperation) StringOperation {
	// Do nothing as cases are all handled by insertDelete
	return o1
}

// Transform o1 when o1 is an delete, and o2 is a delete
func deleteDelete(o1 StringOperation, o2 StringOperation, isLast bool) StringOperation {
	if o1.RangeStart == o2.RangeStart && o1.RangeEnd == o2.RangeEnd {
		if isLast {
			// If both operations do the same thing, make second operation noop
			o1.RangeEnd = o1.RangeStart
		}
		return o1
	}
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
		} else if o2.RangeEnd > o1.RangeEnd {
			// o2 ends after o1, so delete everything inbetween o1 and o2
			o1.RangeEnd = o2.RangeStart
		}
	}
	return o1
}

package editor

// functions for operational transform

// takes an operation and transforms it
// todo: state should not be a string, am assuming that I'm taking a struct that contains operation, pos and 
func transformPipeline(x op, state string) op {
	// IDK how to get type of transform and pos1 pos2 yet
   TP = transformPoint(pos1, pos2)
   if effectIndependent(pos1, pos2, TP) {
      return 
   }
   else if  {
      // both are insert
      pos1, pos2 = transformInserts(pos1, pos2)
   }
   else if {
      pos1, pos2 = transformDeletes(pos1, pos2)
   }
   else {
      // Determine the insert operation and the delete operation
     pos1, pos2 = transformInsertDelete(pos1, pos2) 
   }
   // Assign new pos1 and pos2 to the oeprations and return operations

   return x
}

// Function takes two insert access paths and returns the transformed access paths
func transformInserts(pos1 []int, pos2 []int, TP int) ([]int, []int) {
   if pos1[TP] > pos2[TP] {
      return update(pos1, TP, 1), pos2
   }
   else if pos1[TP] < pos2[TP] {
      return pos1, update(pos2, TP, 1)
   }
   else if pos1[TP] == pos2[TP] {
      if len(pos1) > len(pos2) {
         return update(pos1, TP, 1), pos2
      }
      else if len(pos1) < len(pos2) {
         return pos1, update(pos2, TP, 1)
      }
      // Idk wat application dependent properties are
   }
}

// Function takes two delete access paths and returns the transformed access paths
func transformDeletes(pos1 []int, pos2 []int, TP int) ([]int, []int) {
   if pos1[TP] > pos2[TP] {
      return update(pos1, TP, -1), pos2
   }
   else if pos1[TP] < pos2[TP] {
      return pos1, update(pos2, TP, -1)
   }
   else if pos1[TP] == pos2[TP] {
      if len(pos1) > len(pos2) {
         return nil, pos2
      }
      else if len(pos1) < len(pos2) {
         return pos1, nil
      }
      else if pos1 == pos2:
         return nil, nil
   }
}

// Function takes two access paths, first insert and second delete, and returns the transformed access paths
func transformInsertDelete(insertPos []int, deletePos []int, TP int) ([]int, []int) {
   if insertPos[TP] > deletePos[TP] {
      return update(insertPos, TP, -1), deletePos
   }
   else if insertPos[TP] < deletePos[TP] {
      return insertPos, update(deletePos, TP, 1)
   }
   else if insertPos[TP] == deletePos[TP] {
      if len(pos1) > len(deletePos) {
         return nil, deletePos
      }
      else {
         insertPos, update(deletePos, TP, 1)
      }
}

// Updates the access path at the given index by the given amount
func update(pos []int, toChange int, change int) {
   pos[toChange] += change
}

// Determines the transform point of two access paths
func transformPoint(pos1 []int, pos2 []int) int {
   pos1len := len(pos1)
   pos2len := len(pos2)
   for i := 0; i < pos1len && i < pos2len; i++ {
		if pos1[i] != pos2[i] {
         return i
      }
	}
}

// Determines if the two access paths are independent
func effectIndependent(pos1 []int, pos2 []int, TP int) bool {
   pos1len := len(pos1)
   pos2len := len(pos2)
   // Translate pseudocode to code
   if pos1len > (TP + 1) && pos2len > (TP + 1) {
      return true
   }
   if pos1[TP] > pos2[TP] && pos1len < pos2len {
      return true
   }
   if pos1[TP] < pos2[TP] && pos1len > pos2len {
      return true
   }
   return false
}

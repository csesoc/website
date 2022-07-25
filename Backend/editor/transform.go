package editor

// functions for operational transform

// takes an operation and transforms it
// todo: state should not be a string
func transformPipeline(x op, state string) op {
	// Need to get pos1 pos2 from somewhere
   TP = transformPoint(pos1, pos2)
   if effectIndependent(pos1, pos2, TP) {
      return 
   }
   else if {
      // both are insert
      return transformInserts()
   }
   else if {
      return transformDeletes()
   }
   else {
      // Determine the insert operation and the delete operation
     return transformInsertDelete() 
   }

   return x
}

func transformInserts(pos1 []int, pos2 []int, TP int) {
    if pos1[TP] > pos2[TP] {
      return  
    }
}

func transformDeletes() {

}

func transformInsertDelete() {

}

func transformPoint(pos1 []int, pos2 []int) int {
   pos1len := len(pos1)
   pos2len := len(pos2)
   for i := 0; i < pos1len && i < pos2len; i++ {
		if pos1[i] != pos2[i] {
         return i
      }
	}
}

func effectIndependent(pos1 []int, pos2 []int, TP int) {
   // Mebe we create a struct to contain this shit so we don't call len again and again
   pos1len := len(pos1)
   pos2len := len(pos2)
   // Translate pseudocode to code
   if pos1len > (TP + )

}

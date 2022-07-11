package service

import "github.com/sergi/go-diff/diffmatchpatch"

// Defines some basic methods for synchronising with a document
// and maintaining an internal shadow
type ExtensionStub struct {
	serverShadow *string
	dmp          *diffmatchpatch.DiffMatchPatch
	baseText     string
	sendToDoc    func([]diffmatchpatch.Patch)
}

// Diff match patch implementation
func (stub ExtensionStub) Synchronise(patches []diffmatchpatch.Patch) {
	newText, _ := stub.dmp.PatchApply(patches, stub.baseText)
	newShadow, _ := stub.dmp.PatchApply(patches, *stub.serverShadow)

	stub.baseText = newText
	*stub.serverShadow = newShadow

	// compute the difference between the base text and the shadow
	// and propogate the diff to the document
	diff := stub.dmp.PatchMake(*stub.serverShadow, stub.baseText)
	*stub.serverShadow = stub.baseText

	stub.sendToDoc(diff)
}

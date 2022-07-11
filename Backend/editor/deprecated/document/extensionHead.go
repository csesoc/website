package document

import "github.com/sergi/go-diff/diffmatchpatch"

// Defines an exteion interface, all extensions must satisfy this set of required
// functions to be useable and considered an interface
type ExtensionHead interface {
	// Synchronisation mechanisms
	Synchronise([]diffmatchpatch.Patch)

	// LifeCycle operations
	// Just note that init is passed a method that it can use
	// to try and synchronise with the document
	// it is also given a method the extension head must call to signal
	// to the document that it wishes to die (how tragic)
	// the idea is that the ExtensionHead has no idea wat it is attached to
	// it only knows how to communicate with it
	Init(func([]diffmatchpatch.Patch), func(), *string)
	Destroy(*string) // destroy is given the current state of the document

	// Special functions regarding the service
	IsService() bool
	Spin()
	Stop()
}

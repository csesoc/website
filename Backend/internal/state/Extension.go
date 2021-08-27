package diffsync

// The idea behind extensions is we can extend the existing functionality
// of an edit session, to do this our functionality simply needs to implement
// the extension interface to be easilly supported by the document

type Extension interface {
	// Once an extension is created, this is called as the constructor of the extension
	Construct(*EditSession)

	GetEditSession() *EditSession
	StartExtension(string)
	StopExtension()
	GetExtensionName() string

	// Returns a string representation of all the edits
	// having a methods allows us to block until the method is completed
	ApplyPatch(string)
}

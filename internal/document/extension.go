package document

import (
	"github.com/google/uuid"
	"github.com/sergi/go-diff/diffmatchpatch"
)

// Extension is an actual extension that embeds a HeadlessExtension
// a few of the methods defined for extensions propogate to their underlying
// embedded interface
type Extension struct {
	ID              uuid.UUID
	attachedChannel chan syncPayload
	isSpinning      bool

	ExtensionHead
}

// allocates a new extension with the provided extension head
func NewExtensionWithHead(head ExtensionHead) *Extension {
	return &Extension{
		ID:              uuid.New(),
		attachedChannel: nil,
		ExtensionHead:   head,
	}
}

// Extension methods
func (ext *Extension) GetID() uuid.UUID {
	return ext.ID
}

func (ext *Extension) IsSpinning() bool {
	return ext.isSpinning
}

func (ext *Extension) Spin() {
	if ext.IsService() {
		ext.isSpinning = true
		// The function should ideally block
		ext.ExtensionHead.Spin()
	}
}

func (ext *Extension) IsService() bool {
	return ext.ExtensionHead.IsService()
}

func (ext *Extension) Stop() {
	ext.isSpinning = false
	ext.ExtensionHead.Stop()
}

func (ext *Extension) Init(commChannel chan syncPayload, documentState *string) {
	ext.attachedChannel = commChannel
	ext.ExtensionHead.Init(ext.PropogatePatches, documentState)
}

func (ext *Extension) Destroy(docState *string) {
	ext.ExtensionHead.Destroy(docState)
}

// PropogatePatches allows the extension to send information to the document
// that it is attached to
func (ext *Extension) PropogatePatches(patches []diffmatchpatch.Patch) {
	ext.attachedChannel <- syncPayload{
		patches:   patches,
		signature: ext.ID,
	}
}

// Defines an exteion interface, all extensions must satisfy this set of required
// functions to be useable and considered an interface
type ExtensionHead interface {
	// Synchronisation mechanisms
	Synchronise([]diffmatchpatch.Patch)

	// LifeCycle operations
	// Just note that init is passed a method that it can use
	// to try and synchronise with the document
	// the idea is that the ExtensionHead has no idea wat it is attached to
	// it only knows how to communicate with it
	Init(func([]diffmatchpatch.Patch), *string)
	Destroy(*string) // destroy is given the current state of the document

	// Special functions regarding the service
	IsService() bool
	Spin()
	Stop()
}

package document

import (
	"github.com/google/uuid"
	"github.com/sergi/go-diff/diffmatchpatch"
)

// Extension is an actual extension that embeds a HeadlessExtension
// a few of the methods defined for extensions propogate to their underlying
// embedded interface
type Extension struct {
	ID                       uuid.UUID
	attachedChannel          chan syncPayload
	attachedTerminateChannel chan terminatePayload

	isSpinning bool

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
		// The function should ideally run concurrently
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

func (ext *Extension) Init(commChannel chan syncPayload, terminateChannel chan terminatePayload, documentState *string) {
	ext.attachedChannel = commChannel
	ext.attachedTerminateChannel = terminateChannel
	ext.ExtensionHead.Init(ext.PropogatePatches, ext.Terminate, documentState)
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

// Terminate allows the extension to signal to the document
// that it is read to die and be cleaned up
func (ext *Extension) Terminate() {
	ext.attachedTerminateChannel <- terminatePayload{
		signature: ext.ID,
	}
}

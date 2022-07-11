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

	spinning bool

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
func (ext *Extension) getID() uuid.UUID {
	return ext.ID
}

func (ext *Extension) isSpinning() bool {
	return ext.spinning
}

func (ext *Extension) spin() {
	if ext.isService() {
		ext.spinning = true
		// The function should ideally run concurrently
		ext.ExtensionHead.Spin()
	}
}

func (ext *Extension) isService() bool {
	return ext.ExtensionHead.IsService()
}

func (ext *Extension) stop() {
	ext.spinning = false
	ext.ExtensionHead.Stop()
}

func (ext *Extension) init(commChannel chan syncPayload, terminateChannel chan terminatePayload, documentState *string) {
	ext.attachedChannel = commChannel
	ext.attachedTerminateChannel = terminateChannel
	ext.ExtensionHead.Init(ext.propogatePatches, ext.terminate, documentState)
}

func (ext *Extension) destroy(docState *string) {
	ext.ExtensionHead.Destroy(docState)
}

// propogatePatches allows the extension to send information to the document
// that it is attached to
func (ext *Extension) propogatePatches(patches []diffmatchpatch.Patch) {
	ext.attachedChannel <- syncPayload{
		patches:   patches,
		signature: ext.ID,
	}
}

// terminate allows the extension to signal to the document
// that it is read to die and be cleaned up
func (ext *Extension) terminate() {
	ext.attachedTerminateChannel <- terminatePayload{
		signature: ext.ID,
	}
}

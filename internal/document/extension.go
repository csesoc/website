package document

import (
	"github.com/google/uuid"
	"github.com/sergi/go-diff/diffmatchpatch"
)

// Defines an exteion interface, all extensions must satisfy this set of required
// functions to be useable and considered an interface
type Extension interface {
	GetName() string
	AttachToDoc(uuid.UUID) error
	GetTrackingDoc() uuid.UUID

	// Synchronisation mechanisms
	GetShadow() *string
	SetShadow(string)
	SyncShadowAgainst(*string)
	Synchronise([]diffmatchpatch.Patch)

	// LifeCycle operations
	Load(uuid.UUID)
	Unload(uuid.UUID)

	// Regular mechanisms
	Spin()
	Stop()
	IsSpinning() bool
}

// StrippedClient is a partial implementation of the Extension interface
// particularly the aspects that have to do with differential synchronisation
type StrippedClient struct {
	Name        string
	Shadow      string
	TrackingDoc uuid.UUID
}

// Partial implementation of extension interface :)
func (client StrippedClient) GetName() string {
	return client.Name
}

func (client StrippedClient) GetShadow() *string {
	return &client.Shadow
}

// General implementation of a sycnronisation operation
func (client StrippedClient) Synchronise([]diffmatchpatch.Patch) {
	// todo: do later
}

// TODO: implement
func (client StrippedClient) AttachToDoc(uuid.UUID) error {
	return nil
}

func (client StrippedClient) GetTrackingDoc() uuid.UUID {
	return client.TrackingDoc
}

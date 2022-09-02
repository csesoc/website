package repositories

//go:generate mockgen -source=models.go -destination=mocks/models_mock.go -package=mocks

import (
	"os"
	"time"

	"cms.csesoc.unsw.edu.au/database/contexts"
	"github.com/google/uuid"
)

// filesystem model (model stored within database)
type FilesystemEntry struct {
	EntityID    uuid.UUID
	LogicalName string

	IsDocument  bool
	IsPublished bool
	CreatedAt   time.Time

	OwnerUserId  int
	ParentFileID uuid.UUID
	ChildrenIDs  []uuid.UUID
}

// Repository interface that all valid filesystem repositories
// mocked/real should implement
type IFilesystemRepository interface {
	GetEntryWithID(ID uuid.UUID) (FilesystemEntry, error)
	GetRoot() (FilesystemEntry, error)
	GetEntryWithParentID(ID uuid.UUID) (FilesystemEntry, error)
	GetIDWithPath(path string) (uuid.UUID, error)

	CreateEntry(file FilesystemEntry) (FilesystemEntry, error)
	DeleteEntryWithID(ID uuid.UUID) error

	RenameEntity(ID uuid.UUID, name string) error

	GetContext() contexts.DatabaseContext
}

// Repository interface representing an underlying connection
// to a filesystem within a docker volume containing unpublished
// data
type IUnpublishedVolumeRepository interface {
	AddToVolume(filename string) (err error)
	CopyToVolume(src *os.File, filename string) (err error)
	GetFromVolume(filename string) (fp *os.File, err error)
	GetFromVolumeTruncated(filename string) (fp *os.File, err error)
	DeleteFromVolume(filename string) (err error)
}

// Repository interface representing a connection to
// the published data docker volume
type IPublishedVolumeRepository interface {
	IUnpublishedVolumeRepository
}

// Model for a user within the database
type Person struct {
	UID       int
	Email     string
	FirstName string
	// Hashed >:D
	Password string
	GroupID  int
}

// Note: only exists Email and Password
type IPersonRepository interface {
	PersonExists(Person) bool
	GetPersonWithDetails(Person) Person
}

// model of the groups table within the database
type Groups struct {
	UID        int
	Name       string
	Permission string
}

// repository interface for the groups table within the database
type IGroupsRepository interface {
	// Only requires Groups.Name
	GetGroupInfo(Groups) Groups
}

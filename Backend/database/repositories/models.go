package repositories

//go:generate mockgen -source=models.go -destination=mocks/models_mock.go -package=mocks

import (
	"os"
	"time"
)

// filesystem model (model stored within database)
type FilesystemEntry struct {
	EntityID    int
	LogicalName string

	IsDocument  bool
	IsPublished bool
	CreatedAt   time.Time

	OwnerUserId  int
	ParentFileID int
	ChildrenIDs  []int
}

// Repository interface that all valid filesystem repositories
// mocked/real should implement
type IFilesystemRepository interface {
	GetEntryWithID(ID int) (FilesystemEntry, error)
	GetRoot() (FilesystemEntry, error)
	GetEntryWithParentID(ID int) (FilesystemEntry, error)
	GetIDWithPath(path string) (int, error)

	CreateEntry(file FilesystemEntry) (FilesystemEntry, error)
	DeleteEntryWithID(ID int) error

	RenameEntity(ID int, name string) error
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

package repositories

import (
	"sync"

	"cms.csesoc.unsw.edu.au/database/contexts"
	"github.com/google/uuid"
)

// Start up a database connection with a provided context
// TODO: this is technical a global shared variable and should be treated as such, this should be wrapped in a mutex
// or eliminated of entirely :D
var contextLock = sync.Mutex{}
var context contexts.DatabaseContext = nil

// Open constructors available for everyone

// NewFilesystemRepo instantiates a new file system repository with the current embedded context
func NewFilesystemRepo(frontEndID uuid.UUID, logicalName string, URL string) (FilesystemRepository, error) {
	return NewFrontendRepo(frontEndID, logicalName, URL, embeddedContext{getContext()})
}

// NewGroupsRepo instantiates a new groups repository
func NewGroupsRepo() GroupsRepository {
	return groupsRepository{
		embeddedContext{getContext()},
	}
}

// NewFrontendsRepo instantiates a new frontends repository
func NewFrontendsRepo() FrontendsRepository {
	return frontendsRepository{
		embeddedContext{getContext()},
	}
}

// NewPersonRepo instantiates a new person repository
func NewPersonRepo(frontendId uuid.UUID) PersonRepository {
	return personRepository{
		frontendId,
		embeddedContext{getContext()},
	}
}

// NewDockerPublishedRepo instantiates a new published docker volume repository
func NewUnpublishedRepo() UnpublishedVolumeRepository {
	fs, err := newDockerUnpublishedFileSystemRepository()
	if err != nil {
		// We should always be able to acquire this repository, if we cant then something really bad has happened
		panic(err)
	}

	return fs
}

func NewPublishedRepo() PublishedVolumeRepository {
	fs, err := newDockerPublishedFileSystemRepository()
	if err != nil {
		// We should always be able to acquire this repository, if we cant then something really bad has happened
		panic(err)
	}

	return fs
}

func getContext() contexts.DatabaseContext {
	contextLock.Lock()
	defer contextLock.Unlock()

	if context == nil {
		context = contexts.GetDatabaseContext()
	}

	return context
}

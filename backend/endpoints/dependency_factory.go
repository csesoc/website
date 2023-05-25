package endpoints

//go:generate mockgen -source=dependency_factory.go -destination=mocks/dependency_factory_mock.go -package=mocks

import (
	repos "cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/internal/logger"
	"github.com/google/uuid"
)

type (
	// DependencyFactory is an interface type that handlers can use to retrieve
	// and fetch specific dependencies
	DependencyFactory interface {
		GetFilesystemRepo() (repos.FilesystemRepository, error)
		GetGroupsRepo() repos.GroupsRepository
		GetFrontendsRepo() repos.FrontendsRepository
		GetPersonsRepo() repos.PersonRepository

		GetUnpublishedVolumeRepo() repos.UnpublishedVolumeRepository
		GetPublishedVolumeRepo() repos.PublishedVolumeRepository

		GetLogger() *logger.Log
	}

	// DependencyProvider is a simple implementation of the dependency factory that supports the injection of "dynamic" dependencies
	DependencyProvider struct {
		Log         *logger.Log
		FrontEndID  uuid.UUID
		LogicalName string
		URL         string
	}
)

// GetFilesystemRepo is the constructor for FS repos
func (dp DependencyProvider) GetFilesystemRepo() (repos.FilesystemRepository, error) {
	return repos.NewFilesystemRepo(dp.FrontEndID, dp.LogicalName, dp.URL)
}

// GetGroupsRepo instantiates a new groups repository
func (dp DependencyProvider) GetGroupsRepo() repos.GroupsRepository {
	return repos.NewGroupsRepo()
}

// GetFrontendsRepo instantiates a new frontend repository
func (dp DependencyProvider) GetFrontendsRepo() repos.FrontendsRepository {
	return repos.NewFrontendsRepo()
}

// GetPersonsRepo instantiates a new person repository
func (dp DependencyProvider) GetPersonsRepo() repos.PersonRepository {
	return repos.NewPersonRepo(dp.FrontEndID)
}

// GetUnpublishedVolumeRepo instantiates a new instance of the unpublished volume repository
func (dp DependencyProvider) GetUnpublishedVolumeRepo() repos.UnpublishedVolumeRepository {
	return repos.NewUnpublishedRepo()
}

// PublishedVolumeRepo instantiates an instance of the published volume repository
func (dp DependencyProvider) GetPublishedVolumeRepo() repos.PublishedVolumeRepository {
	return repos.NewPublishedRepo()
}

func (dp DependencyProvider) GetLogger() *logger.Log {
	return dp.Log
}

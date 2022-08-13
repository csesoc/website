package endpoints

//go:generate mockgen -source=dependency_factory.go -destination=mocks/dependency_factory_mock.go -package=mocks

import (
	"cms.csesoc.unsw.edu.au/database/repositories"
	"cms.csesoc.unsw.edu.au/internal/logger"
)

// Dependency Types that the factory supports
type Dependency int

const (
	FileSystemRepository Dependency = iota
	GroupsRepository
	PersonRepository

	UnpublishedVolumeRepository
	PublishedVolumeRepository

	Log
)

// baseDependencyMappings contains all the mappings that are non-specific to the execution of a handler and are instead global
// an example of a non-baseDependencyMapping is a logger dependency (as each function maintains its own log)
var baseDependencyMappings = map[Dependency]func() interface{}{
	FileSystemRepository:        func() interface{} { return repositories.GetRepository(repositories.FILESYSTEM) },
	GroupsRepository:            func() interface{} { return repositories.GetRepository(repositories.GROUPS) },
	PersonRepository:            func() interface{} { return repositories.GetRepository(repositories.PERSON) },
	UnpublishedVolumeRepository: func() interface{} { return repositories.GetRepository(repositories.DOCKER_UNPUBLISHED_FILESYSTEM) },
	PublishedVolumeRepository:   func() interface{} { return repositories.GetRepository(repositories.DOCKER_PUBLISHED_FILESYSTEM) },
}

type (
	// DependencyFactory is an interface type that handlers can use to retrieve
	// and fetch specific dependencies
	DependencyFactory interface {
		GetDependency(depType Dependency) interface{}
	}

	// DependencyProvider is a simple implementation of the dependency factory that supports the injection of "dynamic" dependencies
	DependencyProvider struct {
		Log *logger.Log
	}
)

// GetDependency constructs a dependency given the required dependency type
func (dp DependencyProvider) GetDependency(depType Dependency) interface{} {
	// setup a dependency mapping by first taking the base dependencies and adding handler specific ones
	dependencies := baseDependencyMappings
	dependencies[Log] = func() interface{} { return dp.Log }

	return dependencies[depType]()
}

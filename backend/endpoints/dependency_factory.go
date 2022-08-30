package endpoints

//go:generate mockgen -source=dependency_factory.go -destination=mocks/dependency_factory_mock.go -package=mocks

import (
	"reflect"

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

// baseTypeDependencyMappings maps reflect.Types to the underlying dependency ID (mostly just used by the getDependency helper)
var baseTypeDependencyMappings = map[reflect.Type]Dependency{
	reflect.TypeOf((*repositories.IFilesystemRepository)(nil)): FileSystemRepository,
	reflect.TypeOf((*repositories.IGroupsRepository)(nil)):     GroupsRepository,
	reflect.TypeOf((*repositories.IPersonRepository)(nil)):     PersonRepository,

	reflect.TypeOf((*repositories.IPublishedVolumeRepository)(nil)):   PublishedVolumeRepository,
	reflect.TypeOf((*repositories.IUnpublishedVolumeRepository)(nil)): UnpublishedVolumeRepository,
}

type (
	// DependencyFactory is an interface type that handlers can use to retrieve
	// and fetch specific dependencies
	DependencyFactory interface {
		GetDependency(depType Dependency) interface{}
		// GetDepFromType converts a reflect.Type into a dependency ID
		GetDepFromType(reflect.Type) Dependency
	}

	// DependencyProvider is a simple implementation of the dependency factory that supports the injection of "dynamic" dependencies
	DependencyProvider struct {
		Log        *logger.Log
		FrontEndID int
	}
)

// GetDependency constructs a dependency given the required dependency type
func (dp DependencyProvider) GetDependency(depType Dependency) interface{} {
	// setup a dependency mapping by first taking the base dependencies and adding handler specific ones
	dependencies := baseDependencyMappings
	dependencies[Log] = func() interface{} { return dp.Log }
	dependencies[PersonRepository] = func() interface{} { return repositories.PersonRepository(dp.FrontEndID) }

	return dependencies[depType]()
}

func (dp DependencyProvider) GetDepFromType(t reflect.Type) Dependency {
	depTypeMappings := baseTypeDependencyMappings
	depTypeMappings[reflect.TypeOf((**logger.Log)(nil))] = Log

	return depTypeMappings[t]
}

// getDependency is a small little generic wrapper around the dependency factor to make fetching dependencies cleaner
func getDependency[T any](factory DependencyFactory) T {
	typeMapping := reflect.TypeOf((*T)(nil))

	return factory.GetDependency(factory.GetDepFromType(typeMapping)).(T)
}

func setFrontEndID(id int, df interface{}) {
	stype := reflect.ValueOf(df).Elem()
	stype.FieldByName("FrontEndID").SetInt(int64(id))
}

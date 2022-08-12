package repositories

import (
	"errors"
	"io"
	"os"
	"path/filepath"

	"github.com/docker/docker/client"
)

const publishedVolumePath = "/var/lib/documents/published/data"
const unpublishedVolumePath = "/var/lib/documents/unpublished/data"

type dockerFileSystemRepositoryCore struct {
	dockerCli  *client.Client
	volumePath string
}

type DockerUnpublishedFileSystemRepository struct {
	dockerFileSystemRepositoryCore
}

type DockerPublishedFileSystemRepository struct {
	dockerFileSystemRepositoryCore
}

// create new instances of the corresponding repository types
func NewDockerPublishedFileSystemRepository() (*DockerPublishedFileSystemRepository, error) {
	inner, err := newDockerFilesystemRespositoryCore(publishedVolumePath)
	if err != nil {
		return nil, err
	}

	return &DockerPublishedFileSystemRepository{
		*inner,
	}, nil
}

// create new instances of the corresponding repository types
func NewDockerUnpublishedFileSystemRepository() (*DockerUnpublishedFileSystemRepository, error) {
	inner, err := newDockerFilesystemRespositoryCore(unpublishedVolumePath)
	if err != nil {
		return nil, err
	}

	return &DockerUnpublishedFileSystemRepository{
		*inner,
	}, nil
}

// Create instance of DockerFileSystemRepository struct
func newDockerFilesystemRespositoryCore(volumePath string) (*dockerFileSystemRepositoryCore, error) {
	if dockerCli, err := client.NewClientWithOpts(client.FromEnv); err == nil {
		return &dockerFileSystemRepositoryCore{
			volumePath: volumePath,
			dockerCli:  dockerCli,
		}, nil
	} else {
		return nil, err
	}
}

// Add file to volume or update if exists
func (c *dockerFileSystemRepositoryCore) AddToVolume(filename string) error {
	// Check if source file is valid
	src, err := os.Open(filename)
	if err != nil {
		return errors.New("Couldn't open source file")
	}
	defer src.Close()
	// Create/update destination file and check it is valid
	filepath := filepath.Join(c.volumePath, filename)
	moved, err := os.OpenFile(filepath, os.O_RDWR|os.O_CREATE, 0755)
	if err != nil {
		return errors.New("Couldn't read/create the destination file")
	}
	defer moved.Close()
	// Copy source to destination
	_, err = io.Copy(moved, src)
	if err != nil {
		return errors.New("File couldn't be copied to destination")
	}
	// Delete source file
	err = os.Remove(filename)
	if err != nil {
		return errors.New("Couldn't remove the source file")
	}
	return nil
}

// Copy file to docker volume, creates file if it doesn't exist. Source file is not deleted.
func (c *dockerFileSystemRepositoryCore) CopyToVolume(src *os.File, filename string) error {
	defer src.Close()
	// Create/update destination file and check it is valid
	filepath := filepath.Join(c.volumePath, filename)
	copied, err := os.OpenFile(filepath, os.O_RDWR|os.O_CREATE, 0755)
	if err != nil {
		return errors.New("Couldn't read/create the destination file")
	}
	defer copied.Close()
	// Copy source to destination
	_, err = io.Copy(copied, src)
	if err != nil {
		return errors.New("File couldn't be copied to destination")
	}
	return nil
}

// Get file from volume. Returns a valid file pointer
func (c *dockerFileSystemRepositoryCore) GetFromVolume(filename string) (*os.File, error) {
	// Concatenate volume path with file name
	return os.OpenFile(filepath.Join(c.volumePath, filename), os.O_RDWR|os.O_CREATE, 0755)
}

// Get file from volume in truncated mode
func (c *dockerFileSystemRepositoryCore) GetFromVolumeTruncated(filename string) (*os.File, error) {
	// Concatenate volume path with file name
	return os.OpenFile(filepath.Join(c.volumePath, filename), os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0755)
}

// Delete file from volume
func (c *dockerFileSystemRepositoryCore) DeleteFromVolume(filename string) error {
	filepath := filepath.Join(c.volumePath, filename)
	file, err := os.Open(filepath)
	if err != nil {
		return errors.New("File doesn't exist")
	}
	file.Close()
	os.Remove(filepath)
	if err = os.Remove(filepath); err != nil {
		return errors.New("Couldn't remove the source file")
	}
	return nil
}

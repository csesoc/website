// defines the filesystem repository
package repositories

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	cx "context"

	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
)

// Implements IRepositoryInterface
type FilesystemRepository struct {
	embeddedContext
}

type DockerFileystemRepository struct {
	cli *client.Client
}

func NewDockerFilesystemRespository() (c *DockerFileystemRepository, err error) {
	c = new(DockerFileystemRepository)

	c.cli, err = client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (c *DockerFileystemRepository) SearchVolumes() (err error) {
	volumes, err := c.cli.VolumeList(cx.Background(), filters.NewArgs())

	if err != nil {
		return err
	}

	for _, v := range volumes.Volumes {
		fmt.Println(v.Mountpoint)
	}
	return nil
}

// Add file to volume or update if exists
func (c *DockerFileystemRepository) AddToVolume(source string, dest string) error {
	src, err := os.Open(source)
	if err != nil {
		return fmt.Errorf("Couldn't open source file")
	}
	moved, err := os.OpenFile(dest, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0755)
	defer moved.Close()
	if err != nil {
		return fmt.Errorf("Couldn't read/create the destination file")
	}
	_, err = io.Copy(moved, src)
	if err != nil {
		return fmt.Errorf("File couldn't be copied to destination")
	}
	src.Close()
	err = os.Remove(source)
	if err != nil {
		return fmt.Errorf("Couldn't remove the source file")
	}
	return nil
}

// Get file from volume
func (c *DockerFileystemRepository) GetFromVolume(fp string, dest string) (*os.File, error) {
	file, err := os.Open(filepath.Join(dest, fp))
	if err != nil {
		return nil, fmt.Errorf("File doesn't exist")
	}
	return file, nil
}

// Delete file from volume
func (c *DockerFileystemRepository) DeleteFromVolume(fp string, dest string) error {
	filepath := filepath.Join(dest, fp)
	file, err := os.Open(filepath)
	if err != nil {
		return fmt.Errorf("File doesn't exist")
	}
	file.Close()
	os.Remove(filepath)
	return nil
}

// We really should use an ORM jesus this is ugly
func (rep FilesystemRepository) query(query string, input ...interface{}) (FilesystemEntry, error) {
	entity := FilesystemEntry{}
	children := []int{}

	err := rep.ctx.Query(query,
		input,
		&entity.EntityID, &entity.LogicalName, &entity.IsDocument, &entity.IsPublished,
		&entity.CreatedAt, &entity.OwnerUserId, &entity.ParentFileID)
	if err != nil {
		return FilesystemEntry{}, err
	}

	rows, err := rep.ctx.QueryRow("SELECT EntityID FROM filesystem WHERE Parent = $1", []interface{}{entity.EntityID})
	if err != nil {
		return FilesystemEntry{}, err
	}
	// finally scan in the rows
	for rows.Next() {
		var x int
		err := rows.Scan(&x)
		if err != nil {
			return FilesystemEntry{}, err
		}

		children = append(children, x)
	}

	entity.ChildrenIDs = children
	return entity, nil
}

// Returns: entry struct containing the entity that was just created
func (rep FilesystemRepository) CreateEntry(file FilesystemEntry) (FilesystemEntry, error) {
	if file.ParentFileID == FILESYSTEM_ROOT_ID {
		// determine root ID
		root, err := rep.GetRoot()
		if err != nil {
			return FilesystemEntry{}, errors.New("failed to get root")
		}

		file.ParentFileID = root.EntityID
	}

	var newID int
	err := rep.ctx.Query("SELECT new_entity($1, $2, $3, $4)", []interface{}{file.ParentFileID, file.LogicalName, file.OwnerUserId, file.IsDocument}, &newID)
	if err != nil {
		return FilesystemEntry{}, err
	}
	return rep.GetEntryWithID(newID)
}

func (rep FilesystemRepository) GetEntryWithID(ID int) (FilesystemEntry, error) {
	if ID == FILESYSTEM_ROOT_ID {
		return rep.GetRoot()
	}

	result, err := rep.query("SELECT * FROM filesystem WHERE EntityID = $1", ID)
	return result, err
}

func (rep FilesystemRepository) GetRoot() (FilesystemEntry, error) {
	// Root is currently set to ID 1
	return rep.query("SELECT * FROM filesystem WHERE Parent = 1")
}

func (rep FilesystemRepository) GetEntryWithParentID(ID int) (FilesystemEntry, error) {
	return rep.query("SELECT * FROM filesystem WHERE Parent = $1", ID)
}

func (rep FilesystemRepository) GetIDWithPath(path string) (int, error) {
	// I could do this with one query, where I query the repository for all files in parentNames and process that here
	parentNames := strings.Split(path, "/")
	if parentNames[0] != "" {
		return -1, errors.New("path must start with /")
	}

	// Determine main parent
	parent, err := rep.query("SELECT * FROM filesystem WHERE LogicalName = $1", parentNames[1])
	if err != nil {
		return -1, err
	}
	// Loop through children
	for i := 2; i < len(parentNames); i++ {
		child, err := rep.query("SELECT * FROM filesystem WHERE LogicalName = $1 AND Parent = $2", parentNames[i], parent.EntityID)
		if err != nil {
			return -1, err
		}

		parent = child
	}

	return parent.EntityID, err
}

func (rep FilesystemRepository) DeleteEntryWithID(ID int) error {
	return rep.ctx.Exec("SELECT delete_entity($1)", []interface{}{ID})
}

func (rep FilesystemRepository) RenameEntity(ID int, name string) error {
	return rep.ctx.Exec("UPDATE filesystem SET logicalname = ($1) WHERE entityid = ($2)", []interface{}{name, ID})
}

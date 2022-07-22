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

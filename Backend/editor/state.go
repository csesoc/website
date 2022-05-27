package editor

type State struct {
	blocks map[string]Block
}

type Block struct {
	text              string
	inlineStyleRanges []styleRange
}

type styleRange struct {
	offset int
	length int
	style  string
}

func (s *State) addBlock(key string) {
	if _, found := s.blocks[key]; found {
		panic("Block already exists")
	}
	s.blocks[key] = Block{
		text:              "",
		inlineStyleRanges: make([]styleRange, 0),
	}
}

func (s *State) removeBlock(key string) {
	if _, found := s.blocks[key]; !found {
		panic("Block doesn't exist")
	}
}

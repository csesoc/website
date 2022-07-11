package environment

import (
	"flag"
	"testing"
)

func init() {
	testing.Init()
	flag.Parse()
}

// package to quickly grab information regarding the execution environment
func IsTestingEnvironment() bool {
	return flag.Lookup("test.v").Value.(flag.Getter).Get().(bool)
}

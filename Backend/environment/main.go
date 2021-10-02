package environment

import "flag"

// package to quickly grab information regarding the execution environment
func IsTestingEnvironment() bool {
	return flag.Lookup("test.v") != nil
}

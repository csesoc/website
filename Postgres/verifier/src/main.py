import sys
import yaml

from lookup import lookup

if __name__ == "__main__":
    config_file = open(sys.argv[1], "r")
    structure_file = open(sys.argv[2], "r")

    lookup(yaml.load(config_file), yaml.load(structure_file))

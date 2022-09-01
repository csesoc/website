import os
import sys
import yaml

import psycopg2

from config import parse_config
from lookup import lookup

config_filename = sys.argv[1]
structure_filename = sys.argv[2]

if __name__ == "__main__":
    with open(config_filename, "r") as config_file:
        config = parse_config(config_file)
    
    with open(structure_filename, "r") as structure_file:
        structure = yaml.safe_load(structure_file)

    lookup(config, structure, print_result=True)

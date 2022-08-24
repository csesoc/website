import os
import re
import yaml

def parse_config(yaml_file):
    loader = yaml.SafeLoader

    pattern = re.compile(r"(\$\{\w+\})")
    loader.add_constructor("!env", pattern)

    pass
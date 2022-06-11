import os
import pytest

from src.config import parse_config

def test_missing_variables():
    with open("./config/invalid_test.yml", "r") as invalid:
        with pytest.raises(KeyError):
            parse_config(invalid)

def test_invalid_env_variables():
    with open("./config/env_variable_test.yml", "r") as invalid:
        with pytest.raises(KeyError):
            parse_config(invalid)

        # We're forgetting an env variable
        os.environ["TEST_USERNAME"] = "foo"
        os.environ["TEST_PASSWORD"] = "bar"

        with pytest.raises(KeyError):
            parse_config(invalid)

        # Set an incorrect env variable
        os.environ["TEST_FOO"] = "invalid env variable"

        with pytest.raises(KeyError):
            parse_config(invalid)

def test_success():
    with open("./config/valid_test.yml", "r") as valid:
        username, password, db = parse_config(valid)

        assert username == "foo"
        assert password == "bar"
        assert db == "baz"

def test_success_env():
    with open("./config/env_variable_test.yml", "r") as valid:
        os.environ["TEST_USERNAME"] = "foo"
        os.environ["TEST_PASSWORD"] = "bar"
        os.environ["TEST_DATABASE"] = "baz"

        username, password, db = parse_config(valid)

        assert username == "foo"
        assert password == "bar"
        assert db == "baz"

# Format of `lookup`'s output:
# [
#   {
#     "name": string,
#     "columns": [
#       {
#         "name": string,
#         "correct": boolean
#       }
#     ]
#   }
# ]

import os
import psycopg2
import pytest
import yaml

from src.config import parse_config
from src.lookup import lookup

@pytest.fixture
def database():
    conn = psycopg2.connect(
        host="localhost",
        database="pytest",
        username=os.environ["PG_USER"],
        password=os.environ["PG_PASSWORD"]
    )

    return conn

def test_table_nonexistent():
    config = open("./config/lookup_config.yml", "r")
    structure = open("./structure/table_nonexistent.yml", "r")
    results = lookup(parse_config(config), yaml.parse(structure))

    assert len(results) == 1
    assert results[0]["name"] == "foo"
    assert results[0]["columns"] == None

def test_column_nonexistent(database):
    cursor = database.cursor()

    cursor.execute("CREATE TABLE foo (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL);")
    database.commit()

    cursor.close()

    config = open("./config/lookup_config.yml", "r")
    structure = open("./structure/column_nonexistent.yml", "r")
    results = lookup(parse_config(config), yaml.parse(structure))

    assert len(results) == 1
    assert results[0]["name"] == "foo"

    columns = results[0]["columns"]

    assert len(columns) == 3
    assert columns[2]["name"] == "burger"
    assert columns[2]["correct"] == None

    cursor = database.cursor()

    cursor.execute("DROP TABLE foo;")
    database.commit()

    database.close()

def test_success(database):
    pass

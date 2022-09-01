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

def clean_database(conn: psycopg2.connection):
    with conn.cursor() as cursor:
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")

        for (table_name,) in cursor.fetchall():
            cursor.execute(f"TRUNCATE {table_name} CASCADE")

        conn.commit()

def test_table_nonexistent():
    config = open("./config/lookup_config.yml", "r")
    structure = open("./structure/table_nonexistent.yml", "r")
    results = lookup(parse_config(config), yaml.parse(structure))

    assert len(results) == 1
    assert results[0]["name"] == "foo"
    assert results[0]["columns"] == None

def test_column_nonexistent(database: psycopg2.connection):
    with database.cursor() as cursor:
        cursor.execute("CREATE TABLE foo (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL);")
        database.commit()

    config = open("./config/lookup_config.yml", "r")
    structure = open("./structure/column_nonexistent.yml", "r")
    results = lookup(database, parse_config(config), yaml.parse(structure))

    assert len(results) == 1
    assert results[0]["name"] == "foo"

    columns = results[0]["columns"]

    assert len(columns) == 3
    assert columns[2]["name"] == "burger"
    assert columns[2]["correct"] == None

    clean_database(database)

def test_success(database: psycopg2.connection):
    with database.cursor() as cursor:
        pass

    clean_database(database)

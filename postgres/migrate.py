# Simple migration script to migrate the database in two phases
#   - Phase 1: involves completely destroying the current state of the database (down)
#   - Phase 2: involves recreating the entire database (up)

import os
import sys
import psycopg2
import glob

# get_db acquires a connection to the database
def get_db():
    connection = psycopg2.connect(
        host = os.environ["POSTGRES_HOST"],
        database = os.environ["POSTGRES_DB"],
        user = os.environ["POSTGRES_USER"],
        password = os.environ["POSTGRES_PASSWORD"]
    )

    connection.autocommit = False
    return connection


# UpgradeJob represents a single attempt to upgrade the DB, it does everything within a transaction
class UpgradeJob:
    def __init__(self):
        self.connection = get_db()
        self.cursor = self.connection.cursor()

    def run_script(self, script: str):
        self.cursor.execute(script)

    def cancel_job(self):
        self.cursor.close()
        self.connection.rollback()

    def finish_job(self):
        self.cursor.execute("update migrations SET VersionID = VersionID + 1 WHERE MigrationID = 1;")
        self.connection.commit()
        self.cursor.close()


# Completely destroy the current state of the DB
def down(job: UpgradeJob):
    down_script = open("down.sql", "r").read()
    job.run_script(down_script)


# Recreate the database from the defined schema files
def up(job: UpgradeJob):
    up_jobs = [x for x in glob.glob('*.sql') if x != "down.sql"]
    up_jobs.sort()
    for script in up_jobs: job.run_script(open(script, "r").read())


# requires_update determines if the current database requires an update, it does so by querying an update table and comparing the result
# with the contents of the dbver.txt file
def get_db_versions():
    db = get_db()

    git_version_file = open("dbver.txt", "r")
    git_version = int(git_version_file.readlines()[0])
    container_version = 0

    # acquire the db version
    cursor = db.cursor()
    try:
        cursor.execute("select VersionID from migrations where MigrationID = 0;")
        migration_records = cursor.fetchall()
        container_version = 0 if len(migration_records) == 0 else migration_records[0]
    except: pass
    finally:
        cursor.close()        

    return (container_version, git_version)


if __name__ == '__main__':
    container_version, git_version = get_db_versions()

    if git_version <= container_version:
        print("Container DB is up to date, skipping upgrade :)")
        sys.exit()

    # run the upgrade now :D
    upgradeJob = UpgradeJob()
    try:
        down(upgradeJob)
        up(upgradeJob)
    except Exception as e:
        print(f"""
            Failed to upgrade the database from version {container_version} to {git_version}, check logs for additional information.
            Database is currently on version {container_version}.""")
        upgradeJob.cancel_job()
        raise e
        
    upgradeJob.finish_job()
    print(f"Successfully updated DB from version {container_version} to {git_version}.")
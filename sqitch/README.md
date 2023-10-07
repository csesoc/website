# Sqitch
Sqitch is an open source database change management tool, basically like git but specifically for databases.

First, Make sure will ran `make dev-build`, so that the sqitch container is running.
Then cd into the `sqitch` folder.
As a sanity check, type `./sqitch help` into the command line and check that the following pops up:
```
Usage
      sqitch [--etc-path | --help | --man | --version]
      sqitch <command> [--chdir <path>] [--no-pager] [--quiet] [--verbose]
             [<command-options>] [<args>]

Common Commands
    The most commonly used sqitch commands are:

      add        Add a new change to the plan
      bundle     Bundle a Sqitch project for distribution
      checkout   Revert, checkout another VCS branch, and re-deploy changes
      config     Get and set local, user, or system options
      deploy     Deploy changes to a database
      engine     Manage database engine configuration
      help       Display help information about Sqitch commands
      init       Initialize a project
      log        Show change logs for a database
      plan       Show the contents of a plan
      rebase     Revert and redeploy database changes
      revert     Revert changes from a database
      rework     Duplicate a change in the plan and revise its scripts
      show       Show information about changes and tags, or change script contents
      status     Show the current deployment status of a database
      tag        Add or list tags in the plan
      target     Manage target database configuration
      upgrade    Upgrade the registry to the current version
      verify     Verify changes to a database

    See "sqitch help <command>" or "sqitch help <concept>" to read about a
    specific command or concept. See "sqitch help --guide" for a list of
    conceptual guides.
```

## User config
Much like git, it will be great if we can tell who made a certain change to the database.
To do that, simply run the following commands.
`sqitch config --user user.name '<name>'`
`sqitch config --user user.email '<email>'`

## Adding a new SQL script to the database
To add a new change to the database (Like a new SQl script, table or function), first run
`./sqitch add appschema -n "<message>"`

You will see the following changes:
1. New SQL files will be made in the `/deploy`, `/revert` and `/verify` folders.
2. The `sqitch.plan` file will be appended with your new change and message.

The `/deploy` folder contains all the SQL scripts that will be ran when we deploy the database.
The `/revert` folder contains all the SQL scripts that will be ran when we need to revert the database to some previous state. (Usually just contains a bunch of DROP TABLE expressions)
The `/verify` folder contains all the SQL scripts to verify that a deploy did what it's supposed to.

## Deploying changes
To deploy changes you made to the database simply type in:
`./sqitch deploy test`

This will cause sqitch to run all the SQl scripts inside your `/deploy` folder in the order they are created.

## Revert changes
To revert changes you made to a database, type
`./sqitch revert test --to @HEAD^`

The `@HEAD` always points to *the last change deployed to the database*
The `^` appended tells Sqitch to select the change prior to the last deployed change.
You can add more `^` to go back further.
You can also use `@ROOT` which refers to the first change deployed to the database.

## Verify changes
(Use this if you actually fill out the scripts inside of the `/verify` folder)

Run `./sqitch verify test` to run verification checks.

## Sqitch.conf
This file contains all the settings that sqitch will follow, you don't need to touch anything here.
The only thing of note is the 
```
[target "test"]
	uri = db:pg://postgres:postgres@localhost:5432/test_db
```

This tells sqitch that `test` refers to the a specific database uri (Which is the current one we are using)
So you don't have to type the actual uri itself if you want to use sqitch, you just type `test` instead.

## The .bat and .sh files
Don't remove them or touch them.
The sqitch docker container need them in order for you to interact with sqitch from the command line.

## References
Refer to the official Sqitch page for more detailed documentation.
https://sqitch.org/
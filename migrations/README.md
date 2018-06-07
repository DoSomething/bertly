# Bertly's Schema

Bertly stores links in a Redis key-value store, but we maintain a PostgreSQL database for click tracking.

## Migrations
Migrations are handled with [Alembic](http://alembic.zzzcomputing.com/en/latest/).

You can **run any outstanding migrations** to set up your database:

```sh
$ FLASK_APP=bertly.py flask db upgrade head
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 37ba37319784, Create 'clicks' table
INFO  [alembic.runtime.migration] Running upgrade 37ba37319784 -> 42a810a76302, Add shortened index.
```

To make a schema change, **generate a migration** with Alembic:

```sh
$ FLASK_APP=bertly.py flask db revision -m "Add a column"
Generating /bertly/migrations/versions/880842b95b06_add_a_column.py ... done
```

If you want to poke around the database visually, [Postico](https://eggerapps.at/postico/) is a fantastic tool for macOS.

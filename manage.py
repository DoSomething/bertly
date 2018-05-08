# -*- coding: utf-8 -*-
"""
    migrations.py
    ~~~~~~~~~~~~~~

    Migrations via SQLAlchemy.

    :license: MIT, see LICENSE for details
"""

from bertly import app, db
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

manager = Manager(app)
migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()

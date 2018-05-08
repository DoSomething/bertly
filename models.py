# -*- coding: utf-8 -*-
"""
    models.py
    ~~~~~~~~~~~~~~

    Model definition for recording clicks via SQLAlchemy.

    :license: MIT, see LICENSE for details
"""

import os

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Click tracking table
click_table = os.environ.get('CLICK_TABLE')


class Click(db.Model):
    """Click tracker"""
    __tablename__ = click_table

    click_id = db.Column(db.String(128), primary_key=True)
    click_time = db.Column(db.DateTime)
    shortened = db.Column(db.String(32))
    target_url = db.Column(db.String(255))

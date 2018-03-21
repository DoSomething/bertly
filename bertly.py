# -*- coding: utf-8 -*-
"""
    package.module
    ~~~~~~~~~~~~~~

    A URL shortener service, mostly from
    Mostly from https://pythonhosted.org/shorten/user/examples.html

    Serverless deployment template from
    https://github.com/alexdebrie/serverless-flask

    Setup details: see INSTALL.md

    :license: MIT, see LICENSE for details
"""

import redis
import os
from flask import Flask, request, redirect, url_for
from flask import jsonify as _jsonify
from shorten import RedisStore, NamespacedFormatter, UUIDTokenGenerator
from shorten import alphabets
from shorten import RevokeError
from rfc3987 import parse
from werkzeug import iri_to_uri
from urlparse import urlparse

app = Flask(__name__)

## COMPOSE_REDIS_URL: A complete access URL for a Redis instance
compose_redis_url = os.environ.get('COMPOSE_REDIS_URL')
if not compose_redis_url:
    app.logger.error("No Redis URL")

ssl_wanted=compose_redis_url.startswith("rediss:")
parsed = urlparse(compose_redis_url)
ssl_wanted=compose_redis_url.startswith("rediss:")
redis_client = redis.StrictRedis(
    host=parsed.hostname,
    port=parsed.port,
    password=parsed.password,
    ssl=ssl_wanted,
    decode_responses=True)

formatter = NamespacedFormatter('shorten')
token_gen = UUIDTokenGenerator()

def jsonify(obj, status_code=200):
    obj['status'] = 'error' if 'error' in obj else 'okay'
    res = _jsonify(obj)
    res.status_code = status_code
    return res

def valid_url(url):
    return bool(parse(url, rule='URI_reference'))

###########################################################

# The Redis store persists original URL, shortened key, and revocation token.
store = RedisStore(redis_client=redis_client,
    min_length=3,
    counter_key='shorten:counter_key',
    formatter=formatter,
    token_gen=token_gen,
    alphabet=alphabets.URLSAFE_DISSIMILAR)

@app.route('/', methods=['POST'])
def shorten():
    """POST handler to shorten a URL"""
    url = request.form['url'].strip()

    if not valid_url(url):
        return jsonify({'error': str(e)}, 400)

    key, token = store.insert(url)

    url = url_for('bounce', key=key, _external=True)
    revoke = url_for('revoke', token=token, _external=True)

    return jsonify({'url': url, 'revoke': revoke})

@app.route('/<key>', methods=['GET'])
def bounce(key):
    """GET handler to redirect a shortened key"""
    try:
        url = store[key]
        return redirect(iri_to_uri(url))
    except KeyError as e:
        return jsonify({'error': 'url not found'}, 400)

@app.route('/revoke/<token>', methods=['POST'])
def revoke(token):
    """POST handler to revoke a shortened link by token"""
    try:
        store.revoke(token)
    except RevokeError as e:
        return jsonify({'error': e}, 400)

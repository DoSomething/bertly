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

import os
import redis

from flask import Flask, request, redirect, url_for, abort
from flask import jsonify as _jsonify
from functools import wraps
from rfc3987 import parse
from shorten import RedisStore, NamespacedFormatter, UUIDTokenGenerator
from shorten import alphabets
from shorten import RevokeError
from urlparse import urlparse
from werkzeug import iri_to_uri

app = Flask(__name__)

# COMPOSE_REDIS_URL: A complete access URL for a Redis instance
compose_redis_url = os.environ.get('COMPOSE_REDIS_URL')
if not compose_redis_url:
    app.logger.error("No Redis URL")

# Establish Redis connection as redis_client
ssl_wanted = compose_redis_url.startswith("rediss:")
parsed = urlparse(compose_redis_url)
ssl_wanted = compose_redis_url.startswith("rediss:")
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


def require_api_key(view_function):
    """Decorator to require API key in header, passed as api_key_label"""
    @wraps(view_function)
    def decorated_function(*args, **kwargs):

        api_key_label = os.environ.get('BERTLY_API_KEY_NAME')
        api_key = os.environ.get('BERTLY_API_KEY')

        if not api_key_label:
            app.logger.error("No name for API key: Should be defined in "
                             + "environment as BERTLY_API_KEY_NAME")
            abort(401)
        if request.headers.get(api_key_label) and \
                request.headers.get(api_key_label) == api_key:
            return view_function(*args, **kwargs)
        else:
            received_api_key = request.headers.get(api_key_label) or "[None]"
            app.logger.warning("Incorrect API key header: " + api_key_label
                               + ' = ' + received_api_key)
            abort(401)
    return decorated_function

###########################################################


# The Redis store persists original URL, shortened key, and revocation token.
store = RedisStore(redis_client=redis_client,
                   min_length=3,
                   counter_key='shorten:counter_key',
                   formatter=formatter,
                   token_gen=token_gen,
                   alphabet=alphabets.URLSAFE_DISSIMILAR)


@app.route('/', methods=['POST'])
@require_api_key
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
@require_api_key
def revoke(token):
    """POST handler to revoke a shortened link by token"""
    try:
        store.revoke(token)
        return jsonify({'success': 'hey nice job'}, 200)
    except RevokeError as e:
        return jsonify({'error': e}, 400)

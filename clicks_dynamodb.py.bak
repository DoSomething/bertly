# -*- coding: utf-8 -*-
"""
    clicks_dynamodb.py
    ~~~~~~~~~~~~~~

    Use this config & logic to record clicks to DynamoDB instead of
    PostgresQL.

    :license: MIT, see LICENSE for details
"""

# Click tracking table
click_table = os.environ.get('CLICK_TABLE')

# DynamoDB click tracking config
if is_offline:
    dynamo_client = boto3.client(
        'dynamodb',
        region_name='localhost',
        endpoint_url='http://localhost:8000'
    )
else:
    dynamo_client = boto3.client('dynamodb')


# ROUTE: GET /<key>
@app.route('/<key>', methods=['GET'])
def bounce(key):
    """GET handler to redirect a shortened key"""
    try:
        url = store[key]

    except KeyError as e:
        return jsonify({'error': 'url not found'}, 400)

    try:
        # Record click event, by writing to a DynamoDB table.
        click_time = str(time.time())
        click_key = click_time + "_" + key

        app.logger.debug("table = " + click_table)
        app.logger.debug("key = " + click_key)

        resp = dynamo_client.put_item(
            TableName=click_table,
            Item={
                'click_key': {'S': str(click_time) + key},  # unique ID
                'click_timestamp': {'S': click_time},  # Timestamp / Unix epoch
                'url': {'S': key},  # Shortened URL
                'target': {'S': url}  # Original URL
            }
        )
    except Exception as e:
        app.logger.error("Can't write to DynamoDB")
        app.logger.error(e)
        app.logger.error(resp)

    # Process redirect even if we fail to record the click.
    return redirect(iri_to_uri(url))

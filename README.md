# Bertly: URL shortener service in Flask

Bertly provides three endpoints:

## Authentication

When deployed, Bertly expects a header to be defined for passing an API key. The key is required for the `create` and `revoke` methods, not for the actual redirect request.

More details in `INSTALL.md`. For the examples below, assume that the header name is `X-BERTLY-API-KEY`, and the value is `testing`.

## Create redirect

`POST /<key>`

Given a URL, return a JSON object containing the shortened URL, and a token to use when revoking the shortened URL.

Example request, ignoring authentication for now:

`curl -X POST --header "X-BERTLY-API-KEY: testing" -d "url=http://thepretenders.com/" https://bertlydeployed.com`

HINT: Make sure to URL-encode arguments: `?x=test&y=this_thing&z=the-other-thing` should get passed as `%3Fx%3Dtest%26y%3Dthis_thing%26z%3Dthe-other-thing`.

Example response:

```
{
  "revoke": "https://bertlydeployed.com/revoke/491dcfe3-7715-479c-a32b-bad375992e20",
  "status": "okay",
  "url": "https://bertlydeployed.com/32s"
}
```

## Execute redirect

`GET /<key>`

## Revoke redirect

`POST /revoke/<token>`

Example request:

`curl -X POST --header "X-BERTLY-API-KEY: testing" https://bertlydeployed.com/revoke/491dcfe3-7715-479c-a32b-bad375992e20`

Response:

```
{
  "status": "okay",
  "success": "hey nice job"
}
```

## Configuration

See `INSTALL.md` for gory details.

## Thanks to

- [Serverless framework](https://github.com/serverless/serverless), holy crap
- [Shorten example](https://pythonhosted.org/shorten/user/examples.html)
- [Flask-Serverless deployment template](https://github.com/alexdebrie/serverless-flask)

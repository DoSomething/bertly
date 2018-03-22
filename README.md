# Bertly: URL shortener service in Flask

Bertly provides three endpoints:

## Create redirect

`POST /<key>`

Given a URL, return a JSON object containing the shortened URL, and a token to use when revoking the shortened URL.

Example request:

`curl -X POST -d "url=http://thepretenders.com/" https://bertlydeployed.com`

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

`curl -X POST https://bertlydeployed.com/revoke/491dcfe3-7715-479c-a32b-bad375992e20`

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


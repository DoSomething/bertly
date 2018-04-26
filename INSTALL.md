# Bertly: Setup notes

## Serverless deployment templates

A Flask deployment template: https://github.com/alexdebrie/serverless-flask

You can just check out the [Bertly repo](https://github.com/DoSomething/bertly), but I used this template to create the new Servlerless directory:

`serverless install --url https://github.com/alexdebrie/serverless-flask --name bertly`

This will set up Docker to manage Python dependencies locally. Explanation: https://serverless.com/blog/serverless-python-packaging/

In practice, I disabled Docker (`dockerizePip: false` in `serverless.yml`) because pip cache was throwing a permissions error, and because none of the required libraries have complicated build procedures.

## Env vars

| Env var               | Description                                                                                         |
|-----------------------|-----------------------------------------------------------------------------------------------------|
| `COMPOSE_REDIS_URL`   | Full Redis connection URL, of the form `redis://user:password@redisurl.com:123`                     |
| `BERTLY_API_KEY_NAME` | Name of the header used to pass the API key. The key is required for the create and revoke methods. |
| `BERTLY_API_KEY`      | The API key value.                                                                                  |

In theory, we should be able to use the [AWS SSM Parameter Store](https://hackernoon.com/you-should-use-ssm-parameter-store-over-lambda-env-variables-5197fc6ea45b) service, which provides access across applications within AWS. In practice, the Heroku-style, [per-app environment variable setting](https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html) is adequate here. We're not planning to reuse this app's Redis store elsewhere.

For Parameter Store, the env var should get injected into the application via `serverless.yml`:

```
environment:
  COMPOSE_REDIS_URL: '${ssm:bertly-redis-url}'
```

For Lambda env vars, just set the values on the deployed Lambda Function's configuration screen: https://cl.ly/081F0V0G3z2p

## Deploying

When setting up my Serverless environment, I created a `serverless` user in IAM, and authenticated to that as a separate AWS profile locally. So, if I invoke `aws` locally, I use

```
aws --profile serverless ...
```

Similarly, to deploy via `serverless`:

```
sls --profile serverless --region us-east-1 deploy
```

Or, you can set profile and region in your local env vars, e.g.,

```
export AWS_PROFILE="serverless" && export AWS_REGION=us-east-1
```

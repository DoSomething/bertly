# Bertly [![code style](https://img.shields.io/badge/style-flake8-blue.svg)](http://flake8.pycqa.org/en/latest/)

This is **Bertly**, a serverless link shortener. We use it to create shareable URLs, like this: [`dosome.click/wq544`](https://dosome.click/wq544). Bertly is built using [Serverless Framework](https://serverless.com), [Flask](http://flask.pocoo.org), and [`short_url`](https://pypi.org/project/short_url/). It runs on [AWS Lambda](https://aws.amazon.com/lambda/). We don't know where the name came from, but it sounds a bit familiar...

## Getting Started

Check out the [API Documentation](https://github.com/DoSomething/bertly/blob/master/documentation/README.md) to start using
Bertly! :link:

## Contributing

Install [Node](https://nodejs.org/en/), [Python](https://www.python.org), and [VirtualEnv](https://virtualenv.pypa.io/en/stable/). You'll also need a local [Redis](https://redis.io) and [PostgreSQL](https://www.postgresql.org) database.

```sh
# Create virtual environment:
virtualenv venv
source venv/bin/activate

# Install dependencies:
$ npm i && pip install -r requirements.txt

# Copy environment variables & edit w/ your machine's details:
$ cp .env.example .env && vi .env

# Run database migrations to set up your PostgreSQL database:
$ FLASK_APP=bertly.py flask db upgrade head

# And finally, start your local dev server!
$ npm start
```

We automatically lint all pull requests with [Stickler CI](https://stickler-ci.com).

## Deployments

We deploy Bertly using [Serverless Framework](https://serverless.com) in [AWS](https://aws.amazon.com/), under separate development and production organizations.

Before you start, make sure you've followed the "contributing" directions above & manually tested your code. Then, install [Docker](https://www.docker.com/docker-mac) and the [AWS CLI](https://aws.amazon.com/cli/), and configure it with our "dev" and "production" IAM roles (found in Lastpass):

```sh
$ aws configure --profile serverless-dev
AWS Access Key ID [None]: **************
AWS Secret Access Key [None]: **************
Default region name [None]: us-east-1
Default output format [None]: text

$ aws configure --profile serverless-production
AWS Access Key ID [None]: **************
AWS Secret Access Key [None]: **************
Default region name [None]: us-east-1
Default output format [None]: text
```

Then, run either `npm run deploy:dev`, `npm run deploy:qa`, or `npm run deploy:prod` to deploy! (For more power, you can also install the [Serverless CLI](https://serverless.com/framework/docs/getting-started/) globally on your machine and run commands with `serverless` or `sls`).

Migrations can be run by invoking the corresponding "migrate" Lambda function. For example:

```sh
# to run migrations on dev stage:
$ aws lambda invoke --function-name bertly-dev-migrate --profile serverless-dev /dev/null

# to run migrations on qa stage:
$ aws lambda invoke --function-name bertly-qa-migrate --profile serverless-dev /dev/null

# to run migrations on production stage:
$ aws lambda invoke --function-name bertly-prod-migrate --profile serverless-production /dev/null
```

## Security Vulnerabilities

We take security very seriously. Any vulnerabilities in Bertly should be reported to [security@dosomething.org](mailto:security@dosomething.org),
and will be promptly addressed. Thank you for taking the time to responsibly disclose any issues you find.

## License

&copy; DoSomething.org. Bertly is free software, and may be redistributed under the terms specified
in the [LICENSE](https://github.com/DoSomething/bertly/blob/master/LICENSE) file. The name and logo for
DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.

# Bertly [![code style](https://img.shields.io/badge/style-flake8-blue.svg)](http://flake8.pycqa.org/en/latest/)

This is **Bertly**, the DoSomething.org link shortener. We use it to create shareable URLs, like this: [`dosome.click/wq544`](https://dosome.click/wq544). Bertly is built using [Flask](http://flask.pocoo.org), [Serverless Framework](https://serverless.com), and [`short_url`](https://pypi.org/project/short_url/). It's hosted on [AWS Lambda](https://aws.amazon.com/lambda/). We don't know where the name came from, but it sounds a bit familiar...

### Getting Started

Check out the [API Documentation](https://github.com/DoSomething/bertly/blob/docs/documentation/README.md) to start using
Bertly! :link:

### Contributing

Install [Node](https://nodejs.org/en/), [Python](https://www.python.org), [VirtualEnv](https://virtualenv.pypa.io/en/stable/), and the [AWS CLI](https://aws.amazon.com/cli/). You'll also need a local [Redis](https://redis.io) and [PostgreSQL](https://www.postgresql.org) database.

```sh
# Create virtual environment:
virtualenv venv
source venv/bin/activate

# Install dependencies:
$ npm i && pip install -r requirements.txt

# Copy environment variables & edit w/ your machine's details:
$ cp .env.example .env && vi .env

# And finally, start your local dev server!
$ npm start
```

We automatically lint all pull requests with [Stickler CI](https://stickler-ci.com).

### Security Vulnerabilities

We take security very seriously. Any vulnerabilities in Bertly should be reported to [security@dosomething.org](mailto:security@dosomething.org),
and will be promptly addressed. Thank you for taking the time to responsibly disclose any issues you find.

### License

&copy; DoSomething.org. Bertly is free software, and may be redistributed under the terms specified
in the [LICENSE](https://github.com/DoSomething/bertly/blob/master/LICENSE) file. The name and logo for
DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.

# Bertly [![code style](https://img.shields.io/badge/style-flake8-blue.svg)](http://flake8.pycqa.org/en/latest/)

This is **Bertly**, a serverless link shortener. We use it to create shareable URLs, like this: [`dosome.click/wq544`](https://dosome.click/wq544). Bertly is built using [Express](https://expressjs.com/), [Dynamoose](https://dynamoosejs.com), and [hashids](https://hashids.org/). It runs on [AWS Lambda](https://aws.amazon.com/lambda/). We don't know where the name came from, but it sounds a bit familiar...

## Getting Started

Check out the [API Documentation](https://github.com/DoSomething/bertly/blob/master/documentation/README.md) to start using
Bertly! :link:

## Contributing

Install [Node 12.x](https://nodejs.org/en/) and clone this repository. Then, follow the setup instructions:

```sh
# Install dependencies:
$ npm install

# Copy environment variables & edit w/ your machine's details:
$ cp .env.example .env && vi .env

# And finally, start your local dev server!
$ npm run dev
```

## Testing

You can run functional and unit tests locally using [Jest](https://jestjs.io/):

```sh
npm test
```

Please write a test case when adding or changing a feature. Most steps you would take when manually testing your code can be automated, which makes it easier for yourself & others to review your code and ensures we don't accidentally break something later on!

## Deployments

We deploy Bertly using [CircleCI](https://app.circleci.com/pipelines/github/DoSomething/bertly?branch=master).

Anything that's merged to `master` is automatically deployed to `dev.dosome.click` and `qa.dosome.click`.

You can approve a build to be deployed to production by clicking the purple "on hold" step.

**Note:** Database migrations are [currently bugged](https://github.com/DoSomething/bertly/blob/abdaf05fecafedb0cdc3cb684e4b95ee90fa84c8/config/database.js#L21-L23), so you'll need to add or change fields manually.

## Security Vulnerabilities

We take security very seriously. Any vulnerabilities in Bertly should be reported to [security@dosomething.org](mailto:security@dosomething.org),
and will be promptly addressed. Thank you for taking the time to responsibly disclose any issues you find.

## License

&copy; DoSomething.org. Bertly is free software, and may be redistributed under the terms specified
in the [LICENSE](https://github.com/DoSomething/bertly/blob/master/LICENSE) file. The name and logo for
DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.

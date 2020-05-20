import localDynamo from 'local-dynamo';

// Boot local in-memory DynamoDB server for tests. This is a little
// slow so we only do this *once* before all tests, and then clear
// records between each test case with the `dropTable` helper.
export default () => {
  // If we're running tests on CircleCI, we use their DynamoDB docker
  // image, and do not need to start our own in-memory process here.
  if (process.env.CI) {
    return;
  }

  localDynamo.launch(null, 45671);
};

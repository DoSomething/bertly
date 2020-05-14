import express from 'express';
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';

import auth from './Middleware/auth';
import notFound from './Middleware/notFound';
import createLink from './Functions/createLink';
import destroyLink from './Functions/destroyLink';
import errorHandler from './Middleware/errorHandler';

const app = express();

// We'll happily parse either JSON or URL-encoded bodies:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes:
app.post('/', [auth], asyncHandler(createLink));
app.delete('/:link', [auth], asyncHandler(destroyLink));

// Attach terminal "not found" & error handler
// middleware for when things go awry:
app.use(notFound);
app.use(errorHandler);

export default app;

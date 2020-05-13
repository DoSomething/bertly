import express from 'express';
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';

import notFound from './Middleware/notFound';
import errorHandler from './Middleware/errorHandler';

const app = express();

// We'll happily parse either JSON or URL-encoded bodies:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes:
// ...

// Attach terminal "not found" & error handler
// middleware for when things go awry:
app.use(notFound);
app.use(errorHandler);

export default app;

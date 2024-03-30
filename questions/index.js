// Imports (express syntax)
const express = require('express');
const cors = require('cors');
// Routes:
const questionRoutes = require('./routes/question-routes-api.js');

// App definition and
const app = express();
const port = 8010;

// Middlewares added to the application
app.use(cors());
app.use(express.json());

// Routes middlewares to be used
app.use('/questions', questionRoutes);

// Start the service
const server = app.listen(port, () => {
  console.log(`Question Service listening at http://localhost:${port}`);
});

module.exports = server
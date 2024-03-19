// Imports (express syntax)
const express = require('express');


// Routes:
const authRoutes = require('./routes/auth-routes.js');
const userRoutes = require('./routes/user-routes.js');
const groupRoutes = require('./routes/group-routes.js');
const staticsRoutes = require('./routes/statics-routes.js');

// App definition and
const app = express();
const port = 8001;

// Middlewares added to the application
app.use(express.json());

// Routes middlewares to be used
app.use('/user', userRoutes);
app.use('/login', authRoutes);
app.use('/group', groupRoutes);
app.use('/statics', staticsRoutes);

// Start the service
const server = app.listen(port, () => {
    console.log(`User Service listening at http://localhost:${port}`);
});

module.exports = server;
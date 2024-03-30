// Imports (express syntax)
const express = require('express');


// Routes:
const authRoutes = require('./routes/auth-routes.js');
const userRoutes = require('./routes/user-routes.js');

// App and users port definition 
const app = express();
const port = 8001;
let expressSession = require('express-session');

// Middlewares added to the application
app.use(express.json());

app.use(expressSession({
 secret: 'abcdefg', //put in environment vars or secrets
 resave: true,
 saveUninitialized: true
}));

// Routes middlewares to be used
app.use('/user', userRoutes);
app.use('/login', authRoutes);



// Start the service
const server = app.listen(port, () => {
    console.log(`User Service listening at http://localhost:${port}`);
});

module.exports = server;
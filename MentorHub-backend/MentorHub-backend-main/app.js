const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

// Initialize an Express app
const app = express();
require("./config/db");

// Import routes and configuration files
const routes = require("./routes/v1");
const config = require("./config");
const { notFound, errorHandler } = require("./middleware/error");
const { generalLimiter } = require("./middleware/rateLimiter");

// Sets a batch of standard security-related HTTP headers
app.use(helmet());

// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: [
    "https://mentor-hub-project-six.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (for form submissions, etc.)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies from the incoming requests
app.use(cookieParser());

// Strips out any keys starting with "$" or containing "." from
// req.body/req.query/req.params, blocking MongoDB operator-injection
// payloads like { "email": { "$gt": "" } }.
app.use(mongoSanitize());

// Guards against HTTP Parameter Pollution (e.g. ?role=student&role=admin)
app.use(hpp());

// Basic protection against brute-force / scraping across all routes
app.use(generalLimiter);

// Use the routes with a prefix defined in the config file
app.use(config.PREFIX, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

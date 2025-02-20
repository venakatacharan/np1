const express = require("express");
const dotenv = require("dotenv");
const { init } = require('./socket');
const connectDB = require("./config/database");
const taskRoute = require("./routes/taskRoute");
const userRoute = require("./routes/userRoute");
const swaggerUI = require('swagger-ui-express')
const swaggerSpecs = require("./config/swagger")
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();



app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// // Swagger setup
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpecs))

// task route
app.use("/api/task", taskRoute);

// user route
app.use("/api/user", userRoute);

const server = app.listen(PORT, async () => {
  console.log(`App is running at http://localhost:${PORT}`);
  await connectDB();
});

init(server);

module.exports = app;

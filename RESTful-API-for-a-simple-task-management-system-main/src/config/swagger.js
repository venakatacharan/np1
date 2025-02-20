const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Task Management System",
      version: "0.1.0",
      description: "This is a simple Task Management CRUD API application made with Nodejs, Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Ayomide Wilfred Adeyemi",
        url: "https://wilfred-portfolio.vercel.app",
        email: "ayowilfred1995@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GreenVeggies API",
      version: "1.0.0",
      description: "API documentation for GreenVeggies",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local server",
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

const swaggerSpec = swaggerJsDoc(options);

module.exports = (app) => {
  app.use(
    "/greenveggies-api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
  app.use(
    "/greenveggies-api-docs/",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};

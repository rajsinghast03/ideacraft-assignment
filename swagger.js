// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IdeaCraft Assignment API",
      version: "1.0.0",
      description: "API documentation for Ideacraft assignment backend",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
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
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "643f2b2b5a4a8e00124ef321" },
            name: { type: "string", example: "Raj Singh" },
            email: {
              type: "string",
              format: "email",
              example: "raj@example.com",
            },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Category: {
          type: "object",
          properties: {
            _id: { type: "string", example: "661ff43823cb51c7e9a1dfb1" },
            name: { type: "string", example: "Clothing" },
            description: {
              type: "string",
              example: "All clothing-related items",
            },
            image: {
              type: "string",
              example: "https://cdn.example.com/image.jpg",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        SubCategory: {
          type: "object",
          properties: {
            _id: { type: "string", example: "661ff4c423cb51c7e9a1dfb4" },
            name: { type: "string", example: "T-Shirts" },
            description: { type: "string", example: "All types of t-shirts" },
            category: { type: "string", example: "661ff43823cb51c7e9a1dfb1" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Variation: {
          type: "object",
          properties: {
            size: { type: "string", example: "M" },
            color: { type: "string", example: "Blue" },
            price: { type: "number", example: 499 },
            discount: { type: "number", example: 10 },
            stock: { type: "number", example: 50 },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "661ff4fa23cb51c7e9a1dfb6" },
            name: { type: "string", example: "Plain Cotton T-Shirt" },
            productCode: { type: "string", example: "TSHIRT001" },
            description: {
              type: "string",
              example: "Comfortable plain cotton t-shirt",
            },
            images: {
              type: "array",
              items: {
                type: "string",
                example: "https://cdn.example.com/product1.jpg",
              },
            },
            category: { type: "string", example: "661ff43823cb51c7e9a1dfb1" },
            subCategory: {
              type: "string",
              example: "661ff4c423cb51c7e9a1dfb4",
            },
            variations: {
              type: "array",
              items: { $ref: "#/components/schemas/Variation" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

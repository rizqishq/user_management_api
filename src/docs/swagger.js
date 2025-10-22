import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.3",
    info: {
        title: "User Management API",
        version: "1.0.0",
        description:
            "Dokumentasi API untuk User Management API. Gunakan Authorization Bearer token untuk endpoint yang membutuhkan autentikasi.",
    },
    servers: [
        {
            url: process.env.SWAGGER_SERVER_URL || "http://localhost:" + (process.env.PORT || 5000),
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
                    id: { type: "integer" },
                    username: { type: "string" },
                    email: { type: "string" },
                    avatar_url: { type: "string", nullable: true },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                },
            },
        },
    },
};

const options = {
    definition: swaggerDefinition,
    apis: [
        "./src/routes/*.js",
        "./index.js",
    ],
};

export const swaggerSpec = swaggerJSDoc(options);



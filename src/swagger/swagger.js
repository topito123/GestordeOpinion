import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Gestor de Opinión API",
            version: "1.0.0",
            description: "API para gestionar opiniones y comentarios.",
        },
        servers: [
            {
                url: "http://localhost:5000/api", // Cambiado a puerto 5000
                description: "Servidor local",
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
    apis: ["./src/routes/*.js"], // Apunta a los archivos de rutas
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Documentación disponible en: http://localhost:5000/api-docs");
};

export default swaggerDocs;
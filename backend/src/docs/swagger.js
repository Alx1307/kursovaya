const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'LibraManager API',
            version: '1.0.0',
            description: 'REST API для управления библиотекой.'
        },
        servers: [
            {
                url: 'http://localhost:8080/',
            },
        ],
    },
    apis: ['./src/**/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
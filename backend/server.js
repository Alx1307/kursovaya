const express = require('express');
const database = require('./src/config/database');
const sequelize = database.sequelize;
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = YAML.load('./src/docs/spec.yaml');
require('dotenv').config();

const librarianRoutes = require('./src/routes/librarianRoutes');
const bookRoutes = require('./src/routes/bookRoutes');

const app = express();
app.use(express.json());

//маршруты
app.use('/', librarianRoutes);
app.use('/books', bookRoutes);

//Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

const PORT = 8080;
app.listen(PORT, async () => {
    console.log(`Сервер запущен на порту http://localhost:${PORT}/api-docs`);
});
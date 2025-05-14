const express = require('express');
const { Sequelize } = require('sequelize');
const sequelize = require('./src/config/database');
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');
require('dotenv').config();


const librarianRoutes = require('./src/routes/librarianRoutes');

const swaggerDoc = YAML.load('./src/docs/spec.yaml');

const app = express();
app.use(express.json());

(async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Успешно подключено к базе данных.');
    } catch (err) {
        console.error('Ошибка подключения:', err.message);
    }
})();

//маршруты
app.use('/', librarianRoutes);

//Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

const PORT = 8080;
app.listen(PORT, async () => {
    console.log(`Сервер запущен на порту http://localhost:${PORT}`);
});
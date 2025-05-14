const express = require('express');
const { Sequelize } = require('sequelize');
const sequelize = require('./src/config/database');
require('dotenv').config(); 

const librarianRoutes = require('./src/routes/librarianRoutes');

const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./src/docs/swagger');

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
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

const PORT = 8080;
app.listen(PORT, async () => {
    console.log(`Сервер запущен на порту http://localhost:${PORT}`);
});
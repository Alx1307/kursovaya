const express = require('express');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('./src/config/database');

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

app.get('/', (req, res) => {
    res.send('<h1>Сервер запущен!</h1>');
});

const PORT = 8080;
app.listen(PORT, async () => {
    console.log(`Сервер запущен на порту http://localhost:${PORT}`);
});
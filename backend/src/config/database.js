const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'library_management',
    'postgres',
    '12345678',
    {
        host: 'localhost',
        dialect: 'postgres'
    }
);

sequelize.sync({ force: false }).then(() => {
    console.log('Все модели синхронизированы с базой данных.');
}).catch((err) => {
    console.error('Ошибка синхронизации:', err);
});

module.exports = sequelize;
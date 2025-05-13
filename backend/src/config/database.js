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

module.exports = sequelize;
const { DataTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = database.sequelize;

const Author = sequelize.define('Author', {
    author_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    surname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            correct_surname(value) {
                if (!value.match('^([А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)?)$')) {
                    throw new Error('Некорректная фамилия.');
                }
            }
        }
    },

    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            correct_name(value) {
                if (!value.match('^([А-ЯЁ][а-яё]+(\s[А-ЯЁ][а-яё]+)?)$')) {
                    throw new Error('Некорректное имя.');
                }
            }
        }
    },

    patronymic: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            correct_patronymic(value) {
                if  (!value.match('^[А-ЯЁ][а-яё]{1,}$' )) {
                    throw new Error('Некорректное отчество.');
                }
            }
        }
    }
}, {
    tableName: 'author',
    timestamps: false
});

module.exports = Author;
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
                if (value && !/^[А-Яа-яЁё\s-]+$/u.test(value)) {
                    throw new Error('Некорректная фамилия. Фамилия должна содержать только русские буквы и может содержать дефис для составных фамилий.');
                }
            }
        }
    },

    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            correct_name(value) {
                if (value && !/^[А-Яа-яЁё\s-]+$/u.test(value)) {
                    throw new Error('Некорректное имя. Имя должно содержать только русские буквы.');
                }
            }
        }
    },

    patronymic: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            correct_patronymic(value) {
                if (value && !/^[А-Яа-яЁё\s-]+$/u.test(value)) {
                    throw new Error('Некорректное отчество. Отчство должно содержать только русские буквы.');
                }
            }
        }
    }
}, {
    tableName: 'author',
    timestamps: false
});

module.exports = Author;
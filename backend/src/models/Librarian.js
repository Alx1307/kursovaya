const { DataTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = database.sequelize;

const Librarian = sequelize.define('Librarian', {
    librarian_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(60),
        allowNull: true,
        validate: {
            isRussianLetters(value) {
                if (value && !/^[А-Яа-яЁё\s-]+$/u.test(value)) {
                    throw new Error('Поле full_name должно содержать только русские буквы, пробелы или дефисы.');
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isEmail: true,
            correct_email(value) {
                if (!value.match(/^[a-zA-Z0-9_-]+@[a-zA-Z]+\.[a-zA-Z.-]+$/)) {
                    throw new Error('Некорректный email.');
                }
            }
        },
        unique: {
            args: true,
            msg: 'Такой email уже зарегистрирован.'
        }
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            // len: [8, 20],
            // correct_password(value) {
            //     const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
            //
            //     if (!regex.test(value)) {
            //         throw new Error('Пароль должен содержать латинские буквы, цифры и спецсимволы и иметь длину от 8 до 20 символов.');
            //     }
            // }
        }
    },
    role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            correct_role(value) {
                const roles = ['Администратор', 'Библиотекарь', 'Библиограф'];

                if (!roles.includes(value)) {
                    return new Error('Некорректная роль.');
                }
            }
        }
    }
}, {
    tableName: 'librarian',
    timestamps: false
});

module.exports = Librarian;
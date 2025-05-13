const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
    const Librarian = sequelize.define('Librarian', {
        librarian_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        full_name: {
            type: DataTypes.STRING(60),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                isEmail: true,
                correct_email(value) {
                    if (!value.match(/^[a-zA-Z0-9_-]+@[a-zA-Z]+\.[a-zA-Z-.]+$/)) {
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
            allowNull: false,
            validate: {
                len: [8, 20],
                correct_password(value) {
                    if (!value.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/)) {
                        throw new Error('Пароль должен содержать латинские буквы, циффры и спецсимволы и иметь длину от 8 до 20 символов.');
                    }
                }
            }
        }
    }, {
        tableName: 'librarian',
        timepstamps: false
    });

    return Librarian;
};
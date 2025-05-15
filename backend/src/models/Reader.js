const { DataTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = database.sequelize;

module.exports = (sequelize) => {
    const Reader = sequelize.define('Reader', {
        reader_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },

        card_number: {
            type: DataTypes.STRING(12),
            allowNull: false,
            unique: {
                args: true,
                msg: 'Такой номер читательского билета уже занят.'
            }
        },

        birth_date: {
            type: DataTypes.DATE,
            allowNull: true
        },

        phone: {
            type: DataTypes.STRING(16),
            allowNull: true,
            validate: {
                correct_phone(value) {
                    if (!value.match(/^\+7 9[0-9]{2} [0-9]{3}-[0-9]{2}-[0-9]{2}$/)) {
                        throw new Error('Некорректный номер телефона.');
                    }
                }
            },
            unique: {
                args: true,
                msg: 'Читатель с таким номером телефона уже зарегистрирован.'
            }
        },

        hall_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Hall',
                key: 'hall_id'
            }
        }
    }, {
        tableName: 'reader',
        timestamps: false
    });

    return Reader;
};
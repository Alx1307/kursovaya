const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
    const Hall = sequelize.define('Hall', {
        hall_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                correct_number(value) {
                    if (!(value >= 1 && value <= 5)) {
                        throw new Error('Некорректный номер зала.');
                    }
                }
            },
            unique: {
                args: true,
                msg: 'Зал с таким номером уже существует.'
            }
        },

        specialization: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                correct_specialization(value) {
                    const correctSpecializations = ['Общий', 'Физико-математический', 'Гуманитарный', 'Филологический', 'Естественно-научный'];
                    if (!correctSpecializations.includes(value)) {
                        throw new Error('Некорректная специализация зала.');
                    }
                }
            },
            unique: {
                args: true,
                msg: 'Зал с такой специализацией уже существует.'
            }
        },

        seats_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                correct_seats_quantity(value) {
                    if (!(value > 0 && value <= 100)) {
                        throw new Error('Некорректное количество мест.');
                    }
                }
            }
        }
    }, {
        tableName: 'hall',
        timestamps: false
    });

    return Hall;
};
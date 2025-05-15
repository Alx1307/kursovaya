const { DataTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = database.sequelize;

module.export = (sequelize) => {
    const Issue = sequelize.define('Issue', {
        issue_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Book',
                key: 'book_id'
            }
        },

        reader_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Reader',
                key: 'reader_id'
            }
        },

        issue_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        return_date: {
            type: DataTypes.DATE,
            allowNull: true
        },

        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                correct_status(value) {
                    const correctStatuses = ['Выдана', 'Возвращена', 'Просрочена'];
                    if (!correctStatuses.includes(value)) {
                        throw new Error('Некорректный статус.');
                    }
                }
            },
            defaultValue: 'Выдана'
        },

        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });

    return Issue;
};
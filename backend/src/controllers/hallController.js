const database = require('../config/database');
const sequelize = database.sequelize;
const Hall = require('../models/Hall');
const Reader = require('../models/Reader');

class HallController {
    constructor(HallModel) {
        this.Hall = HallModel;
    }

    async getHallData(req, res) {
        try {
            const { hall_id } = req.params;

            const hall = await this.Hall.findByPk(hall_id, {
                attributes: ['hall_id', 'number', 'specialization', 'seats_quantity']
            });

            if (!hall) {
                return res.status(404).send('Зал не найден.');
            }

            const readersInHall = await Reader.count({ where: { hall_id } });

            const freeSeats = hall.seats_quantity - readersInHall;

            const result = {
                id: hall.hall_iid,
                number: hall.number,
                specialization: hall.specialization,
                seatsQuantity: hall.seats_quantity,
                freeSeats: Math.max(freeSeats, 0),
                seatsString: `${Math.max(freeSeats, 0)}/${hall.seats_quantity}`
            };

            return res.status(200).json(result);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getAllHallsData(req, res) {
        try {
            const allHalls = await Hall.findAll({
                attributes: ['hall_id', 'number', 'specialization', 'seats_quantity'],
                order: [['hall_id', 'ASC']],
            });

            let result = [];

            for (let hall of allHalls) {
                const readersInHall = await Reader.count({ where: { hall_id: hall.hall_id } });
                
                const freeSeats = hall.seats_quantity - readersInHall;

                result.push({
                    hall_id: hall.hall_id,
                    number: hall.number,
                    specialization: hall.specialization,
                    seatsQuantity: hall.seats_quantity,
                    freeSeats: Math.max(freeSeats, 0),
                    seatsString: `${Math.max(freeSeats, 0)}/${hall.seats_quantity}`
                });
            }
    
            return res.status(200).json(result);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getReadersForHall(req, res) {
        try {
            const { hall_id } = req.params;

            const hall = await Hall.findByPk(hall_id);
            if (!hall) {
                return res.status(404).send('Зал не найден.');
            }

            const readers = await Reader.findAll({
                where: { hall_id },
                attributes: ['reader_id', 'name', 'card_number'],
            });

            return res.status(200).json(readers);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
}

module.exports = HallController;
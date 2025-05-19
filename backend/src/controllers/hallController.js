const database = require('../config/database');
const sequelize = database.sequelize;
const Hall = require('../models/Hall');

class HallController {
    constructor(HallModel) {
        this.Hall = HallModel;
    }

    async getHallData(req, res) {
        try {
            const { hall_id } = req.params;

            const hall = await this.Hall.findByPk(hall_id);

            if (!hall) {
                return res.status(404).send('Зал не найден.');
            }

            return res.status(200).json(hall.toJSON());
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getAllHallsData(req, res) {
        try {
            const allHalls = await Hall.findAll();

            res.status(200).json(allHalls.map(hall => hall.toJSON()));
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
}

module.exports = HallController;
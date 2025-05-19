const database = require('../config/database');
const sequelize = database.sequelize;
const Reader = require('../models/Reader');

class ReaderController {
    constructor(ReaderModel) {
        this.Reader = ReaderModel;
    }

    async addReader (req, res) {
        try {
            if (req.userData.role !== 'Библиотекарь') {
                return res.status(403).send('Доступ запрещен.');
            }

            const { name, card_number, birth_date, phone, hall_id } = req.body;

            if (!name) return res.status(400).send('ФИО читателя обязательно.');
            if (!card_number) return res.status(400).send('Номер читательского билета обязательно.');
            if (!hall_id) return res.status(400).send('Номер зала обязателен.');

            const reader = new Reader({ name, card_number, birth_date, phone, hall_id });
            await reader.save();

            return res.status(201).send('Читатель успешно зарегистрирован.');
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
}

module.exports = ReaderController;
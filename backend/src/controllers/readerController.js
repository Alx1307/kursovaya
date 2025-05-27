const database = require('../config/database');
const sequelize = database.sequelize;
const Reader = require('../models/Reader');
const Hall = require('../models/Hall');
const Issue = require('../models/Issue');
const Book = require('../models/Book');

class ReaderController {
    constructor(ReaderModel) {
        this.Reader = ReaderModel;
    }

    async addReader (req, res) {
        try {
            if (req.userData.role !== 'Библиотекарь') {
                return res.status(403).send('Доступ запрещен.');
            }

            let { name, card_number, birth_date, phone, hall_id } = req.body;

            if (!name) return res.status(400).send('ФИО читателя обязательно.');
            if (!card_number) return res.status(400).send('Номер читательского билета обязательно.');
            if (!hall_id) return res.status(400).send('Номер зала обязателен.');

            if (birth_date && typeof birth_date === 'string') {
                const parts = birth_date.split('.').map(Number);
                if (parts.length === 3) {
                    birth_date = `${parts[2]}-${parts[1].toString().padStart(2, '0')}-${parts[0].toString().padStart(2, '0')}`;
                }
            }

            const hall = await Hall.findByPk(hall_id, {
                attributes: ['seats_quantity']
            });

            if (!hall) {
                return res.status(404).send('Зал не найден.');
            }

            const readersInHall = await Reader.count({
                where: { hall_id }
            });

            if (readersInHall >= hall.seats_quantity) {
                return res.status(400).send('В выбранном зале нет свободных мест.');
            }

            const reader = new Reader({ name, card_number, birth_date, phone, hall_id });
            await reader.save();

            return res.status(201).send('Читатель успешно зарегистрирован.');
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getReaderData(req, res) {
        try {
            const { reader_id } = req.params;

            const reader = await this.Reader.findByPk(reader_id);

            if (!reader) {
                return res.status(404).send('Читатель не найден.');
            }

            res.json(reader.toJSON());
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getAllReaders(req, res) {
        try {
            const allReaders = await Reader.findAll();

            res.json(allReaders.map(reader => reader.toJSON()));
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    }

    async editReader(req, res) {
        try {
            const { reader_id } = req.params;

            if (req.userData.role !== 'Библиотекарь') {
                return res.status(403).send('Доступ запрещен.');
            }

            const updatedData = {};

            if (req.body.name) {
                updatedData.name = req.body.name.trim();
            }

            if (req.body.card_number) {
                updatedData.card_number = req.body.card_number.trim();
            }

            if (req.body.birth_date) {
                updatedData.birth_date = req.body.birth_date.trim();
            }

            if (req.body.phone) {
                updatedData.phone = req.body.phone.trim();
            }

            if (req.body.hall_id) {
                updatedData.hall_id = req.body.hall_id;
            }

            const reader = await Reader.findByPk(reader_id);

            if (!reader) {
                return res.status(404).send('Читатель не найден.');
            }

            Object.keys(updatedData).forEach( key => {
                reader[key] = updatedData[key];
            });

            await reader.save();

            return res.status(200).send('Данные успешно обновлены.');
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async deleteReader(req, res) {
        try {
            if (req.userData.role !== 'Библиотекарь') {
                return res.status(403).send('Доступ запрещен.');
            }

            const { reader_id } = req.params;

            const reader = await Reader.findByPk(reader_id);

            if (!reader) {
                return res.status(403).send('Читатель не найден.');
            }

            await reader.destroy();

            return res.status(200).send('Читатель успешно удален.');
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }

    async getIssuesForReader(req, res) {
        try {
            const { reader_id } = req.params;

            console.log(reader_id);
    
            if (!reader_id) {
                return res.status(400).send('Читатель не найден.');
            }
    
            const issues = await Issue.findAll({
                where: { reader_id },
                order: [['issue_date', 'DESC']]
            });
    
            if (!issues || issues.length === 0) {
                return res.status(404).send(`У данного читателя нет выдач.`);
            }
    
            const results = issues.map(issue => ({
                issue_id: issue.issue_id,
                book_id: issue.book_id,
                issue_date: issue.issue_date,
                return_date: issue.return_date,
                status: issue.status,
                comment: issue.comment,
            }));
    
            return res.status(200).json(results);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
    }
}

module.exports = ReaderController;
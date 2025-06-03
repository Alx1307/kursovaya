const bcrypt = require('bcryptjs');
const database = require('../config/database');
const sequelize = database.sequelize;
const jwt = require('jsonwebtoken');
const Librarian = require('../models/Librarian');

class LibrarianController {
    constructor(LibrarianModel) {
        this.Librarian = LibrarianModel;
    }

    async addLibrarian(req, res) {
        const { email, role } = req.body;

        try {
            if (req.userData.role !== 'Администратор') {
                return res.status(403).send('Доступ запрещен.');
            }

            const existingUser = await Librarian.findOne({ where: {email} });

            if (existingUser) {
                return res.status(409).send('E-mail уже зарегистрирован.');
            }

            const librarian = new Librarian({ email, role });
            await librarian.save();

            return res.status(201).send('Новый сотрудник успешно добавлен.');
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async registerLibrarian(req, res) {
        const { full_name, email, password } = req.body;
        
        try {
            let librarian = await Librarian.findOne({ where: { email } });

            if (!librarian) {
                return res.status(404).send('Сотрудник с указанным email не найден');
            }

            if (librarian.full_name !== null && librarian.password !== null) {
                return res.status(400).send('Данный пользователь уже завершил регистрацию');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
    
            await librarian.update({ full_name, password: hashedPassword });
    
            res.status(200).send('Сотрудник успешно зарегистрирован.');
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async loginLibrarian(req, res) {
        const { email, password } = req.body;
    
        try {
            const librarian = await Librarian.findOne({
                where: { email }
            });
    
            if (! librarian) {
                return res.status(404).send('Библиотекарь не найден.');
            }
    
            const match = await bcrypt.compare(password, librarian.password);
    
            if (!match) {
                return res.status(400).send('Неверный пароль.');
            }
    
            const tokenPayload = {
                id: librarian.librarian_id,
                role: librarian.role,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor((Date.now() / 1000) + 3600)
            };
    
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);
    
            res.json({ token });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Ошибка сервера.');
        }
    }

    async getLibrarianData(req, res) {
        try {
            if (req.userData.role !== 'Администратор') {
                if (req.params.librarian_id != req.userData.id) {
                    return res.status(403).send('Доступ запрещен.');
                }
            }

            const librarian = await Librarian.findOne({
                where: { librarian_id: req.params.librarian_id },
                attributes: ['librarian_id', 'full_name', 'email', 'role']
            });
    
            if (!librarian) {
                return res.status(404).send('Библиотекарь не найден.');
            }
    
            res.json(librarian.toJSON());
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Ошибка сервера.');
        }
    }

    async getLibrarianTokenData(req, res) {
        try {
            const userId = req.userData.id;
            
            const librarian = await Librarian.findOne({
                where: { librarian_id: userId },
                attributes: ['librarian_id', 'full_name', 'email', 'role']
            });
    
            if (!librarian) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }
    
            res.json(librarian.toJSON());
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async getAllLibrariansData(req, res) {
        try {
            if (req.userData.role !== 'Администратор') {
                return res.status(403).send('Доступ запрещен.');
            }
    
            const allLibrarians = await Librarian.findAll({
                attributes: ['librarian_id', 'full_name', 'email', 'role'],
                order: [['librarian_id', 'ASC']]
            });
    
            res.json(allLibrarians.map(librarian => librarian.toJSON()));
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }

    async deleteLibrarian(req, res) {
        const { librarian_id } = req.params;

        try {
            if (req.userData.role !== 'Администратор') {
                if (librarian_id != req.userData.id) {
                    return res.status(403).send('Доступ запрещен.');
                }
            }

            const adminCount = await Librarian.count({
                where: { role: 'Администратор' }
            });

            const librarian = await Librarian.findOne({
                where: { librarian_id },
            });

            if (!librarian) {
                return res.status(404).send('Библиотекарь не найден.');
            }

            if (librarian.role === 'Администратор') {
                if (adminCount <= 1) {
                    return res.status(400).send('Нельзя удалить последнего администратора.');
                }
            }

            await librarian.destroy();

            res.json({ message: "Аккаунт успешно удален." });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Ошибка сервера.");
        }
    }

    async editLibrarianData(req, res) {
        const { librarian_id } = req.params;
    
        try {
            if (req.userData.role !== 'Администратор') {
                if (librarian_id != req.userData.id) {
                    return res.status(403).send('Доступ запрещен.');
                }
            }
    
            const updatedData = {};
    
            if (req.body.full_name) {
                updatedData.full_name = req.body.full_name.trim();
            }
    
            if (req.body.email) {
                updatedData.email = req.body.email.trim();
            }
    
            if (req.userData.role === 'Администратор' && req.body.role) {
                updatedData.role = req.body.role.trim();
            }
    
            const librarian = await Librarian.findOne({
                where: { librarian_id }
            });
    
            if (!librarian) {
                return res.status(404).send('Библиотекарь не найден.');
            }
    
            Object.keys(updatedData).forEach( key => {
                librarian[key] = updatedData[key];
            });
    
            await librarian.save();
    
            res.status(200).send('Данные успешно обновлены.');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Ошибка сервера.');
        }
    } 
}

module.exports = LibrarianController;
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');
const Librarian = require('../models/Librarian')(sequelize);

//Регистрация
/** 
    * @swagger 
    * /register: 
    *   post: 
    *       summary: Регистрация библиотекаря 
    *       tags: ["Регистрация"]
    *       requestBody:
    *           required: true
    *           content:
    *               application/json:
    *                   schema:
    *                       type: object
    *                       properties:
    *                           full_name:
    *                               type: string
    *                               example: Иванова Александра Евгеньевна
    *                           email:
    *                               type: string
    *                               format: email
    *                               description: Адрес электронной почты библиотекаря
    *                               example: ivan.petrov@example.com
    *                           password:
    *                               type: string
    *                               format: password
    *                               description: Пароль библиотекаря
    *                               example: SecureP@ssword123
    *       responses:
    *           201:
    *               description: Библиотекарь успешно зарегистрирован
    *               content:
    *                   application/json:
    *                       schema:
    *                           type: object
    *                           properties:
    *                               message:
    *                                   type: string
    *                                   description: Сообщение успеха
    *                                   example: Библиотекарь успешно зарегистрирован
    *           400:
    *               description: Некорректные входные данные
    *               content:
    *                   application/json:
    *                       schema:
    *                           type: object
    *                           properties:
    *                               error:
    *                                   type: string
    *                                   description: Описание ошибки
    *                                   example: Некорректный формат ввода
    *           500:
    *               description: Внутренняя ошибка сервера
    *               content:
    *                   application/json:
    *                       schema:
    *                           type: object
    *                           properties:
    *                               error:
    *                                   type: string
    *                                   description: Сообщение об ошибке
    *                                   example: Произошла внутренняя ошибка сервера
*/

exports.registerLibrarian = async (req, res) => {
    const { full_name, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const librarian = new Librarian({full_name, email, password: hashedPassword});
        await librarian.save();

        res.status(201).send('Библиотекарь успешно зарегистрирован.');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

//Авторизация
/** 
 * @swagger 
 * /login: 
 *   post: 
 *       summary: Аутентификация библиотекаря
 *       tags: ["Авторизация"]
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       type: object
 *                       properties:
 *                           email:
 *                               type: string
 *                               format: email
 *                               description: Электронная почта библиотекаря
 *                               example: alexander.sidorov@example.com
 *                           password:
 *                               type: string
 *                               format: password
 *                               description: Пароль библиотекаря
 *                               example: SecurePassw0rd123
 *       responses:
 *           200:
 *               description: Успешная аутентификация
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               token:
 *                                   type: string
 *                                   description: JWT-токен для дальнейшей авторизации
 *                                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *           404:
 *               description: Пользователь не найден
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               error:
 *                                   type: string
 *                                   description: Ошибка авторизации
 *                                   example: Библиотекарь не найден
 *           400:
 *               description: Неверный пароль
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               error:
 *                                   type: string
 *                                   description: Ошибка авторизации
 *                                   example: Неверный пароль
 *           500:
 *               description: Внутренняя ошибка сервера
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               error:
 *                                   type: string
 *                                   description: Сообщение об ошибке
 *                                   example: Произошла внутренняя ошибка сервера
 */

exports.loginLibrarian = async (req, res) => {
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
            iat: Math.floor(Date.now() / 1000)
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера.');
    }
};

//Загрузка данных библиотекаря (ФИО)

//Выход из аккаунта

//Удаление аккаунта

//Редактирование профиля?
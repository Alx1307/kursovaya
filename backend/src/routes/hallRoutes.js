const express = require('express');
const router = express.Router();
const HallController = require('../controllers/hallController');
const Hall = require('../models/Hall');
const authMiddleware = require('../middleware/authMiddleware');

const controller = new HallController(Hall);

router.get('/get/:hall_id', authMiddleware, controller.getHallData.bind(controller));

module.exports = router;
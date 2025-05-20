const express = require('express');
const database = require('./src/config/database');
const sequelize = database.sequelize;
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = YAML.load('./src/docs/spec.yaml');
const cors = require('cors');
require('dotenv').config();

const librarianRoutes = require('./src/routes/librarianRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const readerRoutes = require('./src/routes/readerRoutes');
const hallRoutes = require('./src/routes/hallRoutes');
const issueRoutes = require('./src/routes/issueRoutes');

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}));

//маршруты
app.use('/', librarianRoutes);
app.use('/books', bookRoutes);
app.use('/readers', readerRoutes);
app.use('/halls', hallRoutes);
app.use('/issues', issueRoutes);

//Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

const PORT = 8080;
app.listen(PORT, async () => {
    console.log(`Сервер запущен на порту http://localhost:${PORT}/api-docs`);
});
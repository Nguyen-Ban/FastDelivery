require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const logger = require('./config/logger');
require('./models/index'); // Import associations

const app = express();
const apiRouter = require('./routes/index');
const errorHandler = require('./middleware/error.middleware');
const redisClient = require('./config/redis');
const WebSocketService = require('./services/websocket.service');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    logger.info('[App] Health check endpoint accessed');
    res.json({ message: 'Welcome to the API' });
});

app.use('/api', apiRouter);

// Error handling
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        logger.info('[App] Database connection has been established successfully.');

        await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables (for testing)
        logger.info('[App] Database synced successfully.');

        await redisClient.flushall();
        logger.info('[App] Redis flushed successfully.');

        const server = app.listen(PORT, () => {
            logger.info(`[App] Server is running on port ${PORT}...`);
        });

        // Initialize WebSocket service
        new WebSocketService(server);
        logger.info('[App] WebSocket service initialized successfully.');

    } catch (error) {
        logger.error(`[App] Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer(); 
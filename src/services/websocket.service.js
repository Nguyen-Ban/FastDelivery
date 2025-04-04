const socketIO = require('socket.io');
const redisClient = require('../config/redis');
const { decodeAccessToken, isAccessTokenBlacklisted } = require('./token.service');
const logger = require('../config/logger');
const { Driver } = require('../models');

class WebSocketService {
    constructor(server) {
        this.io = socketIO(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.setupSocketHandlers();
    }

    async authenticateSocket(socket, next) {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                logger.warn('[WebSocket] Authentication failed: No token provided');
                return next(new Error('Authentication error: No token provided'));
            }

            if (await isAccessTokenBlacklisted(token)) {
                logger.warn('[WebSocket] Authentication failed: Token is blacklisted');
                return next(new Error('Authentication error: Token is blacklisted'));
            }

            const user = await decodeAccessToken(token);

            // Get driver information during authentication
            const driver = await Driver.findOne({
                where: { userId: user.userId }
            });

            if (!driver) {
                logger.warn(`[WebSocket] Authentication failed: Driver not found for user ${user.userId}`);
                return next(new Error('Authentication error: Driver not found'));
            }

            // Store both user and driver info in socket
            socket.user = user;
            socket.driver = driver;

            logger.info(`[WebSocket] User ${user.userId} (Driver ${driver.id}) authenticated successfully`);
            next();
        } catch (error) {
            logger.error(`[WebSocket] Authentication error: ${error.message}`);
            next(new Error('Authentication error: Invalid token'));
        }
    }

    setupSocketHandlers() {
        this.io.use((socket, next) => this.authenticateSocket(socket, next));

        this.io.on('connection', (socket) => {
            logger.info(`[WebSocket] New client connected: ${socket.id} (Driver: ${socket.driver.id})`);

            // Handle driver location updates
            socket.on('driver:location', async (data) => {
                try {
                    const { latitude, longitude } = data;

                    // Log received location data
                    console.log(`[WebSocket] Received location from client ${socket.id}:`, {
                        driverId: socket.driver.id,
                        latitude,
                        longitude,
                        timestamp: new Date().toISOString()
                    });

                    // Validate required fields
                    if (!latitude || !longitude) {
                        socket.emit('error', { message: 'Missing required fields' });
                        return;
                    }

                    // Store driver location in Redis using GEOADD
                    await redisClient.geoadd(
                        'drivers:locations',
                        longitude,
                        latitude,
                        socket.driver.id
                    );

                    // // Update driver status to AVAILABLE
                    // await socket.driver.update({ status: 'AVAILABLE' });

                    // // Broadcast the location update to all connected clients
                    // this.io.emit('driver:location:updated', {
                    //     driverId: socket.driver.id,
                    //     location: { latitude, longitude }
                    // });

                } catch (error) {
                    logger.error(`[WebSocket] Error updating driver location: ${error.message}`);
                    socket.emit('error', { message: 'Failed to update location' });
                }
            });

            // Handle driver disconnection
            socket.on('disconnect', async () => {
                try {
                    logger.info(`[WebSocket] Client disconnected: ${socket.id} (Driver: ${socket.driver.id})`);

                    // Update driver status to OFFLINE
                    await socket.driver.update({ status: 'OFFLINE' });
                    // Remove driver's location from Redis
                    await redisClient.zrem('drivers:locations', socket.driver.id);
                } catch (error) {
                    logger.error(`[WebSocket] Error handling driver disconnect: ${error.message}`);
                }
            });
        });
    }

    // Method to get nearby drivers
    async getNearbyDrivers(latitude, longitude, radius = 5, unit = 'km') {
        try {
            const results = await redisClient.georadius(
                'drivers:locations',
                longitude,
                latitude,
                radius,
                unit,
                'WITHCOORD',
                'WITHDIST'
            );

            return results.map(result => ({
                driverId: result[0],
                distance: result[1],
                location: {
                    longitude: result[2][0],
                    latitude: result[2][1]
                }
            }));
        } catch (error) {
            logger.error(`[WebSocket] Error getting nearby drivers: ${error.message}`);
            throw error;
        }
    }
}

module.exports = WebSocketService; 
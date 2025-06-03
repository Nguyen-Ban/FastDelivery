const socketMap = new Map();

const registerSocket = (userId, socket) => {
    socketMap.set(userId, socket);
}

const getSocket = (userId) => {
    return socketMap.get(Number(userId)) || null;
}

module.exports = {
    registerSocket,
    getSocket,
}

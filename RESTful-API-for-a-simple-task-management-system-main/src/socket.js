const socketIO = require('socket.io');

let io;

const init = (server) => {
    io = socketIO(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        // Task events
        socket.on('createTask', (task) => {
            io.emit('taskCreated', task);
        });

        socket.on('updateTask', (task) => {
            io.emit('taskUpdated', task);
        });

        socket.on('deleteTask', (taskId) => {
            io.emit('taskDeleted', taskId);
        });

        socket.on('getTasks', () => {
            // You can implement logic to fetch tasks from the database and emit them
            const tasks = []; // Example: Fetch tasks from database
            io.emit('tasksList', tasks);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = { init, getIO };

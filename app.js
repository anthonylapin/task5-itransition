const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const { handleSocketConnection } = require('./socket');

const server = http.createServer(app);
const io = socketIO(server);

handleSocketConnection(io);

app.use(express.json({ extended: true }));
app.use('/api/content', require('./routes/content.routes'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
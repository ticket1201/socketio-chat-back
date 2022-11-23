import express from 'express'
import http from 'http'
import {Server} from 'socket.io'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const messages = [
    {
        message: 'hello first',
        id: '1231',
        user: {
            id: '123',
            name: 'Anonim1'
        }
    },
    {
        message: 'hello second',
        id: '333',
        user: {
            id: '333',
            name: 'Anonim2'
        }
    },
]

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});


io.on('connection', (socketChannel) => {

    socketChannel.on('client-message-sent', (text: string) => {
        let messageItem = {
            message: text,
            id: '333' + new Date().getTime(),
            user: {
                id: '333',
                name: 'Anonim'
            }
        }
        messages.push(messageItem)
        socketChannel.emit('new-message-sent', messageItem)
        console.log(text);
    })

    socketChannel.emit('init-messages-published', messages)
    console.log('a user connected');
})


const PORT = process.env.PORT || 3009

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
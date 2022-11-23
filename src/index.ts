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
const users = new Map()


app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});


io.on('connection', (socketChannel) => {
    users.set(socketChannel, {id: new Date().getTime().toString(), name: ''})

    socketChannel.on('client-name-sent', (name: string) => {
        if (typeof name !== 'string') {
            return
        }
        const user = users.get(socketChannel)
        user.name = name;
        socketChannel.emit('new-name-sent', name)
        const names:Array<string> = [];
            users.forEach(el => names.push(el.name))
        io.emit('user-sent', names)
    })

    socketChannel.on('client-message-sent', (text: string) => {
        let messageItem = {
            message: text,
            id: new Date().getTime().toString(),
            user: {...users.get(socketChannel)}
        }
        messages.push(messageItem)
        io.emit('new-message-sent', messageItem)
        console.log(text);
    })

    socketChannel.emit('init-messages-published', messages)
    console.log('a user connected');
})


const PORT = process.env.PORT || 3009

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
const { Client, RemoteAuth, MessageMedia } = require('whatsapp-web.js')
const express = require('express')
const socketIO = require('socket.io')
const qrcode = require('qrcode')
const http = require('http')
const { MongoStore } = require('wwebjs-mongo')
const mongoose = require('mongoose')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: '*',
    }
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    // res.status(200).json({
    //     status: true,
    //     message: 'Not just hello world'
    // })
    res.sendFile('index.html', { root: __dirname })
})

mongoose.connect('mongodb://205.209.99.71:27017/').then(() => {
    const store = new MongoStore({ mongoose: mongoose })
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    })

    client.on('message', message => {
        if (message.body === '!ping') {
            message.reply('Hola Saecorp');
        }
    });
    //Socket IO   
    io.on('connection', (socket) => {
        socket.emit('message', 'Connecting...')
        client.on('qr', (qr) => {
            //qrcode.generate(qr, { small: true })
            //console.log('QR RECEIVED', qr)
            qrcode.toDataURL(qr, (err, url) => {
                socket.emit('qr', url)
                socket.emit('message', 'CODIGO QR RECIBIDO, POR FAVOR ESCANEAR')
            })
        })
        client.on('ready', () => {
            // console.log('Client is ready!')
            // client.getChats().then(chats => {
            //     console.log(chats[0])
            // })
            socket.emit('message', 'Whatsapp esta listo')
        })
    })
    app.post('/send-message', (req, res) => {
        const number = req.body.number
        const message = req.body.message
        console.log(number, message)
        client.sendMessage(number, message).then(response => {
            res.status(200).json({
                status: true,
                response: response
            })
        }).catch(error => {
            res.status(500).json({
                status: false,
                response: error
            })
        })
    })

    app.post('/send-media', (req, res) => {
        const number = req.body.number
        const caption = req.body.caption
        const media = MessageMedia.fromFilePath('FACT_020010000482458.pdf')
        client.sendMessage(number, media, { caption: caption }).then(response => {
            res.status(200).json({
                status: true,
                response: response
            })
        }).catch(error => {
            res.status(500).json({
                status: false,
                response: error
            })
        })
    })

    client.initialize()
})


server.listen(8000, () => {
    console.log('App running on *:' + 8000)
})

// client.on('ready', () => {
//     console.log('Client is ready!')
//     client.getChats().then(chats => {
//         console.log(chats[0])
//     })
// })
// client.on('message', message => {
//     if (message.body === '!ping') {
//         message.reply('Hola Saecorp');
//     }
// });
// client.initialize()

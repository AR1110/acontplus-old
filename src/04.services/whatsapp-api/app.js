const { Client, RemoteAuth, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const express = require('express')
const { body, validationResult } = require('express-validator')
const socketIO = require('socket.io')
const qrcode = require('qrcode')
const http = require('http')
const { MongoStore } = require('wwebjs-mongo')
const mongoose = require('mongoose')
const { phoneNumberFormatter } = require('./helpers/formatter')
const fileUpload = require('express-fileupload')
const axios = require('axios')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: '*',
    }
})

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(fileUpload({
//     debug: true
// }))

app.get('/', (req, res) => {
    // res.status(200).json({
    //     status: true,
    //     message: 'Not just hello world'
    // })
    res.sendFile('index.html', { root: __dirname })
})

// mongoose.connect('mongodb://205.209.99.71:27017/').then(() => {
//     const store = new MongoStore({ mongoose: mongoose })
//     const client = new Client({
//         authStrategy: new RemoteAuth({
//             store: store,
//             backupSyncIntervalMs: 300000
//         })
//     })


// })

const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows '--disable-gpu', 
        ],
    },
    authStrategy: new LocalAuth()
});

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

    client.on('authenticated', () => {
        socket.emit('authenticated', 'Whatsapp is authenticated!');
        socket.emit('message', 'Whatsapp is authenticated!');
        console.log('AUTHENTICATED');
    })

    client.on('auth_failure', function (session) {
        socket.emit('message', 'Auth failure, restarting...');
    })

    client.on('disconnected', (reason) => {
        socket.emit('message', 'Whatsapp is disconnected!');
        client.destroy();
        client.initialize();
    })
})




const checkRegisteredNumber = async (number) => {
    const isRegistered = await client.isRegisteredUser(number)
    return isRegistered
}

app.post('/send-message', [
    body('number').notEmpty(),
    body('message').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req).formatWith(({ msg }) => {
        return msg
    })
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: errors.mapped()
        })
    }
    const number = phoneNumberFormatter(req.body.number)
    const message = req.body.message
    //console.log("", number, message)
    const isRegisteredNumber = await checkRegisteredNumber(number)
    if (!isRegisteredNumber) {
        return res.status(422).json({
            status: false,
            message: 'El número no se encuentra registrado en whatsaap'
        })
    }
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

app.post('/send-media', async (req, res) => {
    const number = phoneNumberFormatter(req.body.number)
    const caption = req.body.caption
    //const media = MessageMedia.fromFilePath('FACT_020010000482458.pdf')
    const file = req.files.file
    const media = new MessageMedia(file.mimetype, file.data.toString('base64'), file.name)
    // const fileUrl = req.body.file
    // let mimetype
    // const attachment = await axios.get(fileUrl, { responseType: 'arraybupper' }).then(response => {
    //     mimetype = response.headers['content-type']
    //     return response.data.toString('base64')
    // })
    // console.log(fileUrl)
    // console.log(attachment)
    // console.log(mimetype)
    //const media = new MessageMedia(mimetype, attachment, 'Media')
    // console.log(file)
    // return
    console.log(number)
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

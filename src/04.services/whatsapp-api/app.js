const { Client, RemoteAuth, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const express = require('express')
const { body, validationResult } = require('express-validator')
const socketIO = require('socket.io')
const qrcode = require('qrcode')
const http = require('http')
// const { MongoStore } = require('wwebjs-mongo')
// const mongoose = require('mongoose')
const fs = require('fs')
const { phoneNumberFormatter } = require('./helpers/formatter')
// const fileUpload = require('express-fileupload')
// const axios = require('axios')
const port = process.env.PORT || 8000

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

const sessions = []

const SESSIONS_FILE = './whatsapp-sessions.json'

const createSessionsFileIfNotExists = () => {
    if (!fs.existsSync(SESSIONS_FILE)) {
        try {
            fs.writeFileSync(SESSIONS_FILE, JSON.stringify([]))
            console.log('Sessions file created successfully.')
        } catch (err) {
            console.log('Failed to create sessions file: ', err)
        }
    }
}

createSessionsFileIfNotExists()

const setSessionsFile = (sessions) => {
    fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions), (err) => {
        if (err) {
            console.log(err)
        }
    })
}

const getSessionsFile = () => {
    return JSON.parse(fs.readFileSync(SESSIONS_FILE))
}

const createSession = (id, description) => {
    console.log('Creating ' + id)
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
        authStrategy: new LocalAuth({
            clientId: id
        })
    })

    client.initialize()

    client.on('qr', (qr) => {
        //qrcode.generate(qr, { small: true })
        //console.log('QR RECEIVED', qr)
        // qrcode.toDataURL(qr, (err, url) => {
        //     socket.emit('qr', url)
        //     socket.emit('message', 'CODIGO QR RECIBIDO, POR FAVOR ESCANEAR')
        // })

        qrcode.toDataURL(qr, (err, url) => {
            io.emit('qr', { id: id, src: url });
            io.emit('message', { id: id, text: 'QR Code recibido, por favor scanear!' });
        })
    })

    client.on('ready', () => {
        // console.log('Client is ready!')
        // client.getChats().then(chats => {
        //     console.log(chats[0])
        // })

        io.emit('ready', { id: id })
        io.emit('message', { id: id, text: 'Whatsapp esta listo!' })

        const savedSessions = getSessionsFile()
        console.log(savedSessions)
        const sessionIndex = savedSessions.findIndex(sess => sess.id == id)
        savedSessions[sessionIndex].ready = true
        setSessionsFile(savedSessions)
    })

    client.on('authenticated', () => {
        io.emit('authenticated', { id: id });
        io.emit('message', { id: id, text: 'Whatsapp ha sido autenticado!' })
    })

    client.on('auth_failure', function () {
        io.emit('message', { id: id, text: 'Atenticación fallida, reiniciado...' })
    })

    client.on('disconnected', (reason) => {
        io.emit('message', { id: id, text: 'Whatsapp ha sido desconectado!' })
        client.destroy();
        client.initialize();

        // Menghapus pada file sessions
        const savedSessions = getSessionsFile()
        const sessionIndex = savedSessions.findIndex(sess => sess.id == id)
        savedSessions.splice(sessionIndex, 1)
        setSessionsFile(savedSessions)

        io.emit('remove-session', id)
    })

    sessions.push({
        id: id,
        description: description,
        client: client
    })

    const savedSessions = getSessionsFile()
    const sessionIndex = savedSessions.findIndex(sess => sess.id == id)

    if (sessionIndex == -1) {
        savedSessions.push({
            id: id,
            description: description,
            ready: false
        })
        setSessionsFile(savedSessions)
    }
}

const init = (socket) => {
    const savedSessions = getSessionsFile()

    if (savedSessions.length > 0) {
        if (socket) {
            savedSessions.forEach((e, i, arr) => {
                arr[i].ready = false
            })
            socket.emit('init', savedSessions)
        } else {
            savedSessions.forEach(session => {
                createSession(session.id, session.description)
            })
        }
    }
}

init()



// mongoose.connect('mongodb://205.209.99.71:27017/').then(() => {
//     const store = new MongoStore({ mongoose: mongoose })
//     const client = new Client({
//         authStrategy: new RemoteAuth({
//             store: store,
//             backupSyncIntervalMs: 300000
//         })
//     })


// })

// const client = new Client({
//     restartOnAuthFail: true,
//     puppeteer: {
//         headless: true,
//         args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--disable-dev-shm-usage',
//             '--disable-accelerated-2d-canvas',
//             '--no-first-run',
//             '--no-zygote',
//             '--single-process', // <- this one doesn't works in Windows '--disable-gpu', 
//         ],
//     },
//     authStrategy: new LocalAuth()
// })

// client.on('message', message => {
//     if (message.body === '!ping') {
//         message.reply('Hola Saecorp');
//     }
// })
//Socket IO   
io.on('connection', (socket) => {
    //socket.emit('message', 'Connecting...')

    // client.on('qr', (qr) => {
    //     //qrcode.generate(qr, { small: true })
    //     //console.log('QR RECEIVED', qr)
    //     qrcode.toDataURL(qr, (err, url) => {
    //         socket.emit('qr', url)
    //         socket.emit('message', 'CODIGO QR RECIBIDO, POR FAVOR ESCANEAR')
    //     })
    // })

    // client.on('ready', () => {
    //     // console.log('Client is ready!')
    //     // client.getChats().then(chats => {
    //     //     console.log(chats[0])
    //     // })
    //     socket.emit('message', 'Whatsapp esta listo')
    // })

    // client.on('authenticated', () => {
    //     socket.emit('authenticated', 'Whatsapp is authenticated!');
    //     socket.emit('message', 'Whatsapp is authenticated!');
    //     console.log('AUTHENTICATED');
    // })

    // client.on('auth_failure', function (session) {
    //     socket.emit('message', 'Auth failure, restarting...');
    // })

    // client.on('disconnected', (reason) => {
    //     socket.emit('message', 'Whatsapp is disconnected!');
    //     client.destroy();
    //     client.initialize();
    // })

    init(socket)

    socket.on('create-session', (data) => {
        console.log("Create session: " + data.id)
        createSession(data.id, data.description)
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
    const sender = req.body.sender
    const number = phoneNumberFormatter(req.body.number)
    const message = req.body.message

    const client = sessions.find(sess => sess.id === sender)?.client
    console.log(client)
    if (!client) {
        return res.status(422).json({
            status: false,
            message: `No se encontro la solicitud ${sender}`
        })
    }

    //console.log("", number, message)
    //const isRegisteredNumber = await checkRegisteredNumber(number)
    // if (!client.isRegisteredUser(number)) {
    //     return res.status(422).json({
    //         status: false,
    //         message: 'El número no se encuentra registrado en whatsaap'
    //     })
    // }
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

    const sender = req.body.sender

    const number = phoneNumberFormatter(req.body.number)
    const caption = req.body.caption
    //const media = MessageMedia.fromFilePath('FACT_020010000482458.pdf')
    const file = req.files.file
    const client = sessions.find(sess => sess.id === sender)?.client

    if (!client) {
        return res.status(422).json({
            status: false,
            message: `No se encontro la solicitud ${sender}`
        })
    }

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

//client.initialize()

server.listen(port, () => {
    console.log('App running on *:' + port)
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

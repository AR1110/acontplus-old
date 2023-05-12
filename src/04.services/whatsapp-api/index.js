const { Client, RemoteAuth, MessageMedia } = require('whatsapp-web.js')
const express = require('express')
const { Server } = require('socket.io')
const qrcode = require('qrcode')
const http = require('http')
const { phoneNumberFormatter } = require('./helpers/formatter')
const { body, validationResult } = require('express-validator')

const { MongoStore } = require('wwebjs-mongo')
const mongoose = require('mongoose')

const port = process.env.PORT || 8000
const app = express()
const server = http.createServer(app)

let store
mongoose.connect('mongodb://205.209.99.71:27017/').then(() => {
    store = new MongoStore({ mongoose: mongoose })
    console.log('Mongo is ready')
})

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
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

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Not just hello world'
    })
})

const save = async (id) => {
    await store.save({ session: 'RemoteAuth-' + id })
    console.log(store)
}
const get = async (id) => {
    let test = await store.extract({ session: 'RemoteAuth-' + id })
}

const exists = async (id) => {
    return await store.sessionExists({ session: 'RemoteAuth-' + id })
}

const logout = async (id) => {
    let response = await store.delete({ session: 'RemoteAuth-' + id })
}

const allSessionsObject = {}

let client
const createWhatsappSession = (id, socket) => {
    console.log('session creating: ' + id)
    client = new Client({
        puppeteer: {
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: false,
            args: [
                '--enable-features=NetworkService',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--shm-size=3gb', // this solves the issue
            ],
        },
        authStrategy: new RemoteAuth({
            clientId: id,
            store: store,
            backupSyncIntervalMs: 300000,
        })
    })

    client.on('qr', async (qr) => {
        //if (!await exists(id)) {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit('qr', { id: id, src: url });
            socket.emit('message', { id: id, text: 'QR Code recibido, por favor scanear!' });
        })
        // } else {
        //     socket.emit('ready', { id: id, text: 'Whatsapp esta listo!' })
        // }
    })

    client.on('authenticated', () => {
        socket.emit('authenticated', { id: id });
        socket.emit('message', { id: id, text: 'Whatsapp ha sido autenticado!' })
    })

    client.on('ready', async () => {
        allSessionsObject[id] = client
        // await store.save({ session: 'RemoteAuth-' + id })
        socket.emit('ready', { id: id, text: 'Whatsapp esta listo!' })
    })

    client.on('remote_session_saved', () => {
        console.log('saved')
        socket.emit('remote_session_saved', {
            id: id,
            text: "session guardada",
        })
    })
    client.initialize()
}

const getWhatsappSession = (id, socket) => {
    console.log('getting session: ' + id)
    client = new Client({
        puppeteer: {
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: false,
            args: [
                '--enable-features=NetworkService',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--shm-size=3gb', // this solves the issue
            ],
        },
        authStrategy: new RemoteAuth({
            clientId: id,
            store: store,
            backupSyncIntervalMs: 300000,
        })
    })

    client.on('ready', () => {
        allSessionsObject[id] = client
        console.log('ready getting: ' + id)
        socket.emit('ready', { id: id, text: "Whatsapp esta listo" })
    })

    client.on('qr', async (qr) => {
        // if (!await exists(id)) {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit('qr', { id: id, src: url });
            socket.emit('message', { id: id, text: 'QR Code recibido, por favor scanear!' });
        })
        // } else {
        //     allSessionsObject[id] = client
        //     socket.emit('ready', { id: id, text: "Whatsapp esta listo" })
        // }
    })

    client.initialize()
}

//Socket IO   
io.on('connection', (socket) => {

    console.log('Usuario conected', socket?.id)

    socket.on('disconnected', () => {
        console.log('user disconnected')
    })

    socket.on('connected', () => {
        console.log('Welcome to whatsapp api')
    })

    socket.on('create-session', (data) => {
        const { id } = data
        createWhatsappSession(id, socket)
    })

    socket.on('get-session', (data) => {
        const { id } = data
        getWhatsappSession(id, socket)
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
    if (!client) {
        return res.status(422).json({
            status: false,
            message: `No se encontro la solicitud ${sender}`
        })
    }
    const isRegisteredNumber = await checkRegisteredNumber(number)
    if (!isRegisteredNumber) {
        return res.status(422).json({
            status: false,
            message: 'El número no se encuentra registrado en whatsapp!'
        })
    }
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
app.post('/send-media', [
    body('number').notEmpty(),
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
    const caption = req.body.caption
    const fileName = req.body.fileName

    if (!client) {
        return res.status(422).json({
            status: false,
            message: `No se encontro la solicitud ${sender}`
        })
    }

    const media = MessageMedia.fromFilePath(`./files/${fileName}`)

    //const file = req.body.file
    //const media = new MessageMedia(file.mimetype, file.data.toString('base64'), file.name)
    // const fileUrl = req.body.file
    // let mimetype
    // const attachment = await axios.get(fileUrl, { responseType: 'arraybupper' }).then(response => {
    //     mimetype = response.headers['content-type']
    //     return response.data.toString('base64')
    // })
    //const media = new MessageMedia(mimetype, attachment, 'Media')

    const isRegisteredNumber = await checkRegisteredNumber(number)
    if (!isRegisteredNumber) {
        return res.status(422).json({
            status: false,
            message: 'El número no se encuentra registrado en whatsapp'
        })
    }

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

app.post('/logout', async (req, res) => {
    const sender = req.body.sender
    const client = allSessionsObject[sender]
    if (!client) {
        return res.status(422).json({
            status: false,
            message: `No se encontro la solicitud ${sender}`
        })
    }
    await logout(sender)
})

server.listen(port, () => {
    console.log('App running on *:' + port)
})
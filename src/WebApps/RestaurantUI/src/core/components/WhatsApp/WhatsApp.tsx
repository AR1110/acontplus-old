

import { forwardRef, useState } from 'react'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { CloseIcon, SendIcon } from '@/core/components/IconsMaterial';
import { green } from '@mui/material/colors';
import axios, { AxiosResponse } from 'axios';
import { MuiChipsInput } from 'mui-chips-input';
import { SnackbarUtility } from '@/core/utilities';
import { DOC_TYPE, DOC_TYPE_REPORT } from '@/core/constants';
import { SharedService } from '@/core/services';
import Swal from 'sweetalert2';

const URL_API_WHATSAPP = "https://api.green-api.com/";
const ID_INSTANCE = "7103845341"
const API_TOKEN_INSTANCE = "a59cd09ed1f449d8981586c7cf24526dfa9c8e6eedf1489b8c";
const URL_FILE_UPLOAD = `/waInstance${ID_INSTANCE}/sendFileByUpload/${API_TOKEN_INSTANCE}`;
const URL_SMS = `/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN_INSTANCE}`

const http = axios.create({
    baseURL: URL_API_WHATSAPP
})

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type OrderDocumentProps<T> = {
    data: T
    open: boolean,
    setOpen(): void
}

const buttonSx = {
    height: 60,
    bgcolor: green[500],
    '&:hover': {
        bgcolor: green[700],
    },
};


const phoneNumberFormatter = (number: string) => {
    let formatted = number.replace(/\D/g, '')
    if (formatted.startsWith('0')) {
        formatted = '593' + formatted.slice(1)
    }
    if (!formatted.endsWith('@c.us')) {
        formatted += '@c.us'
    }
    return formatted
}

/**
 * Component
 * @param props 
 * @returns 
 */
const WhatsApp = <T extends {
    telefono: string,
    documentoId: number,
    docType: string,
    codEstab: string
    telefonoEstablecimiento?: string
    nombreComercial?: string
}>(props: OrderDocumentProps<T>) => {

    const { data, open, setOpen } = props;
    const tempPhoneNumbers = data.telefono ? data.telefono.split(';') : [];

    const [phoneNumbers, setPhoneNumbers] = useState<string[]>(tempPhoneNumbers);
    const [showAlert, setShowAlert] = useState(true);
    const [loading, setLoading] = useState(false);

    const sendSMS = async (message: string) => { 
        const payload = {
            chatId: phoneNumberFormatter(phoneNumbers[0]!),
            message,
        }
        const response = await http.post(URL_SMS, JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response; 
    }

    const sendMedia = async (caption: string, file: File) => {
        try {
            const payload = new FormData();
            const formettedPhoneNumber = phoneNumberFormatter(phoneNumbers[0]!)
            payload.append("caption", caption)
            payload.append("chatId", formettedPhoneNumber)
            payload.append("file", file)

            let messageEstab;
            const messageInfo = 'Gracias por preferirnos, este comprobante se adjuntara a su correo electrónico!.';
            const messageFooter = `*_Por favor responda con un OK y agregue este número a sus contactos_*`;

            if (data.telefonoEstablecimiento) {
                messageEstab = `Si tiene alguna observación, favor comunicarse con la empresa *${data.nombreComercial}* al siguiente número: *${data.telefonoEstablecimiento}*`
            }

            setLoading(true)
            await Promise.all([
                sendSMS('ACONTPLUS adjunta el siguiente comprobante electrónico:'),
                await http.post(URL_FILE_UPLOAD, payload),
                await sendSMS(messageEstab ?? ''),
                await sendSMS(messageInfo),
                await sendSMS(messageFooter),
            ]).then(response => {
                console.log(response)
                Swal.fire({
                    icon: 'success',
                    text: 'Enviado correctamente',
                    timer: 2000
                })
            })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }

    }

    const contentFile = (responseFile: AxiosResponse) => {
        const responseHeaders = responseFile.headers;
        const fileName = responseHeaders["content-disposition"].split(";")[1].split("=")[1];
        const file = new File([responseFile.data], fileName, { type: responseHeaders["content-type"] })
        return {
            file,
            fileName
        }
    }


    const generateFile = async () => {
        try {
            const format = 'pdf';
            /**
             * Factura 
             */
            if (data.docType === DOC_TYPE.FV) {
                const dataParms = {
                    id: data.documentoId,
                    codEstab: data.codEstab,
                    codigo: DOC_TYPE_REPORT.FV,
                    format,
                }
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: DOC_TYPE_REPORT.FV,
                        codEstab: data.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify(dataParms)
                } 
                setLoading(true)
                const responseFile = await SharedService.downloadExternal(parameters, true);
                if (responseFile) {
                    const { file, fileName } = contentFile(responseFile);
                    await sendMedia(fileName, file)
                }
                setLoading(false)
            }

            /**
             * Nota de Entrega
             */
            if (data.docType === DOC_TYPE.NE) {
                setLoading(true)
                const parameters = {
                    hasService: true,
                    reportParams: JSON.stringify({
                        hasParams: true,
                        codigo: DOC_TYPE_REPORT.NE,
                        codEstab: data.codEstab,
                        format,
                        aditionalParams: []
                    }),
                    dataParams: JSON.stringify({
                        id: data.documentoId
                    })
                }

                const responseFile = await SharedService.downloadExternal(parameters, true);
                if (responseFile) {
                    const { file, fileName } = contentFile(responseFile);
                    await sendMedia(fileName, file)
                }
                setLoading(false)
            }

            //Orden de pedido
            if (data.docType === DOC_TYPE.OR) {
                setLoading(true)
                const responseFile = await SharedService.downloadReport(data.documentoId, true)
                if (responseFile) {
                    const { file, fileName } = contentFile(responseFile);
                    await sendMedia(fileName, file)
                }
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const sendToWhatsApp = async () => {
        try {
            if (phoneNumbers.length === 0) {
                SnackbarUtility.warning('Ingrese el número de celular')
                return
            }
            if (phoneNumbers.length === 2) {
                SnackbarUtility.warning(' Por favor, introduzca únicamente un número de celular.')
                return
            }
            if (phoneNumbers.some(phone => isNaN(Number(phone)))) {
                SnackbarUtility.warning('Ingrese número de celular válido!')
                return
            }

            if (phoneNumbers.some(phone => phone.length !== 10)) {
                SnackbarUtility.warning('El número de celular tiene que ser de diez digitos!')
                return
            }
            generateFile();
        } catch (error) {
            console.log(error)
        }
    }

    const closeModal = () => {
        setOpen();
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth="sm"
            TransitionComponent={Transition}
            keepMounted
            open={open}
        >
            <DialogTitle>
                {"Envío de notificación por WhatsApp"}
            </DialogTitle>
            <DialogContent dividers>
                {
                    phoneNumbers.length > 1 && showAlert && <Alert severity="warning"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setShowAlert(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Por favor, introduzca únicamente un número de teléfono.
                    </Alert>
                }
                <MuiChipsInput
                    fullWidth
                    label="Número de Teléfono"
                    variant="outlined"
                    placeholder='Ej: 0959889741'
                    helperText={phoneNumbers.length > 0 ? "Haga doble clic para editar un teléfono" : 'Ingrese el número de teléfono móvil y presione la tecla Enter.'}
                    value={phoneNumbers}
                    focused
                    disabled={loading}
                    onChange={(e) => {
                        setPhoneNumbers(e)
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Button
                            variant='contained'
                            sx={buttonSx}
                            size='large'
                            startIcon={<SendIcon />}
                            fullWidth
                            onClick={sendToWhatsApp}
                            disabled={loading}
                        >
                            Enviar
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button color='inherit' variant='outlined' sx={{
                            height: 60
                        }} size='large' fullWidth onClick={closeModal} disabled={loading}>
                            Cerrar
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}
export default WhatsApp

(function () {

    angular.module('acontPlusApp')
        .factory('formulario', formulario);

    formulario.$inject = ['$rootScope', 'mainService'];

    function formulario($rootScope, mS) {
        let formSvc = {};

        formSvc.dataDocumento = {};
        formSvc.opcionEmit = "";

        formSvc.loaderPost = $(".loadingoverlay");

        formSvc.emitEventData = function (item, opcionEmit) {
            this.opcionEmit = opcionEmit;
            this.dataDocumento = item;
            return
        };

        formSvc.sweetAlert = function (icon, message, title = null, timer = undefined, position = 'center') {
            Swal.fire({
                title: `<small>${title|| ''}</small>`,
                icon,
                html: `<small>${message}</small>`,
                timer,
                position,
                allowOutsideClick: false,
            });
        };

        formSvc.showLoaderForm = function (title = null, html = null, imageUrl = "/assets/images/ajax-loader.gif", position = "center", timer = null) {
            Swal.fire({
                title: `<small>${title || ''}</small>`,
                html: `<small>${html || ''}</small>`,
                imageHeight: '100px',
                imageUrl,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                position,
                timer
            });
        };

        formSvc.showLoaderPost = function (tipoRegistro) {
            Swal.fire({
                title: `<small>${tipoRegistro===1?'Guardando...':'Actualizando...'}</small>`,
                html: "<small>Espere por favor</small>",
                imageHeight: '100px',
                imageUrl: "/assets/images/ajax-loader.gif",
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        };

        formSvc.showLoaderAnular = function (item) {
            Swal.fire({
                title: `<small>Espere</small>`,
                html: '<small>Anulando...</small>',
                imageHeight: '150px',
                imageUrl: "/assets/images/loader-delete.gif",
                allowOutsideClick: false,
                showConfirmButton: false,
            });
        }

        formSvc.showLoaderSendEmail = function (item) {
            Swal.fire({
                title: `<small>Enviando...</small>`,
                html: "<small>Espere por favor</small>",
                imageHeight: '150px',
                imageUrl: "/assets/images/loader-send-email.gif",
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        };

        formSvc.showLoaderGetAuthorizate = function (item) {
            Swal.fire({
                title: `<small>Autorizando...</small>`,
                html: "<small>Espere por favor</small>",
                imageHeight: '150px',
                imageUrl: "/assets/images/loader-authorizate.gif",
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        };

        formSvc.showLoader = function (title, nombre = "Cargando...") {
            Swal.fire({
                title: `<small>${title}</small>`,
                html: `<small>${nombre}</small>`,
                imageHeight: '150px',
                imageUrl: "/assets/images/loader.gif",
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        };

        formSvc.getDownload = function (url, parameters) {
            mS.getFile('post', url, parameters).then(response => {

                Swal.close();
                let fileBlob = new Blob([response.data], {
                    type: response.data.type
                });

                let objectUrl = window.URL || window.webkitURL;
                let urlFile = objectUrl.createObjectURL(fileBlob);

                //    let height = (parseInt(window.innerHeight) / 2);
                //     let width = (parseInt(window.innerWidth) / 2);

                // Ajuste horizontal
                let x = parseInt((screen.width - 1200) / 2);
                // Ajustae vertical
                let y = parseInt((screen.height - 650) / 4);

                window.open(urlFile, "_blank",
                    `resizable=yes
                                 width=1200
                                 height=650
                                 screenY=${y}
                                 screenX=${x}`
                );

            })
        }

        formSvc.renderViewPartial = (urlView) => {
            return '/Home/RenderView?name=' + urlView;
        }


        formSvc.letterInline = (text) => {
            if (text) {
                return text.replace(/[\n\r]+/g, ' ')
            }
            return text;
        }

        formSvc.removeAccents = (str) => {
            // return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let inputText = str || ""

            inputText = inputText.normalize('NFD')
                .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
                .normalize();
            return inputText.replace(/[`~!#$%^&*¡Ç¨()|+\=?'´",<>\{\}\[\]\\\/]/gi, '').trim()

            //str.replace(/[`~!@#$%^&*¡Ç¨()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').trim()
        }

        formSvc.campo = function (campo) {
            if (campo === undefined || campo === null || campo === '') {
                return true;
            }
        }

        formSvc.obtenerTresLetras = function (campo) {
            if (campo.length >= 3 && campo !== undefined) {
                return campo.substring(0, 3).replace(/[^-A-Za-z0-9]+/g, '').toUpperCase();
            }
        }

        //Conversion Decimal
        formSvc.convertDecimal = function (value) {
            return value ? parseFloat(value).toFixed(5).toString().replace('.', ',') : null;
        }

        //Validacion de Numero de Cedula y RUC
        formSvc.validarIdentificacion = function (data) {
            let obj = {
                data,
                tipoValidacion: 'IDENTI'
            }
            return mS.getData('post', '/ValidarDatos/VerificarDatos', obj).then(response => response);
        }

        /* number: número a redondear
           max: máximo de dígitos fraccionables
        */
        formSvc.roundNumber = function (number, max = 1) {

            if (typeof number !== 'number' || isNaN(number)) {
                throw new TypeError('Número inválido: ' + number);
            }

            if (typeof max !== 'number' || isNaN(max)) {
                throw new TypeError('Máximo de dígitos inválido: ' + max);
            }

            // let fraccion = number.toString().split('.')[1];

            // if (!fraccion || fraccion.length <= 2) {
            //     return number;
            // }

            let factor = Math.pow(10, max);
            let tempNumber = number * factor;
            let roundedTempNumber = Math.round(tempNumber);
            return roundedTempNumber / factor;
            // return Math.trunc(number * Math.pow(10, max)) / Math.pow(10, max);

        }



        /**
         * 
         * @param {Date} fecha
         * @param {format} format "YYYY-MM-DD HH:mm:ss" 
         * @returns date
         */
        formSvc.formatDateTimeZone = (fecha, format = "DD-MM-YYYY h:mm A") => {
            const formatDateMoment = moment.tz(fecha, "America/Guayaquil")
            return formatDateMoment.format(format);
        }

        /**
         * 
         * @param {*} fecha 
         * @returns date
         */
        formSvc.formatDateMoment = function (dateString) {
            if (!this.isDateValid(dateString)) {
                throw new Error("La fecha es inválida");
            }
            return moment(dateString).format('YYYY-MM-DD HH:mm:ss A')
        }

        formSvc.isDateValid = function (dateString) {
            var date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        }






        formSvc.meses = function () {
            let meses = [{
                    nombre: 'Año',
                    numero: 0
                },
                {
                    nombre: 'Enero',
                    numero: 1
                }, {
                    nombre: 'Febrero',
                    numero: 2
                }, {
                    nombre: 'Marzo',
                    numero: 3
                }, {
                    nombre: 'Abril',
                    numero: 4
                }, {
                    nombre: 'Mayo',
                    numero: 5
                }, {
                    nombre: 'Junio',
                    numero: 6
                }, {
                    nombre: 'Julio',
                    numero: 7
                }, {
                    nombre: 'Agosto',
                    numero: 8
                }, {
                    nombre: 'Septiembre',
                    numero: 9
                }, {
                    nombre: 'Octubre',
                    numero: 10
                }, {
                    nombre: 'Noviembre',
                    numero: 11
                },
                {
                    nombre: 'Diciembre',
                    numero: 12
                }
            ];
            return meses;
        }

        //Valid Fornat Date
        formSvc.validarFormatoFecha = function (campo) {
            var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
            if ((campo.match(RegExPattern)) && (campo != '')) {
                return true;
            } else {
                return false;
            }
        };

        //Verificar si la fecha cumple con el formato de calendario 
        formSvc.existeFecha = function (fecha) {
            let fechaf = fecha.split("/");
            let day = fechaf[0];
            let month = fechaf[1];
            let year = fechaf[2];
            let date = new Date(year, month, '0');
            if ((day - 0) > (date.getDate() - 0)) {
                return false;
            }
            return true;
        }


        formSvc.getFechaEscrita = function (fecha) {
            let mes = this.meses();
            let diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

            return diasSemana[fecha.getDay()] + ", " + fecha.getDate() + " de " + mes[fecha.getMonth() + 1].nombre + " de " + fecha.getFullYear();
        };

        formSvc.getFechaEscritaCompleta = function (fecha) {
            if (!this.campo(fecha)) {
                return fecha.toLocaleDateString("es-ES", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

            }
        }

        formSvc.getFechaVencimiento = function (fechaEmision, dia) {
            let fechaVencimiento = new Date(fechaEmision);
            fechaVencimiento.setDate(fechaVencimiento.getDate() + dia);
            return fechaVencimiento;
        };


        /**
         * 
         * @param {Date} fecha 
         * @returns fecha
         */
        formSvc.formatDate = function (fecha) {
            let _getFecha = new Date(fecha);
            _getFecha.setMinutes(_getFecha.getMinutes() + _getFecha.getTimezoneOffset());
            return _getFecha;
        }


        formSvc.getTagInputAsList = function (item) {
            return item.split(';').map(r => {
                return {
                    text: r
                }
            });
        }

        formSvc.getInputTagAsJoin = function (item) {
            return item.map(r => r.text).join(';');
        }

        formSvc.getInputTagAsSplit = function (item) {
            return item.split(';').map(r => {
                return {
                    text: r
                }
            });
        }


        //Get fecha Inicio/Fin en la Busqueda Avanzada del Tipo Documentos 
        formSvc.getFechaInicioFinFilter = function (mes) {
            const fecha = new Date();
            let fechaInicio, fechaFin, anio = fecha.getFullYear();

            //Si es opcion Todo el Año         
            if (mes == 0) {
                fechaInicio = new Date(anio, 0, 1);
                fechaFin = new Date(anio, 11, 31);
            } else {
                fechaInicio = new Date(anio, mes - 1, 1);
                fechaFin = new Date(anio, mes - 1, this.diasEnUnMes(mes, anio));
            }
            return {
                fechaInicio,
                fechaFin
            }
        }

        //Obtener dias de cada Mes
        formSvc.diasEnUnMes = function (mes, anio) {
            return new Date(anio, mes, 0).getDate();
        }

        return formSvc;


    }




})(window.angular)
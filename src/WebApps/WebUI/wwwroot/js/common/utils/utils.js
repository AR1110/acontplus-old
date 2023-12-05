(function () {

    angular.module('acontPlusApp')
        .factory('pricingUtils', function () {
            let service = {}

            service.calcularPrecioConIva = function (precioVenta, porcentaje) {
                try {
                    let resultadoPorcentaje = Number(porcentaje) / 100;
                    let result = Number(precioVenta) * Number(resultadoPorcentaje)
                    let precioConIva = result + Number(precioVenta);
                    return precioConIva;

                } catch (error) {
                    console.log('pricingUtils -> CALCULO PRECIO CON IVA', error);
                }
            }

            service.calcularPrecioVenta = function (precioConIva, porcentaje) {
                try {
                    let resultadoPorcentaje = Number(porcentaje) / 100 + 1;
                    let precioVenta = Number(precioConIva) / Number(resultadoPorcentaje);
                    return precioVenta;
                } catch (error) {
                    console.log('pricingUtils -> CALCULO PRECIO Unitario', error);
                }
            }
            //cuando edito porcentaje utilidad
            service.calcularPorcentajeUtilidad = function (precioCosto, porcentajeUtilidad) {
                try {
                    let resultPorcentajeUtilidad = Number(porcentajeUtilidad) / 100;
                    let result = Number(precioCosto) * resultPorcentajeUtilidad;
                    let precioVenta = Number(precioCosto) + result;
                    return precioVenta

                } catch (error) {
                    console.log('pricingUtils -> calcularPorcentajeUtilidad', error);
                }

            }


            //cuando cambio precio venta
            //Get Campo Porcentaje Utilidad
            service.campoPorcentajeUtilidad = function (precioCosto, precioVenta) {
                try {
                    let porcentajeUtilidad = (Number(precioVenta) / Number(precioCosto) * 100) - 100;
                    return porcentajeUtilidad;

                } catch (error) {
                    console.log('pricingUtils -> campoPorcentajeUtilidad', error);
                }
            }


            //EN VENTA 
            service.getPrecioIvaConDescuento = function (precioConIva, porcentajeDescuento) {
                try {
                    let porcentaje = Number(porcentajeDescuento) / 100;
                    let descuento = Number(porcentaje) * Number(precioConIva);
                    let precioIvaConDescuento = Number(precioConIva) - Number(descuento);
                    return precioIvaConDescuento;
                } catch (error) {
                    console.log('pricingUtils -> getPrecioIvaConDescuento', error);
                }

            }

            service.getValorDescuento = function (precioUnitario, porcentajeDescuento) {
                try {
                    let porcentaje = Number(porcentajeDescuento) / 100;
                    let descuento = Number(porcentaje) * Number(precioUnitario);
                    return descuento;
                } catch (error) {
                    console.log('pricingUtils -> getValorDescuento', error);
                }
            }

            service.getPorcentajeDescuento = function (precioUnitario, valorDescuento) {
                try {
                    let porcentaje = valorDescuento / precioUnitario;
                    let porcentajeDescuento = porcentaje * 100;
                    return porcentajeDescuento;

                } catch (error) {
                    console.log('pricingUtils -> getPorcentajeDescuento', error);
                }
            }

            service.calculateTaxValue = function (price, percentage) {
                try {
                    const tax = (price * percentage) / 100;
                    return tax;
                } catch (error) {
                    console.log('pricingUtils -> ERROR CALCULATE TAX VALUE', error);
                    return -1;
                }
            };



            return service;

        })

    angular.module('acontPlusApp')
        .factory('formulario', formulario);

    formulario.$inject = ['pricingUtils'];

    function formulario(pricingUtils) {
        let formSvc = {};

        formSvc.dataDocumento = {};
        formSvc.opcionEmit = "";

        formSvc.loaderPost = $(".loadingoverlay");

        formSvc.sweetAlert = function (icon, message, title = null, timer = undefined, position = 'center') {
            Swal.fire({
                title: `<small>${title || ''}</small>`,
                icon,
                html: `<small>${message}</small>`,
                timer,
                position,
                allowOutsideClick: false,
            });
        }

        formSvc.showLoaderSendEmail = function () {
            Swal.fire({
                title: `<small>Enviando...</small>`,
                html: "<small>Espere por favor</small>",
                imageHeight: '150px',
                imageUrl: "/assets/images/loader-send-email.gif",
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            });
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
        //Eliminar mas adelante
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
            return moment(dateString).tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss A')
        }

        formSvc.isDateValid = function (dateString) {
            if (dateString === null) {
                return false; // Valor nulo no es válido
            }
            let date = new Date(dateString);
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

        formSvc.sumarDiasAFecha = function (fecha, dia) {
            let fechaVencimiento = new Date(fecha);
            fechaVencimiento.setDate(fechaVencimiento.getDate() + dia);
            return {
                fechaVencimiento,
                fechaEmisionEscrita: formSvc.getFechaEscrita(fecha),
                fechaVencimientoEscrita: formSvc.getFechaEscrita(fechaVencimiento)
            }
        }


        formSvc.formatDateShort = function (date) {
            const formatedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return formatedDate;
        }

        formSvc.getDate = function (fecha) {
            if (!fecha) new Error('Parametro fecha requerido: ' + fecha)
            let newDate = new Date(fecha)

            let resulDate = newDate;

            return resulDate;
        }

        formSvc.setHoursToDate = function (fecha) {
            let fechaActual = new Date();

            // Comprobar si ambas fechas son la fecha actual
            if (formSvc.formatDateShort(fechaActual) === formSvc.formatDateShort(fecha)) {
                fecha.setHours(fechaActual.getHours());
                fecha.setMinutes(fechaActual.getMinutes());
                fecha.setSeconds(fechaActual.getSeconds());
            }
            return fecha;

        }


        /**
         * 
         * @param {Date} fecha 
         * @returns fecha
         */
        formSvc.formatDate = function (fecha) {
            var date = moment.tz(fecha, 'America/Guayaquil');
            var htmlDateTime = date.format('YYYY-MM-DDTHH:mm:ss');
            // let _getFecha = new Date(fecha);
            // _getFecha.setMinutes(_getFecha.getMinutes() + _getFecha.getTimezoneOffset());
            return new Date(htmlDateTime);
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

        formSvc.isValidDate = (dateString) => {
            const date = new Date(dateString);

            // Comprobar si la fecha es válida y si el año tiene cuatro dígitos
            return (
                Object.prototype.toString.call(date) === '[object Date]' &&
                !isNaN(date) &&
                date.getFullYear().toString().length === 4
            );
        };

        formSvc.isEmail = function (value) {
            return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(value);
        };


        formSvc.validarLongitudNroIdentificacion = function (numero) {
            return numero.length === 10 || numero.length === 13;
        }

        formSvc.isNumer = function (numero) {
            return !isNaN(numero);
        }

        formSvc.contieneSecuencia001 = function (numero) {
            return numero.includes("001");
        }


        formSvc.validAndFormatedRangeSequential = function (cadena) {
            // Expresión regular que verifica si la cadena contiene solo números.
            var formatoValido = /^\d+$/;

            if (formatoValido.test(cadena)) {
                // La cadena contiene solo números, así que la formateamos a "xxx-xxx".
                cadena = `${cadena}-${cadena}`
            }

            // Luego, validamos que la cadena siga el formato "xxx-xxx".
            var formatoValidoFinal = /^\d+-\d+$/;
            return formatoValidoFinal.test(cadena) ? cadena : null;
        }

        formSvc.getDataUserRol = function () {
            let userData = JSON.parse(localStorage.getItem("userData"));
            let { permissions } = userData;
            let permisoVentaTemp = permissions.find(pp => pp.codModule === "V");
            let objPermissionVenta = JSON.parse(permisoVentaTemp.permission);

            let { comprobante, detail, additional } = objPermissionVenta;
            let permisoEditarDoc = {
                requiereClave: additional && additional.requestAuthorizationKey.requestKey
            }
            const permisoVenta = {
                comprobante: {
                    descuento: comprobante && comprobante.descuento.update,
                    fechaEmision: comprobante && comprobante.fechaEmision.update,
                    porcentajeDescuento: comprobante && comprobante.porcentajeDescuento.update,
                    tarifa: comprobante && comprobante.tarifa.update,
                    tiempoCredito: comprobante && comprobante.tiempoCredito.update
                },
                detalle: {
                    descuento: detail && detail.descuento.update,
                    medida: detail && detail.medida.update,
                    porcentajeDescuento: detail && detail.porcentajeDescuento.update,
                    precioConIva: detail && detail.precioConIva.update,
                    precioUnitario: detail && detail.precioUnitario.update,
                    tarifa: detail && detail.tarifa.update,
                    tipoIva: detail && detail.tipoIva.update
                }
            }

            return {
                permisoVenta,
                permisoEditarDoc
            }
        }

        formSvc.validateDateIsAfterCurrentDate = function (fecha) {
            const zonaHorariaEcuador = 'America/Guayaquil'; // Utilizamos la zona horaria de la Costa del Ecuador (ECT)

            const fechaActual = moment().tz(zonaHorariaEcuador); // Obtener la fecha actual en la zona horaria de Ecuador
            const fechaIngresada = moment.tz(fecha, 'YYYY-MM-DD', zonaHorariaEcuador); // Utilizar la zona horaria de Ecuador para la fecha ingresada

            if (fechaIngresada.isValid() && fechaIngresada.isAfter(fechaActual, 'day')) {
                return true;
            }
            return false;
        }


        /**
         * 
         * @param {*} estabs 
         */
        formSvc.groupingEstab = function (obj) {
            const tempEstabsAndPtosEmision = obj.estabs;
            const tempEstabsAndBodegas = obj.bodegas;
            const isGroupBodega = obj.isGroupBodega;
            const tempEstabs = tempEstabsAndPtosEmision.reduce((acc, item) => {
                const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

                if (!existingItem) {
                    acc.push({
                        idEstablecimiento: item.idEstablecimiento,
                        nombreComercial: item.nombreComercial,
                        codEstab: item.codEstab,
                        defaultEstab: item.defaultEstab,
                        puntosEmision: [{
                            codEstab: item.codEstab,
                            idPuntoEmision: item.idPuntoEmision,
                            ptoEmi: item.ptoEmi,
                            defaultPtoEmi: item.defaultPtoEmi
                        }]
                    });
                } else {
                    existingItem.puntosEmision.push({
                        codEstab: item.codEstab,
                        idPuntoEmision: item.idPuntoEmision,
                        ptoEmi: item.ptoEmi,
                        defaultPtoEmi: item.defaultPtoEmi
                    });
                }
                return acc;
            }, []);

            if (isGroupBodega) {
                let estabs = tempEstabs.map(estab => ({
                    ...estab,
                    bodegas: tempEstabsAndBodegas.filter(bodega => (bodega.idEstablecimiento === estab.idEstablecimiento))
                        .map(bodega => ({
                            codEstab: estab.codEstab,
                            idBodega: bodega.idBodega,
                            bodega: bodega.bodega,
                            descripcion: bodega.bodega,
                            defaultBodega: bodega.defaultBodega,
                        }))
                }))
                return estabs;
            }
            return tempEstabs;

        }

        formSvc.groupEstabBodega = function (tempEstabBodega) {
            const estabs = tempEstabBodega.reduce((acc, item) => {
                const existingItem = acc.find((el) => el.idEstablecimiento === item.idEstablecimiento && el.codEstab === item.codEstab);

                if (!existingItem) {
                    acc.push({
                        idEstablecimiento: item.idEstablecimiento,
                        nombreComercial: item.nombreComercial,
                        codEstab: item.codEstab,
                        defaultEstab: item.defaultEstab,
                        bodegas: [{
                            idBodega: item.idBodega,
                            descripcion: item.bodega,
                            defaultBodega: item.defaultBodega
                        }]
                    });
                } else {
                    existingItem.bodegas.push({
                        idBodega: item.idBodega,
                        descripcion: item.bodega,
                        defaultBodega: item.defaultBodega
                    });
                }
                return acc;
            }, []);

            return estabs;

        }

        formSvc.isValidField = function (field) {
            let invalid = ["", null, undefined, 0].includes(field)
            if (invalid) {
                return null;
            }
            return field;
        }

        /**
         * 
         * @param {*} items  (items de factura, nota entrega)
         * @returns 
         */
        formSvc.impuestoTarifaMapperTo = function (items) {
            let impuestosTarifa = items.map(item => {
                const { taxBase, taxValue } = formSvc.getTaxBaseAndTaxValue(item);
                const discount = item.cantidad * item.valorDescuento;
                const obj = {
                    taxId: item.idImpuesto,
                    taxPercentId: item.idTipoIva,
                    percent: item.tarifa,
                    taxBase: formSvc.roundNumber(taxBase, 5),
                    taxValue: formSvc.roundNumber(taxValue, 5),
                    discount: formSvc.roundNumber(discount, 5)
                }
                return obj;
            })
            return impuestosTarifa;
        }

        formSvc.getTaxBaseAndTaxValue = function (item) {
            const taxBase = ((item.cantidad * item.precioUnitario)) - item.valorDescuento;
            const taxValue = pricingUtils.calculateTaxValue(taxBase, item.tarifa);
            return {
                taxBase: formSvc.roundNumber(taxBase, 5),
                taxValue: formSvc.roundNumber(taxValue, 5),
            };
        }

        return formSvc;
    }


})(window.angular)
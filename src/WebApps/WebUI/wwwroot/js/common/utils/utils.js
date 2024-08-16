//@ts-check
(function () {

    function instanceDecimal(num, max = 0) {
        if (max > 0) {
            return new Decimal(num).toDecimalPlaces(max).toNumber()
        }
        return new Decimal(num);
    }

    /**
     * 
     * @param {*} num1 
     * @param {*} num2 
     * @param {*} max 
     * @returns 
     */
    function decPlus(num1, num2, max = 0) {
        let dec = instanceDecimal(num1).plus(num2)
        if (max > 0) {
            return dec.toDecimalPlaces(max).toNumber()
        }

        return dec;

    }

    /**
     * 
     * @param {*} num1 
     * @param {*} num2 
     * @param {*} max 
     * @returns 
     */

    function decMinus(num1, num2, max = 0) {
        let dec = instanceDecimal(num1).minus(num2)
        if (max > 0) {
            return dec.toDecimalPlaces(max).toNumber()
        }

        return dec;

    }


    function decMul(num1, num2, max = 0) {
        let dec = instanceDecimal(num1).mul(num2)
        if (max > 0) {
            return dec.toDecimalPlaces(max).toNumber()
        }

        return dec;

    }


    function decDiv(num1, num2, max = 0) {
        let dec = instanceDecimal(num1).div(num2)
        if (max > 0) {
            return dec.toDecimalPlaces(max).toNumber()
        }

        return dec;
    }



    angular.module('acontPlusApp')
        .factory('pricingUtils', function () {
            let service = {}
            let precisionMaxima = 5;

            service.calcularPrecioConIva = function (precioVenta, porcentaje) {
                try {
                    let porcentajeDecimal = decDiv(Number(porcentaje), 100, precisionMaxima)
                    let montoImpuesto = decMul(Number(precioVenta), Number(porcentajeDecimal), precisionMaxima);
                    let precioTotal = decPlus(montoImpuesto, Number(precioVenta), precisionMaxima);
                    return precioTotal;

                } catch (error) {
                    console.log('pricingUtils -> CALCULO PRECIO CON IVA', error);
                }
            }



            /**
             * Funtion old 
             * @param {*} precioTotalConImpuesto 
             * @param {*} porcentajeImpuesto 
             * @returns 
             */
            service.calcularPrecioVenta = function (precioTotalConImpuesto, porcentajeImpuesto) {
                try {
                    let factorImpuesto = decDiv(Number(porcentajeImpuesto), 100, precisionMaxima);
                    let factorTotal = decPlus(factorImpuesto, 1, precisionMaxima);
                    let precioBase = decDiv(Number(precioTotalConImpuesto), factorTotal, precisionMaxima);
                    return precioBase;
                } catch (error) {
                    console.log(`Error al calcular el precio base: precioTotalConImpuesto=${precioTotalConImpuesto}, porcentajeImpuesto=${porcentajeImpuesto}`, error);
                    return null;
                }
            }


            /**
             * Function new 
             * @param {*} precioTotalConImpuesto 
             * @param {*} porcentajeImpuesto 
             * @returns 
             */
            service.calcularPrecioBase = function (precioTotalConImpuesto, porcentajeImpuesto) {
                try {
                    let factorImpuesto = decDiv(Number(porcentajeImpuesto), 100, precisionMaxima);
                    let factorTotal = decPlus(factorImpuesto, 1, precisionMaxima);
                    let precioBase = decDiv(Number(precioTotalConImpuesto), factorTotal, precisionMaxima);
                    return precioBase;
                } catch (error) {
                    console.log(`Error al calcular el precio base: precioTotalConImpuesto=${precioTotalConImpuesto}, porcentajeImpuesto=${porcentajeImpuesto}`, error);
                    return null;
                }
            }




            //cuando edito porcentaje utilidad
            service.calcularPorcentajeUtilidad = function (precioCosto, porcentajeUtilidad) {

                try {
                    let factorUtilidad = decDiv(Number(porcentajeUtilidad), 100, precisionMaxima);
                    let montoUtilidad = decMul(Number(precioCosto), factorUtilidad, precisionMaxima)
                    let precioVenta = decPlus(Number(precioCosto), montoUtilidad, precisionMaxima);
                    return precioVenta;
                } catch (error) {
                    console.log(`Error al calcular el precio de venta: precioCosto=${precioCosto}, porcentajeUtilidad=${porcentajeUtilidad}`, error);
                    return null;
                }

            }


            //cuando cambio precio venta
            //Get Campo Porcentaje Utilidad
            service.campoPorcentajeUtilidad = function (precioCosto, precioVenta) {
                try {
                    // Primer paso: Dividir el precio de venta por el precio de costo
                    let resultadoDivision = decDiv(Number(precioVenta), Number(precioCosto), precisionMaxima)

                    // Segundo paso: Multiplicar el resultado de la división por 100
                    let porcentajeBruto = decMul(resultadoDivision, 100, precisionMaxima);

                    // Tercer paso: Restar 100 para obtener el porcentaje de utilidad
                    let porcentajeUtilidad = decMinus(porcentajeBruto, 100, precisionMaxima);

                    return porcentajeUtilidad;
                } catch (error) {
                    console.log(`Error al calcular el porcentaje de utilidad: precioCosto=${precioCosto}, precioVenta=${precioVenta}`, error);
                    return null;
                }
            }


            //EN VENTA 
            service.getPrecioIvaConDescuento = function (precioConIva, porcentajeDescuento) {
                try {
                    // Convertir el porcentaje de descuento a decimal
                    let porcentajeDecimal = decDiv(Number(porcentajeDescuento), 100, precisionMaxima);

                    // Calcular el monto del descuento
                    let montoDescuento = decMul(Number(precioConIva), porcentajeDecimal, precisionMaxima);

                    // Calcular el precio con IVA después de aplicar el descuento
                    let precioConDescuento = decMinus(Number(precioConIva), montoDescuento, precisionMaxima);

                    return precioConDescuento;
                } catch (error) {
                    console.log(`Error al calcular el precio con descuento: precioConIva=${precioConIva}, porcentajeDescuento=${porcentajeDescuento}`, error);
                    return null;
                }

            }

            service.getValorDescuento = function (precioUnitario, porcentajeDescuento) {
                try {
                    // Convertir el porcentaje de descuento a decimal
                    let porcentajeDecimal = decDiv(Number(porcentajeDescuento), 100, precisionMaxima);

                    // Calcular el monto del descuento
                    let montoDescuento = decMul(Number(precioUnitario), porcentajeDecimal, precisionMaxima)

                    return montoDescuento;
                } catch (error) {
                    console.log(`Error al calcular el monto del descuento: precioUnitario=${precioUnitario}, porcentajeDescuento=${porcentajeDescuento}`, error);
                    return null;
                }
            }

            
            /**
             *Función para calcular el valor total del descuento 
             * @param {*} cantidad 
             * @param {*} valorDescuento 
             * @returns 
             */
            service.calcularValorTotalDescuento = function(cantidad, valorDescuento) {
                // Calcular el valor total del descuento
                let valorTotalDescuento = decMul(cantidad , valorDescuento, precisionMaxima);
                
                return valorTotalDescuento;
            }

            // Función para calcular el total antes de aplicar descuentos
            service.calcularTotalAntesDescuento = function(precioUnitario, cantidad) {
                let valorTotal = decMul(precioUnitario, cantidad, precisionMaxima);
                return valorTotal;
            }



            service.getPorcentajeDescuento = function (precioUnitario, montoDescuento) {
                try {
                    // Calcular el porcentaje de descuento en base al monto del descuento y el precio unitario
                    let porcentajeDecimal = decDiv(Number(montoDescuento), Number(precioUnitario), precisionMaxima);
                    let porcentajeDescuento = decMul(porcentajeDecimal, 100, precisionMaxima);

                    return porcentajeDescuento;
                } catch (error) {
                    console.log(`Error al calcular el porcentaje de descuento: precioUnitario=${precioUnitario}, montoDescuento=${montoDescuento}`, error);
                    return null;
                }
            }

            service.calculateTaxValue = function (precio, porcentajeImpuesto) {
                try {
                    // Paso 1: Convertir el porcentaje a un valor decimal
                    let porcentajeDecimal = decDiv(Number(porcentajeImpuesto), 100, precisionMaxima)

                    // Paso 2: Calcular el valor del impuesto
                    let valorImpuesto = decMul(Number(precio), porcentajeDecimal, precisionMaxima);

                    return valorImpuesto;
                } catch (error) {
                    console.log(`Error al calcular el valor del impuesto: precio=${precio}, porcentajeImpuesto=${porcentajeImpuesto}`, error);
                    return null;  // Devuelve null en lugar de -1 para una mejor gestión de errores
                }
            };

            /**
             * Calcular el subtotal sin impuestos
             * @param {*} precioUnitario 
             * @param {*} cantidad 
             * @param {*} descuento 
             * @returns 
             */
            service.calcularSubtotalSinImpuesto = function(precioUnitario, cantidad, descuento) {
                let totalAntesDescuento = service.calcularTotalAntesDescuento(precioUnitario, cantidad);
                let subtotalSinImpuesto = decMinus(totalAntesDescuento, descuento, precisionMaxima);
                return subtotalSinImpuesto;
            }

            // Calcular el total con impuesto
            service.calcularTotalConImpuesto = function(subtotalSinImpuesto, valorImpuesto) {
                try {
                    // Sumar el subtotal sin impuestos y el valor del impuesto
                    let totalConImpuesto = decPlus(subtotalSinImpuesto, valorImpuesto, precisionMaxima);
                    return totalConImpuesto;
                } catch (error) {
                    console.error('Error en calcularTotalConImpuesto:', error);
                    return null; // O algún valor por defecto si es necesario
                }
            }




            return service;

        })

    angular.module('acontPlusApp')
        .factory('formulario', formulario);

    formulario.$inject = ['pricingUtils', 'uuid2'];

    function formulario(pricingUtils, uuid2) {
        let formSvc = {};

        formSvc.dataDocumento = {};
        formSvc.opcionEmit = "";


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
         * @param {*} dateString 
         * @returns 
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
            if (!formSvc.isDateValid(fecha)) return '';

            let mes = this.meses();
            let diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

            return diasSemana[fecha.getDay()] + ", " + fecha.getDate() + " de " + mes[fecha.getMonth() + 1].nombre + " de " + fecha.getFullYear();
        };

        formSvc.getFechaEscritaCompleta = function (fecha) {
            if (!fecha) {
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

        formSvc.parseDate = function (dateString) {
            const [day, month, year] = dateString.split('/');
            return new Date(year, month - 1, day);
        }

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
            let permisoCajaTemp = permissions.find(pp => pp.codModule === "C");
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


            let permisoCajaParse = permisoCajaTemp && JSON.parse(permisoCajaTemp.permission) || {}

            let permisoCaja = {
                cerrarCaja: permisoCajaParse && permisoCajaParse.cerrarCaja && permisoCajaParse.cerrarCaja.cerrar || false,
                enterKey: permisoCajaParse && permisoCajaParse.enterKey && permisoCajaParse.enterKey.isRequerid || false,
                reporteMovimientoCaja: permisoCajaParse && permisoCajaParse.reporteMovimientoCaja.view || false,
                verOtrasCajas: permisoCajaParse && permisoCajaParse.verOtrasCajas && permisoCajaParse.verOtrasCajas.view || false
            }
            return {
                permisoVenta,
                permisoEditarDoc,
                permisoCaja
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
         * @param {*} obj 
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

        formSvc.getValidId = (id) => {
            let valid = id > 0 ? id : null;
            return valid;
        }

        /**
         * 
         * @param {*} items  (items de factura, nota entrega)
         * @returns 
         */
        formSvc.impuestoTarifaMapperTo = function (items) {
            let impuestosTarifa = items.map(item => {
                const obj = {
                    taxId: item.idImpuesto,
                    taxPercentId: item.idTipoIva,
                    percent: item.tarifa,
                    taxBase: formSvc.roundNumber(item.precioTotalSinImpuesto, 5),
                    taxValue: formSvc.roundNumber(item.valorImpuesto, 5),
                    discount: formSvc.roundNumber(item.valorDescuento, 5)
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

        /**
         * 
         * @param {*} fecha1 
         * @param {*} fecha2 
         * @returns 
         */
        formSvc.sonFechasIguales = function (fecha1, fecha2) {
            // Verificar si alguna fecha es null
            if (!fecha1 || !fecha2) {
                return {
                    esMismaFecha: false,
                    esMismoDia: false,
                    esMismoMes: false,
                    esMismoAnio: false
                };
            }

            // Comparar solo el día, mes y año
            const esMismaFecha = fecha1.getDate() === fecha2.getDate() &&
                fecha1.getMonth() === fecha2.getMonth() &&
                fecha1.getFullYear() === fecha2.getFullYear();

            return {
                esMismaFecha,
                esMismoDia: fecha1.getDate() === fecha2.getDate(),
                esMismoMes: fecha1.getMonth() === fecha2.getMonth(),
                esMismoAnio: fecha1.getFullYear() === fecha2.getFullYear()
            };
        };


        formSvc.ajustarFechaEmision = function (isActualizacion, fechaEmision, fechaEmisionDocCreado) {
            let fechaEmisionModificada = new Date(fechaEmision);
            let fechaActual = new Date();

            let dataFechaAnterior = formSvc.sonFechasIguales(fechaEmisionModificada, fechaEmisionDocCreado);

            if (isActualizacion && dataFechaAnterior.esMismaFecha) {
                return fechaEmisionDocCreado;
            }

            let dataFechaActual = formSvc.sonFechasIguales(fechaEmisionModificada, fechaActual);

            if ((isActualizacion || !isActualizacion) && dataFechaActual.esMismaFecha) {
                fechaEmisionModificada.setHours(
                    fechaActual.getHours(),
                    fechaActual.getMinutes(),
                    fechaActual.getSeconds(),
                    fechaActual.getMilliseconds()
                );
            } else {
                fechaEmisionModificada.setHours(0, 0, 0, 0);
            }

            return fechaEmisionModificada;
        }

        formSvc.ajustarFechaEmisionConsolidacion = function (isActualizacion, fechaEmision, fechaEmisionDocCreado) {
            let fechaEmisionModificada = new Date(fechaEmision);
            let fechaActual = new Date();

            let dataFechaAnterior = formSvc.sonFechasIguales(fechaEmisionModificada, fechaEmisionDocCreado);

            if (isActualizacion && dataFechaAnterior.esMismaFecha) {
                return fechaEmisionDocCreado;
            }

            let dataFechaActual = formSvc.sonFechasIguales(fechaEmisionModificada, fechaActual);

            if ((isActualizacion || !isActualizacion) && dataFechaActual.esMismaFecha) {
                fechaEmisionModificada.setHours(
                    fechaActual.getHours(),
                    fechaActual.getMinutes(),
                    fechaActual.getSeconds(),
                    fechaActual.getMilliseconds()
                );
            } else {
                fechaEmisionModificada.setHours(23, 59, 0, 0);
            }

            return fechaEmisionModificada;
        }


        /**
         * 
         * @param {*} medidasFraccionado 
         * @param {*} medidasPrincipal 
         * @returns 
         */

        formSvc.processAndSortMeasures = function (medidasPrincipal, medidasFraccionado) {
            let medidasPrincipalTemp = [];
            let medidasFraccionadoTemp = [];

            // Medida principal con las tarifas
            if (!Array.isArray(medidasPrincipal)) {
                medidasPrincipalTemp = JSON.parse(medidasPrincipal) || [];
            } else {
                medidasPrincipalTemp = medidasPrincipal;
            }

            // Medidas del artículo fraccionado del principal
            if (!Array.isArray(medidasFraccionado)) {
                medidasFraccionadoTemp = JSON.parse(medidasFraccionado) || [];
            } else {
                medidasFraccionadoTemp = medidasFraccionado;
            }
            const medidasPrincipalMapper = medidasPrincipalTemp.map(medidaPrincipal => ({
                ...medidaPrincipal,
                precioCosto: medidaPrincipal.precioCosto || 0,
                precioCostoFraccionado: medidaPrincipal.precioCostoFraccionado || 0,
                precioUnitario: medidaPrincipal.precioUnitario || 0,
                tipo: 'PRINCIPAL'
            }))
            const medidasFraccionadoMapper = medidasFraccionadoTemp.map(medidaFraccionado => ({
                ...medidaFraccionado,
                precioCosto: medidaFraccionado.precioCosto || 0,
                precioCostoFraccionado: medidaFraccionado.precioCostoFraccionado || 0,
                precioUnitario: medidaFraccionado.precioUnitario || 0,
                tipo: 'FRACCIONADO'
            }))

            /**
             * Combinar los dos arrays de medidas en uno solo
             *
             * Parámetros:
             *  - mergedMedidasArray: El array resultante de la combinación de los dos arrays de medidas
             */
            // Combinar los dos arrays de medidas en uno solo

            const mergedMedidasArray = [...medidasFraccionadoMapper, ...medidasPrincipalMapper];

            /**
             * Ordenar el array de medidas en función de la propiedad "orden" y
             * establecer la propiedad "defaultMedida" en falso para todos los elementos
             *
             * Parámetros:
             *  - orderMedidaArray: El array de medidas ordenado
             */
            let orderMedidaArray = mergedMedidasArray.sort((a, b) => a.orden - b.orden).map(medida => ({
                ...medida,
                defaultMedida: false
            }));
            orderMedidaArray = orderMedidaArray || []

            // Establecer la propiedad "defaultMedida" en true para el primer elemento del array (el que tiene el orden más bajo)
            if (orderMedidaArray[0]) {
                orderMedidaArray[0].defaultMedida = true;
            }


            // Crear un nuevo array de medidas con un formato específico
            let medidas = orderMedidaArray.map(item => ({
                idMedida: item.idMedida,
                conversion: item.conversion || 1,
                descripcion: item.descripcion || item.medida,
                defaultMedida: item.defaultMedida,
                tipo: item.tipo,
                precioCosto: item.precioCosto,
                precioCostoFraccionado: item.precioCostoFraccionado,
                precioUnitario: item.precioUnitario,
                tarifas: (typeof item.tarifas === "string" ? JSON.parse(item.tarifas) : item.tarifas) || []
            }))

            return medidas;
        }



        // Función para calcular detalles de cuotas basadas en términos de crédito
        formSvc.calcularCuotas = function (obj) {
            // Desestructuración de propiedades del objeto para mayor legibilidad
            const { fechaEmision, tiemposCredito, idTiempoCredito, montoTotal } = obj;

            // Encontrar datos de tiempo de crédito según el id proporcionado
            const dataTiempoCredito = tiemposCredito.find(t => t.idTiempoCredito === idTiempoCredito);

            // Manejo del caso en que no se encuentran datos de tiempo de crédito
            if (!dataTiempoCredito) {
                console.error("Tiempo de crédito no encontrado.");
                return {
                    cuotas: 0,
                    montoTotalCuota: 0
                }
            }

            // Cálculo de la cantidad de días por cuota
            const diaCuota = dataTiempoCredito.diasCredito / dataTiempoCredito.numeroCuota;

            // Cálculo del monto de cada cuota
            const valorCuota = montoTotal / dataTiempoCredito.numeroCuota;

            // Extracción del valor de la entrada desde los datos de tiempo de crédito
            const entrada = dataTiempoCredito.entrada;

            // Creación de un array que representa los números de cuota
            let cuotasArray = Array.from({ length: dataTiempoCredito.numeroCuota }, (_, index) => index + 1);

            cuotasArray = entrada ? [...cuotasArray, cuotasArray.length + 1] : cuotasArray;

            // Mapeo de detalles de cuotas basado en el array
            const resultCuotas = cuotasArray.map((num, index) => {
                // Verificación de si la cuota tiene entrada y es la primera
                let tieneEntrada = entrada && num === 1;

                // Cálculo de los días acumulados hasta la cuota actual
                let sumDia = 0;
                let nroCuota = 0;
                if (entrada) {
                    sumDia = index * diaCuota;
                    nroCuota = index;
                } else {
                    sumDia = num * diaCuota;
                    nroCuota = num;
                }

                // Manejo del caso en que hay una entrada en la primera cuota
                if (tieneEntrada) {
                    return {
                        nroCuota: nroCuota,
                        cuota: 0,
                        fechaVencimiento: formSvc.formatDateTimeZone(fechaEmision),
                        entrada: 1
                    };
                }

                // Cálculo de la fecha de vencimiento para la cuota
                const fechaVencimiento = new Date(fechaEmision.getTime() + sumDia * 24 * 60 * 60 * 1000);

                // Retorno de detalles de la cuota
                return {
                    nroCuota: nroCuota,
                    cuota: formSvc.roundNumber(valorCuota, 5),
                    fechaVencimiento: formSvc.formatDateTimeZone(fechaVencimiento),
                    entrada: 0
                };
            });

            // Retorno del array de cuotas calculadas
            return {
                cuotas: resultCuotas,
                montoTotalCuota: resultCuotas.reduce((acc, curr) => acc + curr.cuota, 0)
            };
        }

        formSvc.updateCuotas = function (obj) {
            const { fechaEmision, tiemposCredito, idTiempoCredito, montoTotal, cuotas } = obj;

            // Encontrar datos de tiempo de crédito según el id proporcionado
            const dataTiempoCredito = tiemposCredito.find(t => t.idTiempoCredito === idTiempoCredito);

            // Manejo del caso en que no se encuentran datos de tiempo de crédito
            if (!dataTiempoCredito) {
                console.error("Tiempo de crédito no encontrado.");
                return {
                    cuotas: 0,
                    montoTotalCuota: 0
                }
            }

            // Cálculo de la cantidad de días por cuota
            const diaCuota = dataTiempoCredito.diasCredito / dataTiempoCredito.numeroCuota;

            // Cálculo del monto de cada cuota
            const valorCuota = montoTotal / dataTiempoCredito.numeroCuota;

            const resultCuotas = cuotas.map((cuota) => {
                if (!cuota.entrada) {
                    let sumDia = cuota.nroCuota * diaCuota;
                    // Cálculo de la fecha de vencimiento para la cuota
                    const fechaVencimiento = new Date(fechaEmision.getTime() + sumDia * 24 * 60 * 60 * 1000);

                    // Retorno de detalles de la cuota
                    return {
                        nroCuota: cuota.nroCuota,
                        cuota: formSvc.roundNumber(valorCuota, 5),
                        fechaVencimiento: formSvc.formatDateTimeZone(fechaVencimiento),
                        entrada: cuota.entrada,
                        idCuotaPorPagar: cuota.idCuotaPorPagar,
                        idCuotaPorCobrar: cuota.idCuotaPorCobrar
                    };
                }

                return {
                    nroCuota: cuota.nroCuota,
                    cuota: cuota.cuota,
                    fechaVencimiento: formSvc.formatDateTimeZone(cuota.fechaVencimiento),
                    entrada: cuota.entrada,
                    idCuotaPorPagar: cuota.idCuotaPorPagar,
                    idCuotaPorCobrar: cuota.idCuotaPorCobrar
                };
            });

            // Retorno del array de cuotas calculadas
            return {
                cuotas: resultCuotas,
                montoTotalCuota: resultCuotas.reduce((acc, curr) => acc + curr.cuota, 0)
            };

        }


        //Merge Item Detalle Documento Venta 
        formSvc.mergeItemStock = function (items, rowEntity) {
            // Filtra los elementos que tienen las mismas propiedades idArticulo e idBodega que rowEntity.
            let foundItemByArticuloAndBodega = items.filter(item => (
                item.idArticulo === rowEntity.idArticulo &&
                item.idBodega === rowEntity.idBodega
            ))

            let { totalCantidadFraccionada, totalCantidadPrincipal } = foundItemByArticuloAndBodega.reduce((total, item) => {
                let dataMedidaFraccionado = item.medidas.find(medida => medida.idMedida === item.idMedida && medida.tipo === 'FRACCIONADO')
                let dataMedidaPrincipal = item.medidas.find(medida => medida.idMedida === item.idMedida && medida.tipo === 'PRINCIPAL')
                if (dataMedidaFraccionado) {
                    let conversionSum = item.cantidad * dataMedidaFraccionado.conversion;
                    total.totalCantidadFraccionada += conversionSum;
                }
                if (dataMedidaPrincipal) {
                    let conversionSum = item.cantidad * dataMedidaPrincipal.conversion;
                    total.totalCantidadPrincipal += conversionSum;
                }
                return total;
            }, {
                totalCantidadFraccionada: 0,
                totalCantidadPrincipal: 0
            });

            let dataItemMerge = foundItemByArticuloAndBodega.reduce((itemPrevious, itemCurrent) => {
                itemPrevious.cantidad += itemCurrent.cantidad;
                return itemPrevious;
            }, {
                // Inicializa el objeto resultante con las propiedades de rowEntity y cantidades en cero.
                ...rowEntity,
                cantidad: 0,
            });

            // Devuelve el objeto resultante de la fusión. 
            return {
                idBodega: dataItemMerge.idBodega,
                cantidad: dataItemMerge.cantidad,
                consolidacionesFecha: dataItemMerge.consolidacionesFecha,
                cantidadStock: totalCantidadPrincipal + totalCantidadFraccionada
            };
        }

        formSvc.getCantidadStock = function (rowEntity, fechaEmision) {
            try {
                let fechaEmisionValidate = fechaEmision;
                let cantidadStock = rowEntity.cantidadStock;

                let dataConsolidacionFecha = rowEntity.consolidacionesFecha.find(
                    cdataFecha => cdataFecha.idBodega === rowEntity.idBodega
                )

                if (dataConsolidacionFecha && formSvc.isDateValid(dataConsolidacionFecha.fechaConsolidacion)) {
                    if (dataConsolidacionFecha.fechaConsolidacion >= fechaEmisionValidate) {
                        return 0;
                    }
                }

                let resultCantStock = cantidadStock < 0 ? cantidadStock : -cantidadStock;
                return resultCantStock;
            } catch (error) {
                console.log(error)
            }
        }


        formSvc.mapperFromFormaPago = function (formasPago) {
            let results = formasPago.map(item => {
                let infoReferencia = '';
                if (item.codigo === "01") {
                    infoReferencia = 'Ref.: EFECTIVO'
                }
                if (item.codigo === "20") {
                    infoReferencia = 'Ref.: TRANSFERENCIAS, CHEQUES'
                }
                return {
                    idFormaPagoSri: item.idFormaPagoSri,
                    descripcion: item.descripcion,
                    codigo: item.codigo,
                    infoReferencia
                }
            })
            return results;
        }

        //sacamos numero decimal del saldo
        formSvc.contarDecimales = function (input) {
            const partes = input.toString().split(".");
            return partes.length > 1 ? partes[1].length : 3;

        }

        formSvc.generateUuidv4 = () => uuid2.newguid()

        formSvc.isNumber = function (value) {
            var regex = /^\d+$/;
            return regex.test(value);
        };


        formSvc.instanceDecimal = function (num, max = 0) {
            if (max > 0) {
                return new Decimal(num).toDecimalPlaces(max).toNumber()
            }
            return new Decimal(num);
        }

        /**
         * 
         * @param {*} num1 
         * @param {*} num2 
         * @param {*} max 
         * @returns 
         */
        formSvc.plus = function (num1, num2, max = 0) {
            let instanceDecimal = new Decimal(num1).plus(num2)
            if (max > 0) {
                return instanceDecimal.toDecimalPlaces(max).toNumber()
            }

            return instanceDecimal;

        }

        /**
         * 
         * @param {*} num1 
         * @param {*} num2 
         * @param {*} max 
         * @returns 
         */

        formSvc.minus = function (num1, num2, max = 0) {
            let instanceDecimal = new Decimal(num1).minus(num2)
            if (max > 0) {
                return instanceDecimal.toDecimalPlaces(max).toNumber()
            }

            return instanceDecimal;

        }


        formSvc.mul = function (num1, num2, max = 0) {
            let instanceDecimal = new Decimal(num1).mul(num2)
            if (max > 0) {
                return instanceDecimal.toDecimalPlaces(max).toNumber()
            }

            return instanceDecimal;

        }


        formSvc.div = function (num1, num2, max = 0) {
            let instanceDecimal = new Decimal(num1).div(num2)
            if (max > 0) {
                return instanceDecimal.toDecimalPlaces(max).toNumber()
            }

            return instanceDecimal;

        }



        return formSvc;

    }

})(window.angular)
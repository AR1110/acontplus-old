export class CommonService {
    static $inject = [
        "$rootScope",
        "$http",
        "mainService",
        "FileSaver",
        "formulario",
        "modalService",
        "nombreModal",
        "nombreModalFactElect",
        "nombreModalVenta",
        "nombreModalInventario",
        "nombreModalCompra",
        "nombreModalLogistica",
        "articuloService",
        "empleadoService",
        "ventaService",
        "clienteService"
    ]; 
    constructor(
        $rootScope,
        $http,
        mS,
        FileSaver,
        form,
        _modalSvc,
        _nombreModalConst,
        nombreModalFactElect,
        nombreModalVenta,
        nombreModalInventario,
        nombreModalCompra,
        nombreModalLogistica,
        articuloSvc,
        empleadoSvc,
        ventaSvc,
        clienteSvc
    ) {
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.mS = mS;
        this.FileSaver = FileSaver;
        this.form = form;

        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;
        this.nombreModalFactElect = nombreModalFactElect;
        this.nombreModalVenta = nombreModalVenta;
        this.nombreModalInventario = nombreModalInventario;
        this.nombreModalCompra = nombreModalCompra;
        this.nombreModalLogistica = nombreModalLogistica;
        this.articuloSvc = articuloSvc;
        this.empleadoSvc = empleadoSvc;
        this.ventaSvc = ventaSvc;
        this.clienteSvc = clienteSvc;

        // this.$http.get('/TipoDocumento/GetAll').then(({data:response})=>{
        //     this.tipoDoc = response.data.reduce((groups, item)=>{
        //         let val = item.codigo
        //         groups[val]=groups[val] || {idTipoDocumento: 0, codigo: item.codigo, descripcion: '',};
        //         groups[val].idTipoDocumento = item.idTipoDocumento;
        //         groups[val].codigo          = item.codigo;
        //         groups[val].descripcion     = item.descripcion.toUpperCase()
        //         return groups
        //     }, {})
        //     console.log(this.tipoDoc)
        // })

        this.tipoDoc = Object.freeze({
            FC: Object.freeze({
                idTipoDocumento: 1,
                codigo: "FC",
                descripcion: "FACTURA DE COMPRA",
            }),
            OC: {
                idTipoDocumento: 2,
                codigo: "OC",
                descripcion: "ORDEN DE COMPRA",
            },
            IB: {
                idTipoDocumento: 3,
                codigo: "IB",
                descripcion: "INGRESO A BODEGA",
            },
            NV: {
                idTipoDocumento: 4,
                codigo: "NV",
                descripcion: "NOTA DE VENTA",
            },
            LC: {
                idTipoDocumento: 5,
                codigo: "LC",
                descripcion: "LIQUIDACIÓN DE COMPRA",
            },
            FV: {
                idTipoDocumento: 6,
                codigo: "FV",
                descripcion: "FACTURA DE VENTA",
            },
            NE: {
                idTipoDocumento: 7,
                codigo: "NE",
                descripcion: "NOTA DE ENTREGA",
            },
            RC: {
                idTipoDocumento: 8,
                codigo: "RC",
                descripcion: "RETENCION DE COMPRA",
            },
            GR: {
                idTipoDocumento: 9,
                codigo: "GR",
                descripcion: "GUIA DE REMISION",
            },
            NC: {
                idTipoDocumento: 10,
                codigo: "NC",
                descripcion: "NOTA DE CREDITO",
            },
            CI: {
                idTipoDocumento: 11,
                codigo: "CI",
                descripcion: "COMPROBANTE DE INGRESO",
            },
            CE: {
                idTipoDocumento: 12,
                codigo: "CE",
                descripcion: "COMPROBANTE DE EGRESO",
            },
            PR: {
                idTipoDocumento: 13,
                codigo: "PR",
                descripcion: "PROFORMA",
            },
            NCP: {
                idTipoDocumento: 14,
                codigo: "NCP",
                descripcion: "NOTA CREDITO PROVEEDOR",
            },
            CIV: {
                idTipoDocumento: 15,
                codigo: "CIV",
                descripcion: "CONSOLIDACION INVENTARIO",
            },
            RV: {
                idTipoDocumento: 16,
                codigo: "RV",
                descripcion: "RETENCION DE VENTA",
            },
            IC: {
                idTipoDocumento: 17,
                codigo: "IC",
                descripcion: "INGRESO CAJA",
            },
            EC: {
                idTipoDocumento: 18,
                codigo: "EC",
                descripcion: "EGRESO CAJA",
            },
            A: {
                idTipoDocumento: 19,
                codigo: "A",
                descripcion: "ANTICIPO",
            },
            TRA: {
                idTipoDocumento: 20,
                codigo: "TRA",
                descripcion: "TRANFERENCIA",
            },
        });
    }

    //En uso 
    getEstabAsign(json = {}) {
        return this.mS.getData('get', 'Config/EstabAsig/?json=' + JSON.stringify(json), null, true).then(response => {
            if (response.code === "0") {
                throw response
            }
            //return JSON.parse(response.payload) || [];
            return response || []
        })
    }

    //En uso en Aprob. Documento 
    getDataFormEstabAsig(json = {}) {
        return this.mS.getData('get', '/EstabAsig/GetDataForm?json=' + JSON.stringify(json)).then(response => {

            if (response.code === '0') {
                throw response
            }
            return JSON.parse(response.payload)
        })
    }

    removeAccents(str) {
        str = str || '';
        //return str.replace(/[^a-z0-9]/gi, '');
        return str.replace(/^-+|-+$| [^A-Za-z0-9.-]+/g, "");
    }

    //revisar y eliminar posteriormente
    getAllTiempoCredito(gestion) {
        return this.$http.get("/TiempoCredito/OptionTiempoCredito?gestion=" + gestion)
            .then(({
                data: response
            }) => response.data);
    }

    getEstadoDocByCodDoc(codDoc) {
        return this.mS.getData("get", "Config/EstadoDocumento/?json=" + JSON.stringify({
            codDoc
        }), null, true)
            .then(({
                data: response
            }) => response || []);
    } 
    //Buscador Empleado 
    querySearchEmpleado(textSearch) {
        if (!textSearch && textSearch.length < 2) return []

        return this.empleadoSvc.search({
            textSearch
        })
    }
 
    //-------------------------------------Usuario--------------------------------
    /***
     *  json = {busqueda, idRol}
     */
    usuarioSearch(json) {
        return this.mS.getData('get', 'Config/Usuario/Search?json=' + JSON.stringify(json), null, true).then(response => {
            if (response.code === "0") {
                return [];
            }
            return JSON.parse(response.payload)
        })
    }

    //---------------------------------------START CLIENTE-----------------------------------------
    clienteSearch(textSearch) {
        return this.clienteSvc.search({ textSearch })
    }

    /**
     * 
     * @param {*} id (idCliente)
     * @returns data;
     */
    //eliminar posteriormente (se usa en ventas)
    async getDataCliente(id) {

        try {
            let data = {};
            if (id === null || id === 0 || id === undefined) return data;
            showLoader();
            await this.clienteSvc.findById(id).then(response => {
                data = response;
            }
            ).finally(() => hideLoader())
            return data;
        } catch (error) {
            console.log(error)
        }
    }


    /**
     * 
     * @param {*} param0 
     * @returns 
     * Médodos relacionados a los tipos de documentos 
     * 1. generarNroDocumento
     * 2. Compras 
     * 3. Ventas 
     */

    async generarNroDocumentoVenta({
        puntoEmision,
        idPuntoEmision,
        nroDocumento,
        codigoDocumento
    }) {
        let nroDocumentoSecuencial = null;
        return await this.mS.getData('get', `/GenerarNroDoc/GenerarNroDocVenta?puntoEmision=${puntoEmision}&idPuntoEmision=${idPuntoEmision}&nroDocumento=${nroDocumento}&codigoDocumento=${codigoDocumento}`)
            .then(response => {
                if (response.id === "0") {
                    Swal.fire({
                        title: `<small>${response.titleSms}</small>`,
                        icon: "warning",
                        html: `<small>${response.message}</small>`,
                        allowOutsideClick: false,
                    });
                    return nroDocumentoSecuencial;
                }
                if (response.id === "1") {
                    return (nroDocumentoSecuencial = response.data);
                }
            })
    }

    async generarNroDocumentoCompra({
        puntoEmision,
        idPuntoEmision,
        nroDocumento,
        codigoDocumento
    }) {
        let nroDocumentoSecuencial = null;
        return await this.mS.getData('get', `/GenerarNroDoc/GenerarNroDocCompra?puntoEmision=${puntoEmision}&idPuntoEmision=${idPuntoEmision}&nroDocumento=${nroDocumento}&codigoDocumento=${codigoDocumento}`)
            .then(response => {
                if (response.id === "0") {
                    Swal.fire({
                        title: `<small>${response.titleSms}</small>`,
                        icon: "warning",
                        html: `<small>${response.message}</small>`,
                        allowOutsideClick: false,
                    });
                    return nroDocumentoSecuencial;
                }
                if (response.id === "1") {
                    return (nroDocumentoSecuencial = response.data);
                }
            })
    } 
    //-----------------------------METODOS RELACIONADOS AL TIPO DOCUMENTO---------------------------

    //Eliminar mas Adelante en depuracion co
    getDataFormVenta() {
        return this.mS.getData('get', 'FactElect/Factura/Get?json=' + JSON.stringify({ tipo: 3 }), null, true).then(response => {
            if (response.code === '0') {
                throw response
            }
            return JSON.parse(response.payload)
        })
    } 
    //por mejorar mas adelante 
    async generarNroDocumento({
        puntoEmision,
        idPuntoEmision,
        nroDocumento,
        codigoDocumento,
        tipoDoc = 'C'
    }) {
        let nroDocumentoSecuencial = null;
        let url = tipoDoc === 'C' ? 'GenerarNroDocCompra' : 'GenerarNroDocVenta';
        return await this.mS.getData('get', `/GenerarNroDoc/${url}?puntoEmision=${puntoEmision}&idPuntoEmision=${idPuntoEmision}&nroDocumento=${nroDocumento}&codigoDocumento=${codigoDocumento}`)
            .then(response => {
                if (response.id === "0") {
                    Swal.fire({
                        title: `<small>${response.titleSms}</small>`,
                        icon: "warning",
                        html: `<small>${response.message}</small>`,
                        allowOutsideClick: false,
                    });
                    return nroDocumentoSecuencial;
                }
                if (response.id === "1") {
                    return (nroDocumentoSecuencial = response.data);
                }
            })
    }

    //-------------------------------------------------GET DATA TIPO DOCUMENTO COMPRA ---------------------
    setUiGridDetalleCompra(detalleCompra) {

        let index = 1;
        return detalleCompra.map(item => {
            item.n = index++
            this.articuloSvc.findForPurchase({
                idArticulo: item.idArticulo
            }).then(response => {
                item.medidas = response.medidas
                item.etiquetas = response.etiquetas;
            })

            let subTotal = item.cantidad * item.precioUnitario;
            let totalDescuento = item.cantidad * item.valorDescuento;

            if (!("total" in item)) {
                let total = (item.precioUnitario - item.valorDescuento) * item.cantidad;
                item.total = total;
            }


            item.subTotal = subTotal;
            item.totalDescuento = totalDescuento;
            item.totalIce = item.cantidad * item.ice;
            return item;
        })

    }

    async getDataTipoDocCompra({
        id,
        codigoDocumento
    }) {
        let isComplete = false;
        let proveedor = {};
        let dataTipoDocumento = {};
        let dataDocumento = {};
        let factura = {}
        let detalleDocumento = [];
        let infoAdicionalDocumento = [];
        let datosAdicionalesArticulo = [];

        // const TIPO_DOC = this.tipoDoc[codigoDocumento];

        if (!(id > 0)) {
            throw "ID DOCUMENTO NO VÁLIDO"
        }

        switch (codigoDocumento) {
            

            case "IB": 

            case 'NCP':
                showLoader();
                await this.mS.getData('get', '/NotaCreditoProveedor/GetId?id=' + id).then(response => {
                    if (response.code === '0') {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }
                    if (response.code === '1') {
                        let dataMain = JSON.parse(response.payload);

                        dataDocumento = dataMain[0][0];
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);
                        factura = dataMain[1][0]

                        proveedor = dataMain[2][0];

                        detalleDocumento = this.setUiGridDetalleCompra(dataMain[3]);
                        isComplete = true;
                    }
                })
                break


            case 'OC':
                await this.mS.getData('get', '/OrdenCompra/GetId?id=' + id).then(response => {

                    if (response.code === '0') {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }
                    if (response.code === '1') {
                        let dataMain = JSON.parse(response.payload) || [];

                        dataDocumento = dataMain[0][0];
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);
                        proveedor = dataMain[1][0];
                        detalleDocumento = this.setUiGridDetalleCompra(dataMain[2]);
                        infoAdicionalDocumento = dataMain[3];

                        isComplete = true;
                    }
                })
                break

            case "RC":
                showLoader();
                await this.mS.getData('get', '/RetencionCompra/GetId?id=' + id).then(response => {
                    if (response.code == "0") {
                        hideLoader();
                        form.sweetAlert("warning", response.message, response.titleSms);
                    }
                    if (response.code === '1') {
                        let dataMain = JSON.parse(response.payload)

                        dataDocumento = dataMain[0][0];
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);

                        proveedor = dataMain[1][0];

                        detalleDocumento = dataMain[2];

                        infoAdicionalDocumento = dataMain[3];

                        isComplete = true;
                        hideLoader();
                    }
                })
                break
            default:
                toastr.warning('Código de Documento No Existe')
                break
        }

        return {
            proveedor,
            dataTipoDocumento,
            dataDocumento,
            factura,
            detalleDocumento,
            infoAdicionalDocumento,
            datosAdicionalesArticulo,
            isComplete,
        }
    }
 
    /*  
    -------------------------------------------------START GET DATA TIPO DOCUMENTO VENTA-------------------
    */

    /**
     * 
     * @param {Array} detalleVenta 
     * @param {string} nombrePrecio default Property PrecioVenta
     * @returns Array
     */
    getDetalleVenta(detalleVenta, nombrePrecio = 'precioUnitario') {
        try {
            let index = 1;
            return detalleVenta.map(item => {
                item.n = index++;

                let query = {
                    tipo: 6,
                    idArticulo: item.idArticulo,
                }
                this.articuloSvc.findForSale(query).then(response => {
                    let { articulo, medidas, datosAdicionalesArticulo } = response;
                    item.medidas = medidas;
                    item.datosAdicionalesArticulo = datosAdicionalesArticulo;

                    let dataMedida = medidas.find(m => m.idMedida === item.idMedida) || {};
                    item.articuloTarifas = dataMedida.tarifas && JSON.parse(dataMedida.tarifas) || [];

                    item.cantMinimaVentaPorMayor = articulo.cantMinimaVentaPorMayor;
                }).catch(err => {
                    console.log(err);
                })


                let subTotal = item.cantidad * item[nombrePrecio] || 0;
                let totalDescuento = item.cantidad * item.valorDescuento || 0;

                item.subTotal = subTotal || 0;
                item.totalDescuento = totalDescuento || 0;
                return item;
            });

        } catch (error) {
            toastr.error(`Error al cargar detalle del documento: ${error}`)
        }
    }

    async getDataTipoDocVenta({
        id,
        codigoDocumento
    }) {
        let isComplete = false;
        let cliente = {};
        let dataTipoDocumento = {};
        let detalleDocumento = [];
        let dataDocumento = {};
        let infoAdicionalDocumento = [];
        let datosAdicionalesArticulo = [];
        let factura = {}
        let actividadTipoIva = {};

        switch (codigoDocumento) {
            case "FV":
                await this.mS.getData('get', "/FacturaVenta/GetId?id=" + id).then(response => {
                    if (response.id === "0") {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }
                    if (response.id === "1") {
                        let dataMain = JSON.parse(response.payload);

                        let detalle = dataMain[2];
                        dataDocumento = dataMain[0][0];

                        dataDocumento.nroDocSecuencial = `${dataDocumento.estab}-${dataDocumento.ptoEmi}-${dataDocumento.secuencial}`;

                        dataDocumento.ptoEmi = `${dataDocumento.estab}-${dataDocumento.ptoEmi}`
                        //Fechas                         
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);
                        dataDocumento.fechaVencimiento = this.form.formatDate(dataDocumento.fechaVencimiento);

                        cliente = dataMain[1][0];
                        detalleDocumento = this.getDetalleVenta(detalle, 'precioUnitario');

                        infoAdicionalDocumento = dataMain[3];

                        actividadTipoIva = {
                            tarifa: dataDocumento.tarifa,
                            codigoPorcentaje: dataDocumento.codigoPorcentaje
                        }

                        //----------------------Datos Adicionales del Articulo-----------------
                        datosAdicionalesArticulo = dataMain[4].map(item => ({
                            idDocumento: item.idDocumento,
                            idHistoryInfoAdicional: item.idHistoryInfoAdicional,
                            idArticulo: item.idArticulo,
                            idEtiqueta: item.idEtiqueta,
                            idInfoAdicional: item.idInfoAdicional,
                            jsonAdicional: JSON.parse(item.jsonAdicional),
                            selected: item.selected,
                            estado: item.estado
                        }))

                        isComplete = true;
                        hideLoader();
                    }
                })
                break;

            case "NE":
                // showLoader();
                await this.ventaSvc.getIdNotaEntrega(id).then(response => {
                    if (response.code == "0") {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }

                    if (response.code == "1") {

                        let dataMain = JSON.parse(response.payload);

                        let detalle = dataMain[2];
                        dataDocumento = dataMain[0][0];
                        dataDocumento.nroDocSecuencial = `${dataDocumento.estab}-${dataDocumento.ptoEmi}-${dataDocumento.secuencial}`;
                        dataDocumento.ptoEmi = `${dataDocumento.estab}-${dataDocumento.ptoEmi}`
                        //Fechas                         
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);
                        dataDocumento.fechaVencimiento = this.form.formatDate(dataDocumento.fechaVencimiento);

                        cliente = dataMain[1][0];
                        detalleDocumento = this.getDetalleVenta(detalle, 'precioUnitario');

                        infoAdicionalDocumento = dataMain[3];

                        //----------------------Datos Adicionales del Articulo-----------------
                        datosAdicionalesArticulo = dataMain[4].map(item => ({
                            idDocumento: item.idDocumento,
                            idHistoryInfoAdicional: item.idHistoryInfoAdicional,
                            idArticulo: item.idArticulo,
                            idEtiqueta: item.idEtiqueta,
                            idInfoAdicional: item.idInfoAdicional,
                            jsonAdicional: item.jsonAdicional && JSON.parse(item.jsonAdicional) || [],
                            selected: item.selected,
                            estado: item.estado
                        }))

                        actividadTipoIva = {
                            tarifa: dataDocumento.tarifa,
                            codigoPorcentaje: dataDocumento.codigoPorcentaje
                        }

                        isComplete = true;
                        //  hideLoader();
                    }
                });
                break;

            case "PR":

                await this.mS.getData('get', '/Proforma/GetId?id=' + id).then(response => {
                    if (response.code === "0") {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }
                    if (response.code === "1") {
                        let dataMain = JSON.parse(response.payload);

                        let detalle = dataMain[2];
                        dataDocumento = dataMain[0][0];
                        dataDocumento.nroDocSecuencial = `${dataDocumento.estab}-${dataDocumento.ptoEmi}-${dataDocumento.secuencial}`;
                        dataDocumento.ptoEmi = `${dataDocumento.estab}-${dataDocumento.ptoEmi}`
                        //Fechas                         
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);

                        cliente = dataMain[1][0];

                        detalleDocumento = this.getDetalleVenta(detalle, 'precioUnitario');
                        infoAdicionalDocumento = dataMain[3];
                        actividadTipoIva = {
                            tarifa: dataDocumento.tarifa,
                            codigoPorcentaje: dataDocumento.codigoPorcentaje
                        }
                        isComplete = true;
                    }
                });
                break;

            case "NC":
                await this.mS.getData('get', 'FactElect/NotaCredito/' + '?json=' + JSON.stringify({ id: id, tipo: 4 }), null, true).then(response => {
                    console.log(response)
                    if (response.code == "0") {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }
                    if (response.code === "1") {
                        let dataMain = JSON.parse(response.payload);
                        let detalle = dataMain[3];

                        dataDocumento = dataMain[0][0];

                        //Fechas                         
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);

                        factura = dataMain[1][0]

                        cliente = dataMain[2][0];


                        detalleDocumento = this.getDetalleVenta(detalle, 'precioUnitario');

                        infoAdicionalDocumento = dataMain[4];

                        actividadTipoIva = {
                            tarifa: dataDocumento.tarifa,
                            codigoPorcentaje: dataDocumento.codigoPorcentaje
                        }
                        isComplete = true;

                    }
                });
                break

            case "RV":
                await this.mS.getData('get', '/RetencionVenta/GetId?id=' + id).then(response => {

                    if (response.code == "0") {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }

                    if (response.code === "1") {
                        let dataMain = JSON.parse(response.payload)

                        dataDocumento = dataMain[0][0];
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision)
                        cliente = dataMain[1][0];
                        factura = dataMain[2][0];
                        detalleDocumento = dataMain[3];
                        isComplete = true;
                    }
                });
                break;
        }

        return {
            cliente,
            dataTipoDocumento,
            dataDocumento,
            factura,
            detalleDocumento,
            infoAdicionalDocumento,
            actividadTipoIva,
            datosAdicionalesArticulo,
            isComplete,
        };
    }
    /**--------------------------------------------------END GET DATA TIPO DOCUMENTO VENTA  */
 
    /**------------------------------------------------- OTROS DOCUMENTOS-------------------*/

    async getDataGuiaRemision(id) {

        let isComplete = false;
        let dataDocumento = {},
            cliente = {},
            transportista = {},
            vehiculo = {},
            empleado = {},
            detalleDocumento = [],
            infoAdicionalDocumento = []

        if (!id) throw "ID DOCUMENTO INVÁLIDO";

        await this.mS.getData('get', 'Logistica/GuiaRemision/GetId/' + id, null, true).then(response => {

            if (response.code == "0") {
                this.form.sweetAlert('warning', response.message)
                throw response.message
            }

            if (response.code === "1") {
                let dataMain = JSON.parse(response.payload)

                dataDocumento = dataMain[0][0];
                dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);
                dataDocumento.fechaInicio = this.form.formatDate(dataDocumento.fechaInicio);
                dataDocumento.fechaFin = this.form.formatDate(dataDocumento.fechaFin);

                cliente = dataMain[1][0];
                transportista = dataMain[2][0];
                vehiculo = dataMain[3][0];
                empleado = dataMain[4][0];
                detalleDocumento = dataMain[5];
                infoAdicionalDocumento = dataMain[6];
                isComplete = true;
            }

        })

        return {
            dataDocumento,
            cliente,
            transportista,
            vehiculo,
            empleado,
            detalleDocumento,
            infoAdicionalDocumento,
            isComplete
        }

    }




    /**
     * 
     * @param {number} id 
     * @returns  object 
     */
    async getDataConsolidacionInventario(id) {
        let isComplete = false,
            dataTipoDocumento = {},
            dataDocumento = {},
            detalleDocumento = [],
            medidasTemp = [];

        await this.mS.getData('get', 'Inventario/Consolidacion/?json=' + JSON.stringify({ tipo: 3, id: id }), null, true).then(response => {

            if (response.code === '0') {
                this.form.sweetAlert('warning', response.message)
                throw response.message
            }
            if (response.code === '1') {
                let dataMain = JSON.parse(response.payload);
                dataDocumento = dataMain[0][0];
                dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision)
                detalleDocumento = dataMain[1];
                medidasTemp = dataMain[2];
                isComplete = true;
            }
        })

        return {
            isComplete,
            dataTipoDocumento,
            dataDocumento,
            detalleDocumento,
            medidasTemp
        }
    }


    /**
     * 
     * @param {numbre} idTransferenciaBodega
     * @returns 
     */

    async getDataTransferenciaBodega(id) {
        let dataDocumento = {},
            establecimientoOrigen = {},
            establecimientoDestino = {},
            detalleDocumento = [],
            isComplete = false;
        if (!id) throw "ID DOCUMENTO INVÁLIDO";

        await this.mS.getData('get', `Inventario/TransferenciaBodega/GetId?id=${id}`, null, true).then(response => {

            if (response.code === "0") {
                this.form.sweetAlert('warning', response.message)
                throw response.message
            }

            if (response.code === "1") {
                let dataMain = JSON.parse(response.payload);

                dataDocumento = dataMain[0][0];
                dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);

                establecimientoOrigen = dataMain[1][0];
                establecimientoDestino = dataMain[2][0];

                for (let item of dataMain[3]) {
                    this.articuloSvc.findForPurchase(item).then(response => {
                        item.medidas = response.medidas
                    })

                    detalleDocumento.push(item)
                }


                isComplete = true;
            }
        })

        return {
            dataDocumento,
            establecimientoOrigen,
            establecimientoDestino,
            detalleDocumento,
            isComplete
        }
    }

    //--------------------------------------------------REPORTE----------------------------------
    async getReport(params) {
        try {
            let method = params.method || 'POST';
            let url = params.v2 ? 'Reports/v2/Reporte/Download' : params.url || 'Reports/Reporte/Download';
            let parameters = params.parameters;
            let formatType = params.formatType || "pdf";
            showLoader();
            await this.mS.getFile(method, url, parameters, true).then(response => {

                if (formatType === "pdf") {
                    let fileName = '';
                    let contentDispositionHeader = response.headers()['content-disposition'];
                    // Attempt to extract filename from Content-Disposition header
                    let matches = contentDispositionHeader.match(/filename\*?=['"]?([^'";]+)/);

                    if (matches && matches[1]) {
                        // Decode the URI-encoded filename
                        fileName = decodeURIComponent(matches[1]);
                    }
                    let fileBlob = new Blob([response.data], {
                        type: response.data.type,
                    })

                    let objectUrl = window.URL || window.webkitURL;
                    let urlFile = objectUrl.createObjectURL(fileBlob);
                    // Ajuste horizontal
                    let x = parseInt((screen.width - 1200) / 2);
                    // Ajustae vertical
                    let y = parseInt((screen.height - 650) / 4);
                    // var link = document.createElement('a');
                    // link.href = window.URL.createObjectURL(fileBlob);
                    // link.setAttribute('download', fileName);
                    // document.body.appendChild(link);
                    // link.click();
                    // document.body.removeChild(link);    

                    let newWindow = window.open(
                        urlFile,
                        "_blank",
                        `resizable=yes
                    width=1200
                    height=650
                    screenY=${y}
                    screenX=${x}`
                    )

                    setTimeout(function () { newWindow.document.title = fileName; }, 1000);

                    //newWindow.document.title = "YOUR PDF NAME HERE!";
                } else {
                    let serverData = new Blob([response.data], {
                        type: response.headers()["content-type"],
                    });
                    // let fileName = response
                    //     .headers()["content-disposition"].split(";")[1]
                    //     .split("=")[1];
                    let filename = response.headers()['content-disposition'].split(';')[1].split('=')[1].replace('"', "")
                    filename = filename.replace('"', "")
                    this.FileSaver.saveAs(serverData, decodeURIComponent(filename));
                }
            }).catch(error => {
                hideLoader();
                console.log(error)
            })
        } catch (error) {
            hideLoader();
            console.log(error)
        } finally {
            hideLoader();
        }
    }

    //--------------------------------------------------EXCEL----------------------------------
    async exportExcel({
        method = "post",
        url = 'Reporte/ExportExcel',
        parameters
    }) {
        try {
            showLoader();
            await this.mS.getFile(method, url, parameters, true).then(response => {
                let serverData = new Blob([response.data], {
                    type: response.headers()["content-type"],
                });
                let fileName = response
                    .headers()["content-disposition"].split(";")[1]
                    .split("=")[1];
                this.FileSaver.saveAs(serverData, fileName);
            })
        } catch (error) {
            hideLoader()
            console.log(error)
        } finally {
            hideLoader();
        }
    }
    /**
     * 
     * 
     * @param {*} parameters 
     */

    async askToPrint({
        parameters
    }) {

        let {
            isConfirmed
        } = await Swal.fire({
            icon: 'warning',
            html: `<small>Desea Imprimir este comprobante?</small>`,
            confirmButtonText: '<icon class="mdi mdi-cloud-print-outline"></icon> Sí, imprimir',
            showDenyButton: true,
            denyButtonText: 'No, cancelar',
            allowOutsideClick: false
        })
        if (isConfirmed) {
            this.mS
                .getData("POST", "https://acontplusprint.com/Print", parameters)
                .then((response) => {
                    if (response.code === "0") {
                        toastr.warning(response.message, "", {
                            positionClass: "toast-bottom-right",
                            closeButton: true,
                            preventDuplicates: true,
                            progressBar: true,
                        });
                    }
                    if (response.code === "1") {
                        toastr.success(response.message, "", {
                            positionClass: "toast-bottom-right",
                            closeButton: true,
                            preventDuplicates: true,
                            progressBar: true,
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            //this.getPrinter(parameters)
        }
    }

    getPrinter(parameters) {
        try {
            let url = `Config/Print/?json=${parameters}`
            this.mS.getData('get', url, null, true).then(
                response => {
                    if (response.code === '0') {
                        toastr.warning(response.message)
                    }
                    if (response.code === '1') {
                        this.print(JSON.parse(response.payload))
                    }
                }
            ).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
            toastr.error(error)
        }
    }

    async print(params) {
        try {
            let urlPrinter = params[0].urlPrinter + '?rdlcProps=' + params[0].rdlcProps + '&dataSources=' + encodeURIComponent(params[0].dataSources) + '&rdlcParams=' + params[0].rdlcParams
            this.mS.getData('POST', urlPrinter).then(data => {
                if (data.code == "0") {
                    toastr.warning(data.message, '', {
                        positionClass: 'toast-bottom-right',
                        closeButton: true,
                        preventDuplicates: true,
                        progressBar: true
                    })
                }
                if (data.code == "1") {
                    toastr.success(data.message, '', {
                        positionClass: 'toast-bottom-right',
                        closeButton: true,
                        preventDuplicates: true,
                        progressBar: true
                    })
                }
            }).catch(function (error) {
                console.log('Hubo un problema al imprimir:' + error.message);
            })
        } catch (error) {
            hideLoader()
            console.log(error)
        }
    }



    getJsBarcode(item, format = "CODE128") {
        JsBarcode("#jsBarcodeImg", item, {
            format,
            lineColor: "#000000",
            width: 1,
            height: 50,
            displayValue: false
        })
        const barcodeData = $('#jsBarcodeImg').attr('src').replace(/^data:image\/[a-z]+;base64,/, "");
        return barcodeData;
    }

    /**
     * 
     * @param {Array} param0 arr
     * @param {String} param1 fileExtension
     * @param {String} param2 fileName
     */
    exportTableToExcel({
        arr,
        fileExtension = '.xlsx',
        fileName
    }) {
        try {
            showLoader();
            const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const ws = XLSX.utils.json_to_sheet(arr);

            const wb = {
                Sheets: {
                    data: ws
                },
                SheetNames: ["data"]
            };
            const excelBuffer = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array"
            });
            const data = new Blob([excelBuffer], {
                type: fileType
            });
            this.FileSaver.saveAs(data, fileName + fileExtension);
            hideLoader();
        } catch (error) {
            hideLoader();
            console.log(error)
        }

    }






    /**
     * Ver Detalle del Documento 
     * 
     */

    async viewDetailDocumentII({
        id,
        codTransaccion,
        codigoDocumento,
        size,
        windowClass = "uibModalFullScreen"
    }) {
        try {
            let controller = null,
                template = null,
                params = {},
                response = {},
                isComplete = false;
            let controllers = {};
            let templates = {};
            let fileCtrl = '';
            let ctrl;
            let isRenderRazorPartial = false;

            switch (codigoDocumento) {
                case "FE":

                    if (codTransaccion == 'E') {
                        response = await this.getDataTipoDocVenta({
                            id,
                            codigoDocumento
                        })
                    }
                    if (codTransaccion == 'S') {

                        fileCtrl = this.nombreModalFactElect.FACTURA.fileCtrl;
                        ctrl = this.nombreModalFactElect.FACTURA.controllers['D']
                        template = this.nombreModalFactElect.FACTURA.templates['D']

                        controller = (await import(fileCtrl))[ctrl];

                        response = await this.getDataTipoDocVenta({
                            id,
                            codigoDocumento: 'FV'
                        })
                    }


                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response,
                    }

                    break

                case "NE":

                    fileCtrl = this.nombreModalVenta.NOTA_ENTREGA.fileCtrl;
                    ctrl = this.nombreModalVenta.NOTA_ENTREGA.controllers['D']
                    template = this.nombreModalVenta.NOTA_ENTREGA.templates['D']

                    controller = (await import(fileCtrl))[ctrl];

                    response = await this.getDataTipoDocVenta({
                        id,
                        codigoDocumento
                    })

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response,
                    }

                    break


                case "NC":
                    let {
                        nota_credito_cliente
                    } = this._nombreModalConst;
                    controller = (await import('./../' + nota_credito_cliente.MODAL_FILE_CTRL))[nota_credito_cliente.MODAL_DETALLE['controller']];
                    template = nota_credito_cliente.MODAL_DETALLE['template'];

                    response = await this.getDataTipoDocVenta({
                        id,
                        codigoDocumento
                    })

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response,
                    }

                    break


                case "FF":
                    fileCtrl = this.nombreModalCompra.FACTURA_FISICA.fileCtrl;
                    ctrl = this.nombreModalCompra.FACTURA_FISICA.controllers['D']
                    template = this.nombreModalCompra.FACTURA_FISICA.templates['D']
                    controller = (await import(fileCtrl))[ctrl];
                    response = await this.getDataTipoDocCompra({
                        id,
                        codigoDocumento: 'FC'
                    })

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response
                    }

                    break

                case "IV":
                    let modalParams = {}, {
                        MODAL_FILE_PATH,
                        MODAL_DETALLE
                    } = this._nombreModalConst.compra_no_habitual;
                    isRenderRazorPartial = true;


                    controller = (await import('./../../' + MODAL_FILE_PATH))[MODAL_DETALLE['controller']]
                    template = MODAL_DETALLE['template']

                    showLoader();

                    await this.mS.getData('get', 'CompraNoHabitual/' + JSON.stringify({
                        idDocumentoIngreso: id,
                        typeList: 4
                    }), null, true).then(response => {
                        if (response.code === "0") {
                            console.log(response)
                            hideLoader();
                        }

                        if (response.code === "1") {
                            modalParams.params = JSON.parse(response.payload);
                            hideLoader();
                        }
                    })

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: modalParams.params
                    }


                    break
                case "IB":
                    let {
                        ingreso_bodega
                    } = this._nombreModalConst;
                    controller = (await import('./../' + ingreso_bodega.MODAL_FILE_CTRL))[ingreso_bodega.MODAL_DETALLE['controller']];
                    template = ingreso_bodega.MODAL_DETALLE['template'];

                    response = await this.getDataTipoDocCompra({
                        id,
                        codigoDocumento
                    })

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response
                    }

                    break


                case "CI":

                    fileCtrl = this.nombreModalInventario.CONSOLIDACION_INVENTARIO.fileCtrl;
                    ctrl = this.nombreModalInventario.CONSOLIDACION_INVENTARIO.controllers['D']
                    template = this.nombreModalInventario.CONSOLIDACION_INVENTARIO.templates['D']

                    controller = (await import(fileCtrl))[ctrl];

                    response = await this.getDataConsolidacionInventario(id)

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response
                    }

                    break
            }



            this._modalSvc.openModalCustom({
                controller,
                template,
                params: codigoDocumento == "IV" ? params.data : params,
                size,
                windowClass,
                isRenderRazorPartial
            })

        } catch (error) {
            hideLoader()
            console.log(error)
        }

    }


    async viewDetailDocument({
        id,
        codigoDocumento,
        size,
        windowClass = "uibModalFullScreen",
        isRenderRazorPartial = false,
    }) {
        try {
            let controller = null,
                template = null,
                params = {},
                response = {},
                isComplete = false;
            let fileCtrl = null;
            let ctrl;


            switch (codigoDocumento) {
                case "FV":

                    fileCtrl = this.nombreModalFactElect.FACTURA.fileCtrl;
                    ctrl = this.nombreModalFactElect.FACTURA.controllers['D']
                    template = this.nombreModalFactElect.FACTURA.templates['D']

                    controller = (await import(fileCtrl))[ctrl];


                    response = await this.getDataTipoDocVenta({
                        id,
                        codigoDocumento
                    })

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response,
                    }

                    break

                case "NE":

                    fileCtrl = this.nombreModalVenta.NOTA_ENTREGA.fileCtrl;
                    ctrl = this.nombreModalVenta.NOTA_ENTREGA.controllers['D']
                    template = this.nombreModalVenta.NOTA_ENTREGA.templates['D']

                    controller = (await import(fileCtrl))[ctrl];

                    response = await this.getDataTipoDocVenta({
                        id,
                        codigoDocumento
                    })

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response,
                    }

                    break


                case "NC":
                    let {
                        nota_credito_cliente
                    } = this._nombreModalConst;
                    controller = (await import('./../' + nota_credito_cliente.MODAL_FILE_CTRL))[nota_credito_cliente.MODAL_DETALLE['controller']];
                    template = nota_credito_cliente.MODAL_DETALLE['template'];

                    response = await this.getDataTipoDocVenta({
                        id,
                        codigoDocumento
                    })

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response,
                    }

                    break


                case "FC":
                    isRenderRazorPartial = true;
                    fileCtrl = this.nombreModalCompra.FACTURA_FISICA.fileCtrl;
                    ctrl = this.nombreModalCompra.FACTURA_FISICA.controllers['D']
                    template = this.nombreModalCompra.FACTURA_FISICA.templates['D']
                    controller = (await import(fileCtrl))[ctrl];
                    response = await this.getDataTipoDocCompra({
                        id,
                        codigoDocumento
                    })

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response
                    }

                    break

                case "IB":
                    // fileCtrl = this.nombreModalInventario.CONSOLIDACION_INVENTARIO.fileCtrl;
                    // ctrl = this.nombreModalInventario.CONSOLIDACION_INVENTARIO.controllers['D']
                    // template = this.nombreModalInventario.CONSOLIDACION_INVENTARIO.templates['D']


                    // response = await this.getDataTipoDocCompra({
                    //     id,
                    //     codigoDocumento
                    // })

                    // params = {
                    //     TIPO_REGISTRO: 'DETALLE',
                    //     data: response
                    // }

                    break


                case "CI":
                    fileCtrl = this.nombreModalInventario.CONSOLIDACION_INVENTARIO.fileCtrl;
                    ctrl = this.nombreModalInventario.CONSOLIDACION_INVENTARIO.controllers['D']
                    template = this.nombreModalInventario.CONSOLIDACION_INVENTARIO.templates['D']

                    controller = (await import(fileCtrl))[ctrl];

                    response = await this.getDataConsolidacionInventario(id)

                    params = {
                        TIPO_REGISTRO: 'DETALLE',
                        data: response
                    }

                    break

                case "GR":

                    fileCtrl = this.nombreModalLogistica.GUIA_REMISION.fileCtrl;
                    ctrl = this.nombreModalLogistica.GUIA_REMISION.controller;
                    template = this.nombreModalLogistica.GUIA_REMISION.template;
                    controller = (await import(fileCtrl))[ctrl];

                    response = await this.getDataGuiaRemision(id);
                    params = response;
                    break

                default:
                    console.log(`Detalle del Documento No definido: ${codigoDocumento}`);
                    throw 'Detalle del Documento No definido'
            }


            this._modalSvc.openModalCustom({
                controller,
                template,
                params,
                size,
                windowClass,
                isRenderRazorPartial
            })

        } catch (error) {
            console.log(error)
        }

    }




    //Permiso para editar o anular Doc. Venta 
    async checkHasPermissionToEditOrDelete(codigoAccion) {
        let jsonParams = {
            typeList: 2,
            codigoAccion,
        }
        let result = {};

        showLoader();
        await this.mS.getData('get', 'Config/Solicitud/Check/' + JSON.stringify(jsonParams), null, true).then(response => {
            if (response.code === "0") {
                hideLoader();
                this.form.sweetAlert('warning', response.message, response.titleSms);
                throw response;
            }
            hideLoader();
            result = response;

        }).catch(error => {
            hideLoader();
            throw error;
        })
        return result;
    }


    async requestAuthorizationKey(codigoAccion) {
        let textMotivo = codigoAccion === 'E' ? 'Editar' : 'Anular';
        Swal.fire({
            title: "Solicitud de Clave de Autorización",
            text: `Por favor, proporcione una explicación del motivo por el cual desea ${textMotivo} el documento!`,
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            inputPlaceholder: "Explicación del motivo",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false,
            inputValidator: (value) => {
                if (!value) {
                    return ('Por favor ingrese la descripción del motivo');
                }
                if (value.length < 15) {
                    return ('La descripción del motivo tiene que terner al menos de 15 caracteres');
                }
            }
        }).then(result => {
            if (result.isConfirmed) {
                let jsonParams = JSON.stringify({
                    motivo: result.value,
                    codigoAccion
                });
                this.mS.getData('post', 'Config/Solicitud/Post/' + jsonParams, null, true).then(response => {
                    if (response.code === "0") {
                        this.form.sweetAlert('warning', response.message)
                    }
                    if (response.code === "1") {
                        this.form.sweetAlert('success', response.message, response.titleSms, 1000);
                    }
                }).catch(error => {
                    throw error
                })
            }
        })
    }


    updateRequestKey(codigoAccion) {
        this.mS.getData('put', 'Config/Solicitud/Put/' + JSON.stringify({
            codigoAccion,
            typeOperation: 2
        }), null, true).then(response => {
            console.log(response)
        })
    }



    //========================================END POINT EXTERNOS================== 
    checkClientSRIByRUC = function (identificacion) {
        return this.mS.getData('get', 'Consultas/GetRucSRI?Ruc=' + identificacion, null, true).then(response => {
            return response;
        })
    }


    checkClientSRIByCedula = function (identificacion) {
        return this.mS.getData('get', 'Consultas/GetCedulaSri?Ruc=' + identificacion, null, true).then(response => {
            return response;
        })
    }


    checkCantItem(items) {
        if (Array.isArray(items)) {
            return items.length === 75
        }
        return items.length === 50;
    }

}


app.factory("commonService", CommonService);





app.factory('storageService', storageService)

storageService.$inject = ['$window']

function storageService($window) {

    return {
        set: function (key, value) {
            return $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },


        askToSaveDetailDoc: async function (name, valueStorage) {
            let { isConfirmed, value } = await Swal.fire({
                title: '<small>Apartar Documento</small>',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Apartar',
                cancelButtonText: 'No, cancelar',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Ingrese la descripción!'
                    }

                    if (Object.keys(this.getObject(name)).length > 0) {
                        if (this.getObject(name)[value]) {
                            return 'Ya existe Documento Apartado con esta descripción';
                        }
                    }
                },
            })

            if (isConfirmed) {
                if (Object.keys(this.getObject(name)).length > 0) {
                    let dataInvoiceDetail = this.getObject(name)
                    dataInvoiceDetail[value] = JSON.stringify(valueStorage);
                    this.setObject(name, dataInvoiceDetail)
                    toastr.success('Documento Apartado Correctamente')
                }

                if (Object.keys(this.getObject(name)).length === 0) {
                    let objSave = {
                        [value]: JSON.stringify(valueStorage)
                    }
                    this.setObject(name, objSave)
                    toastr.success('Documento Apartado Correctamente')
                }

            }

            return isConfirmed;


        },

        restoreInvoiceDetail: async function (name) {
            let dataInvoiceDetail = this.getObject(name)

            const { isConfirmed, value } = await Swal.fire({
                title: '<small>Recuperar Detalle del Documento</small>',
                input: 'select',
                inputOptions: Object.keys(dataInvoiceDetail).reduce((obj, cur) => ({ ...obj, [cur]: cur }), {}),
                inputPlaceholder: 'Seleccionar el documento',
                showCancelButton: true,
                confirmButtonText: 'Recuperar detalle',
                cancelButtonText: 'No, cancelar',
                allowEscapeKey: false,
                allowOutsideClick: false,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value) {
                            resolve()
                        } else {
                            resolve('Seleccione la opción :)')
                        }
                    })
                }
            })


            return {
                isConfirmed,
                value,
                dataInvoiceDetail
            }
        }

    }
}



 

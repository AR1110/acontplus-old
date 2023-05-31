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
        "articuloService"
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
        articuloSvc
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
        this.articuloSvc = articuloSvc;

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
        return this.mS.getData('get', '/EstabAsig/Get?json=' + JSON.stringify(json)).then(response => {
            if (response.code === "0") {
                throw response
            }
            return JSON.parse(response.payload) || [];
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
        str = str || ''
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }


    //Gestion de Configuracion del SISTEMA 
    getGestionSistema(json = {}) {
        return this.mS.getData('get', '/GestionSistema/Get?json=' + JSON.stringify(json)).then(
            response => JSON.parse(response.payload) || []
        )
    }
    // Configuración de Decimal en modulo de configuracion general 
    getModuloDecimal(json = {}) {
        return this.$http.get("/CantidadDecimal/Get?json=" + JSON.stringify(json))
            .then(({
                data: response
            }) => JSON.parse(response.data));
    }

    //Obtenemos todas las configuraciones(decimales por modulo, tipo iva asignado a una Entidad)
    getGestionConfig(json) {
        return this.mS.getData('get', "/Configuracion/Get?json=" + JSON.stringify(json)).then(response => {

            if (response.id === '0') {
                toastr.warning(response)
            }
            return JSON.parse(response.data)
        });
    }


    getConfigVentaDetalle() {
        return this.$http.get("/ConfigVentaDetalle/Get").then(({
            data: response
        }) => {
            if (response.id === "0") {
                toastr.warning(response.message, response.titleSms);
                return;
            }
            return response.data;
        })
    }

    getAllTipoIva() {
        return this.$http.get("/TipoIva/OptionTipoIva")
            .then(({
                data: response
            }) => response.data)
    }

    getAllTarifa() {
        return this.$http.get("/Tarifa/GetAll")
            .then(({
                data: response
            }) => response.data);
    }

    getAllTiempoCredito(gestion) {
        return this.$http.get("/TiempoCredito/OptionTiempoCredito?gestion=" + gestion)
            .then(({
                data: response
            }) => response.data);
    }

    getAllEstado(tipo) {
        return this.$http.get("/EstadoPago/Get?type=" + tipo)
            .then(({
                data: response
            }) => response.data);
    }

    getEstadoDocByCodDoc(codDoc) {
        return this.$http.get("/EstadoDocumento/Get?json=" + JSON.stringify({
            codDoc
        }))
            .then(({
                data: response
            }) => response.data || []);
    }

    getAllCiudadProvincia(json = {}) {
        return this.$http.get("/Ciudad/Get?json=" + JSON.stringify(json)).then(({
            data: response
        }) => response)
    }


    /**
     * Metodos Comunes 
     * @return [0]=>
     * @return [1]=>Entidad Financiera
     * @return [2]=>SubEntidad Financiera 
     * @return [3]=>Banco
     * @return [4]=>Estado Movimiento
     */

    getGestionFinanciera(json = {}) {
        return this.mS.getData('get', '/GestionFinanciera/Get?json=' + JSON.stringify(json)).then(response => {
            return JSON.parse(response.payload)
        })
    }


    //Buscador Empleado 
    querySearchEmpleado(search) {
        if (search === null || search === undefined || search === '') return
        return this.mS.getData('get', '/Empleado/Search?busqueda=' + search).then(response => {
            return response.data;
        })
    }


    /**
     * 
     * Médodos relacionados a los Impuestos de Estados 
     */

    getAllImpuestoEstado(json) {
        return this.$http.get('/ImpuestoEstado/Get?json=' + JSON.stringify(json))
            .then(({
                data: response
            }) => JSON.parse(response.data))
    }






    //-------------------------------------Usuario--------------------------------
    usuarioSearch(json) {
        return this.mS.getData('get', 'Usuario/Search/' + JSON.stringify(json), null, true).then(response => {
            if (response.code === "0") {
                return [];
            }
            return JSON.parse(response.payload)
        })
    }

    //--------------------------------------CONSULTA COMPRAS --------------------
    getAllSustentoTributario() {
        return this.$http.get('/SustentoTributario/GetAll')
            .then(({
                data: response
            }) => response.data)
    }

    getAllCategoriaCompra() {
        return this.$http.get('/CategoriaCompra/GetAll')
            .then(({
                data: response
            }) => response.data)
    }




    //---------------------------------------START CLIENTE-----------------------------------------
    clienteSearch(textSearch) {
        return this.mS.getData('get', '/Cliente/Search?json=' + JSON.stringify({
            textSearch
        })).then(response => {
            if (response.id === '0') {
                console.warn(response)
                return
            }
            return JSON.parse(response.payload) || []
        })
    }

    /**
     * 
     * @param {*} id (idCliente)
     * @returns data;
     */
    async getDataCliente(id) {

        try {
            let data = {};
            if (id === null || id === 0 || id === undefined) return data

            await this.mS.getData('get', `/Cliente/GetId?id=${id}`).then(
                response => {
                    if (response.code === "0") {
                        toastr.warning(response.message, response.titleSms);
                    }
                    if (response.code === "1") {
                        data = JSON.parse(response.payload)[0] || {};
                        data.correos = data.correo ? data.correo.split(';') : [];
                        data.telefonos = data.telefono ? data.telefono.split(';') : []
                        data.placas = data.placa !== '' ? data.placa.split(';') : []
                        data.response = response.data
                    }
                }
            )

            return data;

        } catch (error) {
            console.log(error)
        }


    }


    getDataClienteByIdCliente(idCliente) {
        return this.$http.get("/Cliente/GetId?idCliente=" + idCliente).then(({
            data: response
        }) => {
            if (response.id === "0") {
                toastr.warning(response.message, response.titleSms);
                return;
            }
            if (response.id === "1") {
                const {
                    cliente,
                    nombreCompleto
                } = response.data;
                cliente.empleado = nombreCompleto;
                return cliente;
            }
        })
    }




    //---------------------------------------END CLIENTE --------------------------------------  


    //--------------------------------------START PROVEEDOR-------------------------------------
    proveedorSearch(textSearch) {
        return this.$http.get(`/Proveedor/SearchProveedor?busqueda=${textSearch}`)
            .then(({
                data: response
            }) => response.data)
    }

    proveedorSearchGeneral(textSearch) {
        return this.$http.get(`/Proveedor/SearchProveedor?busqueda=${textSearch}`).then(
            response => {
                let proveedores = response.data.data
                if (response.data.id === '1') {
                    return proveedores.map(({
                        proveedor
                    }) => proveedor)
                }
                return []
            }
        )
    }

    getDataByProveedor(idProveedor) {
        try {
            showLoader();
            return this.mS.getData('get', '/Proveedor/GetId?idProveedor=' + idProveedor).then(
                response => {
                    if (response.id == "0") {
                        hideLoader();
                        toastr.warning(response.message, response.titleSms)
                        return response
                    }

                    if (response.id == "1") {
                        hideLoader();
                        const item = {};
                        const {
                            data
                        } = response;
                        item.tipoIdentificacion = {
                            idTipoIdentificacion: data.proveedor.idTipoIdentificacion,
                            identificacion: data.tipoIdentificacion
                        }

                        Object.assign(item, data.proveedor);
                        return item;
                    }
                }
            )
        } catch (error) {

        }
    }




    /**
     * Métodos relacionaddos con Almacen  *******************************************************
     */

    /**
     * -------------------------------Eliminar Posteriormente
     * 
     * Función que obtiene Familias, SubFamilias, Marca, modelo
     * @returns json 
    
     *@lectura const {
            subFamilias,
            familias,
            medidas,
            modelos,
            marcas,
            valoracionMetodos,
            tipoArticulos,
            tarifas,
            etiquetaActividades
        } = results[0]
     */
    getGestionAlmacen(json = {}) {
        return this.mS.getData('get', '/Almacen/Get?json=' + JSON.stringify())
            .then(
                response => {
                    const results = JSON.parse(response.payload);

                    return {
                        subFamilias: results[0],
                        familias: results[1],
                        medidas: results[2],
                        modelos: results[3],
                        marcas: results[4],
                        valoracionMetodos: results[5],
                        tipoArticulos: results[6],
                        tarifas: results[7],
                        etiquetaActividades: results[8],
                        movimientosStocks: results[9],
                        jsonPersmission: results[10]
                    }
                }
            ).catch(
                error => console.error(error)
            )
    }


    //---------------------------------------------Almacen-------------------------
    /**
     *Eliminar mas adelante esta función (depuracion se encuentra en inventario/services/articuloService.js)
     * @param {*} busqueda 
     * @param {*} isSearchByCodigo 
     * @returns 
     */
    articuloSearch(busqueda, isSearchByCodigo) {
        const txtRemovedAccents = this.removeAccents(busqueda);
        return this.$http.get(`/Articulo/SearchArticuloFilter?busqueda=${txtRemovedAccents}&condicion=${isSearchByCodigo}`)
            .then(({
                data: response
            }) => {
                if (response.id == "0") {
                    toastr.warning(response.message, response.titleSms);
                    return;
                }
                let {
                    filter: articulos
                } = response.data;
                return articulos.length > 0 ? this.getArticuloAsTemplate(articulos) : []
            })
    }

    getArticuloAsTemplate(articulos) {
        articulos[0].showHeader = true; //show header table item
        return articulos.map((val) => {
            val.getHistorialPrecio = () => {
                this.$http.get("/Articulo/HistoryEntradaArticulo?idArticulo=" + this.articulo.idArticulo)
                    .then(({
                        data: response
                    }) => {
                        val.historialPrecio = response.data;
                    })
            }
            val.templateUrl = "viewPoperHistorialPago.html";
            return val;
        });
    }



    //Eliminar mas adelante esta función (depuracion se encuentra en inventario/services/articuloService.js)
    articuloSearchGeneral({
        textSearch,
        code = false
    }) {
        const json = {
            bySearch: this.removeAccents(textSearch),
            code
        }
        // let articulos = [];

        if (textSearch.length < 3) return

        return this.mS.getData('get', '/Articulo/Get?json=' + JSON.stringify(json)).then(response => {
            if (response.code === '0') {
                throw response;
            }
            let articulos = JSON.parse(response.data) || []
            // if (articulos.length > 0) {
            //     articulos.unshift({
            //         showHeader: true
            //     })
            //articulos[0].showHeader = true; //show header table item
            //}
            return articulos
        })

    }

    //Eliminar mas adelante esta función (depuracion se encuentra en inventario/services/articuloService.js)
    getDataArticuloParaVenta({
        json
    }) {
        try {
            showLoader();
            return this.mS.getData('get', '/Articulo/GetIdBySale?json=' + JSON.stringify(json));
        } catch (error) {
            console.error(error)
        } finally {
            hideLoader();
        }
    }

    //Eliminar mas adelante esta función (depuracion se encuentra en inventario/services/articuloService.js)
    getDataArticuloParaCompra({
        json
    }) {
        try {
            showLoader();
            return this.$http.get('/Articulo/GetIdByPurchase?json=' + JSON.stringify(json))
                .then(({
                    data: response
                }) => response)
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }

    //Eliminar mas adelante esta función (depuracion se encuentra en inventario/services/articuloService.js)
    async searchArticuloByCodigo({
        busqueda
    }) {
        return await this.$http.get('/Articulo/SearchArticuloFilter?busqueda=' + busqueda + '&condicion=' + true)
            .then(({
                data: response
            }) => {
                if (response.id === "0") {
                    Swal.fire({
                        title: `<small>${response.titleSms}</small>`,
                        icon: 'warning',
                        html: `<small>${response.message}</small>`,
                        didClose: () => {
                            $("#searchArticulo").focus();
                        }
                    });
                    return
                };
                if (response.id === "2") {
                    let data = {
                        idArticulo: response.data.codigo.articulo.idArticulo,
                        idPresentacion: response.data.codigo.idPresentacion,
                        presentacion: response.data.codigo.presentacion
                    };
                    return data;
                }
            })
    }




    //--------------------------------------END ARTICLE----------------------------------------------------



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

    //Eliminar mas Adelante 
    getDataFormVenta() {
        return this.mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response => {
            if (response.code === '0') {
                throw response
            }
            return JSON.parse(response.payload)
        })
    }




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
    setUiGridDetalleCompra(detalleCompra, nombrePrecio = 'precioUnitario') {

        let index = 1;
        return detalleCompra.map(item => {
            item.n = index++

            const data = {
                idArticulo: item.idArticulo
            }

            this.articuloSvc.findForPurchase({
                idArticulo: item.idArticulo
            }).then(response => {
                item.medidas = response.medidas
                item.etiquetas = response.etiquetas;
            })

            let subTotal = item.cantidad * item.precioUnitario;
            let totalDescuento = item.cantidad * item.valorDescuento;

            if (!item.hasOwnProperty("total")) {
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

        const TIPO_DOC = this.tipoDoc[codigoDocumento];

        if (!(id > 0)) {
            throw "ID DOCUMENTO NO VÁLIDO"
        }

        switch (codigoDocumento) {
            case "FC":
                await this.mS.getData('get', `IngresoFacturaCompra/GetId?id=${id}`, null, true).then(response => {

                    if (response.code == "0") {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }
                    if (response.code === "1") {
                        let dataMain = JSON.parse(response.payload);
                        let datosAdicionales = []
                        dataDocumento = dataMain[0][0];
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);
                        dataDocumento.fechaVencimiento = this.form.formatDate(dataDocumento.fechaVencimiento)

                        proveedor = dataMain[1][0];

                        detalleDocumento = this.setUiGridDetalleCompra(dataMain[2])


                        datosAdicionales = dataMain[3].map(item => {
                            return {
                                idArticulo: item.idArticulo,
                                idEtiqueta: item.idEtiqueta,
                                idInfoAdicional: item.idInfoAdicional,
                                adicionales: JSON.parse(item.jsonAdicional),
                                estado: item.estado,
                            }
                        })

                        datosAdicionalesArticulo = datosAdicionales

                        isComplete = true;
                    }
                });
                break;

            case "IB":

                await this.mS.getData('get', `/IngresoBodega/GetId?id=${id}`).then(response => {
                    if (response.code === "0") {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }
                    if (response.code === "1") {
                        let dataMain = JSON.parse(response.payload)

                        dataDocumento = dataMain[0][0];
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);
                        dataDocumento.fechaVencimiento = this.form.formatDate(dataDocumento.fechaVencimiento)
                        proveedor = dataMain[1][0];
                        detalleDocumento = this.setUiGridDetalleCompra(dataMain[2]);
                        datosAdicionalesArticulo = dataMain[3];


                        isComplete = true;
                    }
                });
                break;

            case "LC":
                await this.mS.getData('get', "/LiquidacionCompra/GetId?id=" + id).then(response => {
                    if (response.code == "0") {
                        this.form.sweetAlert('warning', response.message)
                        throw response.message
                    }
                    if (response.code == "1") {
                        let dataMain = JSON.parse(response.payload)

                        dataDocumento = dataMain[0][0];
                        dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision);
                        dataDocumento.fechaVencimiento = this.form.formatDate(dataDocumento.fechaVencimiento)
                        proveedor = dataMain[1][0];
                        detalleDocumento = this.setUiGridDetalleCompra(dataMain[2]);
                        infoAdicionalDocumento = dataMain[3];

                        isComplete = true;
                    }
                })

                break;

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
                    idArticulo: item.idArticulo,
                }
                this.articuloSvc.findForSale(query).then(response => {
                    let { articulo, medidas, datosAdicionalesArticulo } = response;
                    item.medidas = medidas;
                    item.datosAdicionalesArticulo = datosAdicionalesArticulo;

                    let dataMedida = medidas.find(m => m.idMedida === item.idMedida) || {};
                    item.articuloTarifas = JSON.parse(dataMedida.tarifas);
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
        const TIPO_DOC = this.tipoDoc[codigoDocumento];

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
                await this.mS.getData('get', "/NotaEntrega/GetId?id=" + id).then(response => {
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
                            jsonAdicional: JSON.parse(item.jsonAdicional),
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
                await this.mS.getData('get', '/NotaCreditoCliente/GetId?id=' + id).then(response => {
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
        console.log(datosAdicionalesArticulo)
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

        await this.mS.getData('get', '/GuiaRemision/GetId?id=' + id).then(response => {

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
            detalleDocumento = [];

        await this.mS.getData('get', 'Consolidacion/?json=' + JSON.stringify({ tipo: 3, id: id }), null, true).then(response => {

            if (response.code === '0') {
                this.form.sweetAlert('warning', response.message)
                throw response.message
            }
            if (response.code === '1') {
                let dataMain = JSON.parse(response.payload);
                dataDocumento = dataMain[0][0];
                dataDocumento.fechaEmision = this.form.formatDate(dataDocumento.fechaEmision)
                detalleDocumento = dataMain[1]
                isComplete = true;
            }
        })

        return {
            isComplete,
            dataTipoDocumento,
            dataDocumento,
            detalleDocumento,
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

        await this.mS.getData('get', `/TransferenciaBodega/GetId?id=${id}`).then(response => {

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
                    this.getDataArticuloParaCompra({
                        json: item
                    }).then(response => {
                        item.medidas = JSON.parse(response.payload)[1]
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




    //--------------------------------------HISTORIAL DE CONVERSIÓN DEL DOCUMENTO VENTA---------------------
    async getHistorialConversionDocVenta({
        idComprobante,
        codigoDocumento
    }) {
        const tipoDoc = this.tipoDoc[codigoDocumento];
        let historialConversiones = [],
            isComplete = false;

        await this.$http.get(`/ConvertDocument/GetInformacionDoc?idTipoDoc=${tipoDoc.idTipoDocumento}&idDoc=${idComprobante}`)
            .then(({
                data: response
            }) => {
                if (response.id === null) {
                    toastr.info(`No se encontró documentos vinculados a esta ${tipoDoc.descripcion}`, '', {
                        positionClass: 'toast-bottom-center',
                        timeOut: 900,
                    })
                }
                if (response.id === '0') {
                    toastr.warning(response.message, response.titleSms)
                }
                if (response.id === '1') {
                    isComplete = true;
                    historialConversiones = JSON.parse(response.data) || []
                }
            })
        return {
            isComplete,
            historialConversiones
        }
    }

    //--------------------------------------------------REPORTE----------------------------------
    async getReport({
        method = "post",
        url = 'Reporte/Download',
        parameters,
        formatType = "pdf"
    }) {
        try {
            showLoader();
            await this.mS.getFile(method, url, parameters, true).then(response => {

                if (formatType === "pdf") {
                    let fileBlob = new Blob([response.data], {
                        type: response.data.type,
                    })
                    let objectUrl = window.URL || window.webkitURL;
                    let urlFile = objectUrl.createObjectURL(fileBlob);
                    // Ajuste horizontal
                    let x = parseInt((screen.width - 1200) / 2);
                    // Ajustae vertical
                    let y = parseInt((screen.height - 650) / 4);
                    window.open(
                        urlFile,
                        "_blank",
                        `resizable=yes
                    width=1200
                    height=650
                    screenY=${y}
                    screenX=${x}`
                    )

                } else {
                    let serverData = new Blob([response.data], {
                        type: response.headers()["content-type"],
                    });
                    // let fileName = response
                    //     .headers()["content-disposition"].split(";")[1]
                    //     .split("=")[1];
                    let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1].replace('"', "")
                    fileName = fileName.replace('"', "")
                    this.FileSaver.saveAs(serverData, fileName);
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
     * @param {object} param {parameters, format}
     */

    getReportDynamic({
        parameters,
        format
    }) {
        try {
            showLoader();

            this.mS.getFile('post', 'Reporte/DynamicReport', JSON.stringify(parameters), true).then(response => {
                hideLoader();

                if (format === "pdf") {
                    let fileBlob = new Blob([response.data], {
                        type: response.data.type,
                    })

                    let objectUrl = window.URL || window.webkitURL;
                    let urlFile = objectUrl.createObjectURL(fileBlob);

                    // Ajuste horizontal
                    let x = parseInt((screen.width - 1200) / 2);
                    // Ajustae vertical
                    let y = parseInt((screen.height - 650) / 4);

                    window.open(
                        urlFile,
                        "_blank",
                        `resizable=yes
                        width=1200
                        height=650
                        screenY=${y}
                        screenX=${x}`
                    )
                } else {
                    let serverData = new Blob([response.data], {
                        type: response.headers()["content-type"],
                    })

                    let fileName = response.headers()["content-disposition"].split(";")[1].split("=")[1];
                    this.FileSaver.saveAs(serverData, fileName);
                }
            }).catch(error => {
                hideLoader();
                console.log(error)
            })
        } catch (error) {
            hideLoader();
            console.log(error)
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
            this.getPrinter(parameters)
        }
    }

    getPrinter(parameters) {
        try {
            let url = `Impresion/?json=${parameters}`
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


            // console.log('init get name computer')           
            // console.log('end get name computer')

            // let response = await fetch(`${params[0].urlPrinter}?getMachine=true`);
            // if (!response.ok) {
            //   throw new Error('Network response was not ok');
            // }
            // const data = await response.json();
            // console.log(data);



            let urlPrinter = params[0].urlPrinter + '?rdlcProps=' + params[0].rdlcProps + '&dataSources=' + params[0].dataSources + '&rdlcParams=' + params[0].rdlcParams

            fetch(urlPrinter).then(function (response) {
                if (response.ok) {
                    toastr.success('Impresion correcta!', '', {
                        positionClass: 'toast-bottom-right',
                        progressBar: true
                    })
                } else {
                    toastr.warning('Error!', '', {
                        positionClass: 'toast-bottom-right',
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





    //--------------------------------PETICIONES PARA API ADMIN-CLIENTE----------------------
    async getDataApi({
        method,
        url,
        data = null,
        typeUrl
    }) {
        let urlApi = '';
        // let urlApi = await this.$http.get('/ConnectionApiAdmin/GetUrl?typeUrl=' + typeUrl).then(({data:response})=>response)    

        //IP Local 
        // urlApi = typeUrl == 1 ? "http://localhost:7166/" : "https://localhost:7166/";

        //IP Producción de Desarrollo 
        //urlApi = typeUrl == 1 ? "http://205.209.99.71:8090/" : "http://206.72.196.229:83/";


        //IP Producción
        urlApi = typeUrl == 1 ? "http://206.72.196.229:81/" : "http://206.72.196.229:83/";

        return this.$http({
            method,
            url: `${urlApi}${url}`,
            data
        }).then(({
            data: response
        }) => {
            return response
        }, error => {
            console.log(error)
        })
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
                params,
                size,
                windowClass
            })

        } catch (error) {
            console.log(error)
        }

    }


    async viewDetailDocument({
        id,
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
            let fileCtrl = null;
            let ctrl;
            let isRenderRazorPartial = false;

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
        await this.mS.getData('get', 'Solicitud/Check/' + JSON.stringify(jsonParams), null, true).then(response => {
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
                this.mS.getData('post', 'Solicitud/Post/' + jsonParams, null, true).then(response => {
                    console.log(response)
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
        this.mS.getData('put', 'Solicitud/Put/' + JSON.stringify({
            codigoAccion,
            typeOperation: 2
        }), null, true).then(response => {
            console.log(response)
        })
    }






    //----------------------------PERMISOS Invoice----------------------------
    getPermisos() {
        console.log(this.$rootScope)
    }

}




app.factory("commonService", CommonService);
class CommonService {
    static $inject = [
        "$rootScope",
        "$http",
        "mainService",
        "FileSaver",
        "formulario",
        "modalService",
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
        return this.mS.getData('get', 'Config/EstabAsig/?json=' + JSON.stringify(json)).then(response => {
            if (response.code === "0") {
                throw response
            }
            if(typeof response.payload==='string'){
                return JSON.parse(response.payload) || [];
            }
            return response || []
        })
    }

    removeAccents(str) {
        str = str || '';
        //return str.replace(/[^a-z0-9]/gi, '');
        return str.replace(/^-+|-+$| [^A-Za-z0-9.-]+/g, "");
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
    usuarioSearch(obj) {
        console.log(obj)
        let json = JSON.stringify({
            tipo: 3,
            textSearch: obj.busqueda
        })
        return this.mS.getData('get', `Config/UserCustomer/?json=${json}`).then(response => {
            if (response.code === "0") {
                return [];
            }
            let customerUsers = [];
            if(response && typeof response==='object'){
                customerUsers = response.userCustomers.map((user) => {
                    return {
                        idUsuario: user.idUsuario,
                        nombreCompleto: user.fullname || user.fullName,
                        nombreUsuario: user.username,
                        nroIdentificacion: user.idCard,
                    }
                })
            }
            return customerUsers;
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




    //--------------------------------------------------REPORTE----------------------------------
    async getReport(params) {
        try {
            let method = params.method || 'POST';
            let url = params.v2 ? 'Reports/v2/Reporte/Download' : params.url || 'Reports/Reporte/Download';
            let parameters = params.parameters;
            let formatType = params.formatType || "pdf";
            let downloadOnly = params.downloadOnly || false;
            let returnFile = params.returnFile;
            showLoader();
            if(returnFile){
                return this.mS.getFile(method, url, parameters, true);
            }
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

                    if (downloadOnly) {
                         var link = document.createElement('a');
                         link.href = urlFile
                         link.setAttribute('download', fileName);
                         document.body.appendChild(link);
                         link.click();
                         document.body.removeChild(link);
                    } else {
                        // Ajuste horizontal
                        let x = parseInt((screen.width - 1200) / 2);
                        // Ajustae vertical
                        let y = parseInt((screen.height - 650) / 4);

                        let newWindow = window.open(
                            urlFile,
                            "_blank",
                            `resizable=yes
                    width=1200
                    height=650
                    screenY=${y}
                    screenX=${x}`
                        )
                        setTimeout(function () {
                            if(newWindow && newWindow.document){
                                newWindow.document.title = fileName;
                            }
                        }, 1000);
                    }
                } else {
                    let serverData = new Blob([response.data], {
                        type: response.headers()["content-type"],
                    });
                    let filename = response.headers()['content-disposition'].split(';')[1].split('=')[1].replace('"', "")
                    filename = filename.replace('"', "")
                    this.FileSaver.saveAs(serverData, decodeURIComponent(filename));
                }
            }).catch(error => {
                hideLoader();
                if (error.status === 400) {
                    toastr.warning("No se pudo obtener el reporte", "Aviso", {
                        positionClass: "toast-bottom-center",
                        closeButton: true,
                        preventDuplicates: true,
                        progressBar: true,
                    });
                } else {
                    console.error("An error occurred:", error);
                }
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
            //this.mS
            //    .getData("POST", "https://acontplusprint.com/Print", parameters)
            //    .then((response) => {
            //        if (response.code === "0") {
            //            toastr.warning(response.message, "", {
            //                positionClass: "toast-bottom-right",
            //                closeButton: true,
            //                preventDuplicates: true,
            //                progressBar: true,
            //            });
            //        }
            //        if (response.code === "1") {
            //            toastr.success(response.message, "", {
            //                positionClass: "toast-bottom-right",
            //                closeButton: true,
            //                preventDuplicates: true,
            //                progressBar: true,
            //            });
            //        }
            //    })
            //    .catch((error) => {
            //        console.log(error);
            //    });
            this.getPrinter(parameters)
            //this.print(parameters);
        }
    }

    getPrinter(parameters) {
        try {
            let newParams = Object.assign(JSON.parse(parameters), { getUrlPrintServer: true });
            let url = `Config/Print/?json=${JSON.stringify(newParams)}`
            this.mS.getData('get', url).then(
                response => {
                    if (response.code === '0') {
                        toastr.warning(response.message)
                    }
                    if (response.code === '1') {
                        //this.print(JSON.parse(response.payload))
                        this.print(response.payload, parameters);
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

    async print(url, parameters) {
        try {
            this.mS
                .print("POST", `${url}/Print`, parameters)
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
            //let urlPrinter = params[0].urlPrinter + '?rdlcProps=' + params[0].rdlcProps + '&dataSources=' + encodeURIComponent(params[0].dataSources) + '&rdlcParams=' + params[0].rdlcParams
            //this.mS.getData('POST', urlPrinter).then(data => {
            //    if (data.code == "0") {
            //        toastr.warning(data.message, '', {
            //            positionClass: 'toast-bottom-right',
            //            closeButton: true,
            //            preventDuplicates: true,
            //            progressBar: true
            //        })
            //    }
            //    if (data.code == "1") {
            //        toastr.success(data.message, '', {
            //            positionClass: 'toast-bottom-right',
            //            closeButton: true,
            //            preventDuplicates: true,
            //            progressBar: true
            //        })
            //    }
            //}).catch(function (error) {
            //    console.log('Hubo un problema al imprimir:' + error.message);
            //})
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



    //Permiso para editar o anular Doc. Venta
    /**
     * NO USAR
     * @param {*} codigoAccion
     * @returns
     */
    async checkHasPermissionToEditOrDelete(codigoAccion) {
        let jsonParams = {
            typeList: 2,
            codigoAccion,
        }
        let result = {};

        showLoader();
        await this.mS.getData('get', 'Config/Solicitud/Check/' + JSON.stringify(jsonParams)).then(response => {
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


    /**
     * NO USAR
     * @param {*} codigoAccion
     * @returns
     */
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
                this.mS.getData('post', 'Config/Solicitud/Post/' + jsonParams).then(response => {
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


    /**
     * NO USAR
     * @param {*} codigoAccion
     * @returns
     */
    updateRequestKey(codigoAccion) {
        this.mS.getData('put', 'Config/Solicitud/Put/' + JSON.stringify({
            codigoAccion,
            typeOperation: 2
        })).then(response => {
            console.log(response)
        })
    }



    //========================================END POINT EXTERNOS==================
    checkClientSRIByRUC = function (identificacion) {
        return this.mS.getData('get', 'Consultas/GetRucSRI?Ruc=' + identificacion).then(response => {
            return response;
        })
    }


    checkClientSRIByCedula = function (identificacion) {
        return this.mS.getData('get', 'Consultas/GetCedulaSri?Ruc=' + identificacion).then(response => {
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





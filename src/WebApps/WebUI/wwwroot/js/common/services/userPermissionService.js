angular.module('acontPlusApp')
    .factory('userCustomerPermissionService', ['$injector', function ($injector) {
        const mS = $injector.get('mainService');
        const fS = $injector.get('formulario');
        const urlUserRequest = 'Config/UserCustomerRequest/'
        const urlUserPermission = 'Config/UserCustomerPermission/'
        return {
            userPermissionAdapter,
            accionesSubMenu,
            checkHasPermissionToEdit, 
            checkHasPermissionToDelete,
            requestAuthorizationKey,
            updateRequestKey,
            fetchUserPermission
        }

        function getUserData() {
            return JSON.parse(localStorage.getItem('userData'));
        }
        function userPermissionAdapter() {

            let userData = getUserData();
            if (userData) {
                const { product, cashAccounting, sales } = Array.isArray(userData.permissions) && userData.permissions[0] || {
                    product: {},
                    cashAccounting: {},
                    sales: {}
                }

                return {
                    sales: saleAdapter(sales),
                    cashAccounting: cashAccountingAdapter(cashAccounting),
                    product: producAdapter(product),
                    permisoEditarDoc: saleAdapter(sales).permisoEditarDoc
                }

            }
            else {
                console.error('Error al mapear los permisos')
            }

        }

        function saleAdapter(sales) {
            let comprobante = {};
            let detalle = {
                tarifa: true,
                medida: true,
                tipoIva: true,
                porcentajeDescuento: true,
                descuento: true,
                precioUnitario: true,
                precioConIva: true,
            };
            let adicionales = {};
            if (Array.isArray(sales)) {
                const mainData = sales[0];
                comprobante = typeof mainData.comprobante === 'string' ? JSON.parse(mainData.comprobante) || {} : {}
                detalle = typeof mainData.detalle === 'string' ? JSON.parse(mainData.detalle) || {} : {}
                adicionales = typeof mainData.adicionales === 'string' ? JSON.parse(mainData.adicionales) || {} : {}
            }

            return {
                comprobante: comprobante,
                detalle: detalle,
                adicionales: adicionales,
                permisoEditarDoc: {
                    requiereClave: adicionales.keyRequest
                }
            }
        }
        function cashAccountingAdapter(cashAccounting) {
            if (Array.isArray(cashAccounting)) {
                return cashAccounting[0] || {}
            }
            return {}

        }
        function producAdapter(product) {
            const permissionDefault = {
                nroPrecio: false
            }
            if (Array.isArray(product)) {
                return product[0] || permissionDefault
            }
            return permissionDefault
        }

        function accionesSubMenu() {
            let { menus } = getUserData(); 

            let accionesDefault = {
                leer: false,
                crear: false,
                editar: false,
                eliminar: false,
                reporte: false,
                enviarCorreo: false,
                cobroPago: false,
                enviarSri: false,
                historialFinanciero: false,
                cuota: false,
                anular: false,
                impuesto: false,
                kardex: false,
                imagen: false,
                acceso: false,
                aperturarCaja: false,
                cerrarCaja: false,
                generarDocumento: false,
                movimiento: false,
            }
          
            let accionesProduct = menus.find(sm => sm.code === 'ART');
            if (!accionesProduct){
                return {
                    accionesProduct: accionesDefault 
                }
            }
            let tempArray = typeof accionesProduct.actions==='string'? JSON.parse(accionesProduct.actions) : []
            let newArr = tempArray.map(x => x.name);
            const namesObject = newArr.reduce((obj, name) => {
                obj[name] = true;
                return obj;
            }, {});

            return {
                accionesProduct: namesObject || accionesDefault
            }
        }



        async function checkHasPermissionToEdit(obj) {
            const { idDocumento, codDoc } = obj;
            let json = JSON.stringify({
                codigoAccion: 'E',
                tipo: 2,
                idDocumento,
                codDoc
            })
            let resultReponse = {};
            showLoader();
            await mS.getData('get', `${urlUserRequest}?json=${json}`).then(result => {
                if (result !== null && typeof result === 'object') {
                    const [response] = result.response;
                    console.log(response)
                    resultReponse = response;
                    if (response.code === "0") {
                        hideLoader();
                        fS.sweetAlert('warning', response.message, response.titleSms);
                        resultReponse = null;
                        throw response;
                    }
                }
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader())
            return resultReponse;
        }

        async function checkHasPermissionToDelete(obj) {
            const { idDocumento, codDoc } = obj;
            let json = JSON.stringify({
                codigoAccion: 'A',
                tipo: 2,
                idDocumento,
                codDoc
            })
            let resultReponse = {};
            showLoader();
            await mS.getData('get', `${urlUserRequest}?json=${json}`).then(result => {
                if (result !== null && typeof result === 'object') {
                    const [response] = result.response;
                    console.log(response)
                    resultReponse = response;
                    if (response.code === "0") {
                        hideLoader();
                        fS.sweetAlert('warning', response.message, response.titleSms);
                        resultReponse = null;
                        throw response;
                    }
                }
            })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => hideLoader())
            return resultReponse;
        }

        async function requestAuthorizationKey(obj) {
            const { codigoAccion } = obj;
            let textMotivo = codigoAccion === 'E' ? 'Editar' : 'Anular';
            Swal.fire({
                title: "Solicitud de permiso para " + textMotivo,
                text: `Por favor, proporcione una explicación del motivo por el cual desea ${textMotivo} el documento!`,
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocomplete: 'off'
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
                    try {
                        let params = {
                            ...obj,
                            motivo: result.value,
                        };
                        showLoader();
                        mS.getData('post', `${urlUserRequest}`, { data: params }, true).then(response => {
                            hideLoader();
                            if (response.code === "0") {
                                fS.sweetAlert('warning', response.message)
                            }
                            if (response.code === "1") {
                                fS.sweetAlert('success', response.message, response.titleSms, 1000);
                            }
                        }).catch(error => {
                            console.log(error)
                        }).finally(() => hideLoader())
                    } catch (error) {
                        hideLoader();
                        console.log(error)
                    }
                }
            })
        }


        function updateRequestKey(params) {
            let data = {
                idDocumento: params.idDocumento,
                codDoc: params.codDoc,
                codigoAccion: params.codigoAccion,
                tipo: 2
            }
            mS.getData('put', `${urlUserRequest}`, { data }, true).then(response => {
                console.log(response)
            })
        }

        function fetchUserPermission() {
            return mS.getData('get', `${urlUserPermission}?json=${JSON.stringify({ tipo: 2 })}`).then(response => {
                if (response) {
                    const {detalle} = response.sales[0]
                     return {
                         detalle: JSON.parse(detalle)
                     };

                }
            })
        }

    }])

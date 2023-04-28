 import {
     ArticuloTarifaGridOption
 } from './../helpers/articuloTarifaGridOption.min.js?v=0.20';

 class ModalBaseCtrl {
     constructor({
         $scope,
         _mS,
         _commonSvc,
         _form
     }) {
         this.$scope = $scope;
         this._mS = _mS;
         this._commonSvc = _commonSvc;
         this._form = _form;

         this.tarifaInstance = new ArticuloTarifaGridOption(_form);
     }

     initiload() {
         return Promise.all([
             this._commonSvc.getGestionAlmacen(),
             this._commonSvc.getGestionConfig(),
             this._commonSvc.getAllImpuestoEstado(),
             // this._mS.getData('get', '/ActividadEtiqueta/Get?json=' + JSON.stringify({})),            
         ])
     }

     async openModalMedida() {
         let {
             MODAL_CTRL,
             MODAL_CSHTML
         } = this._nombreModal.medida;
         const {
             ModalMedidaCtrl
         } = await import(`./../modal/${MODAL_CTRL}`);
         const uibModalRef = this._modalSvc.openModalCustom({
             controller: ModalMedidaCtrl,
             template: `Medida/${MODAL_CSHTML}`,
             size: 'md',
         })

         uibModalRef.result.then(async result => {
             if (typeof result !== 'object') return
             const results = await this.initiload();
             this.medidas = results[0].medidas;
             this.data.idMedida = this.medidas.at(this.medidas.length - 1).idMedida;
         })
     }


     //generate barcode

     getBarcode = function () {
         // console.log(item)
         if (!this.data.codigoBarra || !this.data.descripcion) {
             this._toastr.toastr('warning', "Debe ingresar la descripción y el código de barra del artículo para generar el código de barras")
             return
         }
         let codigoBarra = this.data.codigoBarra;
         let descripcion = this.data.descripcion;
         let barcodeCard = null;

         Swal.fire({
             // icon:'info',
             html: `<div class="card">
                    <card class="card-header text-center bg-transparent">
                        Código de Barra
                    </card>
                    <div class="card-body border border-danger" id="cardBusiness">                        
                        <h6 class="text-center">${descripcion}</h6>
                        <img id="barcode" alt="">
                    </div>
                    <div class="card-footer">                     
                        <button type="button" class="btn btn-success btn-block" id="btnBarcodeExport">
                            <i class="ti-download"></i> Descargar
                        </button>
                    </div>
                </div>`,
             showConfirmButton: false,
             showCancelButton: false,
             showDenyButton: false,
         })

         JsBarcode("#barcode", codigoBarra, {
             format: "CODE128",
             lineColor: "#000",
             width: 2,
             // height: 75,
             // displayValue: false
         });

         document.getElementById("btnBarcodeExport").addEventListener("click", e => {

             let container = document.getElementById("cardBusiness");; /* full page */

             html2canvas(container, {
                 allowTaint: true
             }).then(function (canvas) {

                 let link = document.createElement("a")
                 document.body.appendChild(link)
                 link.download = codigoBarra + "_barcode.jpg"

                 link.href = canvas.toDataURL()
                 link.target = '_blank';
                 link.click()
                 link.download()
                 // let image = new Image();
                 // image.src = canvas.toDataURL()

                 // let w = window.open("", '_blank');
                 // w.document.write(image.outerHTML);
                 // w.document.close();
             });
         })

     }


 }

 /**
  * Clase para gestionar Insert, Update al Articulo
  * @params _params {idArticulo: 1, ...}
  */
 export class ModalArticuloCtrl extends ModalBaseCtrl {

     static $inject = [
         '$scope',
         '$timeout',
         '$interval',
         '$uibModalInstance',
         'mainService',
         'commonService',
         'modalService',
         'nombreModal',
         'toastService',
         'formulario',
         'params',
         'decodeToken'
     ]

     constructor($scope, $timeout, $interval, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModal, _toastr, _form, _params, decodeToken) {
         super({
             $scope,
             _mS,
             _commonSvc,
             _form
         })
         this.$scope = $scope;
         this.$timeout = $timeout;
         this.$interval = $interval;
         this.$uibModalInstance = $uibModalInstance;
         this._commonSvc = _commonSvc;
         this._modalSvc = _modalSvc;
         this._nombreModal = _nombreModal;
         this._toastr = _toastr;
         this._params = _params;

         this.step = 1; //Por Defecto Tab General 
         this.data = {};
         this.tipoRegistro = 1;

         this.subFamilias = [];
         this.medidas = [];
         this.tipoArticulos = [];
         this.tipoArticulo = {};
         this.actividades = [];
         this.tarifas = [];

         this.gridOptions = this.tarifaInstance.getTarifaGrid($scope, $interval);

         this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol);
         this.json = {
             typeList: 1,
             idRol: this.idUsuarioRol
         }

     }

     async $onInit() {
         try {
             showLoader();
             let results = await this.initiload();

             const {
                 subFamilias,
                 familias,
                 medidas,
                 modelos,
                 marcas,
                 valoracionMetodos,
                 tipoArticulos,
                 tarifas,
                 etiquetaActividades,
                 jsonPersmission
             } = results[0];

             let moduloDecimales = results[1];
             let estadoImpuestos = results[2];

             //Permisos Especiales asignados por el usuario 




             this.subFamilias = subFamilias;

             //Tipo Articulo
             this.tipoArticulos = tipoArticulos;
             this.data.idTipoArticulo = this.tipoArticulos.length > 0 ? this.tipoArticulos[0].idTipoArticulo : 0

             //Medida 
             this.medidas = medidas;
             this.data.idMedida = this.medidas.length > 0 ? this.medidas[0].idMedida : 0;

             //Etiqueta Actividades 
             this.etiquetaActividades = etiquetaActividades;
             //Aplicacion de Permisos
             this.articlePermission = JSON.parse(jsonPersmission[0].jsonPermission);
             this.gridOptions.articlePermission = this.articlePermission;

             this.tarifas = tarifas;

             this.marcas = marcas
             this.modelos = modelos;


             this.config = moduloDecimales[0][0];
             this.tarifaInstance.setConfigDecimal = this.config;

             this.tipoIces = estadoImpuestos[1];
             this.tipoIvas = estadoImpuestos[0];
             this.tipoIva = this.tipoIvas.find(item => item.codigo == "IVA12");

             this.setCodigoSecuencialArticulo();
             this.setGridTarifa();
             this.getEstablecimientos();

             hideLoader();

             //Registro de artículo desde Importación 
             if (this._params && this._params.isImport) {
                 this.data.codigo = this._params.codigo;
                 this.data.codigoAuxiliar = this._params.codigoAuxiliar;
                 this.data.codigoBarra = this._params.codigo;
                 this.data.descripcion = this._params.descripcion;
                 this.data.precioCosto = this._form.roundNumber(this._params.precioCosto, this.config.nroPrecio);
                 this.tarifaInstance.setPrecioCosto = this.data.precioCosto;
                 return
             }



             //Actualizar artículo 
             if (this._params) {
                 this.tipoRegistro = 2;
                 this.getDataArticulo();


                 //Disabled Column 
                 for (let item of this.gridOptions.columnDefs) {
                     if (["precioConIva", "porcentajeUtilidad", "ganancia"].includes(item.field)) {
                         item.visible = this.articlePermission.precio.update;
                         // item.enableCellEdit = this.jsonArticlePermission.precio.update;
                         // item.enableCellEditOnFocus = this.jsonArticlePermission.precio.update;
                     }
                     if (item.field === "precioVenta") {
                         item.enableCellEdit = this.articlePermission.precio.update;
                         item.enableCellEditOnFocus = this.articlePermission.precio.update;
                     }
                 }
             }
         } catch (error) {
             console.error(error)
             hideLoader();
         }

         this.$uibModalInstance.rendered.then(resolve => {


         })
     }


     getEstablecimientos() {
         this._commonSvc.getEstabAsign({}).then(establecimientos => {
             this.establecimientos = establecimientos;

             let dataEstab = this.establecimientos[0];
             this.data.codEstab = dataEstab.codEstab;

             this.getBodegas(dataEstab);
         })
     }

     onChangeEstablecimiento() {
         let dataEstab = this.establecimientos.find(item => item.codEstab === this.data.codEstab);
         this.getBodegas(dataEstab);
     }

     getBodegas(dataEstab) {

         this._mS.getData('get', '/EstabAsig/GetDataForm?json=' + JSON.stringify(dataEstab)).then(response => {
             if (response.code === '0') {
                 throw response
             }
             let results = JSON.parse(response.payload) || [];
             this.bodegas = results[1];

             if (this.bodegas.length > 0) {
                 this.data.idBodega = this.bodegas[0].idBodega;
             } else {
                 this._toastr.toastr('info', 'No tienes asignado ninguna Bodega')
             }

         })
     }

     setCodigoSecuencialArticulo() {
         if (this.subFamilias.length === 0 || (this._params && this._params.isImport)) return
         const {
             codigo,
             idSubFamilia
         } = this.subFamilias[0]
         this.data.idSubFamilia = idSubFamilia;
         this.setCodigo(codigo)
     }

     getArticuloCodigo() {
         if (this._params && this._params.isImport) return

         if (this.tipoRegistro === 1 && this.subFamilias.length > 0) {
             let {
                 codigo
             } = this.subFamilias.find(val => val.idSubFamilia === this.data.idSubFamilia);
             this.setCodigo(codigo)
         }
     }

     setCodigo(codigo) {
         this.data.codigo = codigo;
         this.data.codigoAuxiliar = 'AUX-' + codigo;
         this.data.codigoBarra = codigo;
     }

     setGridTarifa() {
         this.gridOptions.data = this.tarifas.map(item => {
             item.tarifa = item.descripcion;
             item.precioVenta = 0;
             item.precioConIva = 0;
             item.porcentajeUtilidad = 0;
             item.porcentajeIva = this.tipoIva.porcentaje;
             item.predeterminadaVal = item.predeterminada === true ? 'Predeterminada' : '',
                 item.predeterminada = item.predeterminada;
             item.precioPredeterminado = item.predeterminada;
             item.ganancia = 0;
             return item;
         })
     }



     getDataArticulo() {
         try {
             this._mS.getData('get', '/Articulo/GetId?id=' + this._params.idArticulo).then(
                 response => {
                     if (response.code === "0") {
                         throw response
                     }
                     const results = JSON.parse(response.payload)
                     this.data = results[0][0]
                     this.tipoIva = this.tipoIvas.find(item => item.idTipoIva === this.data.idTipoIva);
                     this.tarifaInstance.setPrecioCosto = this.data.precioCosto;
                     this.tarifaInstance.setPorcentajeIva = this.tipoIva.porcentaje;

                     this.gridOptions.data = results[1].map(item => {
                         let ganancia = item.precioVenta - this.data.precioCosto;
                         item.ganancia = this._form.roundNumber(ganancia, 5);
                         return item;
                     })

                     if (this.data.caducidad) {
                         this.data.fechaCaducidad = new Date(this.data.fechaCaducidad)
                     } else {
                         this.data.fechaCaducidad = null;
                     }

                     if (this.data.datosLote) {
                         this.data.fechaCreacion = new Date(this.data.fechaCreacion);
                         this.data.fechaCaducidadLote = new Date(this.data.fechaCaducidadLote)
                     } else {
                         this.data.fechaCreacion = null;
                         this.data.fechaCaducidadLote = null
                     }

                     //Cuando es editar el articulo desde Importación
                     if (this._params.isUpdateImport) {
                         console.log('is update import', this._params.isUpdateImport)
                     }
                 }
             )

         } catch (error) {
             console.log(error)
         }
         // this.data    = result.data; 

     }

     onTabArticulo(step) {
         this.step = step;
         if (this.step === 3) {
             this._cb = new ArticuloCodigoBarra(this._mS, this._form, this._params);
         }

         if (this.step === 4 || this.tipoRegistro === 2) {
             this._aUbic = new UbicacionArticulo(this._mS, this._form, this._commonSvc, this._params)
         }
     }

     async openModalSubFamilia() {
         const {
             MODAL_CTRL,
             MODAL_CSHTML
         } = this._nombreModal.subFamilia
         const {
             ModalSubFamiliaCtrl
         } = await import(`./../modal/${MODAL_CTRL}`);

         const modalRef = this._modalSvc.openModalCustom({
             controller: ModalSubFamiliaCtrl,
             template: `SubFamilia/${MODAL_CSHTML}`,
             size: 'md',
         })

         modalRef.result.then(async result => {
             if (typeof result !== 'object') return

             const results = await this.initiload();
             this.subFamilias = results[0].subFamilias;
             this.setCodigoSecuencialArticulo();
         })
     }

     async openModalMarca() {
         const {
             MODAL_CTRL,
             MODAL_CSHTML
         } = this._nombreModal.marca;
         const {
             ModalMarcaCtrl
         } = await import(`./../modal/${MODAL_CTRL}`);
         const uibModalRef = this._modalSvc.openModalCustom({
             controller: ModalMarcaCtrl,
             template: `Marca/${MODAL_CSHTML}`,
             size: 'md'
         })
         uibModalRef.result.then(async result => {
             if (typeof result !== 'object') return
             const results = await this.initiload();
             this.marcas = results[0].marcas;
             this.data.idMarca = this.marcas.at(this.marcas.length - 1).idMarca;
         })
     }

     async openModalModelo() {
         const {
             MODAL_CTRL,
             MODAL_CSHTML
         } = this._nombreModal.modelo;
         const {
             ModalModeloCtrl
         } = await import('./../modal/' + MODAL_CTRL);

         const _uibModalRef = this._modalSvc.openModalCustom({
             controller: ModalModeloCtrl,
             template: 'Modelo/' + MODAL_CSHTML,
             size: 'md'
         })

         _uibModalRef.result.then(async result => {
             if (typeof result !== 'object') return
             const results = await this.initiload();
             this.modelos = results[0].modelos;
             this.data.idModelo = this.modelos.at(this.modelos.length - 1).idModelo;
         })
     }

     //Calcular Tarifa al momento de agregar el articulo 
     recalculateTarifaAdd() {
         if (this.tipoRegistro === 2 && !this.articlePermission.precio.update) {
             this._toastr.toastr('warning', 'No tienes permiso para realizar esta acción')
             return
         }

         if ([null, undefined, "", 0].includes(this.data.precioCosto) || isNaN(this.data.precioCosto)) return

         this.data.precioCosto = this._form.roundNumber(this.data.precioCosto, this.config.nroPrecio)

         this.tarifaInstance.setPrecioCosto = this.data.precioCosto;
         this.tarifaInstance.setPorcentajeIva = this.tipoIva.porcentaje;
         this.tarifaInstance.recalculateTarifaAdd();
     }

     recalculateTarifaUpdate() {
         if ([null, undefined, "", 0].includes(this.data.precioCosto) || isNaN(this.data.precioCosto)) return

         this.data.precioCosto = this._form.roundNumber(this.data.precioCosto, this.config.nroPrecio)
         this.tarifaInstance.setPrecioCosto = this.data.precioCosto;
         this.tarifaInstance.setPorcentajeIva = this.tipoIva.porcentaje;
         this.tarifaInstance.recalculateTarifaUpdate(this.opcionCalculate);

     }

     // redondearPrecioCosto() {
     //     if ([null, undefined, "", 0].includes(this.data.precioCosto) || isNaN(this.data.precioCosto)) return

     //     let precioCosto = this._form.roundNumber(this.data.precioCosto, this.config.nroPrecio);
     //     this.data.precioCosto = precioCosto;
     // }


     //Guardar/Actualizar Articulo 
     saveUpdateArticulo() {
         let titulo = this.tipoRegistro === 1 ? 'Agregar' : 'Actualizar';

         if (this.tipoRegistro == 1) {
             if (this._form.campo(this.data.descripcion)) {
                 this._toastr.toastr('warning', 'Ingrese la Descripción del Articulo', titulo);
                 return;
             }

             if (this._form.campo(this.data.codigoBarra)) {
                 this._toastr.toastr('warning', 'Ingrese el Código de Barra del Articulo', titulo);
                 return;
             }

             if (this._form.campo(this.data.idTipoArticulo)) {
                 this._toastr.toastr('warning', 'Seleccione el Tipo Articulo', titulo);
                 return;
             }

             if (this._form.campo(this.data.idMedida)) {
                 this._toastr.toastr('warning', 'Seleccione la Medida', titulo);
                 return;
             }

             if (this._form.campo(this.data.precioCosto) || isNaN(this.data.precioCosto)) {
                 this._toastr.toastr('warning', 'Ingrese el Precio de Costo del Articulo', titulo);
                 return;
             }

             if (this.data.datosAdicionales) {
                 if (this.data.idActividad === null || this.data.idActividad === undefined || this.data.idActividad === 0) {
                     this._toastr.toastr('warning', 'Seleccione la actividad', titulo);
                     return
                 }
             }
             //if (_form.campo($scope.data.precioVenta)) {
             //    logger.warning('Por favor, ingrese el Precio de Venta del Articulo', $scope.tituloModal);
             //    return;
             //}
             //if (_form.campo($scope.data.precioConIva)) {
             //    logger.warning('Por favor, ingrese el Precio con IVA del Articulo', $scope.tituloModal);
             //    return;
             //}
         }

         if (this.tipoRegistro == 1 || this.tipoRegistro == 2) {
             if (this._form.campo(this.data.descripcion)) {
                 this._toastr.toastr('warning', 'Ingrese la Descripción del Articulo', titulo);
                 return;
             }
             //if (_form.campo($scope.familia.idFamilia)) {
             //    logger.warning('Por favor, seleccione la Familia del Articulo', $scope.tituloModal);
             //    return;
             //}
             if (this._form.campo(this.data.idSubFamilia) || this.data.idSubFamilia === 0) {
                 this._toastr.toastr('warning', 'Seleccione la Sub Familia del Articulo', titulo);
                 return;
             }

             if (this._form.campo(this.data.codigo)) {
                 this._toastr.toastr('warning', 'Ingrese el Código del Articulo', titulo);
                 return;
             }

             if (this._form.campo(this.data.idTipoArticulo) || this.data.idTipoArticulo === 0) {
                 this._toastr.toastr('warning', 'Seleccione el Tipo Articulo', titulo);
                 return;
             }

             if (this._form.campo(this.data.idMedida) || this.data.idMedida === 0) {
                 this._toastr.toastr('warning', 'Seleccione la Medida', titulo);
                 return;
             }

             if (this.data.caducidad) {
                 if (this._form.campo(this.data.fechaCaducidad)) {
                     this._toastr.toastr('warning', 'Ingrese la fecha de Caducidad del Articulo', titulo);
                     return;
                 }
             }

             if (this.data.datosLote) {
                 if (this._form.campo(this.data.lote)) {
                     this._toastr.toastr('warning', 'Ingrese el Lote', titulo);
                     return;
                 }
                 if (this._form.campo(this.data.fechaCreacion)) {
                     this._toastr.toastr('warning', 'Ingrese la fecha de Creación', titulo);
                     return;
                 }
                 if (this._form.campo(this.data.fechaCaducidadLote)) {
                     this._toastr.toastr('warning', 'Ingrese la fecha de Caducidad del Lote', titulo);
                     return;
                 }
             }
         }

         if (this._form.campo(this.data.precioCosto) || isNaN(this.data.precioCosto)) {
             this._toastr.toastr('warning', 'Ingrese el Precio de Costo del Articulo', titulo);
             return;
         }

         if (this.data.precioCosto === 0) {
             this._toastr.toastr('warning', 'El valor mínimo en el precio de costo es 0.01', titulo);

             return
         }

         this.data.idTipoIva = this.tipoIva.idTipoIva;

         const senData = {
             jsonArticulo: JSON.stringify(this.data),
             jsonpvp: JSON.stringify(this.gridOptions.data),
             idBodega: this.data.idBodega,
             ubicacion: this.data.ubicacion
         }


         let URL = this.tipoRegistro === 1 ? '/Articulo/Post' : '/Articulo/Put?idArticulo=' + this.data.idArticulo;
         const method = this.tipoRegistro === 1 ? 'post' : 'put';

         this._mS.getData(method, URL, senData).then(
             response => {
                 if (response.id == 0 || response.code == 0) {
                     this._toastr.toastr('warning', response.message, response.titleSms);
                     return;
                 };
                 if (response.id == 1 || response.code == 1) {
                     let mainData = {}
                     if (this.tipoRegistro === 1) {
                         mainData = JSON.parse(response.payload)[0]
                     }

                     const data = {
                         idArticulo: this.tipoRegistro === 1 ? mainData.idArticulo : this._params.idArticulo,
                         idPresentacion: this.tipoRegistro === 1 ? mainData.data : this._params.idPresentacion,
                         presentacion: this.tipoRegistro === 1 ? mainData.gestion : this._params.presentacion,
                         idMedida: this.data.idMedida,
                         codigoPrincipal: this.data.codigo,
                         codigoAuxiliar: this.data.codigoAuxiliar,
                         codigoBarra: this.data.codigoBarra
                     }
                     this.$uibModalInstance.close(data)
                     this._toastr.toastr('success', response.message, response.titleSms);
                 }
             }
         )
     }

     closeModal() {
         if (this.tipoRegistro === 1 && (!this._form.campo(this.data.descripcion) || !this._form.campo(this.data.precioCosto))) {
             Swal.fire({
                 icon: 'warning',
                 html: `<small>Está seguro/a de salir sin guardar los datos del artículo?</small>`,
                 confirmButtonText: 'Sí, salir',
                 showDenyButton: true,
                 denyButtonText: 'No, cancelar'
             }).then(result => {
                 if (result.isConfirmed) {
                     this.$uibModalInstance.close();
                 }
             })
             $('.swal2-container').css("z-index", '999999');
             return
         }
         this.$uibModalInstance.close();
     }

 }


 //-------------------------------------LISTA DE ARTICULO CON INFORMACIÓN COMPLETA------------------------
 /**
  * Clase para gestionar el buscador avanzado del articulo, trae las bodegas y pvps 
  * @params null
  */

 export class ModalArticuloGeneralCtrl {
     static $inject = ['$scope', '$rootScope', '$timeout', '$uibModalInstance', 'mainService', 'modalService', 'nombreModal', 'toastService'];
     constructor($scope, $rootScope, $timeout, $uibModalInstance, _mS, _modalSvc, _nombreModal, _tS) {

         this.$scope = $scope;
         this.$timeout = $timeout;
         this.$uibModalInstance = $uibModalInstance;
         this._mS = _mS;
         this._modalSvc = _modalSvc;
         this._nombreModal = _nombreModal;
         this._tS = _tS;

         this.dataSearch = {};
         this.dataSearch.busqueda;
         this.dataSearch.numeroPagina = 0;
         this.dataSearch.cantidadRegistro = 15;
         this.dataSearch.stock = 0;
         this.dataSearch.byColumn = "DESC";

         this.listaArticulos = [];
         this.selectedArticulos = [];


         this.tipoBusquedas = [{
                 codigo: 'DESC',
                 descripcion: "Descripción"
             },
             {
                 codigo: 'COD',
                 descripcion: "Código"
             },
             {
                 codigo: 'AUX',
                 descripcion: "Código Auxiliar"
             },
             {
                 codigo: 'BAR',
                 descripcion: "Código Barra"
             }
         ]

         this.dynamicPopover = {
             content: 'Hello, World!',
             templateUrl: 'myPopoverTemplate.html',
             title: 'Title'
         }

         this.options = {
             rowSelection: true,
             multiSelect: false,
             autoSelect: false,
             decapitate: false,
             largeEditDialog: false,
             boundaryLinks: false,
             limitSelect: true,
             pageSelect: true
         }

         this.$uibModalInstance.rendered.then(res => {
             $("#inputTextSearch").focus();
         })



     }



     validarCampoText(text) {
         return [null, undefined, ""].includes(text);
     }

     consultarPrecioSearchText() {
         this.listaArticulos = []; //Vaciar el array (Lista de Articulos);                                          
         if (this.validarCampoText(this.dataSearch.busqueda) && this.dataSearch.busqueda.length < 2) return
         this.querySearchArticulo();
     }

     querySearchArticulo() {
         this.dataSearch.numeroPagina = 1;


         this._mS.getData('get', '/Articulo/List?json=' + JSON.stringify(this.dataSearch)).then(response => {

             if (response.code === "0") {
                 this.listaArticulos = []; //Vaciar el array (Lista de Articulos);  
                 this._tS.toastr('warning', response.message, response.titleSms);
                 return
             }

             let parseArticulos = JSON.parse(response.payload)
             this.listaArticulos = parseArticulos.map(item => {
                 item.tarifa = JSON.parse(item.tarifa);
                 return item;
             })
             this.tarifas = this.listaArticulos.length > 0 ? this.listaArticulos[0].tarifa : [];
         })

     }

     consultarPrecioEnter($event) {
         if (!this.validarCampoText(this.searchText) && $event.key === "Enter") {
             this.querySearchArticulo();
             this.dataSearch.busqueda = '';
         }
     }

     async openModalFiltro() {
         const {
             MODAL_CTRL,
             MODAL_FILTRO_CSHTML
         } = this._nombreModal.articulo;
         const {
             ModalFiltroCtrl
         } = await import('./../modal/' + MODAL_CTRL);

         const modalDialogRef = this._modalSvc.openModalCustom({
             controller: ModalFiltroCtrl,
             template: 'Articulo/' + MODAL_FILTRO_CSHTML,
             size: 'lg',
             params: this.dataSearch
         })
         modalDialogRef.result.then(async result => {
             this.dataSearch = Object.assign(this.dataSearch, result);
             if (result.isSearch) {
                 this.dataSearch.busqueda = null;
                 this.querySearchArticulo();
             }
         })
     }

     onChangeCheckBoxItem = (item) => {
         const data = {
             idArticulo: item.idArticulo,
             idPresentacion: item.idPresentacion,
             presentacion: item.presentacion,
             tipoRegistro: 1
         }
         this.$uibModalInstance.close(data);
     }

     async openModalKardex(item) {
         const articulo = {
             idArticulo: item.idArticulo,
             codigo: item.codigo,
             descripcion: item.descripcion,
         }

         const {
             MODAL_CTRL,
             MODAL_CSHTML
         } = this._nombreModal.kardex;
         const {
             ModalKardexCtrl
         } = await import('./../modal/' + MODAL_CTRL);
         this._modalSvc.openModalCustom({
             controller: ModalKardexCtrl,
             template: MODAL_CSHTML,
             size: 'xl',
             params: articulo,
             windowClass: 'uibModalFullScreen',
             isRenderRazorPartial: true
         })
     }


     showBodegas(item) {
         this._mS.getData('get', '/Articulo/GetId?id=' + item.idArticulo).then(response => {
             const results = JSON.parse(response.payload) || [];
             this.branchs = results[4].map(val => {
                 val.warehouses = JSON.parse(val.warehouses)
                 return val;
             })
         })
     }


     //Presentacion del imagen 
     async getImagen(item) {
         const {
             MODAL_CTRL,
             MODAL_IMAGEN_DETALLE_CSHTML
         } = this._nombreModal.articulo;
         const {
             ModalArticuloImagenDetalleCtrl
         } = await import('./../modal/' + MODAL_CTRL);
         this._modalSvc.openModalCustom({
             controller: ModalArticuloImagenDetalleCtrl,
             template: `Articulo/${MODAL_IMAGEN_DETALLE_CSHTML}`,
             size: 'xl',
             params: item
         })
     }



     closeModal() {
         this.$uibModalInstance.close();
     }


 }



 //---------------------------------------------ARTICULO CODIGO BARRA----------------------
 class ArticuloCodigoBarra {
     constructor(_mS, _form, _params) {
         this._mS = _mS;
         this._form = _form;
         this._params = _params;
         this.tipoRegistro = 1;
         this.data = {};
         this.data.color = "#ffffff";
         this.data.descripcion = this._params.descripcion;
         this.articuloCodigoBarras = [];
         this.getCodigoBarraArticulo();
     }

     getCodigoBarraArticulo() {
         this._mS.getData('get', '/Articulo/GetId?id=' + this._params.idArticulo).then(response => {
             const results = JSON.parse(response.payload)
             this.articuloCodigoBarras = results[2];
         })
     }


     coloresCodigoBarra(item) {
         return {
             "background-color": item.color,
             width: 20,
             height: 20
         }
     }

     saveUpdate() {
         let titulo = this.tipoRegistro == 1 ? 'Agregar' : 'Actualizar';
         if (this._form.campo(this.data.idMedida)) {
             toastr.warning('Seleccione una Medida', titulo);
             return;
         }
         if (this._form.campo(this.data.codigoBarra)) {
             toastr.warning('Ingrese el Codigo de Barra', titulo);
             return;
         }
         if (this._form.campo(this.data.descripcion)) {
             toastr.warning('Ingrese la descripción', titulo);
             return;
         }
         // if (form.campo($scope.articuloCodigoBarra.color)) {
         //     toast.toastr( 'Seleccione el Color', $scope.titulo);
         //     return;
         // }
         this.data.idArticulo = this._params.idArticulo;

         const URL = this.tipoRegistro == 1 ? '/CodigoBarraArticulo/Post' : '/CodigoBarraArticulo/Put?idArticuloCodigoBarra=' + this.data.idArticuloCodigoBarra

         this._mS.getData('post', URL, this.data).then(response => {
             if (response.id == "0") {
                 toastr.warning(response.message, response.titleSms);
                 return
             }
             if (response.id == "1") {
                 toastr.success(response.message, response.titleSms);
                 this.getCodigoBarraArticulo();
                 this.data = {};
                 this.data.descripcion = this._params.descripcion;
                 this.data.color = "#ffffff";
                 this.tipoRegistro = 1;
             }
         }, error => console.log(error))
     }



     editarCodigoBarra(item) {
         this.tipoRegistro = 2;
         this.data = item;
         this.data.idMedida = item.idMedida;
     }

     reset() {
         this.data = {};
         this.data.color = "#ffffff";
         this.tipoRegistro = 1;
         this.getCodigoBarraArticulo();
     }


     async deleteArtCodeBarra(item) {
         let {
             isConfirmed
         } = await Swal.fire({
             icon: 'warning',
             html: `<small>Esta seguro/a de eliminar este Código de Barra del Articulo ahora?</small>`,
             showConfirmButton: true,
             confirmButtonText: 'Si, eliminar',
             showCancelButton: true,
             cancelButtonText: 'No, cancelar',
             allowOutsideClick: false,
         });

         if (isConfirmed) {
             this._mS.getData('get', '/CodigoBarraArticulo/Delete?idArticuloCodigoBarra=' + item.idArticuloCodigoBarra).then(response => {
                 if (response.id == "0") {
                     toastr.warning(response.message, response.titleSms);
                     return
                 }
                 if (response.id == "1") {
                     toastr.success(response.message, response.titleSms);
                     this.getCodigoBarraArticulo();
                     this.data = {};
                     this.tipoRegistro = 1;
                 }
             })
         }
     }
 }


 //--------------------------------------------------------------------------------------------------
 //--------------------------------------------------Ubicacion Articulo------------------------------
 class UbicacionArticulo {
     constructor(_mS, _form, _commonSvc, _params) {
         this._mS = _mS;
         this._form = _form;
         this._commonSvc = _commonSvc;
         this._params = _params;
         this.data = {};
         this.tipoRegistro = 1;
         this.getUbicacionArticulo();
         this.getEstablecimientos();
     }

     getUbicacionArticulo() {
         if (!this._params) return

         this._mS.getData('get', '/Articulo/GetId?id=' + this._params.idArticulo).then(response => {
             const results = JSON.parse(response.payload)
             this.articuloUbicaciones = results[3]
         })
     }

     getEstablecimientos() {
         this._commonSvc.getEstabAsign({}).then(establecimientos => {
             this.establecimientos = establecimientos;

             let dataEstab = this.establecimientos[0];
             this.data.codEstab = dataEstab.codEstab;

             this.getBodegas(dataEstab);
         })
     }

     onChangeEstablecimiento() {
         let dataEstab = this.establecimientos.find(item => item.codEstab === this.data.codEstab);
         this.getBodegas(dataEstab);
     }

     getBodegas(dataEstab) {

         this._mS.getData('get', '/EstabAsig/GetDataForm?json=' + JSON.stringify(dataEstab)).then(response => {
             if (response.code === '0') {
                 throw response
             }
             let results = JSON.parse(response.payload) || [];
             this.bodegas = results[1];

             if (this.bodegas.length > 0) {
                 this.data.idBodega = this.bodegas[0].idBodega;
             } else {
                 toastr.info('No tienes asignado ninguna Bodega')
             }

         })
     }

     saveUpdate() {
         let titulo = this.tipoRegistro === 1 ? 'Agregar' : 'Actualizar';
         if (this._form.campo(this.data.idBodega) || this.data.idBodega == 0) {
             toastr.warning('Seleccione la Bodega', titulo);
             return;
         }
         if (this._form.campo(this.data.ubicacion)) {
             toastr.warning('Ingrese la Descripción', titulo);
             return;
         }

         this.data.idArticulo = this._params.idArticulo;

         const URL = this.tipoRegistro === 1 ? "/UbicacionArticulo/Post" : "/UbicacionArticulo/Put?id=" + this.data.idArticuloUbicacion
         const method = this.tipoRegistro === 1 ? 'post' : 'put';
         this._mS.getData(method, URL, this.data).then(response => {
             if (response.id == "0") {
                 toastr.warning(response.message, response.titleSms);
                 return
             }
             if (response.id == "1") {
                 toastr.success(response.message, response.titleSms);
                 this.getUbicacionArticulo();
                 this.data = {};
                 this.tipoRegistro = 1;
             }
         })

     }


     editUbicacionArt(item) {
         this.tipoRegistro = 2;
         this.data = item;
         this.data.idBodega = item.idBodega;

     }

     reset() {
         this.tipoRegistro = 1;
         this.data = {};
         this.getUbicacionArticulo();
     }


     async deleteUbicacionArt(item) {
         const {
             isConfirmed
         } = await Swal.fire({
             icon: 'warning',
             html: `<small>Esta seguro/a de eliminar este Ubicación del Articulo ahora?</small>`,
             showConfirmButton: true,
             confirmButtonText: 'Si, eliminar',
             showCancelButton: true,
             cancelButtonText: 'No, cancelar',
             allowOutsideClick: false,
         });

         if (isConfirmed) {
             this._mS.getData('delete', '/UbicacionArticulo/Delete?id=' + item.idArticuloUbicacion).then(
                 response => {
                     if (response.id == "0") {
                         toastr.warning(response.message, response.titleSms);
                         return
                     }
                     if (response.id == "1") {
                         toastr.success(response.message, response.titleSms);
                         this.getUbicacionArticulo();
                         this.data = {};
                         this.tipoRegistro = 1;
                         return
                     }

                 }
             )

         }
     }

 }





 /**-----------------------------------------------------------------------------------------------------------
  * -----------------------------------------------MODAL FILTRO-------------------------------------------------
  */

 export class ModalFiltroCtrl {
     static $inject = ['$scope', '$uibModalInstance', 'mainService', 'commonService', 'formulario', 'params'];
     constructor($scope, $uibModalInstance, _mSvc, _commonSvc, _form, _params) {
         this.$scope = $scope;
         this.$uibModalInstance = $uibModalInstance;
         this._mSvc = _mSvc;
         this._commonSvc = _commonSvc;
         this._form = _form;
         this.dataSearch = _params;
     }

     async $onInit() {
         const {
             subFamilias,
             familias,
             medidas,
             marcas,
             modelos
         } = await this._commonSvc.getGestionAlmacen();
         this.tipoIvas = await this._commonSvc.getAllTipoIva();
         this.subFamilias = subFamilias;
         this.familias = familias;
         this.medidas = medidas;
         this.marcas = marcas;
         this.modelos = modelos;
         this.$scope.$apply();
     }

     filtrar() {
         if (this.dataSearch.checkBoxSubFamilia) {
             if (this._form.campo(this.dataSearch.bySubFamilia)) {
                 toastr.warning('Seleccione la SubFamilia');
                 return
             }
         }

         if (this.dataSearch.checkBoxMedida) {
             if (this._form.campo(this.dataSearch.byMedida)) {
                 toastr.warning('Seleccione la Medida');
                 return
             }
         }

         if (this.dataSearch.checkBoxMarca) {
             if (this._form.campo(this.dataSearch.byMarca)) {
                 toastr.warning('Seleccione la Marca');
                 return
             }
         }

         if (this.dataSearch.checkBoxModelo) {
             if (this._form.campo(this.dataSearch.byModelo)) {
                 toastr.warning('Seleccione el Modelo');
                 return
             }
         }

         if (this.dataSearch.checkBoxTipoIva) {
             if (this._form.campo(this.dataSearch.byTipoIva)) {
                 toastr.warning('Seleccione el Tipo Iva');
                 return
             }
         }

         if (this.dataSearch.checkBoxStock) {
             if (this._form.campo(this.dataSearch.byStock)) {
                 toastr.warning('Seleccione el Tipo Stock');
                 return
             }
         }
         this.dataSearch.isSearch = true;
         this.$uibModalInstance.close(this.dataSearch)
     }

     closeModal() {
         this.dataSearch.isSearch = false;
         this.$uibModalInstance.close(this.dataSearch);
     }
 }





 /**
  * -----------------------------------------------------------------------------------------------------------
  * --------------------------------------------MODAL ARTICULO IMPUESTO RETENCION------------------------------
  * 
  */
 export class ArticuloImpuestoRetencion {
     static $inject = ['$scope', 'mainService', 'commonService', 'formulario', '$uibModalInstance', 'params']
     constructor($scope, _mS, _commonSvc, _form, $uibModalInstance, _params) {
         this.$scope = $scope;
         this._mS = _mS;
         this._commonSvc = _commonSvc;
         this._form = _form;
         this.$uibModalInstance = $uibModalInstance;
         this._params = _params;

     }

     $onInit() {
         if (this._params.tipoRetencion === "RC") {
             this.labelEntidad = "Proveedor";
             this.getDataCompra();
         } else {
             this.labelEntidad = "Cliente";
             this.getDataVenta();
         }

     }

     async getDataCompra() {
         let results = await Promise.all([
             this._mS.getData('get', `/FacturaCompra/GetDetailByInvoice?idFactura=${this._params.idFactura}&idSubContribuyente=${this._params.idSubContribuyente}&idConfigContribuyente=${this._params.idConfigContribuyente}`).then(
                 response => response.data
             ),
             this._mS.getData('get', '/TipoImpuesto/OptionTipoImpuesto?idConfiguracionContribuyente=' + this._params.idConfigContribuyente).then(
                 response => response.data
             ),
             this._commonSvc.getDataByProveedor(this._params.idProveedor),
         ])

         this.articuloImpuestos = results[0].map(val => {
             val.detalle.idSubContribuyente = this._params.idSubContribuyente;
             val.detalle.idTipoImpuestoRenta = 0;
             return val;
         })

         this.tipoImpuestos = results[1];
         this.header = results[2];
         this.$scope.$apply();
     }

     async getDataVenta() {
         let results = await Promise.all([
             this._mS.getData('get', `/FacturaVenta/GetDetailByInvoiceCustomer?idFactura=${this._params.idFactura}&idSubContribuyente=${this._params.idSubContribuyente}&idConfigContribuyente=${this._params.idConfigContribuyente}`).then(
                 response => response.data
             ),
             this._mS.getData('get', '/TipoImpuesto/OptionTipoImpuesto?idConfiguracionContribuyente=' + this._params.idConfigContribuyente).then(
                 response => response.data
             ),
             this._commonSvc.getDataCliente(this._params.idCliente),
         ])

         this.articuloImpuestos = results[0].map(val => {
             val.detalle.idSubContribuyente = this._params.idSubContribuyente;
             val.detalle.idTipoImpuestoRenta = 0;
             return val;
         })

         this.tipoImpuestos = results[1];
         this.header = results[2];
         this.$scope.$apply();
     }

     onChangeTipoImpuesto() {
         let impuesto = this.tipoImpuestos.find(item => item.idTipoImpuestoRenta === this.idTipoImpuestoRenta).descripcion
         Swal.fire({
             icon: 'warning',
             html: `<small>Desea aplicar el Tipo Impuesto <b>${impuesto}</b> a todos los artículos</small>`,
             showDenyButton: true,
             confirmButtonText: 'Sí, aplicar',
             denyButtonText: 'No, cancelar'
         }).then(result => {
             if (result.isConfirmed) {
                 for (let item of this.articuloImpuestos) {
                     item.detalle.impuestos = this.impuestos;
                     item.detalle.idTipoImpuestoRenta = this.idTipoImpuestoRenta;
                 }

                 this._mS.getData('get', '/ImpuestoRenta/GetByIdTipoImpuesto?idTipoImpuestoRenta=' + this.idTipoImpuestoRenta).then(
                     response => {
                         if (response.id == "0") {
                             toastr.warning(response.message, response.titleSms);
                             return
                         }
                         this.impuestos = response.data;
                         for (let item of this.articuloImpuestos) {
                             item.detalle.impuestos = this.impuestos;
                         }
                     })
                 this.$scope.$apply();
             } else {

                 this.idTipoImpuestoRenta = 0;
                 this.idRetencionRenta = 0;
                 this.impuestos = [];
                 this.$scope.$apply();
             }
         })
     }

     onChangeImpuesto() {
         if (!this.idRetencionRenta) return

         let impuesto = this.impuestos.find(item => item.idRetencionRenta === this.idRetencionRenta).descripcion

         Swal.fire({
             icon: 'warning',
             html: `<small>Desea aplicar el Impuesto <b>${impuesto}</b> a todos los artículos</small>`,
             showDenyButton: true,
             confirmButtonText: 'Sí, aplicar',
             denyButtonText: 'No, cancelar'
         }).then(result => {
             if (result.isConfirmed) {
                 for (let [index, item] of this.articuloImpuestos.entries()) {
                     this.articuloImpuestos[index].detalle.idRetencionRenta = this.idRetencionRenta;
                 }
                 this.$scope.$apply();
             } else {
                 this.idRetencionRenta = 0;
                 this.$scope.$apply();
             }
         })
     }


     getImpuestoByIdTipoImpuesto(data, idTipoImpuestoRenta) {
         data.impuestos = [];
         this._mS.getData('get', '/ImpuestoRenta/GetByIdTipoImpuesto?idTipoImpuestoRenta=' + idTipoImpuestoRenta).then(
             response => {
                 if (response.id == "0") {
                     toastr.warning(response.message, response.titleSms);
                     return
                 }
                 data.impuestos = response.data;
             }
         )
     }

     guardarImpuestoArticulo() {
         if (this.articuloImpuestos.some(val => [null, undefined, ""].includes(val.detalle.idTipoImpuestoRenta))) {
             this._form.sweetAlert('warning', 'Seleccione el Tipo Impuesto');
             return
         }

         if (this.articuloImpuestos.some(val => [null, undefined, ""].includes(val.detalle.idRetencionRenta))) {
             this._form.sweetAlert('warning', 'Seleccione el Impuesto');
             return
         }

         const impuestoArticulos = this.articuloImpuestos.map(function ({
             detalle
         }) {
             return detalle;
         })

         this._mS.getData('post', '/ImpuestoArticulo/ListaPost', impuestoArticulos).then(
             response => {
                 if (response.id === "0") {
                     this._form.sweetAlert('warning', response.message, response.titleSms);
                     return
                 }
                 if (response.id === "1") {
                     this._form.sweetAlert('success', response.message, response.titleSms, 1000);
                     this.$uibModalInstance.close({
                         response: 1
                     });
                     this.closeModal();
                 }

             }
         )
     }


     closeModal() {
         this.$uibModalInstance.close();
     }
 }



 /**
  * 
  */

 export class ModalArticuloDetalleCtrl extends ModalBaseCtrl {
     static $inject = ['$scope', 'mainService', 'commonService', '$uibModalInstance', 'formulario', 'params', 'decodeToken'];
     constructor($scope, _mS, _commonSvc, $uibModalInstance, _form, _params, decodeToken) {
         super({
             $scope,
             _mS,
             _commonSvc
         })
         this.$uibModalInstance = $uibModalInstance;
         this._form = _form;
         this._params = _params;


         this.idUsuarioRol = parseInt(decodeToken.idUsuarioRol)

         this.json = {
             typeList: 1,
             idRol: this.idUsuarioRol
         }

         this.gridOptions = {
             enableColumnMenus: false,
             enableSorting: false,
             enableFiltering: false,
             enableRowHashing: false,
             enableCellEdit: false,
             columnDefs: this.getColumnDefs()
         };
     }

     async $onInit() {
         let results = await this.initiload();
         let dataArticulo = await this._mS.getData('get', '/Articulo/GetId?id=' + this._params.idArticulo).then(
             response => JSON.parse(response.payload)
         )
         const {
             subFamilias,
             familias,
             medidas,
             modelos,
             marcas,
             valoracionMetodos,
             tipoArticulos,
             tarifas,
             etiquetaActividades
         } = results[0];

         this.data = dataArticulo[0][0]

         this.gridOptions.data = dataArticulo[1].map(item => {
             let ganancia = item.precioVenta - this.data.precioCosto;
             item.ganancia = this._form.roundNumber(ganancia, 5);
             return item;
         })

         this.articuloUbicaciones = dataArticulo[3]
     }

     //Definimos los nombres de la columna de Tarifa 
     getColumnDefs = () => {
         return [{
                 name: 'idTarifa',
                 field: 'idTarifa',
                 visible: false,
             },
             {
                 name: 'tarifa',
                 field: 'tarifa',
                 enableCellEdit: false,
                 width: '15%',
                 minWidth: 100
             },
             {
                 name: 'Tipo Iva',
                 field: 'porcentajeIva',
                 type: 'number',
                 enableCellEdit: false,
                 width: '4%',
                 minWidth: 75
             },
             {
                 name: 'precioVenta',
                 field: 'precioVenta',
                 enableCellEditOnFocus: false,
                 enableCellEdit: false,
                 allowCellFocus: false,
                 type: 'number',
                 width: '20%',
                 minWidth: 75
             },
             {
                 name: 'precioConIva',
                 field: 'precioConIva',
                 enableCellEditOnFocus: false,
                 enableCellEdit: false,
                 allowCellFocus: false,
                 type: 'number',
                 width: '20%',
                 minWidth: 100
             },
             {
                 name: 'porcentajeUtilidad',
                 field: 'porcentajeUtilidad',
                 type: 'number',
                 enableCellEditOnFocus: false,
                 enableCellEdit: false,
                 allowCellFocus: false,
                 width: '20%',
                 minWidth: 100
             },

             {
                 name: 'Utilidad',
                 field: 'ganancia',
                 type: 'number',
                 enableCellEditOnFocus: false,
                 width: '10%',
                 minWidth: 100
             },
             {
                 name: 'P. precioPredeterminado',
                 field: 'precioPredeterminado',
                 visible: false
             },
             {
                 name: 'Estado',
                 field: 'predeterminadaVal',
                 enableCellEdit: false,
                 type: 'checkbox',
                 //cellTemplate: '<div class="text-center"><input type="checkbox"' +
                 //    'name="radio" value="radio" ng-click="grid.appScope.updateDefault(row.entity)"/></div>', //'<md-switch style="display:inline;" title="Actualizar estado" aria-label="Predeterminado" ng-click="grid.appScope.updateDefault(row)"></md-switch>',

                 width: '15%',
                 minWidth: 100,
                 cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                     if (row.entity.precioPredeterminado) {

                         row.entity.predeterminadaVal = 'Predeterminado'
                         return 'blue';
                     }
                 }
             }
         ]
     }

     closeModal() {
         this.$uibModalInstance.close();
     }
 }





 /**
  * 
  * ------------------------------------------------Impuesto Articulo----------------
  * 
  * 
  */
 export class ModalArticuloImpuestoCtrl {

     static $inject = ['mainService', '$uibModalInstance', 'formulario', 'params']
     constructor(_mS, $uibModalInstance, _form, _params) {
         this._mS = _mS;
         this.$uibModalInstance = $uibModalInstance;
         this._form = _form;
         this._params = _params;
         this.data = {};
         this.data.tipoRegistro = 1;

         this.articuloImpuestos = []
     }

     $onInit() {
         Promise.all([
             this._mS.getData('get', '/SubContribuyente/OptionSubContribuyente'),
             this._mS.getData('get', '/TipoImpuesto/OptionTipoImpuesto')
         ]).then(results => {
             this.subContribuyentes = results[0].data
             this.tipoImpuestos = results[1].data
         }).catch(error => {
             toastr.error(error)
         });

         this.load();
     }

     $onDestroy() {

     }

     load() {
         this._mS.getData('get', '/ImpuestoArticulo/Get?idArticulo=' + this._params.idArticulo).then(response => {
             if (response.id == "0") {
                 toastr.warning(response.message, response.titleSms);
                 return
             }
             this.articuloImpuestos = response.data;
         })
     }


     getImpuestoByTipoImpuesto() {
         this.impuestos = [];
         this._mS.getData('get', '/ImpuestoRenta/GetByIdTipoImpuesto?idTipoImpuestoRenta=' + this.data.idTipoImpuestoRenta).then(response => {
             if (response.id === "0") {
                 toastr.warning(response.message, response.titleSms);
                 return
             }
             this.impuestos = response.data;

         });
     }

     saveUpdate() {
         let titulo = this.data.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';
         if (this._form.campo(this._params.idArticulo)) {
             toastr.warning('Seleccione el Articulo', titulo);
             return;
         }

         if (this._form.campo(this.data.idSubContribuyente)) {
             toastr.warning('Seleccione el Sub Contribuyente', titulo);
             return;
         }
         if (this._form.campo(this.data.idTipoImpuestoRenta)) {
             toastr.warning('Seleccione el Tipo Impuesto', titulo);
             return;
         }
         if (this._form.campo(this.data.idRetencionRenta)) {
             toastr.warning('Seleccione el Impuesto', titulo);
             return;
         }

         // if(this.data.tipoRegistro===2){
         //     if(this._form.campo(this.data.idImpuestoArticulo) || this.data.idImpuestoArticulo===0){
         //         toastr.warning(this.data.idImpuestoArticulo)
         //     }
         // }

         this.data.idArticulo = this._params.idArticulo;

         let url = this.data.tipoRegistro == 1 ? '/ImpuestoArticulo/Post' : '/ImpuestoArticulo/Update?idImpuestoArticulo=' + this.data.idImpuestoArticulo;
         this._mS.getData('post', url, this.data).then(response => {
             if (response.id === "0") {
                 toastr.warning(response.message, response.titleSms);
                 return
             }
             if (response.id === "1") {
                 toastr.success(response.message, response.titleSms);
                 this.reset();
             }
         });
     }

     updateImpuestoArticulo(item) {
         this.reset();

         this.data = item.impuestoArticulo;
         this.data.idTipoImpuestoRenta = item.idTipoImpuestoRenta
         this.getImpuestoByTipoImpuesto();
         this.data.tipoRegistro = 2;
     }

     async eliminarImpuestoArticulo({
         idImpuestoArticulo
     }) {
         let {
             isConfirmed
         } = await Swal.fire({
             icon: 'warning',
             html: `<small>Esta seguro/a de eliminar este Impuesto Articulo ahora?</small>`,
             showConfirmButton: true,
             confirmButtonText: 'Si, eliminar',
             showCancelButton: true,
             cancelButtonText: 'No, cancelar',
             allowOutsideClick: false
         });

         if (isConfirmed) {
             this._mS.getData('get', '/ImpuestoArticulo/Delete?idImpuestoArticulo=' + idImpuestoArticulo).then(response => {
                 if (response.id === "0") {
                     toastr.warning(response.message, response.titleSms);
                 }
                 if (response.id === "1") {
                     toastr.success(response.message, response.titleSms);
                     this.reset();
                 }
             })
         }

     };

     reset() {
         this.load();
         this.data = {};
         this.data.tipoRegistro = 1;
     }



     closeModal() {
         this.$uibModalInstance.close();
     }
 }






 /**
  * 
  * ---------------------------------GESTION DE IMAGEN------------------------------
  * Agregar y eliminar
  */

 export class ModalArticuloImagenCtrl {
     static $inject = ['$scope', 'mainService', '$uibModalInstance', 'toastService', 'params']
     constructor($scope, _mS, $uibModalInstance, _toastr, _params) {
         this.$scope = $scope;
         this._mS = _mS;
         this.$uibModalInstance = $uibModalInstance;
         this._toastr = _toastr;
         this._params = _params;

         this.modelImagenes = [];
         this.imagenes = [];

     }

     $onInit() {
         this.getAllImage();
     }

     getAllImage() {
         showLoader();
         this._mS.getData('get', '/ArticuloImagen/GetArticuloImagen?idArticulo=' + this._params.idArticulo).then(response => {
             if (response.id === "0") {
                 hideLoader();
                 this.toastr.toastr('warning', response.message, response.titleSms);
                 return
             }

             this.imagenes = response.data.map(val => {
                 val.imagen = `data:${val.mimeType};base64,${val.imagenBase64}`;
                 return val;
             });
             hideLoader();
         });
     }

     onChangeSelectImage() {
         if (this.modelImagenes.length > 5) {
             this.modelImagenes = [];
             this._toastr.toastr('Solo puedes ingresar 5 imagenes');
             return
         }

         for (let file of this.modelImagenes) {
             let reader = new FileReader();

             reader.onload = e => {
                 let imagenBase64 = reader.result.replace("data:", "").replace(/^.+,/, "");
                 let mimeType = file.type,
                     nombreImagen = file.name;
                 let obj = {
                     imagen: e.target.result,
                     imagenBase64,
                     mimeType,
                     nombreImagen
                 };
                 this.imagenes.push(obj);
             };
             reader.readAsDataURL(file);
         }
         this.modelImagenes = [];
         this.$scope.$apply();
     }

     eliminar(file) {
         let index = this.imagenes.indexOf(file);
         this.imagenes.splice(index, 1);
     }


     guardar() {
         try {

             let tituloToast = "Guardar";
             if (this.imagenes.length === 0) {
                 this._toastr.toastr('warning', 'Seleccione al menos una imagen', tituloToast);
                 return
             }

             if (this.imagenes.length > 5) {
                 this._toastr.toastr('warning', 'Solo puedes subir 5 imagenes', tituloToast);
                 return
             }

             showLoader();
             this._mS.getData('post', '/ArticuloImagen/UploadImagen?idArticulo=' + this._params.idArticulo, this.imagenes).then(response => {
                 if (response.id === "0") {
                     hideLoader();
                     this._toastr.toastr('warning', response.message, response.titleSms);
                     return
                 }
                 if (response.id === "1") {
                     hideLoader();
                     this._toastr.toastr('success', response.message, response.titleSms);
                     this.$uibModalInstance.close(response);
                 }
             });

         } catch (error) {
             hideLoader();
         }

     }

     closeModal() {
         this.$uibModalInstance.close();
     }
 }



 /**
  * 
  * -------------------------------------Presentacion de Imagen--------------------------
  * 
  * 
  */

 export class ModalArticuloImagenDetalleCtrl {
     static $inject = ['$scope', 'mainService', '$uibModalInstance', 'params'];

     constructor($scope, _mS, $uibModalInstance, _params) {
         this.$scope = $scope;
         this._mS = _mS;
         this.$uibModalInstance = $uibModalInstance;
         this._params = _params;
         this.data = _params;
         this.imagenes = [];
         this.tarifas = [];
     }

     $onInit() {
         this.getAllImage();
     }

     async getAllImage() {
         try {
             showLoader();
             let results = await Promise.all([
                 this._mS.getData('get', '/ArticuloImagen/GetArticuloImagen?idArticulo=' + this._params.idArticulo),
                 this._mS.getData('get', '/Articulo/GetId?id=' + this._params.idArticulo)
             ])


             this.imagenes = results[0].data.map(val => {
                 val.imagen = `data:${val.mimeType};base64,${val.imagenBase64}`;
                 return val;
             })

             const dataArticulo = JSON.parse(results[1].payload)
             this.data = dataArticulo[0][0];

             this.tarifas = dataArticulo[1].map(val => {
                 val.precioConIva = val.precioConIva;
                 return val;
             })
             this.$scope.$apply();
             hideLoader();
         } catch (error) {
             hideLoader();
         }
     }



     closeModal() {
         this.$uibModalInstance.close();
     }
 }








 /**
  * 
  * 
  * --------------------------------Modal Articulo Fraccionado----------------------------
  * 
  */

 export class ModalArticuloFraccionadoCtrl extends ModalBaseCtrl {
     static $inject = [
         '$scope',
         '$interval',
         '$uibModalInstance',
         'mainService',
         'commonService',
         'modalService',
         'nombreModal',
         'formulario',
         'params'
     ];
     constructor($scope, $interval, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModal, _form, _params) {
         super({
             $scope,
             _mS,
             _commonSvc,
             _form
         })
         this.$uibModalInstance = $uibModalInstance;
         this._modalSvc = _modalSvc;
         this._nombreModal = _nombreModal;
         this._form = _form;
         this._params = _params;

         this.tipoRegistro = 1;
         this.data = {};
         this.articulo = {};

         this.gridOptions = this.tarifaInstance.getTarifaGrid($scope, $interval);
         // this.gridOptions.data  = []; 
     }

     async $onInit() {
         try {
             showLoader();
             let results = await this.initiload();
             const {
                 medidas,
                 tarifas
             } = results[0];

             this.medidas = medidas;
             this.data.idMedida = this.medidas.length > 0 ? this.medidas[0].idMedida : 0;

             this.tarifas = tarifas;

             const moduloDecimales = results[1];
             this.config = moduloDecimales[0][0];
             this.tarifaInstance.setConfigDecimal = this.config;

             if (this._params) {
                 this.tipoRegistro = 2;
                 this.getDataArticuloFraccionado();
             }
             this.$scope.$apply();
             hideLoader();
         } catch (error) {
             console.error(error)
             hideLoader();
         }

         this.$uibModalInstance.rendered.then(response => {
             $("#agregarArtFraccionado").on('shown.bs.modal', e => {
                 $("input[name='articuloAutocomplete']").focus();
             });
         })

     }

     searchArticuloFraccionadoFilter(textSearch) {
         return this._commonSvc.articuloSearchGeneral({
             textSearch,
             fraccionado: true
         })
     }

     onKeyupSearchArticulo() {
         if (this.data.selectedArticulo === null || this.data.selectedArticulo === undefined || this.data.selectedArticulo === "") {
             this.data.selectedArticulo = undefined;
             this.articulo = {};
         }
     }

     selectedArticuloChange(item) {
         this._mS.getData('get', '/Articulo/GetId?id=' + item.idArticulo).then(
             response => {
                 const results = JSON.parse(response.payload);
                 this.data = results[0][0];
                 this.data.selectedArticulo = item;

                 this.gridOptions.data = results[1].map(item => {
                     item.precioVenta = 0;
                     item.precioConIva = 0;
                     item.porcentajeUtilidad = 0;
                     item.ganancia = 0;
                     return item;
                 })
             }
         )
     }

     recalculateTarifaAdd() {
         if (this.gridOptions.data.length === 0) return

         this.tarifaInstance.setPrecioCosto = this.data.precioCostoFraccionado;

         //Por defecto tomammos el porcentaje del Tipo Iva Agregago al Articulo 
         this.tarifaInstance.setPorcentajeIva = this.gridOptions.data[0].porcentajeIva;
         this.tarifaInstance.recalculateTarifaAdd();
     }

     async getDataArticuloFraccionado() {
         this._mS.getData('get', '/ArticuloFraccionado/GetId?id=' + this._params.idArticuloFraccionado).then(response => {
             if (response.id === "0") {
                 this._form.sweetAlert('warning', response.message, response.titleSms)
             }
             if (response.id === "1") {
                 let {
                     fraccionado: data,
                     pvps
                 } = response.data;

                 this.data = {
                     ...this._params,
                     ...data,
                     ...data.fraccionado
                 };

                 this.gridOptions.data = pvps.map(val => {
                     let ganancia = val.pvp.precioVenta - this.data.precioCostoFraccionado;
                     val.ganancia = this._form.roundNumber(ganancia, 5)
                     return {
                         ...val,
                         ...val.pvp,
                     }
                 })

                 this.tarifaInstance.setPrecioCosto = this.data.precioCostoFraccionado;
                 this.tarifaInstance.setPorcentajeIva = this.gridOptions.data[0].porcentajeIva;
             }
         })
     }

     async saveAndUpdate() {
         let tituloToast = this.tipoRegistro === 1 ? 'Guardar' : 'Actualizar';
         if (this._form.campo(this.data.idArticulo)) {
             toastr.warning('Seleccione el Articulo', tituloToast);
             return;
         }

         if (this._form.campo(this.data.conversion)) {
             toastr.warning('Ingrese la Conversión', tituloToast);
             return;
         }

         if (isNaN(this.data.conversion)) {
             toastr.warning('Valor no válido en el campo Conversión', tituloToast);
             return
         }
         if (this._form.campo(this.data.idMedida)) {
             toastr.warning('Seleccione la Medida', tituloToast);
             return;
         }
         if (this._form.campo(this.data.precioCostoFraccionado)) {
             toastr.warning('Ingrese el Precio Costo Fraccionado', tituloToast);
             return;
         }

         if (isNaN(this.data.precioCostoFraccionado)) {
             toastr.warning('Valor no válido en el campo Precio Costo Fraccionado', tituloToast);
             return
         }

         let data = {
             fraccionado: this.data,
             pvps: this.gridOptions.data
         }

         const url = this.tipoRegistro == 1 ? '/ArticuloFraccionado/Post' : `/ArticuloFraccionado/Put?id=${this._params.idArticuloFraccionado}`;
         const method = this.tipoRegistro === 1 ? 'post' : 'put';
         this._mS.getData(method, url, data).then(response => {
             if (response.id == "0") {
                 toastr.warning(response.message, response.titleSms);
                 return
             }
             if (response.id === "1") {
                 toastr.success(response.message, response.titleSms);
                 this.$uibModalInstance.close(response)
             }
         });
     }



     closeModal() {
         this.$uibModalInstance.close();
     }

 }

(function(){

    'use strict';

    let mS = {};
    let tS = {};

    app.directive('forceChipEnable', forceChipEnable);
    
    function forceChipEnable() {
        return {
            require: ['?^mdChips', '?^mdChip'],
            link: function(scope, element, attrs, controllers) {
                if (controllers) {
                    console.log(controllers)
                    let chipsCtrl = controllers[0];
                    let chipCtrl = controllers[1];
                    
                    chipsCtrl.enableChipEdit = true;
                    chipCtrl.init(chipsCtrl);
                }
            }
        }
    }
    
    app.controller('etiquetaCtrl', etiquetaCtrl);
    
    etiquetaCtrl.$inject = ['$scope', '$injector', 'modalService', 'decodeToken'];

    function etiquetaCtrl($scope, $injector, modalSvc, decodeToken) {
      
        mS = $injector.get('mainService');
        tS = $injector.get('toastService');
        
        $scope.dataSearch = {
            pageIndex: 1,
            pageSize: 100
        };

        $scope.openModalNew = function() {
            try {
                let modalRef = modalSvc.openModalCustom({
                    controller: modalEtiquetaCtrl,
                    template: 'Etiqueta/_ModalAddUpdate.cshtml',
                    size:'md',
                    params: {}
                });

                modalRef.result.then(result => {
                    if(typeof result === 'object'){

                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
        

        $scope.getAll = function() {
            try {
                showLoader();
                $scope.etiquetas = [];
                mS.getData('get', 'Etiqueta/Get/' + JSON.stringify($scope.dataSearch), null, true).then(response => {
                    if(response.code==="0"){
                        hideLoader();
                        console.log(response)
                    }

                    if(response.code==="1"){
                        $scope.etiquetas = JSON.parse(response.payload) || [];
                        hideLoader();
                    }
                }).catch(error=>{
                    hideLoader();
                    console.log(error)
                })
            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }

        $scope.getAll();
        // let accion = JSON.parse(localStorage.getItem("accion"));
        // if(accion===null){
        //     location.href = "/Home/Index";
        // }else{
        //     $scope.accion = accion[0];
        // }

        // let idUsuarioRol = parseInt(decodeToken.idUsuarioRol)
        // const json = {
        //     idRol: idUsuarioRol,
        //     pageIndex: 1,
        //     pageSize: 100
        // }

        // $scope.pageIndex = 1;
        // $scope.pageSize = 10000;        
        // $scope.actividades = [];

        // $scope.load = function () {
        //     showLoader();
        //     $http.get('/ActividadEtiqueta/Get?json=' + JSON.stringify(json)).then(({data:response})=>{                
        //         if(response.id==="0"){
        //             hideLoader();
        //             toastr.warning(response.message, response.titleSms);
        //             return
        //         }
        //         $scope.actividadEtiquetas = JSON.parse(response.data) || [];                
        //         hideLoader();
        //     }).catch(error=>{
        //         hideLoader();
        //         toastr.error(error)
        //     })
        // }

        // $scope.load();

        // //Mostrar Etiquetas 
        // $scope.expandDetalle = function(item){
        //     item.expanded = !item.expanded;
        //     $scope.data = item;
        //     showLoader();
        //     $http.get(`/Etiqueta/Get?json=${JSON.stringify($scope.data)}`)
        //     .then(({data:response})=>{
        //         if(response.id==="0"){
        //             hideLoader();
        //             toastr.warning(response.message, response.titleSms);
        //             return
        //         }                                                                 
        //         item.etiquetas = JSON.parse(response.data);
        //         hideLoader();
        //     })
        // }
        
        // //Modal para agregar nuevas etiquetas 
        // $scope.openModalActividadEtiqueta = async(item)=>{  
        //     const modalRef = _modalSvc.openModalSecond(ModalActividadEtiquetaCtrl, 'Etiqueta/_ModalActividadEtiqueta.cshtml', 'md', item);
        //     modalRef.result.then(response=>{
        //         if(typeof response==='object'){
        //             $scope.load();
        //         }
        //     })        
        // }  
        
        // $scope.openModalEtiqueta =async(item)=>{
        //     const modalRef = _modalSvc.openModalSecond(ModalEtiquetaCtrl, 'Etiqueta/_ModalEtiqueta.cshtml', 'lg', item);
        //     modalRef.result.then(response=>{
        //         if(typeof response==='object'){
        //             $scope.load();
        //         }
        //     })  
        // }

    }


    app.controller('modalEtiquetaCtrl', modalEtiquetaCtrl);

    modalEtiquetaCtrl.$inject=['$scope', '$uibModalInstance', 'params'];

    function modalEtiquetaCtrl($scope, $uibModalInstance, params) {
        
        $scope.data = {}

        $scope.dataLabel = {
            etiquetas:[],
            readonly:false,
            removable:false,
            edit: true,

        }

          
        
        if(params.idEtiqueta){

        }else{
            $scope.modalTitle = 'Nuevo';
            $scope.txtSave = 'Guardar';
            $scope.iconSave = 'ti-save';
        }

        $scope.newLabel = function(chip) {
            return {
              name: chip,
              type: 'unknown'
            };
        };

        $uibModalInstance.rendered.then(result=>{
            $("#etiquetas").on('keyup', e=>{
                return e.target.value.toUpperCase();
            })
        })


          
        $scope.save = function(e) {
            try {
                console.log(e)
                let url = null;
                let method = null;

                if(!$scope.data.descripcion){
                    tS.toastr('warning', 'Ingrese la descripción');
                    return
                }

                if($scope.dataLabel.etiquetas.length === 0){
                    tS.toastr('warning', 'Ingrese al menos una etiqueta');
                    return
                }

                showLoader();

                if($scope.data.idEtiqueta > 0){
                    url = 'Etiqueta/Insert';
                    method = 'post';
                }else{
                    url = 'Etiqueta/Update/' + $scope.data.idEtiqueta
                    method = 'put';
                }

                const data = {
                    descripcion: $scope.data.descripcion,
                    estado: $scope.data.estado,
                    etiquetas: $scope.dataLabel.etiquetas.join(';'),
                }
                console.log(data);

                mS.getData(method, url, $scope.data).then(response => {
                    if(response.code==="0"){
                        hideLoader();
                        Swal.fire('warning', response.message)                        
                    }
                    if(response.code==="1"){
                        hideLoader();
                        Swal.fire('success', response.message, 1000);
                        $uibModalInstance.close(response);
                    }
                }).catch(error => {
                    hideLoader();
                    console.log(error);
                })

            } catch (error) {
                hideLoader();
                console.log(error);
            }
        }
          

        $scope.closeModal = function(){
            $uibModalInstance.close();
        }

    }





    // class ModalActividadEtiquetaCtrl{
    //     static $inject = ['$scope', '$http', '$uibModalInstance', 'formulario', 'params']
    //     constructor($scope, $http, $uibModalInstance, _form, _params){
    //         this.$scope            = $scope;
    //         this.$http             = $http;
    //         this.$uibModalInstance = $uibModalInstance;
    //         this._form             = _form;
    //         this._params           = _params;
    //         this.tipoRegistro      = 1;
    //         this.data              = {};
    //     //  this.loadGridOptions();
    //     }

    //     $onInit(){
    //         if(this._params)        {
    //             this.tipoRegistro = 2;
    //             this.data = this._params;
    //         }
    //     }

    //     onKeyupDescripcion(){
    //         if(!this._form.campo(this.data.descripcion) && this.tipoRegistro===1){
    //             this.data.codigo = this._form.obtenerTresLetras(this.data.descripcion)
    //         }
    //     }

    //     saveAndUpdate(){
    //         const tituloTastr = this.tipoRegistro ===1?'Guardar':'Actualizar';
    //         if(this._form.campo(this.data.descripcion)){
    //             toastr.warning('Ingrese la Descripción', tituloTastr);
    //             return
    //         }

    //         if(this._form.campo(this.data.codigo)){
    //             toastr.warning('Ingrese el Código', tituloTastr);
    //             return
    //         }
    //         showLoader();
    //         const URL = this.tipoRegistro===1?'/ActividadEtiqueta/Post':'/ActividadEtiqueta/Put?id=' + this.data.idActividadEtiqueta
    //         this.$http.post(URL, this.data).then(({data:response})=>{
    //             if(response.id==='0'){
    //                 hideLoader();
    //                 toastr.warning(response.message, response.titleSms)                
    //             }
    //             if(response.id==='1'){
    //                 hideLoader();
    //                 toastr.success(response.message, response.titleSms);
    //                 this.$uibModalInstance.close(response)
    //             }
    //         }).catch(error=>{
    //             hideLoader();
    //             toastr.error(error)
    //         })

    //     }

    //     closeModal(){
    //         this.$uibModalInstance.close();
    //     }

        
    // }

    // class ModalEtiquetaCtrl{
    //     static $inject = ['$scope', '$http', '$interval', '$uibModalInstance', 'formulario', 'params']
    //     constructor($scope, $http, $interval, $uibModalInstance, _form, _params){
    //         this.$scope            = $scope;
    //         this.$http             = $http;
    //         this.$interval         = $interval;
    //         this.$uibModalInstance = $uibModalInstance;
    //         this._form             = _form;
    //         this._params           = _params;
    //         this.tipoRegistro      = 1;
    //         this.data              = this._params;
    //         this.loadGridOptions();
    //     }

    //     $onInit(){
    //         showLoader();
    //         this.$http.get(`/Etiqueta/Get?json=${JSON.stringify(this._params)}`)
    //         .then(({data:response})=>{
    //             if(response.id==="0"){
    //                 hideLoader();
    //                 toastr.warning(response.message, response.titleSms);
    //                 return
    //             }        
    //             this.gridOptions.data = JSON.parse(response.data) || [];
    //             this.enumeracionUiGrid();                                                                     
    //             hideLoader();
    //         }).catch(error=>{
    //             hideLoader();
    //             const msg = error.config?error.config.url:error
    //             toastr.error(msg)
    //         })
    //     }

    //     loadGridOptions(){
    //         this.gridOptions = {
    //             enableColumnMenus: false,
    //             enableColumnReordering: true,
    //             appScopeProvider: this,
    //             columnDefs: [
    //                 {
    //                     name:'N°',
    //                     field:'numero',
    //                     width:'5%',
    //                     minWidth:50
    //                 },
    //                 {
    //                     name:'Descripcion',
    //                     field:'descripcion',
    //                     width:'45%',
    //                     minWidth:100,
    //                     enableCellEdit: true,
    //                     allowCellFocus: true,
    //                     enableCellEditOnFocus: true,
    //                 },
    //                 {
    //                     name:'Código',
    //                     field:'codigo',
    //                     width:'45%',
    //                     minWidth:100,
    //                     visible:true,
    //                     enableCellEdit: true,
    //                     allowCellFocus: true,
    //                     enableCellEditOnFocus: true,
    //                 },
    //                 {
    //                     name: 'Op.',
    //                     headerCellTemplate: ' <button type="button" ng-click="grid.appScope.addRow()" class="btn btn-secondary  btn-sm"><i class="fa fa-plus-circle"></i></button>',
    //                     enableCellEdit: false,
    //                     width: '5%',
    //                     minWidth:50,
    //                     cellTemplate: `
    //                             <a  ng-click="grid.appScope.deleteRow(row)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></a>                           
    //                             `,
    //                 }
    //             ],
    //             onRegisterApi: this.onRegisterApi
    //         }
    //     }

    //     onRegisterApi(gridApi) {
        
    //         this.grdApi = gridApi;
    //         let _self = this.appScopeProvider;                     
    //         if (this.gridApi) {
    //             console.log(this, 'khhoh')
    //             _self.$interval(() => {
    //                 this.gridApi.core.handleWindowResize();
    //                 this.gridApi.grid.refresh();
    //             }, 5);
    //         }
            
    //         gridApi.edit.on.afterCellEdit(_self.$scope, _self.afterCellEdit);
    //     }

    //     afterCellEdit(rowEntity, colDef, newValue, oldValue){
    //         let $scope = this.grid.appScope;        
    //         let index = $scope.gridOptions.data.indexOf(rowEntity);
                            
    //         if (rowEntity[colDef.field] === "" || rowEntity[colDef.field] === undefined || rowEntity[colDef.field] === null) {
    //             rowEntity[colDef.field] = oldValue.toUpperCase();
    //         }

    //         if(colDef.field==="descripcion"){        
    //             $scope.gridOptions.data[index].descripcion = rowEntity.descripcion.toUpperCase();
    //             $scope.gridOptions.data[index].codigo = $scope.getCodigoDescripcion(rowEntity);
    //             return
    //         }
    //     }

    //     getCodigoDescripcion = function(rowEntity){
    //         return this._form.obtenerTresLetras(rowEntity.descripcion);
    //     }

    //     addRow(){
    //         const obj = {
    //             codigo: '',
    //             descripcion: ''
    //         }
    //         this.gridOptions.data.push(obj);
    //         this.enumeracionUiGrid();        
    //     }

    //     //Enumeramos las filas de ui-grid 
    //     enumeracionUiGrid = function(){
    //         let numero = 1;
    //         angular.forEach(this.gridOptions.data, (val, index)=>{
    //             this.gridOptions.data[index].numero = numero++;
    //         })
    //     };

    //     deleteRow(row){
    //         let index = this.gridOptions.data.indexOf(row.entity);
    //         this.gridOptions.data.splice(index, 1);
    //         this.enumeracionUiGrid();        
    //     }

    //     //Guardar/Actualizar Etiquetas 
    //     saveUpdateEtiqueta(){
    //         let tituloModal = this.tipoRegistro===1?'Guardar':'Actualizar';
    //         let validacion = val => this._form.campo(val.descripcion) || this._form.campo(val.codigo);

    //         if(this.gridOptions.data.length===0){
    //             toastr.warning('Agregue al menos una etiqueta', tituloModal);
    //             return
    //         }
    //         if (this.gridOptions.data.some(validacion)) {
    //             toastr.warning('Ingrese todos los campos', tituloModal);
    //             return
    //         }

    //         showLoader();
    //         this.$http.post('/Etiqueta/Post?idActividad='+this._params.idActividadEtiqueta, this.gridOptions.data)
    //         .then(({data:response})=>{
    //             if(response.id==="0"){
    //                 hideLoader();
    //                 toastr.warning(response.message, response.titleSms);                
    //             }
    //             if(response.id==="1"){
    //                 hideLoader();
    //                 toastr.success(response.message, response.titleSms);
    //                 this.$uibModalInstance.close(response)                              
    //             }
    //         }).catch(error=>{
    //             hideLoader();
    //             toastr.error(error)
    //         })
    //     }    


    //     closeModal(){
    //         // let validacion = val => this._form.campo(val.descripcion) || this._form.campo(val.codigo);                    
    //         // if (this.gridOptions.data.some(validacion)) {
    //         //     toastr.warning('Ingrese todos los campos', 'Cerrar');
    //         //     return
    //         // }
    //         this.$uibModalInstance.close();
    //     }

    // }


})(window.angular)




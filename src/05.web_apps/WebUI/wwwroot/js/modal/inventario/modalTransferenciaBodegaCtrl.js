

class ModalBaseCtrl{
    constructor({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS}){
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._tS = _tS;
        this._fS = _fS;
                        
    }


     /**
     * 
     * @param {object} json 
     * @returns  array
     */

     initiload(json){
        return this._mS.getData('get', '/FacturaCompra/GetDataForm?json=' + JSON.stringify(json)).then(response=>{            
            if(response.code==="0"){
                throw response
            }
            return JSON.parse(response.payload)
        })
    }

    getDataFormEstabAsig(json={}){
        return this._mS.getData('get', '/EstabAsig/GetDataForm?json=' + JSON.stringify(json)).then(response=>{
            if(response.code==='0'){                
                throw response
            }
            return JSON.parse(response.payload)
        })
    }


    
}


class ModalTransferenciaBodegaCtrl extends ModalBaseCtrl{
    
    constructor({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params}){

        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params})

        const self = this;
        this.TIPO_DOC = this._commonSvc.tipoDoc['TRA'];

        this.gridOptions = {
            enableColumnMenus: false,
            enableSorting: false,
            enableFiltering: false,
            enableRowHashing: false,
            enableColumnReordering: true,
            showGridFooter: false,            
        }

        this.gridOptions.onRegisterApi = function (gridApi) {  
            self.$scope.gridApi = gridApi;  
            if (self.$scope.gridApi) {
                self.$timeout(() => {
                    self.$scope.gridApi.core.handleWindowResize();
                    self.$scope.gridApi.grid.refresh();
                }, 5);
            }   
            
            
            gridApi.grid.element.on('keyup', function (ev) {            
                if(ev.which == 13 || ev.keyCode=='13'){
                    self.setFocusArticulo();
                    $scope.gridApi.grid.cellNav.clearFocus();
                // ev.stopPropagation();   
                }
            })

            gridApi.edit.on.afterCellEdit(self.$scope, (rowEntity, colDef, newValue, oldValue) => {
                               
                //Validar campos                 
                if (rowEntity[colDef.field] === "" || rowEntity[colDef.field] === undefined || rowEntity[colDef.field] === null) {
                    rowEntity[colDef.field] = oldValue;
                }

                if (colDef.field === "idMedida" && rowEntity.idMedida !== oldValue) {
                    let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);
                    rowEntity.precioCosto = dataMedida.precioCosto;
                }

                self.setTotal(rowEntity);  
               
                
            })
        }
    }

    //Set Total Row 
    setTotal(rowEntity) {
        let total = rowEntity.cantidad * rowEntity.precioCosto;
        rowEntity.total = this._fS.roundNumber(total, 5); //Total Precio Venta
    }

    setColumnDefs(){
        this.gridOptions.columnDefs = [
            {
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                        <button type="button"  ng-click="grid.appScope.$ctrl.deleteRow(row)" style="cursor:pointer;" class="btn btn-danger btn-xs text-white" title="Eliminar Item agregada"><i class="fa fa-trash"></i></button>
                        <button type="button"  ng-click="grid.appScope.$ctrl.abrirModalArticulo(row.entity)" style="cursor:pointer;" class= "btn btn-success btn-xs text-white" title = "Editar Articulo" > <i class="fa fa-edit"></i></button >
                        `,
            },
            {
                name: 'N°',
                field: 'num',
                visible: true,
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50',
            },
            {
                name: 'Código',
                field: 'codigo',
                type: 'string',
                width: '10%',
                minWidth: '100',
                enableCellEdit: false,
                allowCellFocus: false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: 'idArticulo',
                field: 'idArticulo',
                type: 'number',
                width: '10%',
                minWidth: '100',
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                allowCellFocus: false,
                visible: false
            },
            {
                name: "Descripción",
                field: "descripcion",
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario !== true;
                },
                cellTooltip: function (row) {
                    return row.entity.descripcion;
                },
                width: '40%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                min: 1,
                type: 'number',
                width: '7%',
                minWidth: '100'
            },
            {
                name: 'Medida',
                field: 'idMedida',
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                editDropdownOptionsFunction: function (rowEntity, colDef) {
                    return rowEntity.medidas.map(function (val) {
                        //if (val.articuloPvP.idTarifa == rowEntity.idTarifa && rowEntity.precioVenta !== val.articuloPvP.precioVenta) {
                        //    val.articuloPvP.precioVenta = rowEntity.precioVenta
                        //}
                        return {
                            id: val.idMedida,
                            value: val.descripcion
                        }
                    })

                },
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            // { 
            //     name: 'codigoTipoIva', field: 'codigoTipoIva', allowCellFocus: false, type:'string',
            //     enableCellEdit: false, width: '8%', minWidth:'100', enableColumnMenu: false, visible: false
            // },
            // { 
            //     name: 'Iva', field: 'nombreTipoIva', allowCellFocus: false, 
            //     enableCellEdit: false, width: '8%', minWidth:'100', type:'string',
            //     enableColumnMenu: false, visible: true 
            // },
            // { 
            //     name: 'Stock', field: 'stock', allowCellFocus: false, 
            //     enableCellEdit: false, width: '5%', minWidth:'65', type:'number',
            //     enableColumnMenu: false, visible: true,  aggregationType: uiGridConstants.aggregationTypes.sum,customTreeAggregationFinalizerFn: function (aggregation) {
            //         aggregation.rendered = form.roundNumber(aggregation.value,2)
            //      }, aggregationLabel: "$",  
            // },
            {
                name: 'P. Costo',
                field: 'precioCosto',
                enableCellEditOnFocus: true,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth: '100',                
                // aggregationType: uiGridConstants.aggregationTypes.sum,
                // footerCellFilter: 'number:2',
                // cellFilter: "currency:'$'",
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'number',
                // aggregationType: form.roundNumber(uiGridConstants.aggregationTypes.sum, 2),
                // customTreeAggregationFinalizerFn: function (aggregation) {
                //     aggregation.rendered = form.roundNumber(aggregation.value, 2)
                // },
                // aggregationLabel: "$",
            }
        ]
    }


    setColumnDefsView(){
        this.gridOptions.columnDefs = [
            {
                name: 'Op.',
                enableCellEdit: false,
                width: '7%',
                minWidth: '100',
                cellTemplate: `
                        <button type="button"  style="cursor:pointer;" class="btn btn-danger btn-xs text-white disabled" title="Eliminar Item agregada"><i class="fa fa-trash"></i></button>
                        <button type="button" style="cursor:pointer;" class= "btn btn-success btn-xs text-white disabled" title = "Editar Articulo" > <i class="fa fa-edit"></i></button>
                        `,
            },
            {
                name: 'N°',
                field: 'num',
                visible: true,
                enableCellEdit: false,
                allowCellFocus: false,
                width: '2%',
                minWidth: '50',
            },
            {
                name: 'Código',
                field: 'codigo',
                type: 'string',
                width: '10%',
                minWidth: '100',
                allowCellFocus: false,
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
            },
            {
                name: 'idArticulo',
                field: 'idARticulo',
                type: 'number',
                width: '10%',
                minWidth: '100',
                headerCellClass: 'header-text-retencion',
                cellClass: 'body-text-retencion',
                allowCellFocus: false,
                visible: false
            },
            {
                name: "Descripción",
                field: "descripcion",
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                cellEditableCondition: function (scope) {
                    return scope.row.entity.llevaInventario !== true;
                },
                cellTooltip: function (row) {
                    return row.entity.descripcion;
                },
                width: '40%',
                minWidth: '100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                min: 1,
                type: 'number',
                width: '7%',
                minWidth: '100'
            },
            {
                name: 'Medida',
                field: 'idMedida',
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                editDropdownOptionsFunction: function (rowEntity, colDef) {
                    return rowEntity.medidas.map(function (val) {
                        //if (val.articuloPvP.idTarifa == rowEntity.idTarifa && rowEntity.precioVenta !== val.articuloPvP.precioVenta) {
                        //    val.articuloPvP.precioVenta = rowEntity.precioVenta
                        //}
                        return {
                            id: val.idMedida,
                            value: val.descripcion
                        }
                    })

                },
                type: 'number',
                width: '8%',
                minWidth: '100'
            },
            // { 
            //     name: 'codigoTipoIva', field: 'codigoTipoIva', allowCellFocus: false, type:'string',
            //     enableCellEdit: false, width: '8%', minWidth:'100', enableColumnMenu: false, visible: false
            // },
            // { 
            //     name: 'Iva', field: 'nombreTipoIva', allowCellFocus: false, 
            //     enableCellEdit: false, width: '8%', minWidth:'100', type:'string',
            //     enableColumnMenu: false, visible: true 
            // },
            // { 
            //     name: 'Stock', field: 'stock', allowCellFocus: false, 
            //     enableCellEdit: false, width: '5%', minWidth:'65', type:'number',
            //     enableColumnMenu: false, visible: true,  aggregationType: uiGridConstants.aggregationTypes.sum,customTreeAggregationFinalizerFn: function (aggregation) {
            //         aggregation.rendered = form.roundNumber(aggregation.value,2)
            //      }, aggregationLabel: "$",  
            // },
            {
                name: 'P. Costo',
                field: 'precioCosto',
                enableCellEdit: false,
                enableCellEditOnFocus: false,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth: '100',                
                // aggregationType: uiGridConstants.aggregationTypes.sum,
                // footerCellFilter: 'number:2',
                // cellFilter: "currency:'$'",
            },
            {
                name: 'Total',
                field: 'total',
                allowCellFocus: false,
                enableCellEdit: false,
                width: '8%',
                minWidth: '100',
                type: 'number',
                // aggregationType: form.roundNumber(uiGridConstants.aggregationTypes.sum, 2),
                // customTreeAggregationFinalizerFn: function (aggregation) {
                //     aggregation.rendered = form.roundNumber(aggregation.value, 2)
                // },
                // aggregationLabel: "$",
            }
        ]
    }


    abrirModalArticulo(item){        
        this.$scope.gridApi.cellNav.scrollToFocus(
            this.gridOptions.data[0],
            this.gridOptions.columnDefs[2]
        )
        this.$scope.$broadcast("editArticulo", item)
    }
    
    setItemArticuloEnDetalle(item){
        try {
            const {articulo, medidas} = item;
        
            let entity = {};

            this.indexRow = this.gridOptions.data.findIndex(value => value.idArticulo === articulo.idArticulo);
           
            if (this.indexRow !== -1) {
                entity = this.gridOptions.data[this.indexRow];
                entity.cantidad = entity.cantidad+1;
           
                this.setTotal(entity)

            } else {
                
                this.addRow();
                
                this.indexRow = this.gridOptions.data.findIndex(value => value.idArticulo === 0);
                entity = this.gridOptions.data[this.indexRow];
            }

            this.addItem(entity, articulo, medidas); // item row
            this.enumGridOptions();    
            this.focusColumnaCantidad();
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }
    } 

    addRow() {
        this.gridOptions.data.push({
            idTransferenciaBodegaDetalle:0,
            num: 1,
            idArticulo: 0,
            codigo: "",
            descripcion: "",
            cantidad: 1,
            medidas: [],
            stock: 0,
            precioCosto: 0,
            total: 0
        });
    }

    addItem(entity, item, medidas) {
        let dataMedida         = medidas[0];
        entity.codigo          = item.codigoArticulo;
        entity.idArticulo      = item.idArticulo;
        entity.descripcion     = item.descripcion;
        entity.stock           = item.stock;
        entity.precioCosto     = dataMedida.precioCosto;
        entity.precioActual    = dataMedida.precioCosto;
        entity.total           = dataMedida.precioCosto;
        entity.llevaInventario = item.llevaInventario;
        entity.medidas         = medidas; //Lista Medida 
        entity.idMedida        = dataMedida.idMedida; //Medida por defecto                                    
    }


    enumGridOptions() {
        let num = 1;
        
        for(let item of this.gridOptions.data){
            item.num = num ++;
        }      
    }

    focusColumnaCantidad() {        
        this.$scope.gridApi.cellNav.scrollToFocus(
            this.gridOptions.data[0],
            this.gridOptions.columnDefs[2]
        )

        this.$timeout(() => {
            this.$scope.gridApi.cellNav.scrollToFocus(
                this.gridOptions.data[this.indexRow],
                this.gridOptions.columnDefs[5]
            );
        }, 10)
    }


    async deleteRow(row) {
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            title: 'Eliminar Articulo',
            html: `<small>Esta seguro de eliminar este articulo ${row.entity.descripcion}</small>`,
            showConfirmButton: true,
            showDenyButton: true,
            allowOutsideClick: false,
            confirmButtonText: 'Si, eliminar',
            denyButtonText: 'No, cancelar'
        })

        if (isConfirmed) {
            let index = this.gridOptions.data.indexOf(row.entity);            
            this.gridOptions.data.splice(index, 1);
            this.$scope.$apply()
        }
    }


    validForm(tituloModal){

        if (!this.data.codEstabOrigen) {
            this._tS.toastr('warning', 'Seleccione Establecimiento Origen', tituloModal);
            return
        }

        if (!(this.data.idBodegaOrigen>0)) {
            this._tS.toastr('warning', 'Seleccione la Bodega Origen', tituloModal);
            return
        }

        if (!(this.data.idBodegaDestino>0)) {
            this._tS.toastr('warning', 'Seleccione la Bodega Destino', tituloModal);
            return
        }

        if (!(this.data.idPuntoEmision>0)) {
            this._tS.toastr('warning', 'Seleccione el Punto de Emisión', tituloModal);
            return
        }

        if (!this.data.fechaEmision) {
            this._tS.toastr('warning', 'Ingrese fecha de Emisión', tituloModal);
            return
        }

        if (this.gridOptions.data.length === 0) {
            this._tS.toastr('warning', 'Ingrese al menos un articulo en el Detalle', tituloModal);
            return
        }

        return true;
    }


    closeModal(){
        this.$uibModalInstance.close()
    }
}


export class ModalTransferenciaBodegaNuevoCtrl extends ModalTransferenciaBodegaCtrl{

    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'formulario', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params})   
        
        this.data = {
            fechaEmision: new Date()
        }

    }

    async $onInit(){
        try {
            showLoader();
            let resultsDataForm = await this.initiload();            

            this.establecimientosOrigen = resultsDataForm[0];
            this.establecimientosDestino = resultsDataForm[0];

            if(this.establecimientosOrigen.length>0){
                                             
                let dataEstabOrigen  = this.establecimientosOrigen[0];             
                       
                //Obtenemos Puntos de Emision, Bodegas, actividad Tipo Iva 
                let dataFormEstabOrigen = await this.getDataFormEstabAsig(dataEstabOrigen);               
                
                //Punto de Emision
                this.puntosEmision = dataFormEstabOrigen[0];
                this.data.idPuntoEmision = this.puntosEmision.length>0?this.puntosEmision[0].idPuntoEmision: 0

                //Codigo Establecimiento 
                this.data.codEstabOrigen = dataEstabOrigen.codEstab;
                this.cloneCodEstabOrigen = dataEstabOrigen.codEstab;
                            
                //Bodegas
                this.bodegasOrigen = dataFormEstabOrigen[1];                               
                this.data.idBodegaOrigen = this.bodegasOrigen.length>0?this.bodegasOrigen[0].idBodega:0;  
            
                
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }
            this.setColumnDefs();
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }           
    }

    async onChangeEstablecimientoOrigen(){
        try {

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
              })
              
              let {isConfirmed} = await  swalWithBootstrapButtons.fire({
                title: '<small>Cambiar Establecimiento?</small>',
                html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, cambiar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })

            if(!isConfirmed){
                this.data.codEstabOrigen = this.cloneCodEstabOrigen;
                this.$scope.$apply();
                return
            }

            this.cloneCodEstabOrigen = this.data.codEstabOrigen;

            let dataEstab = this.establecimientosOrigen.find(item=>item.codEstab===this.data.codEstabOrigen);   
            
            //Obtenemos Puntos de Emision y Bodegas 
            let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
           
            this.puntosEmision = resultsDataFormEstab[0];
            this.data.idPuntoEmision = this.puntosEmision.length>0 ? this.puntosEmision[0].idPuntoEmision: 0;
            
            this.bodegasOrigen = resultsDataFormEstab[1];
            this.data.idBodegaOrigen = this.bodegasOrigen.length>0 ? this.bodegasOrigen[0].idBodega: 0;            

            this.$scope.$apply();
        } catch (error) {
            console.trace(error)
        }     
    }

    async onChangeEstablecimientoDestino(){
        try {

            let dataEstab = this.establecimientosDestino.find(item=>item.codEstab===this.data.codEstabDestino);   
            
            //Obtenemos Puntos de Emision y Bodegas 
            let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
                      
            this.bodegasDestino = resultsDataFormEstab[1];
            this.data.idBodegaDestino = this.bodegasDestino.length>0 ? this.bodegasDestino[0].idBodega: 0;            
                     
            this.$scope.$apply();
        } catch (error) {
            console.trace(error)
        }     
    }


    async onSave(){
        try {
            let tituloModal = "Guardar";
            if(!this.validForm(tituloModal)) return


            showLoader();
            this.nroDocumentoSecuencial = await this._commonSvc.generarNroDocumentoCompra({
                idPuntoEmision: this.data.idPuntoEmision,
                codigoDocumento: this.TIPO_DOC.codigo
            })

            hideLoader();
            if(!this.nroDocumentoSecuencial) throw "NO SE GENERÓ NÚMERO SECUENCIAL CORRECTAMENTE";

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Guardar Transferencia Bodega</small>',
                html: `<small>Esta Ud. seguro de guardar este Documento <b> Nro. ${this.nroDocumentoSecuencial}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })       
           
            
            if(!isConfirmed) return

            showLoader();
            

            let header = Object.assign({}, this.data);
            header.total =  this.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
            // header.fechaEmision = this._formSvc.formatDateTimeZone(this.data.fechaEmision);
          
            let data = {
                header: JSON.stringify(header),
                detail: JSON.stringify(this.gridOptions.data)
            }

            await this._mS.getData('post', '/TransferenciaBodega/Insert', data).then(response=>{
                if (response.code === "0") {                    
                    this._fS.sweetAlert('warning', response.message, response.titleSms);
                }
                if (response.code === "1") {                    
                    this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                    this.$uibModalInstance.close(response)
                }
            })

        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }
    }
}



export class ModalTransferenciaBodegaEditarCtrl extends ModalTransferenciaBodegaCtrl{
    
    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'formulario', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params})   
        
        let {TIPO_REGISTRO, data} = _params;
        let {dataDocumento, establecimientoOrigen, establecimientoDestino, detalleDocumento} = data;
        
        this.data = dataDocumento;

        this.establecimientoOrigen = establecimientoOrigen;
        this.establecimientoDestino = establecimientoDestino;
        this.detalleDocumento = detalleDocumento;

        this.data.codEstabOrigen = this.establecimientoOrigen.codEstab;
        this.data.codEstabDestino = this.establecimientoDestino.codEstab;
        

    }

    async $onInit(){
        try {
            showLoader();
            let resultsDataForm = await this.initiload();            

            this.establecimientosOrigen = resultsDataForm[0];
            this.establecimientosDestino = resultsDataForm[0];

            if(this.establecimientosOrigen.length>0){
                                             
                let dataEstabOrigen  = this.establecimientosOrigen.find(item=>item.codEstab===this.data.codEstabOrigen);         
                let dataEstabDestino  = this.establecimientosOrigen.find(item=>item.codEstab===this.data.codEstabDestino);         
                       
                //Obtenemos Puntos de Emision, Bodegas, actividad Tipo Iva 
                let dataFormEstabOrigen = await this.getDataFormEstabAsig(dataEstabOrigen);               
                let dataFormEstabDestino = await this.getDataFormEstabAsig(dataEstabDestino);               
                
                //Punto de Emision
                this.puntosEmision = dataFormEstabOrigen[0]; 
                            
                //Bodega Origen 
                this.bodegasOrigen = dataFormEstabOrigen[1];                               
             

                //Bodega Destino 
                this.bodegasDestino = dataFormEstabDestino[1];                               
                
            
                
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }
            this.setColumnDefs();
            this.gridOptions.data = this.detalleDocumento;

            this.enumGridOptions();
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }        
    }


    async onSave(){
        try {
            let tituloModal = "Actualizar";
            if(!this.validForm(tituloModal)) return
            

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Actualizar Transferencia Bodega</small>',
                html: `<small>Esta Ud. seguro de actualizar este Documento</small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, actualizar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick:false,
                allowEscapeKey:false
            })       
           
            
            if(!isConfirmed) return

            showLoader();
            

            let header = Object.assign({}, this.data);
            header.total =  this.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
            // header.fechaEmision = this._formSvc.formatDateTimeZone(this.data.fechaEmision);
          
            let data = {
                header: JSON.stringify(header),
                detail: JSON.stringify(this.gridOptions.data)
            }

            await this._mS.getData('put', '/TransferenciaBodega/Update?id=' + this.data.idTransferenciaBodega, data).then(response=>{                
                if (response.code === "0") {                    
                    this._fS.sweetAlert('warning', response.message, response.titleSms);
                }
                if (response.code === "1") {                    
                    this._fS.sweetAlert('success', response.message, response.titleSms, 1000);
                    this.$uibModalInstance.close(response)
                }
            })

        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }
    }



}



export class ModalTransferenciaBodegaDetalleCtrl extends ModalTransferenciaBodegaCtrl{
    
    static $inject = ['$scope', '$timeout', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'formulario', 'params']

    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _params})   
        
        let {TIPO_REGISTRO, data} = _params;
        let {dataDocumento, establecimientoOrigen, establecimientoDestino, detalleDocumento} = data;
        
        this.data = dataDocumento;

        this.establecimientoOrigen = establecimientoOrigen;
        this.establecimientoDestino = establecimientoDestino;
        this.detalleDocumento = detalleDocumento;

        this.data.codEstabOrigen = this.establecimientoOrigen.codEstab;
        this.data.codEstabDestino = this.establecimientoDestino.codEstab;
        

    }

    async $onInit(){
        try {
            showLoader();
            let resultsDataForm = await this.initiload();            

            this.establecimientosOrigen = resultsDataForm[0];
            this.establecimientosDestino = resultsDataForm[0];

            if(this.establecimientosOrigen.length>0){
                                             
                let dataEstabOrigen  = this.establecimientosOrigen.find(item=>item.codEstab===this.data.codEstabOrigen);         
                let dataEstabDestino  = this.establecimientosOrigen.find(item=>item.codEstab===this.data.codEstabDestino);         
                       
                //Obtenemos Puntos de Emision, Bodegas, actividad Tipo Iva 
                let dataFormEstabOrigen = await this.getDataFormEstabAsig(dataEstabOrigen);               
                let dataFormEstabDestino = await this.getDataFormEstabAsig(dataEstabDestino);               
                
                //Punto de Emision
                this.puntosEmision = dataFormEstabOrigen[0]; 
                            
                //Bodega Origen 
                this.bodegasOrigen = dataFormEstabOrigen[1];                               
             

                //Bodega Destino 
                this.bodegasDestino = dataFormEstabDestino[1];                               
                
            
                
            }else{
                this._tS.toastr('info', 'No tienes asignado ningún Establecimiento')
            }
            this.setColumnDefsView();
            this.gridOptions.data = this.detalleDocumento;

            this.enumGridOptions();
            this.$scope.$apply();
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }             
    }

}


export class ModalTransferenciaBodegaFiltroCtrl extends ModalBaseCtrl{
    
}
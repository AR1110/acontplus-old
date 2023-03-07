import { CalculoTarifaHelper } from "../../helpers/calculoTarifaHelper.min.js";
export class ModalBaseCtrl{
    /**
     * 
     * @param {object} {_mS, _commonSvc, _tS, _modalSvc, _nombreModalConst}
     */
    constructor({_mS, _commonSvc, _tS, _modalSvc, _nombreModalConst}){
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._tS = _tS;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;

        this.clienteSearch = {};
        this.data = {};


        this.data.subTotalIva = 0;
        this.data.subTotalIvaCero = 0;
        this.data.subTotalExentoIva = 0;
        this.data.subTotalNoObjetoIva = 0;
        this.data.subTotalNetoIva = 0;
        this.data.subTotalNetoIvaCero = 0;
        this.data.subTotalNetoExentoIva = 0;
        this.data.subTotalNetoNoObjetoIva = 0;
        this.data.totalIce = 0;
        this.data.irbpnr = 0;
        this.data.propina = 0;

        this.data.porcentajeDescuento = 0;
        this.data.transporte = 0;
        this.data.recargo = 0;
        this.data.subTotalSinImpuestos = 0;
        this.data.iva = 0;
        this.data.totalDescuento = 0;
        this.data.total = 0;

        this.NUM_CONSUMIDOR_FINAL = "9999999999999";

    }

    initiload(){
        return this._mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response=>{
            if(response.code==='0'){                
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



    setDataInfoEstab(establecimientos, ptosEmision){
        this.infoEstabPtoEmi = {}
        if(establecimientos.length>0){
            this.infoEstabPtoEmi.nombreComercial = establecimientos.find(item=>item.codEstab===this.data.codEstab).nombreComercial;
        }

        if(ptosEmision.length>0){
            this.infoEstabPtoEmi.ptoEmi = ptosEmision.find(item=>item.idPuntoEmision===this.data.idPuntoEmision).ptoEmi; 
        }
        
    }


    /**
     * 
     * @param {string} textSearch 
     * @returns 
     */
    clienteSearchDynamic(textSearch){
        try {            
            return this._commonSvc.clienteSearch(textSearch);   
            
        } catch (error) {
            console.log(error)
        }
    }


    onKeyupSearchCliente(){
        if(!this.cliente.nombreFiscal){
            this.cliente = {};
        }
    }

    /**
     * 
     * @param {object} item 
     * @returns object data cliente
     */
    
    async getClienteById(item){
        return this._commonSvc.getDataCliente(item.idCliente);
    }


    async openModalClienteNew(){

        let {MODAL_CTRL, MODAL_NUEVO} = this._nombreModalConst.cliente;
        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_NUEVO['controller']];
        let template   = MODAL_NUEVO['template'];
        
        this.openModalCliente({
            controller,
            template
        })
    }


    async openModalClienteUpdate(){
        let {MODAL_CTRL, MODAL_EDITAR} = this._nombreModalConst.cliente;
        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_EDITAR['controller']];
        let template   = MODAL_EDITAR['template'];
        let params = this.cliente;

        this.openModalCliente({
            controller,
            template,
            params
        })        
    }


    async openModalClienteLista(){
        let {MODAL_CTRL, MODAL_LISTA} = this._nombreModalConst.cliente;
        let controller = (await import('./../../modal/' + MODAL_CTRL))[MODAL_LISTA['controller']];
        let template   = MODAL_LISTA['template'];
        let params = this.cliente;

        this.openModalCliente({
            controller,
            template,
            params
        })  
    }


    /**
     * 
     * @param {*} controller 
     * @param {*} template 
     * @param {*} params 
     */
    openModalCliente({controller, template, params}){
        let modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'xl',
            params
        })
        modalRef.result.then(result=>{
            
            if(typeof result!=='object') return
            
            this.onSelectedClienteChange(result)
        })        
    }


    /**
     * 
     * @param {date} fechaEmision 
     */
    getFechaVencimiento(){        
        if (this.data.fechaEmision && this.tiempoCreditos.length > 0) {
            let tiempoCredito = this.tiempoCreditos.find(item=>item.idTiempoCredito===this.data.idTiempoCredito);  
            let diasCredito = typeof tiempoCredito==='object'? tiempoCredito.diasCredito : 0;          
            
            this.data.fechaVencimiento = this._fS.getFechaVencimiento(this.data.fechaEmision, diasCredito);
            this.fechaEmisionEscrita = this._fS.getFechaEscrita(this.data.fechaEmision);
            this.fechaVencimientoEscrita = this._fS.getFechaEscrita(this.data.fechaVencimiento);
            
        }
    }


    setColumnDefs(){
        this.gridOptions.columnDefs = [                
            {
                name: 'Op.',
                enableCellEdit: false,
                width: '5%',
                minWidth:'100',
                cellTemplate: this.CELL_TEMPLATE_OPTION,
            },                        
            {
                name: 'N°',
                field: 'n',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '5%',
                minWidth:'50'
            },
            {
                name: 'cód.',
                field: 'codigo',
                enableCellEdit: false,
                allowCellFocus: false,
                width: '8%',
                minWidth:'100'
            },
            { name: 'idArticulo', field: 'idArticulo', visible: false },
            {
                name: "Descripción",
                field: "descripcion",
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                cellEditableCondition: function(scope) {
                    return scope.row.entity.llevaInventario !== true;
                },
                cellTooltip: function(row) {
                    return row.entity.descripcion;
                },
                width: '25%',
                minWidth:'100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',
                enableCellEditOnFocus: true,
                min: 1,
                type: 'number',
                width: '6%',
                minWidth:'50'
            },
            {
                name: 'Medida',
                field: 'idMedida',                           
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                editDropdownOptionsFunction: function(rowEntity, colDef) {
                    return rowEntity.medidas.map(function(val) {                     
                        return { id: val.idMedida, value: val.descripcion }
                    })

                },
                type: 'number',       
                width: '8%',      
                minWidth:'100'             
            },
            {
                name: 'codigoTipoIva',
                field: 'codigoTipoIva',
                enableCellEdit: false,
                width: '8%',                            
                visible: false
            },
            {
                name: 'I.V.A',
                field: 'idTipoIva',                    
                width: '8%',
                minWidth:'100',
                type: 'number',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva',
                enableCellEdit: true,
                allowCellFocus: true,
                enableCellEditOnFocus: true,
            //    visible: config.porcentajeIva
            },
            { name: 'tarifas', field: 'articuloTarifas', visible: false },
            {
                name: 'Tarifa',
                field: 'idTarifa',
                width: '12%',
                minWidth:'100',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                editDropdownOptionsFunction: (rowEntity, colDef)=>{
                    return rowEntity.articuloTarifas.map(val=>({ id: val.idTarifa, value: val.tarifa + ' - $' + val.precioConIva }))    
                }, 
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario', 
                enableCellEditOnFocus: true,
                enableColumnMenu: false,
                type: 'number',
                width: '8%',
                minWidth:'100',
                // cellFilter: "currency:'$'",
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                min: 0,
                type: 'number',
                enableCellEdit: true,                    
                allowCellFocus:true,
                enableCellEditOnFocus: true,
                width: '7%',
                minWidth:'100',
                // cellFilter: "currency:'$'",
            },
            {
                name: '%',
                field: 'porcentajeDescuento',
                enableCellEdit:true,
                allowCellFocus:true,
                enableCellEditOnFocus: true,
                min: 0,
                width: '6%',
                minWidth:'100',
                // cellFilter: "currency:'%'",
                visible: this.configDetalle.porcentajeDescuento || false,
                type: 'number',
                /*cellFilter: "limitTo:3",*/
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                min: 0,
                type: 'number',
                width: '6%',
                minWidth:'100',
                // cellFilter: "currency:'$'",
                visible: this.configDetalle.descuento || false
            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                enableCellEdit: false,
                allowCellFocus: false,
                min: 0,
                type: 'number',
                width: '7%',
                minWidth:'100',
                // cellFilter: "currency:'$'",
                visible: this.configDetalle.totalDescuento || false
            },
            {
                name: 'sub Total',
                field: 'subTotal',
                enableCellEdit: false,
                type: 'number',
                width: '7%',
                minWidth:'100',
                visible: false,
                // cellFilter: "currency:'$'",
            },  
            {
                name: 'Total',
                field: 'total',
                enableCellEdit: false,
                allowCellFocus: false,
                type: 'number',
                width: '5%',
                minWidth:'100',
                visible: true,
            },
            {
                name: 'Ice',
                field: 'ice',
                enableCellEdit: false,
                allowCellFocus: false,
                type: 'number',
                width: '6%',
                minWidth:'100',
                // cellFilter: "currency:'$'",
                visible: this.configDetalle.ice || false
            },
            {
                name: 'Nota',
                field: 'nota',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'string',
                width: '15%',
                minWidth:'100'
            },
            {
                name: 'bodega',
                field: 'idBodega',                    
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                type: 'number',
                width: '11%',
                minWidth:'100'
            },                                              
            {
                name: 'llevaInventario',
                field: 'llevaInventario',
                visible: false
            },
            {
                name: 'datosAdicionales',
                field: 'datosAdicionales',
                visible: false
            },            
        ]

        let indexTipoIva = this.gridOptions.columnDefs.findIndex(item=>item.field==='idTipoIva');
        let indexBodega  = this.gridOptions.columnDefs.findIndex(item=>item.field==='idBodega');
        this.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;
        this.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;         
    }

    setColumnDefsVista(){
        this.gridOptions.columnDefs = [                
            {
                name: 'Op',
                enableCellEdit: false,
                width: '3%',
                minWidth:'50',
                cellTemplate: this.CELL_TEMPLATE_OPTION,
            },                        
            {
                name: 'N°',
                field: 'n',
                width: '5%',
                minWidth:'50'
            },
            {
                name: 'cód.',
                field: 'codigo',
                width: '8%',
                minWidth:'100'
            },            
            {
                name: "Descripción",
                field: "descripcion",                                
                cellTooltip: function(row) {
                    return row.entity.descripcion;
                },
                width: '25%',
                minWidth:'100'
            },
            {
                name: 'Cant.',
                field: 'cantidad',                
                min: 1,
                type: 'number',
                width: '6%',
                minWidth:'50'
            },
            {
                name: 'Medida',
                field: 'idMedida',                           
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',     
                editDropdownOptionsFunction: function(rowEntity, colDef) {
                    return rowEntity.medidas.map(function(val) {                     
                        return { id: val.idMedida, value: val.descripcion }
                    })

                },
                type: 'number',       
                width: '8%',      
                minWidth:'100'             
            },
            {
                name: 'codigoTipoIva',
                field: 'codigoTipoIva',
                enableCellEdit: false,
                width: '8%',                            
                visible: false
            },
            {
                name: 'I.V.A',
                field: 'idTipoIva',                    
                width: '8%',
                minWidth:'100',
                type: 'number',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva'    
            },            
            {
                name: 'Tarifa',
                field: 'idTarifa',
                width: '12%',
                minWidth:'100',
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: (rowEntity, colDef)=>{
                    return rowEntity.articuloTarifas.map(val=>({ id: val.idTarifa, value: val.tarifa + ' - $' + val.precioConIva }))    
                }, 
            },
            {
                name: 'Precio U.',
                field: 'precioUnitario', 
                type: 'number',
                width: '8%',
                minWidth:'100',                
            },
            {
                name: 'P. Iva',
                field: 'precioConIva',
                min: 0,
                type: 'number',
                width: '7%',
                minWidth:'100',                
            },
            {
                name: '%',
                field: 'porcentajeDescuento',          
                min: 0,
                width: '6%',
                minWidth:'100',                
                visible: this.configDetalle.porcentajeDescuento || false,
                type: 'number',                
            },
            {
                name: 'dsto.',
                field: 'valorDescuento',
                min: 0,
                type: 'number',
                width: '6%',
                minWidth:'100',                
                visible: this.configDetalle.descuento || false
            },
            {
                name: 'T. Dsto.',
                field: 'totalDescuento',
                min: 0,
                type: 'number',
                width: '7%',
                minWidth:'100',                
                visible: this.configDetalle.totalDescuento || false
            },
            {
                name: 'sub Total',
                field: 'subTotal',                
                type: 'number',
                width: '7%',
                minWidth:'100',
                visible: false,
                // cellFilter: "currency:'$'",
            },  
            {
                name: 'Total',
                field: 'total',
                type: 'number',
                width: '5%',
                minWidth:'100',
                visible: true,
            },
            {
                name: 'Ice',
                field: 'ice',
                type: 'number',
                width: '6%',
                minWidth:'100',                
                visible: this.configDetalle.ice || false
            },
            {
                name: 'Nota',
                field: 'nota',
                type: 'string',
                width: '15%',
                minWidth:'100'
            },
            {
                name: 'bodega',
                field: 'idBodega',                    
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
                type: 'number',
                width: '11%',
                minWidth:'100'
            }           
        ]

        let indexTipoIva = this.gridOptions.columnDefs.findIndex(item=>item.field==='idTipoIva');
        let indexBodega  = this.gridOptions.columnDefs.findIndex(item=>item.field==='idBodega');
        this.gridOptions.columnDefs[indexTipoIva].editDropdownOptionsArray = this.tipoIvas;
        this.gridOptions.columnDefs[indexBodega].editDropdownOptionsArray = this.bodegas;         
    }


    async onChangeEstablecimiento(){
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
                this.data.codEstab = this.cloneCodEstab;
                this.$scope.$apply();
                return
            }

            this.cloneCodEstab = this.data.codEstab;

            const dataEstab = this.establecimientos.find(item=>item.codEstab===this.data.codEstab);   
            
            //Obtenemos Puntos de Emision y Bodegas 
            let resultsDataFormEstab = await this.getDataFormEstabAsig(dataEstab);
           
            this.puntosEmisiones = resultsDataFormEstab[0];
            this.data.idPuntoEmision = this.puntosEmisiones.length>0 ? this.puntosEmisiones[0].idPuntoEmision: 0;
            
            this.bodegas         = resultsDataFormEstab[1];
            this.idBodega        = this.bodegas.length>0 ? this.bodegas[0].idBodega: 0;
            this.cloneIdBodega   = this.idBodega;

            this.actividadTipoIva = resultsDataFormEstab[2][0]

            let indexColumn = this.gridOptions.columnDefs.findIndex(item=>item.field==='idBodega');
            
            this.gridOptions.columnDefs[indexColumn].editDropdownOptionsArray = this.bodegas;
                
            for(let item of this.gridOptions.data){
                item.idBodega = this.idBodega;
            }  
            
            //Recalculamos los valos de subtotales 

            this.uiGridInvoice.actividadTipoIva = this.actividadTipoIva;
            this.data = Object.assign(this.data, this.uiGridInvoice.getTotales());

            this.setDataInfoEstab(this.establecimientos, this.puntosEmisiones)

            this.$scope.$apply();
        } catch (error) {
            console.trace(error)
        }       
    }

    async onChangeBodega(){
        try {
            let bodega = this.bodegas.find(item=>item.idBodega===this.idBodega);
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await swalWithBootstrapButtons.fire({
                title: '<small>Cambiar Bodega</small>',
                html: `<small>¿Esta seguro de cambiar la Bodega: <b>${bodega.descripcion}</b>  en el detalle del Documento?</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Si, cambiar!`,
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            })

            if(isConfirmed){
                this.cloneIdBodega = this.idBodega;           
            
                if (this.gridOptions.data.length === 0) return
    
                for(let item of this.gridOptions.data){
                    item.idBodega = this.idBodega;
                }   
                this.$scope.$apply();
            }else{
                this.idBodega = this.cloneIdBodega;
                this.$scope.$apply();
            }
        } catch (error) {
            console.log(error)
        }        
    }


    async askToChangeTariga(){
        let tarifa = this.tarifas.find(item=>item.idTarifa===this.idTarifa);
        let { isConfirmed } = await Swal.fire({
            html: `<small>¿Esta seguro de aplicar este tarifa: <b>${tarifa.descripcion}</b> en los precios de venta en todo el Documento?</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: `Sí, cambiar!`,
            cancelButtonText: 'No, cancelar!',
            allowOutsideClick: false,           
        })

        if (isConfirmed) {
           
            this.cloneIdTarifa = this.idTarifa;           
            
            if (this.gridOptions.data.length === 0) return

            this.setTarifaInDetail();             
        } else {
            this.idTarifa = this.cloneIdTarifa;
            this.$scope.$apply();
        }
    }


    setTarifaInDetail(){
        const self = this;
        try {            
            for(let rowEntity of this.gridOptions.data){
               
                let tarifa = rowEntity.articuloTarifas.find(item=>item.idTarifa===this.idTarifa);     

                let precioConIva             = CalculoTarifaHelper.calcularPrecioConIva(tarifa.precioVenta, rowEntity.tarifa);
                let precioConIvaConDescuento = CalculoTarifaHelper.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                let valorDescuento           = CalculoTarifaHelper.getValorDescuento(tarifa.precioVenta, rowEntity.porcentajeDescuento);
                
                rowEntity.idTarifa       = this.idTarifa;
                rowEntity.precioUnitario    = this._fS.roundNumber(tarifa.precioVenta, this.decimal.nroPrecio);
                rowEntity.precioConIva   = this._fS.roundNumber(precioConIvaConDescuento, this.decimal.nroPrecio);
                rowEntity.valorDescuento = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuentoDetalle);
    
                // this.calculoColumnas["calculoTotalDetalle"](); 
                let objCalculo = self.uiGridInvoice.calculoColDef(rowEntity) 
                objCalculo["calculoTotalDetalle"]();               
            }

            
            self.data = Object.assign(self.data, self.uiGridInvoice.getTotales()); 
            this.$scope.$apply();           
        } catch (error) {
            toastr.error(`APLICACIÓN DE TARIFA EN TODO EL DOCUMENTO: ${error}`)
        }                      
    }


    //------------------------------------------------Articulo----------------------------------
    openModalArticle(item){
        this.$scope.gridApi.cellNav.scrollToFocus(
            this.gridOptions.data[0],
            this.gridOptions.columnDefs[2]
        )
        this.$scope.$broadcast("editArticulo", item)
    }


    /**
     *      
     * @param {object} params  {rowEntity, isView, tipoDoc, idComprobante, articuloManejos}
     */
    async openModalDatoAdicionalArticuloParam(params){       
               
        let {MODAL_DATO_ADICIONAL_VENTA_ARTICULO_CTRL, MODAL_DATO_ADICIONAL_VENTA_ARTICULO_CSHTML} = this._nombreModalConst.common;
        let {ModalDatoAdicionalVentaArticuloCtrl} = await import(`./../../modal/${MODAL_DATO_ADICIONAL_VENTA_ARTICULO_CTRL}`);

        let modalRef = this._modalSvc.openModalCustom({
            controller: ModalDatoAdicionalVentaArticuloCtrl,
            template: `Shared/${MODAL_DATO_ADICIONAL_VENTA_ARTICULO_CSHTML}`,
            size:'lg',
            params
        })
             
        modalRef.result.then(response=>{
            this.datosAdicionalesArticulo = response;
        })       
    }

    setFocusArticulo() {
        setTimeout(function() {
          document.querySelector('#custom-template-md-autocomplete-articulo').focus();
        }, 100);
    }

    async setItemArticuloEnDetalle(dataArticulo){        
        try {
            
            this.dataArticulo = dataArticulo;

            // if(this.dataArticulo.articulo.llevaInventario && this.gridOptionsDetailDocument.data.some(item=>item.idArticulo===this.dataArticulo.articulo.idArticulo)){
            //     this.existArticulo();                              
            // }else{
                this.addItem();
            // }

            this.indexRow = this.gridOptions.data.findIndex(val => val.idArticulo === this.dataArticulo.articulo.idArticulo);           

            
        } catch (error) {
            console.log(error)            
        }
    }


    addRow(){
        const obj =  {
            idFacturaDetalle:0,
            n: 1,
            codigo: "",
            idArticulo: 0,
            descripcion: "",
            cantidad: 1,
            nombreMedida: "",
            codigoPorcentaje: "",
            tarifa: 0,            
            nombreTipoIva: "",
            articuloTarifas: [],
            idTarifa: 0,
            precioUnitario: 0,
            precioConIva: 0,
            porcentajeDescuento: 0,
            valorDescuento: 0,
            totalDescuento: 0,
            ice: 0,
            idBodega: 0,
            subTotal: 0,
            total: 0,
            nota: "S/N",
            llevaInventario: false,
            datosAdicionales: false
        }
        this.gridOptions.data.push(obj)                
    }

    addItem(){
        const self = this;
        self.addRow();        
        
        const {articulo, medidas, datosAdicionales} = self.dataArticulo;        
        let index  = self.gridOptions.data.findIndex(value => value.idArticulo === 0); 
        let entity = self.gridOptions.data[index]; 
    
        let dataMedida = medidas[0];

        
            
        entity.idArticulo           = articulo.idArticulo;
        entity.codigo               = articulo.codigoArticulo;                
        entity.descripcion          = articulo.descripcion;  
        entity.idTipoIva            = articulo.idTipoIva;                          
        entity.codigoPorcentaje     = articulo.codigoPorcentaje;
        entity.tarifa               = articulo.tarifa;
        // entity.nombreTipoIva        = articulo.nombreTipoIva;
        entity.ice                  = articulo.valorIce;
        entity.idBodega             = self.idBodega ? self.idBodega : 0;
        entity.llevaInventario      = articulo.llevaInventario;
        entity.datosAdicionales     = articulo.datosAdicionales;
        entity.productoFraccionable = articulo.productoFraccionable;
        entity.medidas              = medidas; //Lista Medida 
        entity.idMedida             = dataMedida.idMedida; //Medida por defecto 
        entity.adicional            = datosAdicionales; //

        entity.articuloTarifas      = JSON.parse(dataMedida.tarifas);
        let tarifa                  = entity.articuloTarifas.find(item=>item.idTarifa===self.idTarifa);                                      
        entity.idTarifa             = self.idTarifa;  
        entity.precioUnitario       = self._fS.roundNumber(tarifa.precioVenta, self.decimal.nroPrecio);                
        entity.precioConIva         = self._fS.roundNumber(tarifa.precioConIva, self.decimal.nroPrecio);
        
        
        const objCalculo            = self.uiGridInvoice.calculoColDef(entity, 0);             
        
        objCalculo["precioUnitario"] && objCalculo["precioUnitario"]();
        
        objCalculo["calculoTotalDetalle"]();
        
        self.data = Object.assign(self.data, self.uiGridInvoice.getTotales()); 

        this.focusColumnCantidad();
        
        
    }

    focusColumnCantidad() {
        const self = this;
        let index = self.gridOptions.columnDefs.findIndex(item=>item.field==='cantidad')
        self.$scope.gridApi.cellNav.scrollToFocus(
            self.gridOptions.data[0],
            self.gridOptions.columnDefs[2]
        )

        self.$timeout(() => {
            self.$scope.gridApi.cellNav.scrollToFocus(
                self.gridOptions.data[self.indexRow],
                self.gridOptions.columnDefs[index]
            );
        }, 30)
    }

   


    validateForm(){        
        return {
            "idSucursal": {
                valor: this.data.codEstab ,
                message: 'Seleccione la Sucursal'
            },
            "idCliente": {
                valor: this.cliente.idCliente >0,
                message: 'Seleccione el Cliente'
            },
            "idPuntoEmision":{
                valor: this.data.idPuntoEmision >0,
                message: 'Seleccione el Punto de Emisión'                
            },
            "idFactura":{
                valor: this.data.idFactura > 0,
                message: 'Seleccione la Factura'
            },
            "idTiempoCredito":{
                valor: this.data.idTiempoCredito > 0,
                message: 'Seleccione el Forma de Pago'
            },
            "fechaEmision": {
                valor:  this.data.fechaEmision instanceof Date && !isNaN(this.data.fechaEmision),
                message:  'Ingrese la Fecha de Emisión'
            },
            "fechaVencimiento":{
                valor: this.data.fechaVencimiento instanceof Date && !isNaN(this.data.fechaVencimiento),
                message: 'Ingrese la Fecha de Vencimiento',                
            },
            "validFechaVcto":{
                valor: (Date.parse(this.data.fechaEmision) <= Date.parse(this.data.fechaVencimiento)),
                message: 'Fecha de Vencimiento no puede ser menor a  Fecha de Emisión'
            },
            "gridOptions":{
                valor: this.gridOptions.data.length,
                message: 'Ingrese al menos un Articulo en el Detalle',
            },
            "gridOptionsBodega": {
                valor: this.gridOptions.data.some(item=>(item.idBodega>0)),
                message: 'Agregue  bodega a los artículos'
            }
        }
    }

    /**
     * 
     * @param {string} tituloModal Guardar || Actualizar
     * @returns 
     */
    isValidaForm(tituloModal){
        let toastMessageForm = this.validateForm();   

        for(let item of this.CAMPOS){                 
            if(item in  toastMessageForm){
                let campo =  toastMessageForm[item];                                  
                if(!campo.valor){                
                    this._tS.toastr('warning', campo.message, tituloModal);
                    return                
                }                                
            }else{
                throw `CAMPO ${item} NO DEFINIDO CORRECTAMENTE EN ESTE DOCUMENTO ${this.TIPO_DOC.descripcion}`
            }      
        }

        if(this.data.total<=0){
            this._tS.toastr('warning', 'El importe total tiene que ser distinto a 0');
            return
        }
        return true;
    }


    validarDatosAdicionales(id) {
        let isValid = true;
        for (let item of this.gridOptions.data) {
            let datosAdicionales = this.datosAdicionalesArticulo.filter(val => val.idArticulo === item.idArticulo);
            if (!item[id] > 0 && item.datosAdicionales && datosAdicionales.length !== item.cantidad) {
                this._tS.toastr('warning', `La cantidad de etiquetas no coincide con el numero de cantidad del artículo: ${item.descripcion}`, '', 'toast-bottom-right');
                isValid = false                
                break
            }
        }       
        return true
    }

    getImporteTotal(){
        if(!this.decimal) return
        let total = Number(this.data.total);
        let transporte   = Number(this.data.transporte);
        let recargo      = Number(this.data.recargo);
        let importeTotal = total + transporte + recargo;
        this.data.total  = importeTotal;
        return this._fS.roundNumber(importeTotal, this.decimal.nroTotalSubTotal);
    }

    async closeModal(){
        if(this.TIPO_REGISTRO==='NUEVO' && this.gridOptions.data.length>0){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                //   denyButton:'btn btn-info ml-2',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
            
            swalWithBootstrapButtons.fire({
                title: 'Salir ?',
                html: "<small>Tienes un documento en proceso, desea salir ahora?</small>",
                icon: 'warning',
                showCancelButton: true,
                showConfirmButton:true,                
                confirmButtonText: 'Si, salir!',                
                cancelButtonText: 'No, cancelar!',                
                reverseButtons: false
            }).then(result=>{

                if(result.isConfirmed){
                   this.$uibModalInstance.close()
                }                
            })      
            return      
        }
        this.$uibModalInstance.close();        
    }

    


    //Información Adicional del Documento 
    async openModalInfoAdicional(isView){
        let params = {
            isView,
            infoAdicionalDocumento: this.infoAdicionalDocumento
        }
        
        let {MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL, MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML} = this._nombreModalConst.common;
        let {InfoAdicionalTipoDocCtrl} = await import('./../../modal/' + MODAL_INFO_ADICIONAL_TIPO_DOC_CTRL);

        let modalRef = this._modalSvc.openModalCustom({
            controller: InfoAdicionalTipoDocCtrl,
            template: 'Shared/Common/'+MODAL_INFO_ADICIONAL_TIPO_DOC_CSHTML,
            size:'md',
            params
        })

        modalRef.result.then(infoAdicionalDocumento=>{
            this.infoAdicionalDocumento = infoAdicionalDocumento
        })
    }



    setPorcentajeDescuentoAll(porcentajeDescuento) {
        const self = this;
        for(let rowEntity of this.gridOptions.data){
            rowEntity.porcentajeDescuento = porcentajeDescuento;   
            
            let objCalculo = self.uiGridInvoice.calculoColDef(rowEntity);             
        
            objCalculo["porcentajeDescuento"]();
            
            objCalculo["calculoTotalDetalle"]();
            
        }       
        
        console.log(self.uiGridInvoice.getTotales())
        self.data = {...self.data, ...self.uiGridInvoice.getTotales()}

      
        console.log(self.data)        
    }










    async openModalCobroDocumento (params){
        let {MODAL_FILE_CTRL, MODAL_COBRO_DOCUMENTO} = this._nombreModalConst.cobro;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_COBRO_DOCUMENTO['controller']];
        let template   = MODAL_COBRO_DOCUMENTO['template'];

        let $modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'xl',
            params
        })

        $modalRef.result.then(result=>{
            this.$uibModalInstance.close(params)
        })

    }


    async openModalRapido(params){
        
        let {MODAL_FILE_CTRL, MODAL_COBRO_RAPIDO} = this._nombreModalConst.cobro;
        let controller = (await import('./../../' + MODAL_FILE_CTRL))[MODAL_COBRO_RAPIDO['controller']];
        let template   = MODAL_COBRO_RAPIDO['template'];

        let $modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'lg',
            params
        })

        $modalRef.result.then(result=>{
            this.$uibModalInstance.close(params)
        })

    }






    



   
}
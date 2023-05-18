import { CalculoTarifaHelper } from "../../helpers/calculoTarifaHelper.min.js?v=0.2";


export class UiGridOptions{
    
    /**
     * 
     * @param {object} param0 {$scope, gridOptions,  _fS, _tS, _tipoIvas}
     */
    
    constructor({$scope, gridOptions,  _fS, _tS, tipoIvas, _mS}){
        this.$scope = $scope;

        this.gridOptions = gridOptions;      
        this._fS = _fS;
        this._tS = _tS;
        this.tipoIvas = tipoIvas;
        this._mS = _mS;        
    }

    /**
     * 
     * @param {object} props  {bodegas, configColumn, tipoIvas, decimal}
     */
    setInitiload(props){
        const {bodegas, configColumn, tipoIvas, decimal, actividadTipoIva} = props;
        this.bodegas = bodegas;
        this.configColumn = configColumn;
        this.tipoIvas = tipoIvas || this.tipoIvas;
        this.decimal = decimal;
        this.actividadTipoIva = actividadTipoIva;
    }

    
    static getColumnDefs(configVisible={}){
        return  [
            // {name:'N°',  field:'num',    width: '5%', minWidth:'50', enableCellEdit: false, allowCellFocus: false,},
            {name:'Cód', field:'codigo', width: '8%', minWidth:'100', enableCellEdit: false, allowCellFocus: false, },
            {
                name:'descripcion', field:'descripcion', width: '25%', minWidth:'100', enableCellEdit: true, enableCellEditOnFocus: true,
                cellEditableCondition: function(scope) {
                    return scope.row.entity.llevaInventario !== true;
                },
                cellTooltip: function(row) {
                    return row.entity.descripcion;
                },
            },
            {name:'Cant', field:'cantidad', width: '6%', minWidth:'50', type:"number", enableCellEdit:true, enableCellEditOnFocus: true,},
            {
                name: 'medida', field:'idMedida', width: '8%', minWidth:'100',  type: 'number', enableCellEdit: true, enableCellEditOnFocus: true,  
                cellFilter: 'mapMedida:row.entity.medidas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                enableCellEdit: true,
                enableCellEditOnFocus: true,
                editDropdownOptionsFunction: function(rowEntity, colDef) {
                    return rowEntity.medidas.map(val=>({ id: val.idMedida, value: val.descripcion }))
                }
            },
            {
                name: 'I.V.A', field: 'idTipoIva',  width: '8%', minWidth:'100', type: 'number', enableCellEdit: true, allowCellFocus:true, enableCellEditOnFocus:true,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterTipoIva:this',
               // editDropdownOptionsArray: this.tipoIvas,
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idTipoIva',
            },
            {
                name: 'Tarifa', field: 'idTarifa',  width: '12%', minWidth:'100', type:"number", enableCellEdit: true, enableCellEditOnFocus: true,
                cellFilter: 'mapTarifa:row.entity.articuloTarifas',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownOptionsFunction: function(rowEntity, colDef) {
                    return rowEntity.articuloTarifas.map(function(val) {                      
                        return { id: val.idTarifa, value: val.tarifa + ' - $' + val.precioConIva }
                    })

                }
            },
            {name: 'Precio U.',field: 'precioUnitario', width: '8%', minWidth:'100', type: 'number', enableCellEdit: true,  enableCellEditOnFocus: true},
            {name: 'P. Iva',field: 'precioConIva',  width: '7%', minWidth:'100',  type: 'number', enableCellEdit: true, allowCellFocus:true, enableCellEditOnFocus: true,},
            {name: '%',field: 'porcentajeDescuento',  width: '6%', minWidth:'100', type:"number", enableCellEdit:true, allowCellFocus:true, enableCellEditOnFocus: true, visible: configVisible.porcentajeDescuento || false},
            {name: 'dsto.', field: 'valorDescuento',  width: '6%', minWidth:'100', type:'number', enableCellEdit:true, allowCellFocus:true, enableCellEditOnFocus: true, visible: configVisible.descuento || false},
            {name: 'T. Dsto.',field: 'totalDescuento',  width: '7%', minWidth:'100', type:'number', enableCellEdit: false, visible: configVisible.totalDescuento||false},
            {name: 'Total', field: 'total',  width: '5%', minWidth:'100',  type: 'number',  enableCellEdit: false, visible: true,},
            {name: 'Ice',field: 'ice',  width: '6%', minWidth:'100',  type: 'number',  enableCellEdit: false, visible: configVisible.ice || false },
            {name: 'Nota',field: 'nota', width: '15%', minWidth:'100', type: 'string', enableCellEdit:true, allowCellFocus:true, enableCellEditOnFocus: true},
            {
                name: 'bodega',field: 'idBodega', type: 'number', width: '11%', minWidth:'100',  enableCellEdit: true, enableCellEditOnFocus: true,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellFilter: 'cellFilterBodega:this',
               // editDropdownOptionsArray: this.bodegas,
                editDropdownValueLabel: 'descripcion',
                editDropdownIdLabel: 'idBodega',
            }
        ]
    }
    
    createColumnDefs(){        
        for(let col of UiGridOptions.getColumnDefs(this.configColumn)){
            if(col.field==='idTipoIva'){
                col.editDropdownOptionsArray = this.tipoIvas;
            }
            if(col.field==='idBodega'){
                col.editDropdownOptionsArray = this.bodegas;
            }
            this.gridOptions.columnDefs.push(col);
        }
    }
    
    
    setIdBodegaEnColumnDefs(){
        try {                                                                 
            for(let item of this.gridOptions.data){
                item.idBodega = this.idBodega;
            }          
        } catch (error) {
            console.error(error)
        }
    }

    async askToChangeBodega(){
        let bodega = this.bodegas.find(item=>item.idBodega===this.idBodega);
        let { isConfirmed } = await Swal.fire({
            html: `<small>¿Esta seguro de cambiar la Bodega: <b>${bodega.descripcion}</b>  en el detalle del Documento?</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: `Sí, cambiar!`,
            cancelButtonText: 'No, cancelar!',
            allowOutsideClick: false,           
        })

        if (isConfirmed) {
           
            this.cloneIdBodega = this.idBodega;           
            
            if (this.gridOptions.data.length === 0) return

            this.setBodegasEnColumnDefs();
            this.$scope.$apply();
        } else {
            this.idBodega = this.cloneIdBodega;
            this.$scope.$apply();
        }
    }  
    
    
    /**
     * 
     * @param {object} rowEntity 
     * @returns true || false
     */
    async deleteRow(rowEntity){
        try {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger m-l-5'
                },
                buttonsStyling: false
            })
    
            const {isConfirmed} = await swalWithBootstrapButtons.fire({                
                html: `<small>Esta Ud. seguro de eliminar este Artículo <b>${rowEntity.descripcion}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `<small><i class='ti-trash'></i> Sí, eliminar!</small>`,
                cancelButtonText: '<small>&times; No, cancelar!</small>',
                reverseButtons: false,
                allowOutsideClick: false,
                focusConfirm: true
            })
    
            if(isConfirmed){
                let indexRow = this.gridOptions.data.indexOf(rowEntity);
                this.gridOptions.data.splice(indexRow, 1);
            }   
            return isConfirmed;

        } catch (error) {
            console.log(error)
        }
        
    }    
    
    tipoIvaFindById(rowEntity){
        return this.tipoIvas.find(item=>item.idTipoIva===rowEntity.idTipoIva);
    }

    /**
     * 
     * @param {object} entity 
     */
    async checkStock(obj){
        let result = null;
        await this._mS.getData('get', '/ControlStock/VerificarStock?idArticulo='+obj.idArticulo + '&cantidad='+obj.cantidad+'&presentacion='+obj.presentacion+'&idPresentacion='+obj.idPresentacion).then(response=>{ 
                   
            if(response.id==="0" || response.id==="2"){
                
                Swal.fire({
                    title:`<small>${response.titleSms}</small>`,
                    icon:'warning',
                    html:`<small>${response.message}</small>`,
                    allowEscapeKey:false,
                    allowOutsideClick:false,
                    // didClose:()=>{
                    //     if(response.id==="0"){
                    //         entity.cantidad = oldValue;
                    //         this.setTotalRow(entity, index);
                    //         this.indexRow = index;
                    //         this.reloadTotales = true;
                    //         return
                    //     }
                    //     if(response.id==="2"){
                    //         this.indexRow = index;
                    //         this.reloadTotales = true;
                    //         return
                    //     }
                        
                    // }                            
                })
                result = response;                
            }   
            result = response;
        })

        return result;
    }

    /**
     * 
     *  
     * @param {object} rowEntity valores de uiGridOptions
     * @param {string || number} oldValue valor numero o string 
     * @returns object 
     */
    calculoColDef(rowEntity, oldValue){                                 
        const calculoColumnas =  {
            'cantidad': ()=>{                     
                if(rowEntity.cantidad===oldValue) return
                rowEntity.cantidad = this._fS.roundNumber(rowEntity.cantidad, this.decimal.nroCantidad);
                    //Verificacion de Stock                        
            },
            'idMedida': ()=>{
                if (rowEntity.idMedida === oldValue) return

                let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);
                let articuloTarifas = JSON.parse(dataMedida.tarifas);                
                let pvp = articuloTarifas.find(item=>item.idTarifa===this.idTarifa);
           

                rowEntity.articuloTarifas = articuloTarifas;          
                rowEntity.idTarifa        = this.idTarifa
                rowEntity.precioUnitario      = this._fS.roundNumber(pvp.precioVenta, this.decimal.nroPrecio);
                rowEntity.precioConIva        = this._fS.roundNumber(pvp.precioConIva, this.decimal.nroPrecio);
                rowEntity.porcentajeDescuento = 0;
                rowEntity.valorDescuento = 0;
                //  this.setTotalRow(rowEntity, index);                                  
                                  
            },
            'idTipoIva': ()=>{
                try {
                    if(rowEntity.idTipoIva===oldValue) return

                    let tipoIva          = this.tipoIvaFindById(rowEntity);                   
                    rowEntity.tarifa     = tipoIva.tarifa;
                    rowEntity.codigoPorcentaje = tipoIva.codigoPorcentaje;                    
                    calculoColumnas["precioUnitario"]();                        
                } catch (error) {
                    toastr.error(`CALCULO TIPO IVA: ${error}`)                     
                }
            },
            'codigoPorcentaje': ()=>{
                try {
                    if(rowEntity.idTipoIva===oldValue) return

                    let tipoIva          =  this.tipoIvas.find(item=>item.codigoPorcentaje===rowEntity.codigoPorcentaje);                   
                    rowEntity.tarifa     = tipoIva.tarifa;
                    rowEntity.codigoPorcentaje = tipoIva.codigoPorcentaje;                    
                    calculoColumnas["precioUnitario"]();                        
                } catch (error) {
                    toastr.error(`CALCULO TIPO IVA: ${error}`)                     
                }
            },
            'idTarifa':()=>{
                try {
                    if(rowEntity.idTarifa===oldValue) return
                    let tipoIva                 = this.tipoIvaFindById(rowEntity);
                    let tarifa                  = rowEntity.articuloTarifas.find(item=>item.idTarifa===rowEntity.idTarifa);
                                                             
                    let precioConIva            = CalculoTarifaHelper.calcularPrecioConIva(tarifa.precioVenta, tipoIva.tarifa);
                    let precioConIvaConDesuento = CalculoTarifaHelper.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                    let valorDescuento          = CalculoTarifaHelper.getValorDescuento(tarifa.precioVenta, rowEntity.porcentajeDescuento);
                    
                    rowEntity.precioUnitario = this._fS.roundNumber(tarifa.precioVenta, this.decimal.nroPrecio);
                    rowEntity.precioConIva   = this._fS.roundNumber(precioConIvaConDesuento, this.decimal.nroPrecio);
                    rowEntity.valorDescuento = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuentoDetalle);

                } catch (error) {
                    toastr.error(`CAMBIO DE TARIFA: ${error}`)
                }
            },
            'precioUnitario':()=>{
                try {

                    if(rowEntity.precioUnitario===oldValue) return
                    let tipoIva             = this.tipoIvaFindById(rowEntity);
                    
                    let precioConIva        = CalculoTarifaHelper.calcularPrecioConIva(rowEntity.precioUnitario, tipoIva.tarifa);
                    let precioIvaDescuento  = CalculoTarifaHelper.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                    let valorDescuento      = CalculoTarifaHelper.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);
            
                    rowEntity.precioUnitario   = this._fS.roundNumber(rowEntity.precioUnitario, this.decimal.nroPrecio);
                    rowEntity.precioConIva     = this._fS.roundNumber(precioIvaDescuento, this.decimal.nroPrecio);
                    rowEntity.valorDescuento   = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuentoDetalle);            
                   // this.setTotalRow(entity, index)
                   
                } catch (error) {
                    toastr.error(`CÁLCULO DE PRECIO UNITARIO: ${error}`)            
                }                              
            },
            'precioConIva': ()=>{
                try {

                    if(rowEntity.precioConIva===oldValue) return                            
                    let tipoIva                 = this.tipoIvaFindById(rowEntity);    
                                   
                    
                    let precioUnitario = CalculoTarifaHelper.calcularPrecioVenta(rowEntity.precioConIva, tipoIva.tarifa);

                    rowEntity.precioConIva = this._fS.roundNumber(rowEntity.precioConIva, this.decimal.nroPrecio);
                    rowEntity.precioUnitario = this._fS.roundNumber(precioUnitario, this.decimal.nroPrecio);

                } catch (error) {
                    toastr.error(`CÁLCULO DE PRECIO CON IVA: ${error}`)
                }                       
            },
            'porcentajeDescuento': ()=>{
                try {

                    if(rowEntity.porcentajeDescuento===oldValue) return
                    
                    rowEntity.porcentajeDescuento = this._fS.roundNumber(rowEntity.porcentajeDescuento, this.decimal.nroPorcentaje);
                
                    //Verificamos  si el porcentaje es un nuevo Valor y menor o  igual a 100
                    if (rowEntity.porcentajeDescuento <= 100) {   
                        let tipoIva            = this.tipoIvaFindById(rowEntity);
                        let precioConIva       = CalculoTarifaHelper.calcularPrecioConIva(rowEntity.precioUnitario, tipoIva.tarifa);
                        let precioIvaDescuento = CalculoTarifaHelper.getPrecioIvaConDescuento(precioConIva, rowEntity.porcentajeDescuento);
                        let valorDescuento     = CalculoTarifaHelper.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);
    
                        rowEntity.porcentajeDescuento = this._fS.roundNumber(rowEntity.porcentajeDescuento, this.decimal.nroPorcentaje);
                        rowEntity.precioConIva        = this._fS.roundNumber(precioIvaDescuento, this.decimal.nroPrecio);
                        rowEntity.valorDescuento      = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuento);  
    
                    } else {
                        rowEntity.porcentajeDescuento = oldValue;
                        toastr.warning('El Porcentaje tiene que ser menor o igual a 100', 'Cálculo de Porcentaje Descuento');                    
                    }                
                } catch (error) {
                    toastr.error(`CÁLCULO DE PORCENTAJE DE DESCUENTO: ${error}`)                
                }           
            },
            'valorDescuento': ()=>{
                try {
                    
                    if(rowEntity.valorDescuento===oldValue) return
                    
                    rowEntity.valorDescuento = this._fS.roundNumber(rowEntity.valorDescuento, this.decimal.nroDescuento);
                    
                    if (rowEntity.valorDescuento <= rowEntity.precioUnitario) {
                        
                        let porcentajeDescuento = CalculoTarifaHelper.getPorcentajeDescuento(rowEntity.precioUnitario, rowEntity.valorDescuento);
                        let precioConIva        = rowEntity.precioUnitario - rowEntity.valorDescuento;
        
                        rowEntity.valorDescuento      = this._fS.roundNumber(rowEntity.valorDescuento, this.decimal.nroDescuento);
                        rowEntity.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroPorcentaje);
                        rowEntity.precioConIva        = this._fS.roundNumber(precioConIva, this.decimal.nroPrecio);
        
                    } else {
                        rowEntity.valorDescuento = oldValue;
                        toastr.warning('El valor Descuento tiene que ser menor o igual a Precio Venta', 'Ingreso Descuento');                                                        
                    }
                    
                } catch (error) {
                    toastr.error(`CÁLCULO DE VALOR DE DESCUENTO: ${error}`)
                }
            },
            "calculoTotalDetalle": ()=>{
                try {
                    let total           = (rowEntity.precioUnitario - rowEntity.valorDescuento) * rowEntity.cantidad;
                    let totalDescuento  = rowEntity.cantidad * rowEntity.valorDescuento;
                    let subTotal        = rowEntity.cantidad * rowEntity.precioUnitario;
        
                    
                    rowEntity.totalDescuento = this._fS.roundNumber(totalDescuento, this.decimal.nroDescuentoDetalle)
                    rowEntity.subTotal       = this._fS.roundNumber(subTotal, 5);
                    rowEntity.total          = this._fS.roundNumber(total, this.decimal.nroTotalDetalle);
                   // this.getTotales();
                } catch (error) {
                    toastr.error(`CÁLCULO DE TOTAL: ${error}`)
                }
            },                  
        }
        
        return calculoColumnas;
    }


    //Calculo de Totales 
    getSubTotalSinImpuesto(){
        let total = this.gridOptions.data.map(val => val.subTotal).reduce((acc, curr) => acc + curr, 0);        
        // return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
        return total;
    }

    getTotalIva(codigoIva) {
        let totalIva = 0, totalNetoIva = 0;

        for(let value of this.gridOptions.data){                        
            if (value.codigoPorcentaje === codigoIva) {
                
                totalIva += Number(value.subTotal);
                totalNetoIva += Number(value.total);
            }
        }
        
        return [
            totalIva= this._fS.roundNumber(totalIva, this.decimal.nroTotalSubTotal),
            totalNetoIva= this._fS.roundNumber(totalNetoIva, this.decimal.nroTotalSubTotal)
        ]
    }

    getTotalDescuento(){
        let total = this.gridOptions.data.map(val => val.totalDescuento).reduce((acc, curr) => acc + curr, 0);      
        // return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
        return total;
    }

    //get total porcentaje descuento 
    getTotalPorcentajeDescuento(){
        let total = 0, totalDetalle = 0;
        
        if (this.gridOptions.data.length > 0 && this.getSubTotalSinImpuesto() > 0) {

             //Total Detalle No tiene que ser mayor al total sin impuesto
            totalDetalle = this.getTotalDetalle() > this.getSubTotalSinImpuesto()? this.getSubTotalSinImpuesto(): this.getTotalDetalle();
            
            total = ((this.getSubTotalSinImpuesto() - totalDetalle ) * 100) / this.getSubTotalSinImpuesto();
        }        
        // return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
        return total;
    }

    //Sumamos el valor ice de cada articulo del detalle  
    getTotalIce(){
        let total = this.gridOptions.data.map(val => val.ice).reduce((acc, curr) => acc + curr, 0);
        return total;
    }

    //Suma columna total 
    getTotalDetalle() {        
        let total = this.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);             
        return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);                        
    }

    setTotalNetoIva() {
        this.totalNetoIva = this.data.subTotalNetoIva + this.data.subTotalNetoIvaCero + this.data.subTotalNetoExentoIva + this.data.subTotalNetoNoObjetoIva;      
    }


    getTotales() {        
        let CODIGO_PORCENTAJE_IVA0 = '0', CODIGO_PORCENTAJE_IVAEXENTO = '7', CODIGO_PORCENTAJE_IVA_NO_OBJETO ='6', CODIGO_PORCENTAJE_IVA8 = '8' ;
        let [subTotalIva, subTotalNetoIva]             = this.getTotalIva(this.actividadTipoIva.codigoPorcentaje);
        let [subTotalIvaCero, subTotalNetoIvaCero]     = this.getTotalIva(CODIGO_PORCENTAJE_IVA0);
        let [subTotalExentoIva, subTotalNetoExentoIva] = this.getTotalIva(CODIGO_PORCENTAJE_IVAEXENTO);
        let [subTotalNoObjetoIva, subTotalNetoNoObjetoIva] = this.getTotalIva(CODIGO_PORCENTAJE_IVA_NO_OBJETO);
        
        let iva = subTotalNetoIva * this.actividadTipoIva.tarifa / 100;  
       
        let total = this.getSubTotalSinImpuesto() + iva  +  this.getTotalIce();
        let importeTotal = total - this.getTotalDescuento();

        return {
            subTotalSinImpuestos: this._fS.roundNumber(this.getSubTotalSinImpuesto(), this.decimal.nroTotalSubTotal),
            subTotalIva,
            subTotalNetoIva,

            subTotalIvaCero,
            subTotalNetoIvaCero,
            
            subTotalExentoIva,
            subTotalNetoExentoIva,

            subTotalNoObjetoIva,
            subTotalNetoNoObjetoIva,

            totalDescuento: this._fS.roundNumber(this.getTotalDescuento(), this.decimal.nroTotalSubTotal),
            porcentajeDescuento: this._fS.roundNumber(this.getTotalPorcentajeDescuento(), this.decimal.nroTotalSubTotal),
            totalIce: this.getTotalIce(),
            irbpnr : 0,
            propina : 0,
            iva:  this._fS.roundNumber(iva, this.decimal.nroIva),
            total: this._fS.roundNumber(importeTotal, this.decimal.importeTotal)
        }
        //this.data.subTotalSinImpuestos = this.getSubTotalSinImpuesto();

        //IVA 12
        //this.data.subTotalIva = totalIva12;
        //this.data.subTotalNetoIva = totalNeto12;

        //IVA 0
        //this.data.subTotalIvaCero = totalIva0;
        //this.data.subTotalNetoIvaCero = totalNeto0;

        //EXENTO 
        // this.data.subTotalExentoIva = totalExentoIva;
        // this.data.subTotalNetoExentoIva = totalNetoExentoIva;

        //NO OBJETO IVA
        // this.data.subTotalNoObjetoIva = totalNoObjetoIva;
        // this.data.subTotalNetoNoObjetoIva = totalNetoNoObjetoIva;

        //this.data.totalDescuento = this.getTotalDescuento();

        // this.data.porcentajeDescuento = this.getTotalPorcentajeDescuento();
        // this.data.totalIce = this.getTotalIce();
        // this.data.irbpnr = 0;
        // this.data.propina = 0;

        //IVA 12
        // let iva = this.data.subTotalNetoIva * this.decimal.valorTipoIva / 100;
        // this.data.iva = this._fS.roundNumber(iva, this.decimal.nroIva);

        //Total 
        // let total = this.data.iva + this.getTotalDetalle() + this.getTotalIce();
        // this.data.total = this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);

        //Set Total Neto Iva
        // this.setTotalNetoIva();
    }


   
}




export class UiGridOptionsCompra{
    constructor({$scope, gridOptions, _fS, _tS, tipoIvas, decimal, actividadTipoIva}){
        this.$scope = $scope;
        this.gridOptions = gridOptions;
        this._fS = _fS;
        this._tS = _tS;
        this.tipoIvas = tipoIvas;
        this.decimal = decimal;
        this.actividadTipoIva = actividadTipoIva
    }

     /**
     * 
     * @param {object} rowEntity 
     * @returns true || false
     */
     async deleteRow(rowEntity){
        try {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger m-l-5'
                },
                buttonsStyling: false
            })
    
            const {isConfirmed} = await swalWithBootstrapButtons.fire({                
                html: `<small>Esta Ud. seguro de eliminar este Artículo <b>${rowEntity.descripcion}</b></small>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `<small><i class='ti-trash'></i> Sí, eliminar!</small>`,
                cancelButtonText: '<small>&times; No, cancelar!</small>',
                reverseButtons: false,
                allowOutsideClick: false,
                focusConfirm: true
            })
    
            if(isConfirmed){
                let indexRow = this.gridOptions.data.indexOf(rowEntity);
                this.gridOptions.data.splice(indexRow, 1);
                this.countIndex();
            }   
            return isConfirmed;

        } catch (error) {
            console.log(error)
        }
        
    }

    countIndex(){
        let num=1;
        for(let item of this.gridOptions.data){
            item.n = num ++;
        }      
    }

    calculoColDef(rowEntity, oldValue){                                 
        const calculoColumnas =  {
            'descripcion': ()=>{
                let descripcion = rowEntity.descripcion || '';
                rowEntity.descripcion = descripcion.toUpperCase();
            },
            'cantidad': ()=>{                     
                if(rowEntity.cantidad===oldValue) return
                rowEntity.cantidad = this._fS.roundNumber(rowEntity.cantidad, this.decimal.nroCantidad);

                
                
                    //Verificacion de Stock                        
            },
            'idMedida': ()=>{
                if (rowEntity.idMedida === oldValue) return

                let dataMedida = rowEntity.medidas.find(val => val.idMedida === rowEntity.idMedida);
                rowEntity.precioCosto = this._fS.roundNumber(dataMedida.precioCosto, this.decimal.nroPrecio)
                rowEntity.precioUnitario = this._fS.roundNumber(dataMedida.precioCosto, this.decimal.nroPrecio)
                rowEntity.precioCostoNeto = this._fS.roundNumber(dataMedida.precioCosto, this.decimal.nroPrecio)
                //  this.setTotalRow(rowEntity, index);                                  
                                  
            },
            'idTipoIva': ()=>{
                try {
                    if(rowEntity.idTipoIva===oldValue) return

                    let tipoIva = this.tipoIvas.find(val => val.idTipoIva === rowEntity.idTipoIva);
                    
                    rowEntity.tarifa     = tipoIva.tarifa;
                    rowEntity.codigoPorcentaje = tipoIva.codigoPorcentaje;                    
                    calculoColumnas["precioUnitario"]();                        
                } catch (error) {
                    toastr.error(`CALCULO TIPO IVA: ${error}`)                     
                }
            },
            
            'precioUnitario':()=>{
                try {

                    if(rowEntity.precioUnitario===oldValue) return
            
                    
                    let precioCostoNeto = CalculoTarifaHelper.getPrecioIvaConDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);       

                    rowEntity.precioUnitario   = this._fS.roundNumber(rowEntity.precioUnitario, this.decimal.nroPrecio);
                    rowEntity.precioCostoNeto       = this._fS.roundNumber(precioCostoNeto, this.decimal.nroPrecio);
                                  
                    if (rowEntity.porcentajeDescuento > 0) {
                        rowEntity.valorDescuento = this._fS.roundNumber(precioCostoNeto, this.decimal.nroDescuentoDetalle);                       
                    }    
                   
                } catch (error) {
                    toastr.error(`CÁLCULO DE PRECIO UNITARIO: ${error}`)            
                }                              
            },
           
            'porcentajeDescuento': ()=>{
                try {

                    if(rowEntity.porcentajeDescuento===oldValue) return
                    
                    rowEntity.porcentajeDescuento = this._fS.roundNumber(rowEntity.porcentajeDescuento, this.decimal.nroPorcentaje);
                
                    //Verificamos  si el porcentaje es un nuevo Valor y menor o  igual a 100
                    if (rowEntity.porcentajeDescuento <= 100) {
                        let valorDescuento     = CalculoTarifaHelper.getValorDescuento(rowEntity.precioUnitario, rowEntity.porcentajeDescuento);
    
                        let precioCostoNeto = rowEntity.precioUnitario - valorDescuento;
                                
                        rowEntity.valorDescuento  = this._fS.roundNumber(valorDescuento, this.decimal.nroDescuentoDetalle);                
                        rowEntity.precioCostoNeto = this._fS.roundNumber(precioCostoNeto, this.decimal.nroPrecio);  
    
                    } else {
                        rowEntity.porcentajeDescuento = oldValue;
                        toastr.warning('El Porcentaje tiene que ser menor o igual a 100', 'Cálculo de Porcentaje Descuento');                    
                    }                
                } catch (error) {
                    toastr.error(`CÁLCULO DE PORCENTAJE DE DESCUENTO: ${error}`)                
                }           
            },

            'valorDescuento': ()=>{
                try {
                    
                    if(rowEntity.valorDescuento===oldValue) return
                    
                    rowEntity.valorDescuento = this._fS.roundNumber(rowEntity.valorDescuento, this.decimal.nroDescuento);
                    
                    if (rowEntity.valorDescuento <= rowEntity.precioUnitario) {
                        
                        let porcentajeDescuento = CalculoTarifaHelper.getPorcentajeDescuento(rowEntity.precioUnitario, rowEntity.valorDescuento);
                        
                        let precioCostoNeto = rowEntity.precioUnitario - rowEntity.valorDescuento;

                        rowEntity.porcentajeDescuento = this._fS.roundNumber(porcentajeDescuento, this.decimal.nroDescuentoDetalle);
                        rowEntity.precioCostoNeto     = this._fS.roundNumber(precioCostoNeto, this.decimal.nroPrecio);
        
                    } else {
                        rowEntity.valorDescuento = oldValue;
                        toastr.warning('El valor Descuento tiene que ser menor o igual a Precio Venta', 'Ingreso Descuento');                                                        
                    }
                    
                } catch (error) {
                    toastr.error(`CÁLCULO DE VALOR DE DESCUENTO: ${error}`)
                }
            },

            "totalDescuento":()=>{

                if(rowEntity.totalDescuento ===oldValue) return

                let result = (rowEntity.totalDescuento / rowEntity.cantidad);
                               
                rowEntity.valorDescuento = this._fS.roundNumber(result, this.decimal.nroDescuentoDetalle);

                calculoColumnas["valorDescuento"]();   
                
            },

            "calculoTotalDetalle": ()=>{
                try {
                    let subTotal       = rowEntity.cantidad * rowEntity.precioUnitario //Total = Cantidad * Precio Unitario/Precio Costo
                    let total          = rowEntity.cantidad * rowEntity.precioCostoNeto; //Total = Cantidad * Precio Costo Neto 
                    let totalDescuento = rowEntity.cantidad * rowEntity.valorDescuento;
                    let totalIce       = rowEntity.cantidad * rowEntity.ice;
                    
                    rowEntity.ice            = this._fS.roundNumber(rowEntity.ice, this.decimal.nroIce)
                    rowEntity.totalDescuento = this._fS.roundNumber(totalDescuento, this.decimal.nroDescuentoDetalle);
                    rowEntity.subTotal       = this._fS.roundNumber(subTotal, 5) 
                    rowEntity.total          = this._fS.roundNumber(total, this.decimal.nroTotalDetalle);
                    rowEntity.totalIce       = this._fS.roundNumber(totalIce, this.decimal.nroIce)  
                } catch (error) {
                    toastr.error(`CÁLCULO DE TOTAL: ${error}`)
                }
            },                  
        }

        return calculoColumnas;
    }


    //Es la suma de Cantidad * precio Unitario 
    getSubTotalSinImpuesto() { 
        let total = this.gridOptions.data.map(val=>val.subTotal).reduce((acc, curr)=> acc + curr, 0);            
        return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
    }


    getTotalIva(codigoPorcentaje) {
        let total = 0, totalNetoIva = 0;

        for(let item of this.gridOptions.data){
            if (item.codigoPorcentaje === codigoPorcentaje) {
                total += item.subTotal
                totalNetoIva += item.total;
            }

        }

        return [
            total= this._fS.roundNumber(total, this.decimal.nroTotalSubTotal),
            totalNetoIva= this._fS.roundNumber(totalNetoIva, this.decimal.nroTotalSubTotal)
        ]
    }

    //Get Total Ice 
    getTotalIce() {
        let total = this.gridOptions.data.map(val=>val.totalIce).reduce((acc, curr)=>acc + curr, 0);
        return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal)
    }


   

    //Suma columna total 
    getTotalDetalle() {
        let total = this.gridOptions.data.map(val => val.total).reduce((acc, curr) => acc + curr, 0);
        return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
    }

    //Descuento total neto que se suma al valor del iva para dar el total de una tipo documento compra 
    getDescuentoTotalNeto(porcentajeDescuento){
        let descuento = (this.getSubTotalSinImpuesto() * Number(porcentajeDescuento)) / 100;
        let valorDescuento = this.totalNetoTipoIva - descuento;
        return this._fS.roundNumber(valorDescuento, this.decimal.nroDescuento);
    }

    getTotalPorcentajeDescuento () {
        let total = 0, totalDetalle = 0;
        if (this.gridOptions.data.length > 0 && this.getSubTotalSinImpuesto() > 0) {

            //Total Detalle No tiene que ser mayor al total sin impuesto
            
            totalDetalle = this.getTotalDetalle()>this.getSubTotalSinImpuesto()? this.getSubTotalSinImpuesto(): this.getTotalDetalle();

            
            total = ((this.getSubTotalSinImpuesto() - totalDetalle ) * 100) / this.getSubTotalSinImpuesto();
            
        }
        
        return this._fS.roundNumber(total, this.decimal.nroPorcentaje);
    }

    getTotalDescuento(){
        let total = this.gridOptions.data.map(val => val.totalDescuento).reduce((acc, curr) => acc + curr, 0);
        return this._fS.roundNumber(total, this.decimal.nroTotalSubTotal);
    }

    getTotales(){
        
        let CODIGO_PORCENTAJE_IVA0 = '0', CODIGO_PORCENTAJE_IVAEXENTO = '7', CODIGO_PORCENTAJE_IVA_NO_OBJETO ='6';
        let [subTotalIva, subTotalNetoIva]             = this.getTotalIva(this.actividadTipoIva.codigoPorcentaje);
        let [subTotalIvaCero, subTotalNetoIvaCero]     = this.getTotalIva(CODIGO_PORCENTAJE_IVA0);
        let [subTotalExentoIva, subTotalNetoExentoIva] = this.getTotalIva(CODIGO_PORCENTAJE_IVAEXENTO);
        let [subTotalNoObjetoIva, subTotalNetoNoObjetoIva] = this.getTotalIva(CODIGO_PORCENTAJE_IVA_NO_OBJETO);
        
        let iva = subTotalNetoIva * this.actividadTipoIva.tarifa / 100;                
        let total = iva + this.getTotalDetalle() 
       
        return {
            subTotalSinImpuestos: this.getSubTotalSinImpuesto(),
            subTotalIva,
            subTotalNetoIva,

            subTotalIvaCero,
            subTotalNetoIvaCero,
            
            subTotalExentoIva,
            subTotalNetoExentoIva,

            subTotalNoObjetoIva,
            subTotalNetoNoObjetoIva,

            totalDescuento: this.getTotalDescuento(),
            porcentajeDescuento: this.getTotalPorcentajeDescuento(),
            totalIce: this.getTotalIce(),
            irbpnr : 0,
            propina : 0,
            iva:  this._fS.roundNumber(iva, this.decimal.nroIva),
            total: this._fS.roundNumber(total, this.decimal.nroTotalSubTotal)
        }       
    }
}
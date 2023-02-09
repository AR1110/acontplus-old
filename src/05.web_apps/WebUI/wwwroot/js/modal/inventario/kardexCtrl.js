

export class KardexCtrl{
    static $inject =  ['mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario'];
    constructor(_mS, _commonSvc, _modalSvc, _nombreModal, _toast, _form){
        this._mS = _mS;       
        this._commonSvc        = _commonSvc;
        this._modalSvc         = _modalSvc;
        this._nombreModal      = _nombreModal;
        this.toast             = _toast;
        
        this.form              = _form;
    
        this.data              = {};
        this.kardexs           = []     
        
        this.articulo = {};
        this.dataSearch = {};
        this.articuloFiltro = {};

        $(window).resize(()=> {
            let heightBrowser =$(window).height();
            let widthBrowser =$(window).width();

            if(this.kardexs.length>0){
                if(widthBrowser < 1280 || widthBrowser < 1024){                    
                    this.tableTabulatorKardex.options.columns[0].frozen = false;
                    this.tableTabulatorKardex.options.columns[0].widthGrow = 0;                    
                }else{
                    this.tableTabulatorKardex.options.columns[0].frozen = true;
                    this.tableTabulatorKardex.options.columns[0].widthGrow = 2
                }
            }           
         })
    }
    
    drawTable(){
        this.tableTabulatorKardex = new Tabulator('#tabla-kardex', {            
            height: "400px",
            width: "100%",
            // layout:"fitDataFill",
            // layout: "fitDataStretch",
            // layout:"fitColumns", 
            layout:"fitDataFill",
            
            //layout:"fitDataTable",           
            //renderHorizontal:"virtual",
            // autoColumns:true,
            columnHeaderVertAlign: "bottom",
            // movableRows:true,
            tooltipGenerationMode: "hover",
            rowFormatter: function (row) {                
                 if (row.getData().tipoDoc === 'CIV') {                    
                    // row.getElement().classList().add(row.getData().style);                                        
                    row.getElement().style.backgroundColor = "#fedf7e";
                }
                if(row.getData().style === 'table-danger'){
                    row.getElement().style.backgroundColor = "#F5BCB0";
                }
            },
           
            columnDefaults: {
                tooltip: true,
            },
            data:this.kardexs,
            columns: [
                {
                    //create column group ---frozen:true,
                    title: "Descripcion", widthGrow:2, frozen:true,
                    columns: [
                        {
                            title: "F. Emision", field: "fechaEmision", hozAlign: "center",    headerSort: false, sorter: "date", width: 120
                        },
                        {
                            title: "T. Doc", field: "tipoDoc", hozAlign: "center",  headerSort: false, width: 60
                        },
                        {
                            title: "Nro. Doc", field: "nroDocumento", hozAlign: "left",  headerSort: false, width: 130
                        },
                        {
                            title: "Cliente/Proveedor", field: "clienteProveedor", headerSort: false, hozAlign: "left",  width: 150, tooltip: true
                        },
                        {
                            title: "Bodega", field: "bodega", hozAlign: "center",  headerSort: false, width: 150
                        },
                        {
                             title:"Usuario", field:"usuario", hozAlign:"center",  headerSort:false, width:150
                        },

                    ],
                },
                {//create column group
                    title: "Entradas",
                    columns: [
                        {
                            title: "Medida", field: "medidaEntrada", width: 70, headerSort: false, cssClass: "table-entradas",
                        },
                        {
                            title: "Cant.", field: "cantidadEntrada", bottomCalc: this.sumCantidadEntrada, width: 60, headerSort: false, cssClass: "table-entradas",
                        },
                        {
                            title: "Costo U.", field: "costo", hozAlign: "center", headerSort: false, sorter: "date", width: 75, cssClass: "table-entradas",
                        },
                        {
                            title: "Total", field: "totalEntrada", bottomCalc: this.sumTotalEntrada, hozAlign: "center", headerSort: false, sorter: "date", width: 75, cssClass: "table-entradas",
                        },
                    ],
                },
                {//create column group
                    title: "Salidas",
                    columns: [
                        {
                            title: "Medida", field: "medidaSalida", width: 70, headerSort: false, cssClass: "table-salidas",
                        },
                        {
                            title: "Cant.", field: "cantidadSalida", bottomCalc: this.sumCantidadSalida, width: 60, headerSort: false, cssClass: "table-salidas",
                        },
                        {
                            title: "P. Venta", field: "venta", hozAlign: "center", headerSort: false, sorter: "date", width: 75, cssClass: "table-salidas",
                        },
                        {
                            title: "Total", field: "totalSalida", bottomCalc: this.sumTotalSalida, hozAlign: "center", headerSort: false, width: 75, cssClass: "table-salidas",
                        },
                    ],
                },
                {//create column group
                    title: "Saldos",
                    columns: [
                        {
                            title: "Cant. ", field: "saldo", width: 60, headerSort: false, bottomCalc: this.sumTotalCantSaldo, cssClass: "table-saldos",
                        },
                        {
                            title: "Costo U.", field: "precioCosto", width: 70, headerSort: false, bottomCalc: this.sumTotalPrecioCostoSaldo, sorter: "number", cssClass: "table-saldos",
                        },
                        {
                            title: "Total", field: "totalGeneral", hozAlign: "center", width: 60, headerSort: false, sorter: "number", bottomCalc: this.sumTotalGeneral, bottomCalcParams: { precision: 3 }, cssClass: "table-saldos",
                        },
                    ],
                },
            ],
        });                      

        this.tableTabulatorKardex.on("rowClick", (e, row)=> {            
            this.openModalTipoDocumento(row.getData())                          
        });
    }

    sumCantidadEntrada = (values, data, calcParams)=> {                               
        return this.data.cantTotalEntrada || 0           
    }

    sumTotalEntrada = (values, data, calcParams)=> {          
        return this.data.totalEntrada || 0                   
    }

    sumCantidadSalida = (values, data, calcParams)=> {           
        return this.data.cantTotalSalida || 0
    }

    sumTotalSalida = (values, data, calcParams)=> {            
        return this.data.totalSalida || 0
    }

    sumTotalCantSaldo = (values, data, calcParams)=> {
        return this.data.stock || 0
    }

    sumTotalPrecioCostoSaldo = ()=>{
        return this.precioCostoSaldo || 0
    }

    sumTotalGeneral = ()=>{
        return this.totalGenetal || 0
    }

    async openModalSearch(){     
        const {MODAL_FILTRO_CSHTML} = this._nombreModal.kardex;
        const modalRef = this._modalSvc.openModalCustom({
            controller: ModalFiltroKardex,
            template: MODAL_FILTRO_CSHTML,
            size: 'lg',
            params: {
                articulo: this.articulo,
                dataSearch: this.dataSearch,
                articuloFiltro: this.articuloFiltro
            },            
        })
        modalRef.result.then(response=>{
            this.articulo = response.articulo;
            this.dataSearch = response.dataSearch;
            this.articuloFiltro = response.articuloFiltro;
            if(typeof response==='object' && this.dataSearch.isSearch){
                this.getKardex();
            }
        })              
    }

   
    getKardex() {
        try {
            showLoader();   
            if(this.dataSearch.checkBoxBodega || this.dataSearch.checkBoxFecha 
                || this.dataSearch.checkBoxUltimaConsolidacion 
                || this.dataSearch.checkBoxConsolidacion
                || this.dataSearch.checkBoxMovement){
                this.dataSearch.checkBoxDefault = false;            
            }else{
                this.dataSearch.checkBoxDefault = true;
            }

            this._mS.getData('get','/Kardex/Get?json=' + JSON.stringify(this.dataSearch)).then(response=>{               
                if(response.code==="0"){
                    hideLoader();
                    Swal.fire({
                        icon:'warning',
                        html:`<small>${response.message}</small>`
                    })
                    return                
                }
                if(response.code==="1"){
                    this.kardexs = JSON.parse(response.payload) || [];
                    if(this.kardexs.length===0){
                        hideLoader();
                        this.toast.toastr('info','No se encontraron los resultados');
                        this.drawTable();
                        return
                    }
                    
                    let lastObjKardex = this.kardexs.at(-1);
                    
                    this.data.cantTotalEntrada = lastObjKardex.entrada;
                    // this.data.totalEntrada = totalEntrada;
                    // this.data.cantTotalSalida = cantTotalSalida;
                    this.data.totalSalida = lastObjKardex.salida;
                    this.data.stock = lastObjKardex.stock;
                    this.precioCostoSaldo = lastObjKardex.precioCosto;
                    this.totalGeneral     = lastObjKardex.totalGeneral;
                    
                    this.drawTable();
                    hideLoader();  
                }
            })
        } catch (error) {
            hideLoader();
            console.error(error)
        }            
    }

    
    // getTotalesSaldo() {            
    //     if(this.form.campo(this.kardexs) || this.kardexs.length===0) return
        
    //     let obj = this.kardexs[this.kardexs.length - 1];        
    //     this.precioCostoSaldo = this.form.roundNumber(obj.precioCosto, 5);
    //     this.totalGeneral     = this.form.roundNumber(obj.totalGeneral, 5);       
    // }

    async getReport(){
        if(this.kardexs.length===0){
            toastr.warning('No hay registros para el reporte', 'Reporte', { 
                progressBar: 1, 
                closeButton: true, 
                preventDuplicates:2, 
                timeOut:1000
            })
           return
        }
        
        const { value: formatType } = await Swal.fire({
            icon:'warning',
            title: 'Tipo Formato',
            input: 'radio',
            inputOptions: {
                pdf:'PDF',
                excel:'EXCEL'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Seleccione el Tipo de Formato!'
                }
            },
            confirmButtonText:'<i class="mdi mdi-download"></i> Descargar',
            showDenyButton:true,
            denyButtonText:'No, cancelar',
            allowOutsideClick:false,
            showLoaderOnDeny:true,    
            allowEscapeKey:false   
        })
        
        if(!formatType) return            
                 
        let parameters = {
            reportParams: JSON.stringify({
                codigo: "RK", 
                format: formatType,
                codEstab: this.dataSearch.codEstab,
                aditionalParams: []
            }),
            
            dataParams: JSON.stringify(this.dataSearch)
        }
            
        this._commonSvc.getReport({
            parameters,
            formatType
        })     
    }


    async openModalTipoDocumento(item){ 
        let data = {}, modal = {}, dataTipoDoc = {};

        switch(item.tipoDoc)   {
            case 'FC':
                data = {
                    idFacturaCompra: item.idComprobante,
                    nroDocumento: item.nroDocumento
                }
                
                dataTipoDoc = await this._commonSvc.getDataTipoDocCompra({
                    item: data,
                    codigoDocumento: item.tipoDoc            
                })

                if(!dataTipoDoc.isComplete) return
      
                const {factura_compra} = this._nombreModal;
                modal =  await import('./../' + factura_compra.MODAL_CTRL);
                this._modalSvc.openModalSecond(modal.ModalDetalleCtrl, 'FacturaCompra/'+factura_compra.MODAL_DETALLE_CSHTML, 'xl', dataTipoDoc, true, 'uibModalFullScreen')                
                
                break
            case 'FV':

                data = {
                    idFactura: item.idComprobante,
                    nroDocumento: item.nroDocumento
                }
                dataTipoDoc = await this._commonSvc.getDataTipoDocVenta({
                    item: data,
                    codigoDocumento: item.tipoDoc
                })
                
                if(!dataTipoDoc.isComplete) return
                
                const {MODAL_CTRL, MODAL_DETALLE_CSHTML} = this._nombreModal.factura_venta
                const {ModalDetalleCtrl} =  await import('./../' + MODAL_CTRL);
                this._modalSvc.openModalSecond(ModalDetalleCtrl, 'FacturaVenta/'+ MODAL_DETALLE_CSHTML, 'xl', dataTipoDoc, true, 'uibModalFullScreen')                
                break
            case 'NE':
                data = {
                    idNotaEntrega: item.idComprobante,
                    nroDocumento: item.nroDocumento
                }
                dataTipoDoc = await this._commonSvc.getDataTipoDocVenta({
                    item: data,
                    codigoDocumento: item.tipoDoc
                })                
                
                if(!dataTipoDoc.isComplete) return
                
                const {nota_entrega} = this._nombreModal;
                modal =  await import('./../' + nota_entrega.MODAL_CTRL);
                this._modalSvc.openModalSecond(modal.ModalDetalleCtrl, 'NotaEntrega/'+ nota_entrega.MODAL_DETALLE_CSHTML, 'xl', dataTipoDoc, true, 'uibModalFullScreen')                                
                break

            case 'LC':                
                data = {
                    idLiquidacionCompra: item.idComprobante,
                    nroDocumento: item.nroDocumento
                }
                dataTipoDoc = await this._commonSvc.getDataTipoDocCompra({
                    item: data,
                    codigoDocumento: item.tipoDoc
                })                
                
                if(!dataTipoDoc.isComplete) return
                
                const {liquidacion_compra} = this._nombreModal;
                modal =  await import('./../' + liquidacion_compra.MODAL_CTRL);
                this._modalSvc.openModalSecond(modal.ModalDetalleCtrl, 'LiquidacionCompra/'+ liquidacion_compra.MODAL_DETALLE_CSHTML, 'xl', dataTipoDoc, true, 'uibModalFullScreen')                                
                break
            case 'IB':                
                data = {
                    idIngresoBodega: item.idComprobante,
                    nroDocumento: item.nroDocumento
                }
                dataTipoDoc = await this._commonSvc.getDataTipoDocCompra({
                    item: data,
                    codigoDocumento: item.tipoDoc
                })                
                
                if(!dataTipoDoc.isComplete) return
                
                const {ingreso_bodega} = this._nombreModal;
                modal =  await import('./../' + ingreso_bodega.MODAL_CTRL);
                this._modalSvc.openModalSecond(modal.ModalDetalleCtrl, 'IngresoBodega/'+ ingreso_bodega.MODAL_DETALLE_CSHTML, 'xl', dataTipoDoc, true, 'uibModalFullScreen')                                
                break
            case 'CIV':
                data = {
                    idConsolidacionInventario: item.idComprobante,
                    nroDoc: item.nroDocumento
                }

                dataTipoDoc = await this._commonSvc.getDataConsolidacionInventario({
                    item: data,
                    codigoDocumento: item.tipoDoc
                })
                if(!dataTipoDoc.isComplete) return
                const { consolidacion_inv } = this._nombreModal
                modal = await import('./../../modal/' + consolidacion_inv.MODAL_CTRL);
                this._modalSvc.openModalSecond(modal.ModalDetalleCtrl, 'ConsolidacionInventario/' + consolidacion_inv.MODAL_DETALLE_CSHTML, 'xl', dataTipoDoc, true, 'uibModalFullScreen')        
                break

            case 'NCP':
                data = {
                    idNotaCreditoProveedor: item.idComprobante,
                    nroDocumento: item.nroDocumento
                }

                dataTipoDoc = await this._commonSvc.getDataTipoDocCompra({
                    item: data,
                    codigoDocumento: item.tipoDoc
                })
                if(!dataTipoDoc.isComplete) return
                const { nota_credito_prov } = this._nombreModal
                modal = await import('./../../modal/' + nota_credito_prov.MODAL_CTRL);
                this._modalSvc.openModalSecond(modal.ModalDetalleCtrl, 'NotaCreditoProveedor/' + nota_credito_prov.MODAL_DETALLE_CSHTML, 'xl', dataTipoDoc, true, 'uibModalFullScreen')        
                break
            
            case 'NC':
                data = {
                    idNotaCredito: item.idComprobante,
                    nroDoc: item.nroDocumento
                }
                dataTipoDoc =  await this._commonSvc.getDataTipoDocVenta({
                    item: data,
                    codigoDocumento: item.tipoDoc
                })
                if(!dataTipoDoc.isComplete) return
        
                const {nota_credito_cliente } = this._nombreModal;
                modal =  await import('./../../modal/' + nota_credito_cliente.MODAL_CTRL);
                this._modalSvc.openModalSecond(modal.ModalDetalleCtrl, 'NotaCreditoCliente/'+ nota_credito_cliente.MODAL_DETALLE_CSHTML, 'xl', dataTipoDoc, true, 'uibModalFullScreen')       
        }        
    }

}



export class ModalKardexCtrl extends KardexCtrl{
    static $inject =  ['mainService', 'commonService', 'modalService', 'nombreModal', 'toastService', 'formulario', '$uibModalInstance', 'params'];
    constructor(_mS, _commonSvc, _modalSvc, _nombreModal, _toast, _form, $uibModalInstance, _params){      
      super(_mS, _commonSvc, _modalSvc, _nombreModal, _toast, _form)      
      this.$uibModalInstance = $uibModalInstance;
      this._params           = _params;     
    }

    $onInit(){ 
        let { fechaInicio, fechaFin } = this.form.getFechaInicioFinFilter(0);
        this.dataSearch.fechaInicio = fechaInicio;
        this.dataSearch.fechaFin = fechaFin;

        this.articulo = this._params;
        this.articuloFiltro = this.articulo;
        this.dataSearch.byArticulo =this.articulo.idArticulo;
        
        this.getKardex();       
    }
   
    closeModal(){
        this.$uibModalInstance.close()
    }
}



export class ModalFiltroKardex{
    static $inject = ["$uibModalInstance", "mainService", "commonService", "formulario", "toastService", "params"]
    constructor($uibModalInstance, _mS, _commonSvc, _form, _tS, _params){
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this.form = _form;
        this._tS = _tS;
        this._params = _params;

        
        this.sucursales        = [];
        this.bodegas           = [];

        this.articulo          = _params.articulo;
        this.dataSearch        = _params.dataSearch;
        this.articuloFiltro    = _params.articuloFiltro;        
        this.dataSearch.consolidacion = 0;

        this.meses             = this.form.meses();
        this.dataSearch.mes    = new Date().getMonth() + 1;
    }

    $onInit(){
        if(Object.entries(this._params.dataSearch).length >0){
            this.dataSearch.mes = this._params.dataSearch.mes;
        }

        this._mS.getData('get', '/FacturaVenta/GetDataForm?json=' + JSON.stringify({})).then(response=>{
            if(response.code=="0"){
                toastr.warning(response.message)
            }
            if(response.code==="1"){
                let dataMain = JSON.parse(response.payload)
                
                this.establecimientos = dataMain[0];

                if(this.establecimientos.length>0){                    
                    this.dataSearch.codEstab = this.establecimientos[0].codEstab;
                    this.getBodegas();
                }else{
                    taostr.warning('warning', 'NO TIENES ASIGNADO NINGÚN ESTABLECIMIENTO');
                }
            }            
        })

        this._commonSvc.getGestionAlmacen().then(response=>{
            this.estadoMovimientos = response.movimientosStocks;
            
        })    
    }

    getBodegas(){
        let dataEstab = this.establecimientos.find(item=>item.codEstab===this.dataSearch.codEstab);
        this._commonSvc.getDataFormEstabAsig(dataEstab).then(response=>{
            this.bodegas = response[1];

        })
    }


    articuloSearch(textSearch){      
        return this._commonSvc.articuloSearchGeneral({textSearch});
    }

    onKeyupArticuloSearchFiltro(){
        if(this.form.campo(this.articuloFiltro.descripcion)){
            this.data           = {};
            this.articulo       = {};
            this.articuloFiltro = {};

            // if(this.kardexs.length>0){
            //     this.tableTabulatorKardex.clearData();
            //     this.kardexs        = [];

            // }
        }
    }

    selectedArticuloSearchFiltro(item){
        this.articulo = item;        
        this.dataSearch.byArticulo = item.idArticulo;
        this.articuloFiltro.descripcion = item.descripcion;
    }
    

    onChangeFechaFiltro(){
        this.dataSearch.mes = new Date().getMonth() + 1;        
        this.getFechaInicioFinFiltro()
    }

    //Fecha Inicial y Final dependiendo el Mes que seleccione el usuario en el Filtro AVanzado
    getFechaInicioFinFiltro(){
        let { fechaInicio, fechaFin } = this.form.getFechaInicioFinFilter(this.dataSearch.mes);
        this.dataSearch.fechaInicio = fechaInicio;
        this.dataSearch.fechaFin = fechaFin;            
    }

    onChangeUltimaConsolidacion() {
        this.dataSearch.consolidacion = 0
        if (this.dataSearch.checkBoxUltimaConsolidacion) {
            this.dataSearch.consolidacion = 1;
            this.dataSearch.checkBoxConsolidacion = false;

            this.dataSearch.checkBoxFecha = false;                   
        }
    }

    onChangecheckBoxConsolidacionInventario() {
        this.dataSearch.consolidacion = 0
        if (this.dataSearch.checkBoxConsolidacion) {
            this.dataSearch.consolidacion = 2;
            this.dataSearch.checkBoxUltimaConsolidacion = false;            
        }

    }

    //Search Kardex 
    searchKardex() {
        let tituloToast = 'Buscar';
        if (this.form.campo(this.dataSearch.byArticulo)) {
            this._tS.toastr('warning', 'Seleccione el Articulo', tituloToast);
            return
        }

        if (this.dataSearch.checkBoxBodega) {
            if (this.form.campo(this.dataSearch.byBodega) || this.dataSearch.byBodega === 0) {
                this._tS.toastr('warning', 'Seleccione la Bodega', tituloToast);
                return
            }
        }

        if (this.dataSearch.checkBoxFecha) {
            if (this.form.campo(this.dataSearch.fechaInicio)) {
                this._tS.toastr('warning', 'Ingrese la Fecha de Inicio', tituloToast);
                return
            }
            if (this.form.campo(this.dataSearch.fechaFin)) {
                this._tS.toastr('warning', 'Ingrese la Fecha Fin', tituloToast);
                return
            }
        } 

        if(this.dataSearch.checkBoxMovement){            
            if(this.dataSearch.movement === null || this.dataSearch.movement===undefined || this.dataSearch.movement ===""){
                this._tS.toastr('warning', 'Seleccione el Movimiento', tituloToast);
                return                
            }
        }
        this.dataSearch.isSearch = true;
        
        let data = {
            articulo: this.articulo,
            dataSearch: this.dataSearch,
            articuloFiltro: this.articuloFiltro
        }
        
        this.$uibModalInstance.close(data);

    }

    closeModal(){
        this.dataSearch.isSearch = false;        
        const data = {
            articulo: this.articulo,
            dataSearch: this.dataSearch,
            articuloFiltro: this.articuloFiltro
        }
        this.$uibModalInstance.close(data);
    }

}

app.controller('kardexCtrl', KardexCtrl)


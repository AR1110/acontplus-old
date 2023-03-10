
class ModalCobroCtrl{

    constructor({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS}){
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;
        this._mS = _mS;
        this._commonSvc = _commonSvc;
        this._tS = _tS;
        this._fS = _fS;
    }

    getEstablecimiento(){
        return this._mS.getData('get', '/EstabAsig/Get?json=' + JSON.stringify({})).then(response=>{                        
            if(response.code==="0"){
                this._tS.toastr('warning', response.message)
                throw response.message;
            }
            return JSON.parse(response.payload) || [];           
        })
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
     */
    static set setValorAbono(valorAbono) {
        this.valorAbono = valorAbono;
    }
    
    static get getValorAbono() {
        return this.valorAbono;
    }





    agregarFormaCobro(secuencial, isPosFechado){
        
        let valorAbono = 0;
        
        for (let i = 0; i < this.selectedDocumentos.length; i++) {
            
            for (let val of this.selectedDocumentos[i].cuotas) {

                valorAbono = ModalCobroCtrl.getValorAbono //Recuperamos el valor del Pago   
               
                if (valorAbono === 0) return
                
                if ((val.cxc.cuota === val.saldo) && (val.abono === 0 || val.abonoPosfechado === 0)) {
                    
                    this.ningunAbono(val, valorAbono, secuencial, isPosFechado);

                } else if (val.cxc.cuota !== val.saldo && val.saldo > 0) {

                    this.tieneAbono(val, valorAbono, secuencial, isPosFechado);

                }

                val.cxc.cuota        = this._fS.roundNumber(val.cxc.cuota, this.NUM_MAX_ROUND);
                val.abono            = this._fS.roundNumber(val.abono, this.NUM_MAX_ROUND);
                val.abonoPosfechado  = this._fS.roundNumber(val.abonoPosfechado, this.NUM_MAX_ROUND);
                val.saldo            = this.verificarEstadoSaldo(val) //Verificamos el saldo de la Cuota 
                val.estadoFinanciero = this.verificarEstadoPago(val);
                val.cuotaAfectado    = true;
            }
        }
    }


    //Si la cuota no tiene ningun abono 
    ningunAbono(val, valorAbono, secuencial, isPosFechado) {

        if (val.saldo >= valorAbono) {

            val.abono           = isPosFechado ? 0 : valorAbono;
            val.abonoPosfechado = isPosFechado ? valorAbono : 0;
            val.saldo           = val.saldo - valorAbono;

            ModalCobroCtrl.setValorAbono = 0; //Set valor Abono en 0

            this.setCobroCuota(val, valorAbono, secuencial, isPosFechado);

        } else if (val.saldo <= valorAbono) {

            val.abono = isPosFechado ? 0 : val.cxc.cuota;
            val.abonoPosfechado = isPosFechado ? val.cxc.cuota : 0;
            val.saldo = valorAbono -= val.saldo;

            ModalCobroCtrl.setValorAbono = valorAbono; //Set valor Abono restante
            this.setCobroCuota(val, val.cxc.cuota, secuencial, isPosFechado);
        }
    }



    tieneAbono(val, valorAbono, secuencial, isPosFechado) {
        let resultAbono = 0;

        //si el valor abono es menor al saldo 
        if (val.saldo >= valorAbono) {
            if (isPosFechado) {
                val.abonoPosfechado = valorAbono + val.abonoPosfechado;
            } else {
                val.abono = valorAbono + val.abono;
            }
            val.saldo = val.saldo - valorAbono;

            ModalCobroCtrl.setValorAbono = 0; //Set valor Abono en 0
            this.setCobroCuota(val, valorAbono, secuencial, isPosFechado);

        } else if (val.saldo <= valorAbono) { //si el valor abono es mayor al saldo 
            if (isPosFechado) {
                val.abonoPosfechado = val.abonoPosfechado + val.saldo;
            } else {
                val.abono = val.abono + val.saldo;
            }

            resultAbono = valorAbono -= val.saldo;
            valorAbono = this._fS.roundNumber(resultAbono, this.NUM_MAX_ROUND);
           
            ModalCobroCtrl.setValorAbono = valorAbono //Set valor Abono en 0
            this.setCobroCuota(val, val.saldo, secuencial, isPosFechado);
        }
    }


    setCobroCuota(val, valor, secuencial, isPosfechado) {            
        
        if (val.cxc.cuota !== 0) {
            this.cuotasAfectados.push({
                cobroDetalle: {
                    idCuotaXCobrar: val.cxc.idCuotaXCobrar,
                    abono: this._fS.roundNumber(valor, this.NUM_MAX_ROUND),
                    abonoPosfechado: val.abonoPosfechado
                },
                cuota: this._fS.roundNumber(val.cxc.cuota, this.NUM_MAX_ROUND),
                saldo: this.verificarEstadoSaldo(val),
                isPosfechado,
                secuencial
            });
        }
    }




    verificarEstadoPago(cuota) {
        let estado = '';
        if (cuota.cxc.cuota === (cuota.abono + cuota.abonoPosfechado)) estado = 'Cobrada';
        if (cuota.saldo > 0) estado = "Pendiente Parcial";
        if (cuota.cxc.cuota === cuota.saldo) estado = "Pendiente";
    
        return estado
      }
    
    
    verificarEstadoSaldo(val) {
        
        let total = val.abono + val.abonoPosfechado;

        if(this._fS.roundNumber(total, this.NUM_MAX_ROUND) === this._fS.roundNumber(val.cxc.cuota, this.NUM_MAX_ROUND)){
            return 0;
        }

        return  this._fS.roundNumber(val.saldo, this.NUM_MAX_ROUND);
    }




    getValorAbonoFormaPago(secuencial) {
        let abono = this.cuotasAfectados.filter(val=>val.secuencial==secuencial).map(val=>val.cobroDetalle.abono).reduce((prev, curr)=>prev+curr,0);
    
        this.dataAbono.abono = abono;
        this.abonoEntidadesFinancieras.push(this.dataAbono)
    
    }




    calculoTotales() {
        try {

            let abonoTotal = this.abonoEntidadesFinancieras.map(val => val.valor).reduce((prev, curr) => prev + curr, 0)
     
            let abono = this.abonoEntidadesFinancieras.filter(item => !item.posFechado).map(val => val.valor).reduce((prev, curr) => prev + curr, 0);
    
            let abonoPosfechado = this.abonoEntidadesFinancieras.filter(item => (item.posFechado)).map(val => val.valor).reduce((prev, curr) => prev + curr, 0);
        
            let valorSaldo = this.selectedDocumentos.flatMap(item => item.cuotas).map(val => val.saldo).reduce((prev, curr) => prev + curr, 0);
        
        
            this.data.abonoTotal      = this._fS.roundNumber(abonoTotal, this.NUM_MAX_ROUND);
            this.data.abono           = this._fS.roundNumber(abono, this.NUM_MAX_ROUND);
            this.data.abonoPosfechado = this._fS.roundNumber(abonoPosfechado, this.NUM_MAX_ROUND)
            this.data.saldo           = this._fS.roundNumber(valorSaldo, this.NUM_MAX_ROUND);
            this.data.valorCambio     = this.getValorCambio();

        } catch (error) {
            console.log(error)
        }
    }



    



    closeModal(){
        this.$uibModalInstance.close()
    }

}


export class ModalCobroLoteCtrl extends ModalCobroCtrl{
    
    static $inject = ['$scope', '$timeout', '$filter', '$uibModalInstance', 'mainService', 'commonService', 'toastService', 'formulario', 'modalService', 'nombreModal']

    constructor($scope, $timeout, $filter, $uibModalInstance, _mS, _commonSvc, _tS, _fS, _modalSvc, _nombreModalConst){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS})
        
        const self = this;

        this.$filter = $filter;
        this._modalSvc = _modalSvc;
        this._nombreModalConst = _nombreModalConst;

        this.gridOptions = {                                      
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            rowHeight: 35,
            showGridFooter:true, 
            isRowSelectable : function(row){
                
                // if(["AC", "PE"].includes(row.entity.codDoc)){
                //     return true;
                // } else {
                //     return false;
                // }
            }
        }  
        
        this.gridOptions.columnDefs = [
            { name: 'Nro. Doc', field:'nroDocumento'},
            { name: 'Tipo Doc.', field: 'tipoDocumento'},
            { name: 'Fecha Emisión', field: 'fechaEmision'},
            { name: 'Fecha Vencimiento', field: 'fechaVencimiento'},                                
            { name: 'Total', field:'total'},
            { name: 'Abono', field:'abono'},
            { name: 'Saldo', field:'saldo'},
            {
                name: 'Estado', 
                field:'estadoDoc',
                cellClass: function (grid, row, col, rowIndex, colIndex) {
                    var val = grid.getCellValue(row, col);
                    
                    if (row.entity.estadoCod === 'PE') {
                        
                      return "cellPendiente"
                    }
                    else if (row.entity.estadoCod === 'PP') {
                        return "cellPenditeParcial"                  
                    }
                }
            },
        ];
        

        this.gridOptions.onRegisterApi = function (gridApi) {  
            self.$scope.gridApi = gridApi;  
            
        }

        this.NUM_MAX_ROUND = 5

        this.data = {};
        this.cliente = {};
        this.clienteFiltro = {};
        this.tipoDocumentos = [];

        this.selectedDocumentos = []

        this.cobro = {}

        this.abonoEntidadesFinancieras = [];


        this.cuotasAfectados = []

        this.abonoCuotas = []

        this.options = {
            limitOptions: [5, 10, 15],
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: true,
            limitSelect: true,
            pageSelect: true,         
            limit: 5,
            page: 1
        }


        this.footerActionStepUno = true; 
    }


    async $onInit(){

        try {
            showLoader();

            this.establecimientos = await this.getEstablecimiento();

            if(this.establecimientos.length>0){
                this.data.codEstab = this.establecimientos[0].codEstab;
                this.cloneCodEstab = this.data.codEstab;
            }else{
                this._tS.toastr('info', 'NO TIENES ASIGNADO NINGÚN ESTABLECIMIENTO')
            }
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }
    }


    async onChangeEstablecimiento(){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger ml-2'
            },
            buttonsStyling: false
        })
          
        let {isConfirmed} = await  swalWithBootstrapButtons.fire({
            title: '<small>Cambiar el Establecimiento?</small>',
            html: "<small>Esta seguró de cambiar el Establecimiento</small>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, cambiar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: false
        })

        if(isConfirmed){
            this.selectedDocumentos = [];
            this.gridOptions.data = []
            this.tipoDocumentos = [];

            this.cloneCodEstab = this.data.codEstab;
            this.getTipoDocumentos();
            this.$scope.$apply()
        }else{
            this.data.codEstab = this.cloneCodEstab;
            this.$scope.$apply()
        }
    }


    onKeyupClienteSearchFiltro(){
        if(!this.clienteFiltro.nombreFiscal){
            this.cliente = {};
        }
    }

    selectedClienteSearchFiltro(item){
        this.cliente = item;        
        this.getTipoDocumentos();
    }


    getTipoDocumentos() {
        try {
            
            showLoader();

            if(!this.data.codEstab){
                this._tS.toastr('warning', 'Seleccione el Establecimiento');
                return
            }

            if(!(this.cliente.idCliente>0)){
                this._tS.toastr('warning', 'Seleccione el Cliente');
                return
            }

            let json = {
                codEstab: this.data.codEstab,
                idCliente: this.cliente.idCliente
            }


            this._mS.getData('get', '/GestionFinanciera/GetDocumentsCharge?json=' + JSON.stringify(json)).then(response => {
                
                if (response.code == "0") {                    
                    this._tS.toastr('warning', response.message, response.titleSms);
                    return
                }

                if(response.code==="1"){
                    let documentos = JSON.parse(response.payload) || [];                    

                    this.gridOptions.data = documentos;
                    this.tipoDocumentos = documentos;
                    
                    
                }
                // if (response.data.length == 0) {
                //     hideLoader();
                //     Swal.fire({ 
                //         icon: 'info', 
                //         text: 'No se encontraron los documentos de este cliente!' 
                //     })
                // }
               
            })
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader()
        }        
    }


    getCuotaByTypeDocument = async (item)=>{
        try {
            showLoader();
           
            await this._mS.getData('get', '/CuotaXCobrar/GetCuotaForPayment?idComprobante=' + item.idComprobante + '&idTipoDocumento=' + item.idTipoDocumento).then(response => {
                
                if (response.id == "0") {                    
                    this._tS.toastr('warning', response.message, response.titleSms);
                    return
                }
    
                //Si la cuota de la Factura tiene Entrada
                if (response.id == "2") {                   
                    item.hasEntrada = true;
                    this.deleteDocSeleted(item);
                    Swal.fire({ 
                        icon: 'warning', 
                        html: `<small>${response.message}</small>` 
                    })                    
                }                
                
                item.showCuota = true;
                item.cuotaOriginal = JSON.parse(JSON.stringify(response.data));
                item.cuotas = response.data;                

            })
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }       
    }   
    
    
    deleteDocSeleted(item) {
        let index = this.selectedDocumentos.indexOf(item);
        this.selectedDocumentos.splice(index, 1);
    }


    paymentStepUno=function(){
       this.footerActionStepUno=true;
       this.footerActionStepDos=false;
        
        $("#paymentStep a:first-child").addClass('active'); 
        $("#paymentStep a:last-child").removeClass('active'); 

        $("#content-list-documento").show();
        $("#content-cuotas").hide();
    }

    paymentStepDos(){            
        if(this.selectedDocumentos.length===0){
            this._tS.toastr('warning', 'Seleccione al menos un Tipo de Documento', 'Siguiente','toast-top-right');
            return
        }

        this.footerActionStepUno=false;
        this.footerActionStepDos=true;

        $("#paymentStep a:first-child").removeClass('active'); 
        $("#paymentStep a:last-child").addClass('active'); 

        $("#content-list-documento").hide();
        $("#content-cuotas").show();

        this.selectedDocumentos = this.$filter('orderBy')(this.selectedDocumentos, 'fechaEmision');
        this.cobro.abonoPosfechado=0;
        this.cobro.totalCobro=0;
        this.cobro.valorCambio=0;
        this.getTotalesCuotas();              
    }


    getTotalesCuotas(){  
        let total=0, totalAbonoAnterior=0, totalAbonoPosf=0, saldo=0, totalAbono = 0;

        let joinDocumentoCuotas = this.selectedDocumentos.flatMap(item=>item.cuotas);
        
        for(let item of joinDocumentoCuotas){
            total              += item.cxc.cuota;                                        
            totalAbonoAnterior += item.abono; 
            totalAbonoPosf     += item.abonoPosfechado;                                                       
            saldo              += item.saldo;            
        }
        

        this.data.total              = this._fS.roundNumber(total, 5);
        this.data.totalAbonoAnterior = this._fS.roundNumber(totalAbonoAnterior, 5)
        this.data.saldo              = this._fS.roundNumber(saldo, 5);
        this.data.saldoOriginal      = this._fS.roundNumber(saldo, 5);
        this.data.abono              = 0;
        this.data.abonoPosfechado    = 0;
        this.data.abonoTotal         = 0;
        this.data.valorCambio        = 0;
        
    }

    expandDetalle(data){
        data.showCuota=!data.showCuota;
    }


    async openModalFormaCobro(){
        try {

            if (this.data.saldo == 0) {
                this._fS.sweetAlert('warning', 'No hay cuotas pendientes!')
                return
            }

            let {MODAL_FILE_FORMA_COBRO, MODAL_FORMA_COBRO} = this._nombreModalConst.cobro;
            let controller = (await import('./../../../' + MODAL_FILE_FORMA_COBRO))[MODAL_FORMA_COBRO['controller']];
            let template   = MODAL_FORMA_COBRO['template'];
    
            let params = {
                data: this.data,
                abonoEntidadesFinancieras: this.abonoEntidadesFinancieras || [],
                documentos: [],
                isPaymentLote:true,            
                referencia: this.cliente.nombreFiscal
            }
            let $modalRef = this._modalSvc.openModalCustom({
                controller,
                template,
                size:'xl',
                params
            })
    
            $modalRef.result.then(result=>{
    
                if(typeof result!=='object') return
                
                this.dataAbono = result;
               
                ModalCobroCtrl.setValorAbono = result.valor;
               
                this.agregarFormaCobro(result.secuencial, result.posFechado);               
                
                this.getValorAbonoFormaPago(result.secuencial);
                
                this.calculoTotales();
                
                this._tS.toastr('success', 'Abono Agregado Correctamente');
    
            })
        } catch (error) {
            console.log(error)
        }
    }


    agregarFormaCobro(secuencial, isPosFechado){
        
        let valorAbono = 0;
        
        for (let i = 0; i < this.selectedDocumentos.length; i++) {
            
            for (let val of this.selectedDocumentos[i].cuotas) {

                valorAbono = ModalCobroCtrl.getValorAbono //Recuperamos el valor del Pago   
               
                if (valorAbono === 0) return
                
                if ((val.cxc.cuota === val.saldo) && (val.abono === 0 || val.abonoPosfechado === 0)) {
                    
                    this.ningunAbono(val, valorAbono, secuencial, isPosFechado);

                } else if (val.cxc.cuota !== val.saldo && val.saldo > 0) {

                    this.tieneAbono(val, valorAbono, secuencial, isPosFechado);

                }

                val.cxc.cuota        = this._fS.roundNumber(val.cxc.cuota, this.NUM_MAX_ROUND);
                val.abono            = this._fS.roundNumber(val.abono, this.NUM_MAX_ROUND);
                val.abonoPosfechado  = this._fS.roundNumber(val.abonoPosfechado, this.NUM_MAX_ROUND);
                val.saldo            = this.verificarEstadoSaldo(val) //Verificamos el saldo de la Cuota 
                val.estadoFinanciero = this.verificarEstadoPago(val);
                val.cuotaAfectado    = true;
            }
        }
    }


    //Si la cuota no tiene ningun abono 
    ningunAbono(val, valorAbono, secuencial, isPosFechado) {

        if (val.saldo >= valorAbono) {

            val.abono           = isPosFechado ? 0 : valorAbono;
            val.abonoPosfechado = isPosFechado ? valorAbono : 0;
            val.saldo           = val.saldo - valorAbono;

            ModalCobroCtrl.setValorAbono = 0; //Set valor Abono en 0

            this.setCobroCuota(val, valorAbono, secuencial, isPosFechado);

        } else if (val.saldo <= valorAbono) {

            val.abono = isPosFechado ? 0 : val.cxc.cuota;
            val.abonoPosfechado = isPosFechado ? val.cxc.cuota : 0;
            val.saldo = valorAbono -= val.saldo;

            ModalCobroCtrl.setValorAbono = valorAbono; //Set valor Abono restante
            this.setCobroCuota(val, val.cxc.cuota, secuencial, isPosFechado);
        }
    }



    tieneAbono(val, valorAbono, secuencial, isPosFechado) {
        let resultAbono = 0;

        //si el valor abono es menor al saldo 
        if (val.saldo >= valorAbono) {
            if (isPosFechado) {
                val.abonoPosfechado = valorAbono + val.abonoPosfechado;
            } else {
                val.abono = valorAbono + val.abono;
            }
            val.saldo = val.saldo - valorAbono;

            ModalCobroCtrl.setValorAbono = 0; //Set valor Abono en 0
            this.setCobroCuota(val, valorAbono, secuencial, isPosFechado);

        } else if (val.saldo <= valorAbono) { //si el valor abono es mayor al saldo 
            if (isPosFechado) {
                val.abonoPosfechado = val.abonoPosfechado + val.saldo;
            } else {
                val.abono = val.abono + val.saldo;
            }

            resultAbono = valorAbono -= val.saldo;
            valorAbono = this._fS.roundNumber(resultAbono, this.NUM_MAX_ROUND);
           
            ModalCobroCtrl.setValorAbono = valorAbono //Set valor Abono en 0
            this.setCobroCuota(val, val.saldo, secuencial, isPosFechado);
        }
    }


    setCobroCuota(val, valor, secuencial, isPosfechado) {            
        
        if (val.cxc.cuota !== 0) {
            this.cuotasAfectados.push({
                cobroDetalle: {
                    idCuotaXCobrar: val.cxc.idCuotaXCobrar,
                    abono: this._fS.roundNumber(valor, this.NUM_MAX_ROUND),
                    abonoPosfechado: val.abonoPosfechado
                },
                cuota: this._fS.roundNumber(val.cxc.cuota, this.NUM_MAX_ROUND),
                saldo: this.verificarEstadoSaldo(val),
                isPosfechado,
                secuencial
            });
        }
    }




    verificarEstadoPago(cuota) {
        let estado = '';
        if (cuota.cxc.cuota === (cuota.abono + cuota.abonoPosfechado)) estado = 'Cobrada';
        if (cuota.saldo > 0) estado = "Pendiente Parcial";
        if (cuota.cxc.cuota === cuota.saldo) estado = "Pendiente";
    
        return estado
    }
    
    
    verificarEstadoSaldo(val) {
        
        let total = val.abono + val.abonoPosfechado;

        if(this._fS.roundNumber(total, this.NUM_MAX_ROUND) === this._fS.roundNumber(val.cxc.cuota, this.NUM_MAX_ROUND)){
            return 0;
        }

        return  this._fS.roundNumber(val.saldo, this.NUM_MAX_ROUND);
    }




    getValorAbonoFormaPago(secuencial) {
        let abono = this.cuotasAfectados.filter(val=>val.secuencial==secuencial).map(val=>val.cobroDetalle.abono).reduce((prev, curr)=>prev+curr,0);
    
        this.dataAbono.abono = abono;
        this.abonoEntidadesFinancieras.push(this.dataAbono)
    
    }


    getValorCambio() {
        let valorCambio = 0;
        
        if (this.data.abonoTotal >= this.data.saldoOriginal) {
            valorCambio = this.data.abonoTotal - this.data.saldoOriginal;
        }
        
        return this._fS.roundNumber(valorCambio, this.NUM_MAX_ROUND);
    }


    viewCuotaAbonos(data) {
        
        this.abonoCuotas = this.cuotasAfectados.filter(val => val.cobroDetalle.idCuotaXCobrar === data.cxc.idCuotaXCobrar);
    }




     //Eliminar Pago 
    async askToDeleteAbono(item) {
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        })

        if (isConfirmed) {
        
            this.$scope.$apply(()=>{


                let secuencial = 0, total = 0, totalAbonoAnterior = 0, saldo = 0; 
            
                this.cuotasAfectados = []; //Reset todas las cuotas afectadas            
                
                this.abonoEntidadesFinancieras.splice(this.abonoEntidadesFinancieras.indexOf(item), 1); //Eliminamos abono agregado                         
                
                
                //Todas las cuotas en su estado original 
                for (let i = 0; i < this.selectedDocumentos.length; i++) {
                
                    this.selectedDocumentos[i].cuotas = JSON.parse(JSON.stringify(this.selectedDocumentos[i].cuotaOriginal));
                
                    for (let val of this.selectedDocumentos[i].cuotaOriginal) {
                        total              += val.cxc.cuota;
                        totalAbonoAnterior += val.abono;
                        saldo              += val.saldo;
                    }
                }

                this.data.total              = this._fS.roundNumber(total, 5);
                this.data.totalAbonoAnterior = this._fS.roundNumber(totalAbonoAnterior, 5)
                this.data.saldo              = this._fS.roundNumber(saldo, 5);
                this.data.saldoOriginal      = this._fS.roundNumber(saldo, 5);
                this.data.abono              = 0;
                this.data.abonoPosfechado    = 0;
                this.data.abonoTotal         = 0;
                this.data.valorCambio        = 0;
                
                
                if (this.abonoEntidadesFinancieras.length == 0) return
                
                //Recalculamos las cuotas con los abonos restantes   
                for (var i = 0; i < this.abonoEntidadesFinancieras.length; i++) {
                    secuencial++;
                    ModalCobroCtrl.setValorAbono = this.abonoEntidadesFinancieras[i].valor //Set valor de abono 
                    this.agregarFormaCobro(secuencial, this.abonoEntidadesFinancieras[i].posFechado);
                }
                
                
                this.calculoTotales();


            });
        }

    }



    async onSave(){

        try {

            if(this.abonoEntidadesFinancieras.length===0){
                this._tS.toastr('warning', 'Agregue al menos un Cobro', 'Cobro');
                return
            }
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await  swalWithBootstrapButtons.fire({
                title: '<small>Guardar Comprobante Ingreso</small>',
                html: "Esta seguro de guardar este comprobante Ingreso?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false
            })
    
            if(isConfirmed){

                showLoader();
                let comprobanteIngreso = {
                    idCliente: this.cliente.idCliente,  
                    codEstab: this.data.codEstab              ,
                    total: this.abonoEntidadesFinancieras.map(val=>val.valor).reduce((acc, curr)=>acc + curr, 0),
                    abono: this.abonoEntidadesFinancieras.map(val=>val.abono).reduce((acc, curr)=>acc + curr, 0)
                }

                let data = {
                    comprobanteIngreso,
                    cobros: this.abonoEntidadesFinancieras,
                    cobroDetalles: this.cuotasAfectados
                }
        
                
                await this._mS.getData('post', '/ComprobanteIngreso/Insert', data).then(response => {                    
                    if (response.code == "0") {
                        this._fS.sweetAlert('warning', response.message, response.titleSms, 1000)                                         
                    }
                    if (response.code == "1") {
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000)                  
                        this.$uibModalInstance.close(response)
                    }
                });
    
    
            }
        } catch (error) {
           console.log(error) 
        }finally{
            hideLoader()
        }
    }
}











export class ModalCobroRapidoCtrl extends ModalCobroCtrl{
    static $inject = [
        '$scope',         
        '$uibModalInstance', 
        'mainService',
        'commonService',
        'modalService',
        'nombreModal',
        'toastService', 
        'formulario', 
        'params'
    ]

    constructor($scope, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModal, _tS, _fS, _params){
        super({$scope, $uibModalInstance, _mS, _commonSvc, _tS, _fS})
          
        this._modalSvc         = _modalSvc;
        this._nombreModal      = _nombreModal;
        
        let {TIPO_DOC, data}= _params;
        
        this.TIPO_DOC = TIPO_DOC;
        this.data = data;

        // this._cobroSvc         = new CobroService($http, _form, _toast);

        this.cobro              ={};
        this.cobro.valorCambio  = 0; 

        this.entidadFinanciera  = {};
        this.banco              = {};
        this.cuentaBancaria     = {};
        this.estadoCobro        = {};

        // this.cliente            = this._params.cliente;
        // this.cliente.correos    = this._form.getTagInputAsList(this.cliente.correo);
        // this.dataTipoDocumento  = this._params.dataTipoDocumento;    
        $("#btnSaveCobroRapido").focus();     
    }

    async $onInit(){

        try {

            showLoader();
            
            let resultMain = await  Promise.all([
                this._mS.getData('get','/EntidadFinanciera/OptionEntidadFinanciera').then(response=>response.data),
                this._mS.getData('get','/Banco/GetByAll').then(response=>response.data),
                this._mS.getData('get','/Ciudad/ReadCiudadProvincia').then(response=>response.data)
            ])


            this.entidadesFinancieras = resultMain[0];
            this.entidadFinanciera = this.entidadesFinancieras.find(val => val.codigo === 'EFE');
            this.getSubEntidadByIdEntFinanciera();

            this.bancos = resultMain[1];
            this.ciudadPronvincias = resultMain[2];

            this.getAllCuota();

            

        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }   
                
        this.$uibModalInstance.rendered.then(()=>{
            $("#btnSaveCobroRapido").focus();

            setTimeout(()=>{
                $("#btnSaveCobroRapido").focus();
            }, 1000)
        })
    }

    
    getAllCuota(){
        let {idTipoDocumento, id} = this.data;

        this._mS.getData('get', `/CuotaXCobrar/GetCuotaForPayment?idComprobante=${id}&idTipoDocumento=${this.TIPO_DOC.idTipoDocumento}`).then(response=>{
            if(response.id==="0"){
                this._fS.sweetAlert('warning', response.message, response.titleSms)
            }

            if(response.id=="1"){
                let cuotas = response.data;

                this.cobro.abonoAnterior = cuotas.map(val=>val.abono).reduce((acc, curr)=>acc+curr, 0);
                this.cobro.valorAbono    = cuotas.map(val=>val.saldo).reduce((acc, curr)=>acc+curr, 0);

                this.cobro.valorSaldo    = this.cobro.valorAbono;
                this.cobro.valor         = this.cobro.valorAbono; 
                this.cobro.abono         = this.cobro.valorAbono;                         
                this.cobro.fechaEmision  = new Date();      


            }
        })   
    }

    getSubEntidadByIdEntFinanciera(){        
        this._mS.getData('get', '/SubEntidadFinanciera/GetByIdEntidadFinanciera?idEntidadFinanciera=' + this.entidadFinanciera.idEntidadFinanciera).then(response=>{
            if (response.id == "0") {
                toastr.warning(response.message, response.titleSms);
                return
            }
            this.subEntidades = response.data;
            this.subEntidad = response.data[0]; 
        });
    }


    async openModalCobroDocumento(){
        let {MODAL_FILE_CTRL, MODAL_COBRO_DOCUMENTO} = this._nombreModal.cobro;
        let controller = (await import('./../../../' + MODAL_FILE_CTRL))[MODAL_COBRO_DOCUMENTO['controller']];
        let template   = MODAL_COBRO_DOCUMENTO['template'];
        
        
        let params = {
            data: this.data,
            TIPO_DOC: this.TIPO_DOC            
        }

        let $modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size: 'xl',
            params
        })

        $modalRef.result.then(result=>{
            if(typeof result==='object'){
                this.$uibModalInstance.close(result);
            }
        })


    }

    // async openModalCobro(){  
    //     const {MODAL_COBRO_DOCUMENTO_CTRL, MODAL_COBRO_DOCUMENTO_CSHTML}= this._nombreModal.cobro;
    //     const {ModalCobroDocumentoCtrl} = await import('./../modal/' + MODAL_COBRO_DOCUMENTO_CTRL);
    //     const modalRef = this._modalSvc.openModalCustom({
    //         controller: ModalCobroDocumentoCtrl,
    //         template: 'Shared/Cobro/'+MODAL_COBRO_DOCUMENTO_CSHTML,
    //         size: 'xl',
    //         params: this._params
    //     })
         
    //     modalRef.result.then(response=>{            
    //         if(typeof response==='object'){
    //             this.$uibModalInstance.close(response)
    //         }
    //     })                                    
    // }

    tabEntidadFinanciera(ef) {  
        this.cobro.valorAbono = this.cobro.valorSaldo;
        this.cobro.valor = this.cobro.valorAbono; //Todo lo que se escribe  por pantalla;
        this.cobro.abono = this.cobro.valorAbono;                
        this.cobro.valorCambio = 0;            
        this.entidadFinanciera = ef;
        this.cobro.fechaEmision= new Date();
        this.banco = {};
        this.getSubEntidadByIdEntFinanciera(ef.idEntidadFinanciera);
     
        if(ef.codigo==='CHE'){
            this.cobro.referencia = JSON.parse(localStorage.getItem('userData')).entidad            
        }
    }

    setValorEfectivo() {
        let valorCambio=0, valor=0, abono=0, saldo;
        if(this._fS.campo(this.cobro.valorAbono) || isNaN(this.cobro.valorAbono)){
            valor = 0;
        }else{
            valor = Number(this.cobro.valorAbono);
        }
                           
        if(valor>=this.cobro.valorSaldo){                
            valorCambio = valor - this.cobro.valorSaldo;
            this.cobro.valorCambio = this._fS.roundNumber(valorCambio, 5);
            this.cobro.valor = valor; //Todo lo que se escribe  por pantalla;
            this.cobro.abono = this.cobro.valorSaldo;   
        }else{
            saldo = this.cobro.valorSaldo - valor;                
            //this.cobro.valorSaldo = form.roundNumber(valorSaldo, 5);
            this.cobro.valor = valor; //Todo lo que se escribe  por pantalla;
            this.cobro.abono = valor;                   
            this.cobro.valorCambio = 0;                
        };            
    }


    validarFormaCobro(){                        
        //Si el abono es Cheque
        if (this.entidadFinanciera.codigo === "CHE") {
           if (this._fS.campo(this.banco.idBanco)) {
               this._tS.toastr('warning', 'Seleccione el Banco', 'Cobro');
               return
           }
           if (this._fS.campo(this.cobro.nro)) {
               this._tS.toastr('warning', 'Ingrese el Número', 'Cobro');
               return
           }
        }
       
       //Si es tarjeta de credito 
        if (this.entidadFinanciera.codigo === "TAR") {
           if (this._fS.campo(this.cobro.valorAbono)) {
               this._tS.toastr('warning', 'Ingrese el Valor del Abono', 'Cobro');
               return
           }
           if (this._fS.campo(this.cobro.nro)) {
               this._tS.toastr('warning', 'Ingrese el Número', 'Cobro');
               return
           }
           if (this._fS.campo(this.cobro.idCiudad)) {
               this._tS.toastr('warning', 'Seleccione la Ciudad', 'Cobro');
               return
           }
           if (this._fS.campo(this.cobro.aprobacion)) {
               this._tS.toastr('warning', 'Ingrese la Aprobación', 'Cobro');
               return
           }
           if (this._fS.campo(this.cobro.lote)) {
               this._tS.toastr('warning', 'Ingrese el Lote', 'Cobro');
               return
           }
           if (this._fS.campo(this.cobro.referencia)) {
               this._tS.toastr('warning', 'Ingrese la Referencia', 'Cobro');
               return
           }
        }

       //Si es tranferencia 
        if (this.entidadFinanciera.codigo == "TRA") {
            if (this._fS.campo(this.cobro.valorAbono)) {
               this._tS.toastr('warning', 'Ingrese un Valor a Cancelar', 'Cobro');
               return
            }
            if (this._fS.campo(this.banco.idBanco)) {
               this._tS.toastr('warning', 'Seleccione el Banco', 'Cobro');
               return
            }
            if (this._fS.campo(this.cobro.nro)) {
               this._tS.toastr('warning', 'Ingrese el Número', 'Cobro');
               return
            }
        }

        if(isNaN(this.cobro.valorAbono)){
           this._tS.toastr('warning', 'Ingrese un Valor válido', 'Cobro');
           return
        }

        if (this._fS.campo(this.cobro.valorAbono)) {
           this._tS.toastr('warning', 'Ingrese un Valor a Cancelar', 'Cobro');
           return
        }
        if (Number(this.cobro.valorAbono) === 0) {
           this._tS.toastr('warning', 'El Valor a cancelar debe ser mayor 0', 'Cobro');
           return
        }

        return true

    }


    onSave() {
        
        if(!this.validarFormaCobro()) return
        
        Swal.fire({
            icon: 'warning',
            html: `<small>Desea guardar este cobro ahora?</small>`,
            showConfirmButton: true,
            confirmButtonText: 'Si, guardar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        }).then(result => {
            if (result.isConfirmed) {
                this.postCobroRapido();                
            }
        })
    }

    postCobroRapido() {
        try {

            let comprobanteIngreso = {
                codEstab: this.data.codEstab,
                idCliente: this.data.idCliente,
                total: this.cobro.valorAbono,
                abono: this.cobro.abono
            };
    
            let data = {
                comprobanteIngreso,
                cobros: this.setListaAbono()
            };
            
            showLoader();       
            
            const url = `/ComprobanteIngreso/PostFast?idTipoDoc=${this.TIPO_DOC.idTipoDocumento}&idComprobante=${this.data.id}`;
            this._mS.getData('post', url, data).then(response => {
                if (response.id == "0") {
                    hideLoader(); 
                    Swal.fire({
                        title:`<small>${response.titleSms}</small>`,
                        icon: 'warning',
                        html: `<small>${response.message}</small>`
                    });
                    return
                }
                if (response.id == "1") {
                    hideLoader(); 
                    Swal.fire({
                        icon: 'success',
                        html: `<small>${response.message}</small>`,
                        timer: 1000
                    });
                    this.$uibModalInstance.close(response);                    
                }
            })
            
        } catch (error) {
            toastr.error(error)
        }
        
    }


    setListaAbono() {
        return [{
            entidad: this.entidadFinanciera.descripcion,
            subEntidad: this.subEntidad.descripcion,
            idEntidadFinanciera: this.entidadFinanciera.idEntidadFinanciera,
            idSubEntidadFinanciera: this.subEntidad.idSubEntidadFinanciera,
            idBanco: this._fS.campo(this.banco.idBanco) ? 0 : this.banco.idBanco,
            idCuentaBancaria: this._fS.campo(this.cuentaBancaria.idCuentaBancaria) ? 0 : this.cuentaBancaria.idCuentaBancaria,
            idTipoDocumento: this.TIPO_DOC.idTipoDocumento,
            idComprobante: this.data.id,
            fechaEmision: this.cobro.fechaEmision,
            nro: this._fS.campo(this.cobro.nro) ? null : this.cobro.nro,
            valor: Number(this.cobro.valor),
            abono: Number(this.cobro.abono),
            vuelto: this.cobro.valorCambio,
            posFechado: this.cobro.posFechado,
            secuencial: 1,
            lote: this._fS.campo(this.cobro.lote) ? null : this.cobro.lote,
            aprobacion: this._fS.campo(this.cobro.aprobacion) ? null : this.cobro.aprobacion,
            referencia: this._fS.campo(this.cobro.referencia) ? null : this.cobro.referencia,
            idCiudad: this._fS.campo(this.cobro.idCiudad) ? 0 : this.cobro.idCiudad,
            controlCaja: this.subEntidad.controlCaja,

            codEstab: this.data.codEstab
        }];
    }


    closeModal(){
        this.$uibModalInstance.close();
    }

}














export class ModalCobroDocumentoCtrl extends ModalCobroCtrl{
    static $inject = [
        '$scope',         
        '$timeout',
        '$uibModalInstance',
        'mainService',
        'commonService',
        'modalService',
        'nombreModal',
        'toastService', 
        'formulario', 
        'params'
    ]
    constructor($scope, $timeout, $uibModalInstance, _mS, _commonSvc, _modalSvc, _nombreModal, _tS, _fS, _params){
        super({$scope, $timeout, $uibModalInstance, _mS, _commonSvc, _tS, _fS})
       
        this._modalSvc         = _modalSvc;
        this._nombreModal      = _nombreModal;        
    
        this.NUM_MAX_ROUND     = 5; //Número Máximo de redondeo         
        
        this.data              = {};
        this.data.totalCobro  = 0;
        this.data.valorCambio = 0;
        this.data.abonoPosfechado = 0;

        this.entidadFinanciera = {};
        this.subEntidad        = {};
        this.cuentaBancaria    = {};
        this.banco             = {};

        let {TIPO_DOC, data} = _params;

        this.TIPO_DOC = TIPO_DOC;
        this.data = data;

        this.selectedDocumentos = [];
        this.abonoEntidadesFinancieras = [];

        this.cuotasAfectados = []

    }

    async $onInit(){   
        
        try {
            showLoader();
            let json = {
                idCliente: this.data.idCliente,
                codEstab: this.data.codEstab
            }
            
            let results = await Promise.all([
                this._mS.getData('get', `/CuotaXCobrar/GetCuotaForPayment?idComprobante=${this.data.id}&idTipoDocumento=${this.TIPO_DOC.idTipoDocumento}`),
                this._mS.getData('get', '/GestionFinanciera/GetChargeForDocument?json=' + JSON.stringify(json))
            ])

            for(let response of results){
                if(typeof response==='object' && response.id==='0'){
                    toastr.warning(response.message, response.titleSms);                        
                }
            }


            this.selectedDocumentos = [{
                nroDocumento: this.data.nroDocumento,
                tipoDocumento: this.TIPO_DOC.codigo,
                fechaEmision: this.data.fechaEmision,
                total: this.data.total,
                showCuota: true,
                cuotas: results[0].data,                
                cuotaOriginal: JSON.parse(JSON.stringify(results[0].data))
            }]
            
            this.documentos = results[1].data
            
            this.paymentStepDos();                      
            
            this.$scope.$apply();
            
        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }
    }
    
    paymentStepDos() {
        this.footerActionStepDos = true;

        $("#paymentStep a:last-child").addClass('active');
        $("#content-cuotas").show();
        this.data.abonoPosfechado = 0;
        this.data.totalCobro = 0;
        this.data.valorCambio = 0;
        this.getTotalesCuotas();        
    }

    getTotalesCuotas() {
        let total = 0, totalAbonoAnterior = 0, totalAbonoPosf = 0, saldo = 0, totalAbono = 0;

        let groupCuotas = this.selectedDocumentos.flatMap(item=>item.cuotas);

        for(let item of groupCuotas){
            total              += item.cxc.cuota;
            totalAbonoAnterior += item.abono;
            totalAbonoPosf     += item.abonoPosfechado;
            saldo              += item.saldo;
        }
        

        this.data.total              = this._fS.roundNumber(total, this.NUM_MAX_ROUND);
        this.data.totalAbonoAnterior = this._fS.roundNumber(totalAbonoAnterior, this.NUM_MAX_ROUND)
        this.data.saldo              = this._fS.roundNumber(saldo, this.NUM_MAX_ROUND);
        this.data.saldoOriginal      = this._fS.roundNumber(saldo, this.NUM_MAX_ROUND);
        this.data.abono              = 0;
        this.data.abonoPosfechado    = 0;
        this.data.abonoTotal         = 0;
        this.data.valorCambio        = 0;


    }


    async openModalFormaCobro() {
       
        try {
            if(this.data.saldo===0){
                this._fS.sweetAlert('warning', 'No hay cuotas pendientes!')
                return
            }


            let {MODAL_FILE_FORMA_COBRO, MODAL_FORMA_COBRO} = this._nombreModal.cobro;
            let controller = (await import('./../../../' + MODAL_FILE_FORMA_COBRO))[MODAL_FORMA_COBRO['controller']];
            let template   = MODAL_FORMA_COBRO['template'];
    
            let params = {
                data: this.data,
                abonoEntidadesFinancieras: this.abonoEntidadesFinancieras || [],
                documentos: this.documentos,
                isPaymentDocument: true,            
                referencia: this.data.nombreFiscal
            }
            
            let $modalRef = this._modalSvc.openModalCustom({
                controller,
                template,
                size:'xl',
                params
            })

            $modalRef.result.then(result=>{
                console.log(result)
                if(typeof result!=='object') return
                
                this.dataAbono = result;
               
                ModalCobroCtrl.setValorAbono = result.valor;
               
                this.agregarFormaCobro(result.secuencial, result.posFechado);               
                
                this.getValorAbonoFormaPago(result.secuencial);
                
                this.calculoTotales();
                
                this._tS.toastr('success', 'Abono Agregado Correctamente');
            })
        } catch (error) {
            console.log(error)
        }finally{
            
        }      
    }


    getValorCambio() {
        let valorCambio = 0;
        
        if (this.data.abonoTotal >= this.data.saldoOriginal) {
            valorCambio = this.data.abonoTotal - this.data.saldoOriginal;
        }
        
        return this._fS.roundNumber(valorCambio, this.NUM_MAX_ROUND);
    }

    


    setListaAbono(valorAbono) {
        this.listaAbonos.push({
            entidad               : this.entidadFinanciera.descripcion,
            subEntidad            : this.subEntidad.descripcion,
            idEntidadFinanciera   : this.entidadFinanciera.idEntidadFinanciera,
            idSubEntidadFinanciera: this.subEntidad.idSubEntidadFinanciera,
            idBanco               : this._form.campo(this.banco.idBanco) ? 0 : this.banco.idBanco,
            idCuentaBancaria      : this._form.campo(this.cuentaBancaria.idCuentaBancaria) ? 0 : this.cuentaBancaria.idCuentaBancaria,
            valor                 : Number(this.cobro.valorAbono),
            posFechado            : this.cobro.posFechado,
            fechaEmision          : new Date(this.cobro.fechaEmision),
            nro                   : this._form.campo(this.cobro.nro) ? null : this.cobro.nro,
            referencia            : this._form.campo(this.cobro.referencia) ? null : this.cobro.referencia,
            aprobacion            : this._form.campo(this.cobro.aprobacion) ? null : this.cobro.aprobacion,
            lote                  : this._form.campo(this.cobro.lote) ? null : this.cobro.lote,
            idCiudad              : this._form.campo(this.cobro.idCiudad) ? 0 : this.cobro.idCiudad,
            secuencial            : this.listaAbonos.length + 1,
            abono                 : valorAbono,
            controlCaja           : this.subEntidad.controlCaja,

            tipoDocumento         : this._form.campo(this.cobro.tipoDocumento) ? null : this.cobro.tipoDocumento,
            idTipoDocumento       : this._form.campo(this.cobro.idTipoDocumento) ? 0 : this.cobro.idTipoDocumento,
            idComprobante         : this._form.campo(this.cobro.idComprobante) ? 0 : this.cobro.idComprobante,
        });
    }

    viewCuotaAbono(data) {
        this.viewCuotaAbonos = this.cuotasAfectados.filter(val => val.cobroDetalle.idCuotaXCobrar === data.cxc.idCuotaXCobrar);
    }
    
    
     //Eliminar Pago 
     async askToDeleteAbono(item) {
        let {isConfirmed} = await Swal.fire({
            icon: 'warning',
            html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            showCancelButton: true,
            cancelButtonText: 'No, cancelar',
            allowOutsideClick: false
        })

        if (isConfirmed) {
            
            

            this.$scope.$apply(()=>{


                let secuencial = 0, total = 0, totalAbonoAnterior = 0, saldo = 0; 
            
                this.cuotasAfectados = []; //Reset todas las cuotas afectadas            
                
                this.abonoEntidadesFinancieras.splice(this.abonoEntidadesFinancieras.indexOf(item), 1); //Eliminamos abono agregado                         
                
                
                //Todas las cuotas en su estado original 
                for (let i = 0; i < this.selectedDocumentos.length; i++) {
                
                    this.selectedDocumentos[i].cuotas = JSON.parse(JSON.stringify(this.selectedDocumentos[i].cuotaOriginal));
                
                    for (let val of this.selectedDocumentos[i].cuotaOriginal) {
                        total              += val.cxc.cuota;
                        totalAbonoAnterior += val.abono;
                        saldo              += val.saldo;
                    }
                }

                this.data.total              = this._fS.roundNumber(total, 5);
                this.data.totalAbonoAnterior = this._fS.roundNumber(totalAbonoAnterior, 5)
                this.data.saldo              = this._fS.roundNumber(saldo, 5);
                this.data.saldoOriginal      = this._fS.roundNumber(saldo, 5);
                this.data.abono              = 0;
                this.data.abonoPosfechado    = 0;
                this.data.abonoTotal         = 0;
                this.data.valorCambio        = 0;
                
                
                if (this.abonoEntidadesFinancieras.length == 0) return
                
                //Recalculamos las cuotas con los abonos restantes   
                for (var i = 0; i < this.abonoEntidadesFinancieras.length; i++) {
                    secuencial++;
                    ModalCobroCtrl.setValorAbono = this.abonoEntidadesFinancieras[i].valor //Set valor de abono 
                    this.agregarFormaCobro(secuencial, this.abonoEntidadesFinancieras[i].posFechado);
                }
                
                
                this.calculoTotales();



            });
        }

    }


    //Guardar Cobro
    async onSave(){

        try {
            if (this.abonoEntidadesFinancieras.length === 0) {
                this._tS.toastr('warning', 'Agregue al menos un Cobro', 'Cobro');
                return
            }
    
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger ml-2'
                },
                buttonsStyling: false
            })
              
            let {isConfirmed} = await  swalWithBootstrapButtons.fire({
                //title: '<small>Guardar Comprobante</small>',
                html: "<small>Esta seguro/a de guardar este Comprobante Ingreso?</small>",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: false,
                allowOutsideClick: false            
            })

            if(isConfirmed){
                
                showLoader();
                let comprobanteIngreso = {
                    codEstab: this.data.codEstab,
                    idCliente: this.data.idCliente,                
                    total: this.abonoEntidadesFinancieras.map(val=>val.valor).reduce((acc, curr)=>acc + curr, 0),
                    abono: this.abonoEntidadesFinancieras.map(val=>val.abono).reduce((acc, curr)=>acc + curr, 0)
                }

                let data = {
                    comprobanteIngreso,
                    cobros: this.abonoEntidadesFinancieras,
                    cobroDetalles: this.cuotasAfectados
                }


                
                let url = `/ComprobanteIngreso/Insert?idTipoDocumento=${this.TIPO_DOC.idTipoDocumento}&idComprobante=${this.data.id}`;
                await this._mS.getData('post', url, data).then(response => {
                    if (response.code === "0") {                        
                        this._fS.sweetAlert('warning', response.message, response.titleSms);                                    
                    }
                    if (response.code === "1") {                        
                        this._fS.sweetAlert('success', response.message, response.titleSms, 1000);                    
                        this.$uibModalInstance.close(response)                                
                    }
                })
            }

        } catch (error) {
            console.log(error)
        }finally{
            hideLoader();
        }

    }
    

    closeModal(){
        this.$uibModalInstance.close();
    }



}

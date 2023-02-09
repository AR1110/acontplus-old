export class ModalPagoDocumentoCtrl {
    static $inject = ['$http', '$timeout', '$mdBottomSheet', '$uibModalInstance', 'mainService', 'modalService', 'nombreModal', 'formulario', 'params']
    constructor($http, $timeout, $mdBottomSheet, $uibModalInstance, _mS, _modalSvc, _nombreModal, _form, _params) {
      this.$http = $http;
      this.$timeout = $timeout;
      this.$uibModalInstance = $uibModalInstance;
      this.$mdBottomSheet = $mdBottomSheet;

      this._mS = _mS;
      this._modalSvc = _modalSvc;
      this._nombreModal = _nombreModal;
      this._form = _form;
      
      let {TIPO_DOC, data} = _params;

      this.TIPO_DOC = TIPO_DOC;
      this.data = data;
      this._params = _params;
  
      this.documentos = [];
      this.pago = {};     
  
      this.cuotasAfectados = [];
      this.abonoEntidadesFinancieras = [];
  
  
    }
  
    static set setValorAbono(valorAbono) {
      this.valorAbono = valorAbono;
    }
  
    static get getValorAbono() {
      return this.valorAbono;
    }
  
    async $onInit() {   
        try {
            const results = await Promise.all([
                this._mS.getData('get',`/CuotaXPagar/GetForPay?idComprobante=${this.data.id}&idTipoDocumento=${this.TIPO_DOC.idTipoDocumento}`),
                this._mS.getData('get', `/GestionFinanciera/GetPaymentForDocument?idProveedor=${this.data.idProveedor}`)
            ])
            
            console.log(results)

            for(let item of results){
                if(item.id==="0"){
                    this._form.sweetAlert('warning', item.message, item.titleSms);      
                }
            }
      
            if (results[0].id === "1") {
                this.selectedDocs = [{
                    nroDocumento: this.data.nroDocumento,
                    tipoDocumento: this.TIPO_DOC.codigo,
                    fechaEmision: this.data.fechaEmision,
                    total: this.data.total,
                    cuotas:  results[0].data,
                    cuotaOriginal: JSON.parse(JSON.stringify(results[0].data)),
                    display: true
                }];
      
                //lista de documentos(retenciones) para el pago 
                this.documentos = results[1].data;
                this.getTotalesCuotas();
            }
      
            this.$uibModalInstance.rendered.then(() => {
                this.paymentStepDos();
            })
        } catch (error) {
            console.log(error)
        }
  
    }
  
    paymentStepDos() {
      $("#newPaymentForm-head-1").removeClass('active');
      $("#newPaymentForm-step-1").hide();
      $("#newPaymentForm-step-2").show();
      $("#newPaymentForm-head-2").addClass('active');
    }
  
    getTotalesCuotas() {
      let total = 0,
        totalAbonoAnterior = 0,
        saldo = 0;
  
      for (let i = 0; i < this.selectedDocs.length; i++) {
        for (let val of this.selectedDocs[i].cuotas) {
          total += val.cxp.cuota;
          totalAbonoAnterior += val.abono;
          saldo += val.saldo;
        }
      }
      this.data.total = this._form.roundNumber(total, 5);
      this.data.totalAbonoAnterior = this._form.roundNumber(totalAbonoAnterior, 5)
      this.data.saldo = this._form.roundNumber(saldo, 5);
      this.data.saldoOriginal = this._form.roundNumber(saldo, 5);
      this.data.abono = 0;
      this.data.abonoPosfechado = 0;
      this.data.abonoTotal = 0;
      this.data.valorCambio = 0;
    }
  
    displayCuota(data) {
      data.display = !data.display;
    }
  
    async nuevoFormaPago() {
        if (this.data.saldo == 0) {
            this._form.sweetAlert('warning', 'No hay cuotas pendientes.')
            return
        }
  
        const params = {
            data: this.data,
            tituloModal: 'Forma de Pago',
            abonoEntidadesFinancieras: this.abonoEntidadesFinancieras || [],
            documentos: this.documentos,
            isPaymentDocument:true,
            typePayment: 'P',
            referencia: this.data.proveedor
        }

        let {MODAL_FILE_FORMA_PAGO, MODAL_FORMA_PAGO} = this._nombreModal.pago;
        let controller = (await import('./../../../' + MODAL_FILE_FORMA_PAGO))[MODAL_FORMA_PAGO['controller']];
        let template   = MODAL_FORMA_PAGO['template'];

        let $modalRef = this._modalSvc.openModalCustom({
            controller,
            template,
            size:'xl',
            params
        })
  
        $modalRef.result.then(result => {
            if (typeof result !== 'object') return
            this.dataAbono = result;
            ModalPagoDocumentoCtrl.setValorAbono = result.valor;
            this.agregarFormaPago(result.secuencial, result.posFechado);
            this.getValorAbonoFormaPago(result.secuencial);
            this.calculoTotales();
            toastr.success('Abono Agregado Correctamente');
        })
    }
  
    agregarFormaPago(secuencial, isPosFechado) {
      let valorAbono = 0;
      for (var i = 0; i < this.selectedDocs.length; i++) {
        for (var val of this.selectedDocs[i].cuotas) {
          valorAbono = ModalPagoDocumentoCtrl.getValorAbono //Recuperamos el valor del Pago                
          if (valorAbono === 0) return;
  
          //Si la Cuota no tiene Ninguna Pago
          if ((val.cxp.cuota === val.saldo) && (val.abono === 0 || val.abonoPosfechado === 0)) {
            this.cuotaSinAbono(val, valorAbono, secuencial, isPosFechado);
  
            //Si la Cuota tiene mas de un Pago 
          } else if (val.cxp.cuota !== val.saldo && val.saldo > 0) {
            this.cuotaTieneAbono(val, valorAbono, secuencial, isPosFechado);
          }
          val.cxp.cuota = this._form.roundNumber(val.cxp.cuota, 5);
          val.abono = this._form.roundNumber(val.abono, 5);
          val.abonoPosfechado = this._form.roundNumber(val.abonoPosfechado, 5);
          val.saldo = this.verificarEstadoSaldo(val) //Verificamos el saldo de la Cuota 
          val.estadoFinanciero = this.verificarEstadoPago(val);
          val.cuotaAfectado = true;
        }
      }
    }
  
  
  
    //Si la cuota no tiene ningun Pago 
    cuotaSinAbono(val, valorAbono, secuencial, isPosFechado) {
      //Si el valor Pago es menor al saldo 
      if (val.saldo >= valorAbono) {
        val.abono = isPosFechado ? 0 : valorAbono; //Si el pago no es Posfechado
        val.abonoPosfechado = isPosFechado ? valorAbono : 0; //Si el Pago es Posfechado 
        val.saldo -= valorAbono;
        ModalPagoDocumentoCtrl.setValorAbono = 0; //Set valor Abono en 0
        this.setPagoCuota(val, valorAbono, secuencial, isPosFechado);
  
        //Si el valor Pago es mayor al saldo 
      } else if (val.saldo <= valorAbono) {
        val.abono = isPosFechado ? 0 : val.cxp.cuota; //Si el pago no es Poserfechado;
        val.abonoPosfechado = isPosFechado ? val.cxp.cuota : 0; //Si el Pago es Posfechado ;
        val.saldo = valorAbono -= val.saldo;
  
        ModalPagoDocumentoCtrl.setValorAbono = valorAbono; //Set valor Abono restante
        this.setPagoCuota(val, val.cxp.cuota, secuencial, isPosFechado);
      }
    }
  
    //cuando una cuota tiene mas de un abono;
    cuotaTieneAbono(val, valorAbono, secuencial, isPosFechado) {
      let resultAbono = 0;
      //si el valor pago es menor al saldo 
      if (val.saldo >= valorAbono) {
        if (isPosFechado) {
          val.abonoPosfechado = valorAbono + val.abonoPosfechado;
        } else {
          val.abono = valorAbono + val.abono;
        };
        val.saldo = val.saldo - valorAbono;
        ModalPagoDocumentoCtrl.setValorAbono = 0; //Set valor Abono en 0
  
        this.setPagoCuota(val, valorAbono, secuencial, isPosFechado);
  
        //si el valor abono es mayor al saldo 
      } else if (val.saldo <= valorAbono) {
        if (isPosFechado) {
          val.abonoPosfechado = val.abonoPosfechado + val.saldo;
        } else {
          val.abono = val.abono + val.saldo;
        }
        resultAbono = valorAbono -= val.saldo;
        valorAbono = this._form.roundNumber(resultAbono, 5);
        ModalPagoDocumentoCtrl.setValorAbono = valorAbono //Set valor Abono en 0
        this.setPagoCuota(val, val.saldo, secuencial, isPosFechado);
      }
    }
  
    setPagoCuota(val, valor, secuencial, isPosfechado) {
      if (val.cxp.cuota !== 0) {
        this.cuotasAfectados.push({
          detalle: {
            idCuotaXPagar: val.cxp.idCuotaXPagar,
            abono: this._form.roundNumber(valor, 5),
          },
          cuota: this._form.roundNumber(val.cxp.cuota, 5),
          saldo: this.verificarEstadoSaldo(val),
          isPosfechado,
          secuencial
        });
      }
    }
  
    verificarEstadoPago(cuota) {
      let estado = '';
      if (cuota.cxp.cuota === (cuota.abono + cuota.abonoPosfechado)) estado = 'Pagada';
      if (cuota.saldo > 0) estado = "Pendiente Parcial";
      if (cuota.cxp.cuota === cuota.saldo) estado = "Pendiente";
  
      return estado
    }
  
  
    verificarEstadoSaldo(val) {
      let total = val.abono + val.abonoPosfechado;
      return this._form.roundNumber(total, 5) === this._form.roundNumber(val.cxp.cuota, 5) ? 0 : this._form.roundNumber(val.saldo, 5);
    }
  
    getValorAbonoFormaPago(secuencial) {
      let abono = this.cuotasAfectados.filter(val => val.secuencial == secuencial)
        .map(val => val.detalle.abono)
        .reduce((prev, curr) => prev + curr, 0);
  
  
      this.dataAbono.abono = abono
      this.abonoEntidadesFinancieras.push(this.dataAbono)
  
    }
  
    calculoTotales() {
      const abonoTotal = this.abonoEntidadesFinancieras.map(val => val.valor).reduce((prev, curr) => prev + curr, 0)
      const abono = this.abonoEntidadesFinancieras.filter(item => !item.posFechado)
                                                  .map(val => val.valor)
                                                  .reduce((prev, curr) => prev + curr, 0);
      const abonoPosfechado = this.abonoEntidadesFinancieras.filter(item => (item.posFechado))
                                                            .map(val => val.valor)
                                                            .reduce((prev, curr) => prev + curr, 0);
  
      const valorSaldo = this.selectedDocs.flatMap(item => item.cuotas)
                                          .map(val => val.saldo)
                                          .reduce((prev, curr) => prev + curr, 0);
  
  
      this.data.abonoTotal = this._form.roundNumber(abonoTotal, 5);
      this.data.abono = this._form.roundNumber(abono, 5);
      this.data.abonoPosfechado = this._form.roundNumber(abonoPosfechado, 5)
      this.data.saldo = this._form.roundNumber(valorSaldo, 5);
      this.data.valorCambio = this.getValorCambio();
  
    }
  
    getValorCambio() {
      let valorCambio = 0;
      if (this.data.abonoTotal >= this.data.saldoOriginal) {
        valorCambio = this.data.abonoTotal - this.data.saldoOriginal;
      }
      return this._form.roundNumber(valorCambio, 5);
    }
  
    //Eliminar Pago 
    async eliminarAbonoEntidad(item) {
      let {
        isConfirmed
      } = await Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar este Abono ahora?`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false
      })
  
      if (isConfirmed) {
        this.$timeout(() => {
          this.execDelete(item)
        })
      }
  
    }
  
    execDelete(item) {
      let secuencial = 0,
        total = 0,
        totalAbonoAnterior = 0,
        saldo = 0;
      this.cuotasAfectados = []; //Reset todas las cuotas afectadas            
      this.abonoEntidadesFinancieras.splice(this.abonoEntidadesFinancieras.indexOf(item), 1); //Eliminamos abono agregado                         
  
      //Todas las cuotas en su estado original 
      for (var i = 0; i < this.selectedDocs.length; i++) {
        this.selectedDocs[i].cuotas = JSON.parse(JSON.stringify(this.selectedDocs[i].cuotaOriginal));
        for (var val of this.selectedDocs[i].cuotaOriginal) {
          total += val.cxp.cuota;
          totalAbonoAnterior += val.abono;
          saldo += val.saldo;
        }
      };
  
      this.data.total = this._form.roundNumber(total, 5);
      this.data.totalAbonoAnterior = this._form.roundNumber(totalAbonoAnterior, 5)
      this.data.saldo = this._form.roundNumber(saldo, 5);
      this.data.saldoOriginal = this._form.roundNumber(saldo, 5);
      this.data.abono = 0;
      this.data.abonoPosfechado = 0;
      this.data.abonoTotal = 0;
      this.data.valorCambio = 0;
  
      if (this.abonoEntidadesFinancieras.length == 0) return
  
      //Recalculamos las cuotas con los abonos restantes   
      for (var i = 0; i < this.abonoEntidadesFinancieras.length; i++) {
        secuencial++;
        ModalPagoDocumentoCtrl.setValorAbono = this.abonoEntidadesFinancieras[i].valor //Set valor de abono 
        this.agregarFormaPago(secuencial, this.abonoEntidadesFinancieras[i].posFechado);
      }
      this.calculoTotales();
    }
  
  
     //Guardar Pago
    async askToSave() {
      if (this.abonoEntidadesFinancieras.length === 0) {
        Swal.fire({
          icon:'warning',
          html:`<small>Agregue al menos un Pago</small>`,     
        })
        return
      }
  
      let {isConfirmed} = await Swal.fire({
          icon: 'warning',
          html: `<small>Esta seguro/a de guardar este pago ahora?`,
          showConfirmButton: true,
          confirmButtonText: 'Si, Guardar',
          showDenyButton: true,
          denyButtonText: 'No, cancelar',
          allowOutsideClick: false
      })
      
      if (isConfirmed) {
        this.savePayment();
      }
    }
    
    savePayment() { 
      try {
          const comprobanteEgreso = {
            codEstab: this.data.codEstab,
              idProveedor: this.data.idProveedor,
              total: this.data.abonoTotal
          }   
          
          const data = {
            comprobanteEgreso,
            pagos: this.abonoEntidadesFinancieras,
            pagoDetalle: this.cuotasAfectados
          }
          
          showLoader()
          this.$http.post(`/ComprobanteEgreso/Post?idTipoDocumento=${this.TIPO_DOC.idTipoDocumento}&idComprobante=${this.data.id}`, data)
          .then(({data:response})=>{
            if(response.id==='0'){
              hideLoader();
              Swal.fire({
                icon:'warning',
                title:`<small>${response.titleSms}</small>`,
                html:`<small>${response.message}</small>`
              })
              return
            }
            if(response.id==='1'){
              hideLoader();
              Swal.fire({
                icon:'success',
                title:`<small>${response.titleSms}</small>`,
                html:`<small>${response.message}</small>`,
                timer:1000
              })
              this.$uibModalInstance.close(response)
            }
          })                        
      } catch (error) {
        hideLoader();
          toastr.error(error)
      }           
      
  }
  
  
  
  
  
  
    closeModal() {
      this.$uibModalInstance.close()
    }
  
  
  
  
  
  }
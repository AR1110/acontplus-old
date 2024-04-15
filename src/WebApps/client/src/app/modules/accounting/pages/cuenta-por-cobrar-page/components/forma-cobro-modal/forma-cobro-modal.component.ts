import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubEntidadFinancieraComponent } from './components/sub-entidad-financiera/sub-entidad-financiera.component';
import { ValorAbonoComponent } from './components/valor-abono/valor-abono.component';
import { FechaEmisionComponent } from './components/fecha-emision/fecha-emision.component';
import { BancoSelectComponent } from './components/banco-select/banco-select.component';
import { roundNumber } from '@core/utils/round-number.utils';
import { PaymentTypeCode } from '@modules/accounting/enums/accounting.constants';
import { isValidField } from '@core/utils/utils';
import { formatDateMoment } from '@core/utils/format-date-moment';

@Component({
  selector: 'app-forma-cobro-modal',
  standalone: true,
  imports: [
    NgbAccordionModule,
    FormsModule,
    SubEntidadFinancieraComponent,
    ValorAbonoComponent,
    FechaEmisionComponent,
    BancoSelectComponent
  ],
  templateUrl: './forma-cobro-modal.component.html',
  styles: ``
})
export class FormaCobroModalComponent {
  @Input() params = {
    dataFormaCobro: {} as any,
    comprobante: {
      razonSocialComprador: null
    },
    saldo: 0,
    datosCobro: []
  }

  modal = inject(NgbActiveModal);
  tS = inject(ToasterService)

  VALOR_ABONO_ORIGINAL = 0;

  data = {
    posFechado: false,
    idEntidadFinanciera: 0,
    idSubEntidadFinanciera: 0,
    valorAbono: 0,
    idBanco: 0,
    idCiudad: 0,
    referencia: null,
    nro: null,
    lote: null,
    aprobacion: null,
    fechaEmision: new Date()
  }

  comprobante = {
    razonSocialComprador: null
  }

  entidadesFinanciera: any[] = [];
  subEntidadesFinanciera: any[] = []
  bancos: any[] = []
  ciudades: any[] = []
  documentosElectronicos = [];

  selectedDocElectronico = []

  selectedIndexTab = 0;

  loadInitialData() {
    try {
      let { documentos, entidadesFinanciera, bancos, ciudades } = this.params.dataFormaCobro;
      this.comprobante = this.params.comprobante;
      this.entidadesFinanciera = entidadesFinanciera;


      this.bancos = bancos;
      this.ciudades = ciudades;

      this.documentosElectronicos = documentos;
      //  this.onChangeTabEntidadFinanciera(selectedIndexTab)
    } catch (error) {
      console.log(error)
    }
  }

  ngOnInit() {
    let { dataFormaCobro, comprobante, saldo, datosCobro } = this.params;
    this.VALOR_ABONO_ORIGINAL = roundNumber(saldo, 3);
    this.loadInitialData()
  }

  onChangeTabEntidadFinanciera($index: number) {

    try {
      const { descripcion, idEntidadFinanciera, codigo, subEntidadesFinanciera } = this.entidadesFinanciera.at($index);
      const el = document.getElementById('btnAddFormaPago');

      // Controlar la visibilidad del botón en función del código de la entidad financiera
      if (el) {
        el.style.display = codigo === 'DOC' ? 'none' : 'block';
      }

      this.subEntidadesFinanciera = subEntidadesFinanciera;
      this.data.idEntidadFinanciera = idEntidadFinanciera;

      // Establecer valores predeterminados para ciertos campos
      this.data.valorAbono = this.VALOR_ABONO_ORIGINAL;
      this.data.idBanco = 0;
      this.data.idCiudad = 0;
      this.data.referencia = codigo === 'CHE' ? this.comprobante.razonSocialComprador : null;
      this.data.nro = null;
      this.data.lote = null;
      this.data.aprobacion = null;
      this.data.posFechado = false;
      this.selectedDocElectronico = [];
      this.data.fechaEmision = new Date();

      if (this.subEntidadesFinanciera.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: `${descripcion}: No tiene SubEntidad Financiera creada`
        });
      } else {
        this.data.idSubEntidadFinanciera = this.subEntidadesFinanciera[0].idSubEntidadFinanciera;
      }

    } catch (error) {
      console.log(error);
    }
  }

  isValidData() {
    let paymentTypeCode = this.entidadesFinanciera.find(e => e.idEntidadFinanciera === this.data.idEntidadFinanciera).codigo;
    let { nro, referencia, aprobacion, idCiudad, idBanco, lote } = this.data;

    if (!(this.data.idSubEntidadFinanciera > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione la SubEntidad Financiera'
      })
      return
    }


    if (!(Number(this.data.valorAbono) > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese el valor de abono'
      })
      return
    }

    // =================== TARJETA DE CREDITO / DEBITO  =================================== //
    if (paymentTypeCode === PaymentTypeCode.TAR) {
      // if (!isValidField(nro)) {
      //   this.tS.toastr({
      //     type: 'warning',
      //     message: 'Ingrese el Número'
      //   })
      //   return
      // }

      // if (!(idBanco && idBanco > 0)) {
      //   this.tS.toastr({
      //     type: 'warning',
      //     message: 'Seleccione la ciudad'
      //   })
      //   return
      // }
      // if (!isValidField(referencia)) {
      //   this.tS.toastr({
      //     type: 'warning',
      //     message: 'Ingrese la referencia'
      //   })
      //   return
      // }
      // if (!isValidField(aprobacion)) {
      //   this.tS.toastr({
      //     type: 'warning',
      //     message: 'Ingrese la Aprobación'
      //   })
      //   return
      // }
      // if (!isValidField(lote)) {
      //   this.tS.toastr({
      //     type: 'warning',
      //     message: 'Ingrese el Lote'
      //   })
      //   return
      // }
    }

    // =================== TRANSFERENCIAS  =================================== //

    if (paymentTypeCode === PaymentTypeCode.TRA) {
      if (!(idBanco && idBanco > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Banco'
        })
        return
      }
      if (!isValidField(nro)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese el Número'
        })
        return
      }
    }

    // =================== CHEQUES  =================================== //

    if (paymentTypeCode === PaymentTypeCode.CHE) {
      if (!(idBanco && idBanco > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Banco'
        })
        return
      }
      if (!isValidField(nro)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese el Número'
        })
        return
      }

      if (!(idCiudad && idCiudad > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione la ciudad'
        })
        return
      }

      if (!isValidField(referencia)) {
        if (!(idBanco && idBanco > 0)) {
          this.tS.toastr({
            type: 'warning',
            message: 'Ingrese la referencia'
          })
          return
        }
        return
      }
    }

    return true;
  }

  addPaymentType() {
    try {
      if (!this.isValidData()) throw 'Form Invalid';

      this.modal.close(this.getDataPago());

    } catch (error) {
      console.log(error)
    }

  }


  getDataPago(item: any = {}) {
    try {
      let entidadFinanciera = this.entidadesFinanciera.find(item => item.idEntidadFinanciera === this.data.idEntidadFinanciera);
      let subEntidadFinanciera = entidadFinanciera.subEntidadesFinanciera.find((item: any) => item.idSubEntidadFinanciera === this.data.idSubEntidadFinanciera);

      let ciudad = this.ciudades.find(item => item.idCiudad === this.data.idCiudad);
      let banco = this.bancos.find(item => item.idBanco === this.data.idBanco);

      let formattedDateTime = formatDateMoment(this.data.fechaEmision);
      let obj = {
        //Info
        entidadFinanciera: entidadFinanciera.descripcion,
        subEntidadFinanciera: subEntidadFinanciera.descripcion,

        ciudad: ciudad && ciudad.descripcion,
        banco: banco && banco.descripcion,

        //Data
        idEntidadFinanciera: entidadFinanciera.idEntidadFinanciera,
        idSubEntidadFinanciera: subEntidadFinanciera.idSubEntidadFinanciera,
        codEntidadFinanciera: entidadFinanciera.codigo,
        idBanco: this.data.idBanco,
        idCiudad: this.data.idCiudad,
        fechaEmision: formattedDateTime,
        posFechado: this.data.posFechado,
        referencia: this.data.referencia,
        aprobacion: this.data.aprobacion,
        lote: this.data.lote,

        //Data Documento
        nro: item.serieComprobante || this.data.nro,
        idTipoDocumento: item.idTipoDocumento,
        idComprobante: item.idDocumento,
        tipoDocumento: item.tipoDocumento || item.codDoc,
        valorAbono: item.saldo || this.data.valorAbono,
        controlCaja: subEntidadFinanciera.controlCaja
      }
      return obj;
    } catch (error) {
      console.log(error);
      return {}
    }
  }


}

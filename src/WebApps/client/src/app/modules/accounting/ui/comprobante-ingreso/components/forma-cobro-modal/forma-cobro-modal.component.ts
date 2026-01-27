import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { roundNumber } from '@core/utils/round-number.utils';
import { PaymentTypeCode } from '@accounting/shared/enums/accounting.constants';
import { isValidField } from '@core/utils/utils';
import { PaymentSubType, PaymentType } from '@accounting/shared/models/payment-type.model';
import { PaymentData } from '@accounting/data/models/comprobante-ingreso';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';

import Swal from 'sweetalert2';

import { Button } from '@acontplus/ng-components';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

export const _filter = (opt: any[], value: string): string[] => {
  console.log(opt);
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.descripcion.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-forma-cobro-modal',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    Button,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './forma-cobro-modal.component.html',
  styles: ``,
})
export class FormaCobroModalComponent implements OnInit {
  // @Input() params = {
  //   dataFormaCobro: {} as any,
  //   comprobante: {
  //     razonSocialComprador: null,
  //   },
  //   saldo: 0,
  //   multiplesPaymentType: [],
  // };
  params = inject(MAT_DIALOG_DATA);
  _formBuilder = inject(FormBuilder);

  modal = inject(MatDialogRef<FormaCobroModalComponent>);
  tS = inject(ToastrNotificationService);

  ciudadesGroupOptions!: Observable<any[]>;
  ciudadForm = this._formBuilder.group({
    ciudadGroup: '',
  });

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
    fechaEmision: new Date(),
  };

  comprobante = {
    razonSocialComprador: null,
  };

  entidadesFinanciera: PaymentType[] = [];
  subEntidadesFinanciera: PaymentSubType[] = [];
  bancos: any[] = [];
  ciudades: any[] = [];
  documentosElectronicos: any[] = [];

  selectedDocElectronico = [];

  selectedIndexTab = 0;

  agruparPorProvincia(ciudades: any) {
    const provincias: any = {};
    ciudades.forEach(function (ciudad: any) {
      if (!provincias[ciudad.provincia]) {
        provincias[ciudad.provincia] = [];
      }
      provincias[ciudad.provincia].push(ciudad);
    });
    return Object.keys(provincias).map(function (provincia) {
      return { provincia: provincia, ciudades: provincias[provincia] };
    });
  }

  loadInitialData() {
    try {
      const { documentos, entidadesFinanciera, bancos, ciudades } = this.params.dataFormaCobro;
      this.comprobante = this.params.comprobante;
      this.entidadesFinanciera = entidadesFinanciera;

      this.bancos = bancos;
      this.ciudades = this.agruparPorProvincia(ciudades);

      this.documentosElectronicos = documentos;
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {
    const { saldo } = this.params;
    this.VALOR_ABONO_ORIGINAL = roundNumber(saldo, 3);
    this.loadInitialData();

    this.ciudadesGroupOptions = this.ciudadForm.get('ciudadGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroup(value || '')),
    );
  }

  onSelectionChangeCiudad(id: number) {
    this.data.idCiudad = id;
  }

  onChangeTabEntidadFinanciera($index: number) {
    try {
      const dataEntidadFinanciera = this.entidadesFinanciera.at($index);
      let descripcion = null;
      let idEntidadFinanciera = 0;
      let codigo = null;
      let subEntidadesFinanciera: PaymentSubType[] = [];
      if (dataEntidadFinanciera) {
        descripcion = dataEntidadFinanciera.descripcion;
        idEntidadFinanciera = dataEntidadFinanciera.idEntidadFinanciera;
        codigo = dataEntidadFinanciera.codigo;
        subEntidadesFinanciera = dataEntidadFinanciera.subEntidadesFinanciera;
      }
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

      this.ciudadForm.reset({
        ciudadGroup: '', // Reset to empty string or any other initial value
      });

      if (this.subEntidadesFinanciera.length === 0) {
        this.tS.show({
          type: 'warning',
          message: `${descripcion}: No tiene SubEntidad Financiera creada`,
        });
      } else {
        this.data.idSubEntidadFinanciera = this.subEntidadesFinanciera[0].idSubEntidadFinanciera;
      }
    } catch (error) {
      console.log(error);
    }
  }

  isValidData() {
    const paymentTypeCode = this.entidadesFinanciera.find(
      (e) => e.idEntidadFinanciera === this.data.idEntidadFinanciera,
    )?.codigo;
    const { nro, referencia, aprobacion, idCiudad, idBanco, lote } = this.data;

    if (!(this.data.idSubEntidadFinanciera > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione la SubEntidad Financiera',
      });
      return;
    }

    if (!(Number(this.data.valorAbono) > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese el valor de abono',
      });
      return;
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
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el Banco',
        });
        return;
      }
      if (!isValidField(nro)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese el Número',
        });
        return;
      }
    }

    // =================== CHEQUES  =================================== //

    if (paymentTypeCode === PaymentTypeCode.CHE) {
      if (!(idBanco && idBanco > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el Banco',
        });
        return;
      }
      if (!isValidField(nro)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese el Número',
        });
        return;
      }

      if (!(idCiudad && idCiudad > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione la ciudad',
        });
        return;
      }

      if (!isValidField(referencia)) {
        if (!(idBanco && idBanco > 0)) {
          this.tS.show({
            type: 'warning',
            message: 'Ingrese la referencia',
          });
          return;
        }
        return;
      }
    }

    return true;
  }

  addPaymentType() {
    try {
      if (!this.isValidData()) throw 'Form Invalid';

      this.modal.close(this.getDataPago());
    } catch (error) {
      console.log(error);
    }
  }

  getDataPago(item: any = {}) {
    try {
      const entidadFinanciera = this.entidadesFinanciera.find(
        (item) => item.idEntidadFinanciera === this.data.idEntidadFinanciera,
      );
      const subEntidadFinanciera = entidadFinanciera?.subEntidadesFinanciera.find(
        (item: any) => item.idSubEntidadFinanciera === this.data.idSubEntidadFinanciera,
      );

      const ciudad = this.ciudades.find((item) => item.idCiudad === this.data.idCiudad);
      const banco = this.bancos.find((item) => item.idBanco === this.data.idBanco);

      //  let formattedDateTime = formatDateMoment(this.infrastructure.fechaEmision);

      const infoCobro = [
        {
          nro: this.data.nro,
          lote: this.data.lote,
          aprobacion: this.data.aprobacion,
          referencia: this.data.referencia,
          idCiudad: this.data.idCiudad,
        },
      ];

      const obj: PaymentData = {
        //Info
        paymentTypeName: entidadFinanciera?.descripcion,
        paymentSubTypeName: subEntidadFinanciera?.descripcion,

        ciudad: ciudad?.descripcion,
        banco: banco?.descripcion,

        //Data
        idEntidadFinanciera: entidadFinanciera?.idEntidadFinanciera ?? 0,
        idSubEntidadFinanciera: subEntidadFinanciera?.idSubEntidadFinanciera ?? 0,
        paymentTypeCode: entidadFinanciera?.codigo ?? '',
        idBanco: this.data.idBanco,
        idCiudad: this.data.idCiudad,
        fechaEmision: this.data.fechaEmision,
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
        controlCaja: subEntidadFinanciera?.controlCaja ?? false,

        infoCobro:
          entidadFinanciera?.codigo === PaymentTypeCode.EFE ? undefined : JSON.stringify(infoCobro),
        abonoCuota: 0,
        secuencial: 0,
      };
      return obj;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  addDocumentoElectronico(item: any) {
    if (item.saldo === 0) {
      this.tS.show({
        type: 'warning',
        message: 'El Valor de Abono tiene que ser mayor a 0',
      });
      return;
    }

    if (
      this.params.multiplesPaymentType.some(
        (d: any) =>
          d.idTipoDocumento === item.idTipoDocumento && d.idComprobante === item.idDocumento,
      )
    ) {
      this.tS.show({
        type: 'warning',
        message: 'Este documento ya fue aplicado al cobro',
      });
      // $(".swal2-container").css("z-index", "999999");
      return;
    }
    Swal.fire({
      html: `<small>Abonar el valor <h3>$${item.saldo}</h3> del Documento ${
        item.codDoc == 'A' ? item.serieComprobante : item.tipoDoc
      }?</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, abonar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.modal.close(this.getDataPago(item));
      }
    });
  }

  private _filterGroup(value: string): any[] {
    if (value) {
      return this.ciudades
        .map((group) => ({
          provincia: group.provincia,
          ciudades: _filter(group.ciudades, value),
        }))
        .filter((group) => group.ciudades.length > 0);
    }

    return this.ciudades;
  }

  close() {
    this.modal.close();
    // this.modal.destroy();
    // this.modal = null;
  }
}

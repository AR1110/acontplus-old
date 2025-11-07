import { AfterViewInit, Component, inject, input, signal } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Impuesto } from '@sri/domain/models/impuesto';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { Button } from '@acontplus/ng-components';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import Swal from 'sweetalert2';
import { DocSustentoTaxUseCase } from '@billing/domain/use-cases/retencion-ats/doc-sustento-tax.use-case';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

@Component({
  selector: 'app-doc-sustento-tax',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    MatFormField,
    MatSelectModule,
    MatInput,
  ],
  templateUrl: './doc-sustento-tax.component.html',
  styles: ``,
})
export class DocSustentoTaxComponent implements AfterViewInit {
  indexDoc = input.required<number>();
  indexTax = input.required<number>();
  docSustentoArray = input.required<FormArray>();
  taxGroup = input.required<any>();
  taxes = input.required<Impuesto[]>();
  tarifaImpuestos = input.required<TarifaImpuesto[]>();
  tarifaImpuestosFiltered = signal<TarifaImpuesto[]>([]); // Signal mutable
  private readonly _docSustentoTaxUseCase = inject(DocSustentoTaxUseCase);
  private readonly _tS = inject(ToastrNotificationService);

  selectTax(tax: any) {
    setTimeout(() => {
      this.tarifaImpuestosFiltered.set(
        this.tarifaImpuestos().filter((x) => x.idImpuesto === tax.idImpuesto),
      );
    });
  }

  ngAfterViewInit() {
    this.selectTax(this.taxGroup().value);
  }

  async removeTax() {
    const taxesArray = this.docSustentoArray().at(this.indexDoc()).get('taxes') as FormArray;

    const taxSelected = taxesArray.controls[this.indexTax()].value;

    if (taxSelected.idRetAtsImpDocSustento > 0) {
      const { isConfirmed } = await Swal.fire({
        title: 'Eliminar Impuesto',
        icon: 'warning',
        text: `Esta seguro(a) de eliminar este impuesto de manera permanente?`,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      });
      if (isConfirmed) {
        this._docSustentoTaxUseCase
          .delete(taxSelected.idRetAtsImpDocSustento)
          .subscribe((response) => {
            this._tS.show({
              type: response.code === '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code === '1') {
              this.removeByIndex();
            }
          });
      }
    } else {
      await this.removeByIndex();
    }
  }

  async removeByIndex() {
    const taxesArray = this.docSustentoArray().at(this.indexDoc()).get('taxes') as FormArray;

    if (this.indexTax() >= 0 && this.indexTax() < taxesArray.length) {
      taxesArray.removeAt(this.indexTax());
    }
  }

  selectTarifa() {
    const taxes = this.docSustentoArray().at(this.indexDoc()).get('taxes') as FormArray;

    const taxSelected = taxes.controls[this.indexTax()].value;

    taxSelected.tarifa =
      this.tarifaImpuestosFiltered().find(
        (x) => x.idTarifaImpuesto === taxSelected.idTarifaImpuesto,
      )?.tarifa ?? 0;

    taxes.controls[this.indexTax()].setValue(taxSelected);

    this.calculateValorImpuesto();
  }

  calculateValorImpuesto() {
    const taxes = this.docSustentoArray().at(this.indexDoc()).get('taxes') as FormArray;

    const taxSelected = taxes.controls[this.indexTax()].value;
    const tarifa = taxSelected.tarifa ?? 0;
    const baseImponible = taxSelected.baseImponible ?? 0;

    taxSelected.valorImpuesto = ((tarifa * baseImponible) / 100).toFixed(2);
    taxes.controls[this.indexTax()].setValue(taxSelected);

    let totalSinImpuestos = 0;
    taxes.controls.forEach((x) => {
      const baseImponibleValue = x.get('baseImponible')?.value || 0;
      totalSinImpuestos += parseFloat(baseImponibleValue);
    });

    this.docSustentoArray()
      .controls[this.indexDoc()].get('totalSinImpuestos')
      ?.setValue(totalSinImpuestos);

    const importeTotalAdded =
      this.docSustentoArray().controls[this.indexDoc()]?.get('importeTotal')?.value || 0;

    let newTotalDoc = 0;

    taxes.controls.forEach((taxControl, index) => {
      const base = parseFloat(taxControl.get('baseImponible')?.value) || 0;
      const impuesto = parseFloat(taxControl.get('valorImpuesto')?.value) || 0;

      const totalPorFila = base + impuesto;
      // console.log(
      //   `Fila ${index + 1}: base = ${base}, impuesto = ${impuesto}, total = ${totalPorFila}`,
      // );

      newTotalDoc += totalPorFila;
    });

    // console.log('Total del documento:', newTotalDoc);

    // console.log(newTotalDoc, 'newTotalDoc');
    // console.log(importeTotalAdded, 'importeTotalAdded');

    if (newTotalDoc != importeTotalAdded) {
      return this._tS.show({
        type: 'warning',
        message:
          'El importe total del documento no puede ser diferente a la suma de las bases imponibles mas los impuestos, revise los valores!',
      });
    }

    // const payments = this.docSustentoArray()
    //   .at(this.indexDoc())
    //   .get('payments') as FormArray;

    // payments.controls.forEach((paymentControl) => {
    //   const totalValue = paymentControl.get('total')?.value || 0;
    //   totalPaymentsAdded += parseFloat(totalValue);
    //   paymentControl.get('total')?.setValue(importeTotalAdded);
    // });
    //
    // if (importeTotalAdded == totalPaymentsAdded) {
    //   payments.controls.forEach((paymentControl) => {
    //     paymentControl.get('total')?.setValue(totalPaymentsAdded);
    //   });
    // }

    // response.payments.forEach((payment: RetencionAtsDocPayment) => {
    //   this.createPayment(indexDoc, payment);
    // });
  }

  onSave() {
    const taxes = this.docSustentoArray().at(this.indexDoc()).get('taxes') as FormArray;

    const taxSelected = taxes.controls[this.indexTax()].value;

    if (taxSelected.idRetAtsImpDocSustento > 0) {
      this._docSustentoTaxUseCase
        .update(taxSelected.idRetAtsImpDocSustento, taxSelected)
        .subscribe((response) => {
          this._tS.show({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
        });
    } else {
      this._docSustentoTaxUseCase.create(taxSelected).subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
      });
    }
  }
}

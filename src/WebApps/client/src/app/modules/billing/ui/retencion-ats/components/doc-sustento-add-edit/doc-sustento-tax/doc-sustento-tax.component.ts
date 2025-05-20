import { AfterViewInit, Component, inject, input, signal } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Impuesto } from '@sri/domain/models/impuesto';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import Swal from 'sweetalert2';
import { DocSustentoTaxUseCase } from '@billing/domain/use-cases/retencion-ats/doc-sustento-tax.use-case';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-doc-sustento-tax',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeButtonComponent,
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
  private readonly _tS = inject(ToasterService);

  selectTax(tax: any) {
    setTimeout(() => {
      this.tarifaImpuestosFiltered.set(
        this.tarifaImpuestos().filter((x) => x.idImpuesto === tax.idImpuesto),
      );
    });
  }

  ngAfterViewInit() {
    // console.log(this.taxGroup().value);
    this.selectTax(this.taxGroup().value);
  }

  async removeTax() {
    const taxesArray = this.docSustentoArray()
      .at(this.indexDoc())
      .get('taxes') as FormArray;

    const taxSelected = taxesArray.controls[this.indexTax()].value;

    if (taxSelected.idRetAtsDocSustento > 0) {
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
            this._tS.toastr({
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
    const taxesArray = this.docSustentoArray()
      .at(this.indexDoc())
      .get('taxes') as FormArray;

    if (this.indexTax() >= 0 && this.indexTax() < taxesArray.length) {
      taxesArray.removeAt(this.indexTax());
    }
  }

  selectTarifa(value: any) {}
}

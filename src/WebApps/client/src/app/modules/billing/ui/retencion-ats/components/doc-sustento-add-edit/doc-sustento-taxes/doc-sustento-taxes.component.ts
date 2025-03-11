import { AfterViewInit, Component, input } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Impuesto } from '@sri/domain/models/impuesto';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-doc-sustento-taxes',
  imports: [FormsModule, ReactiveFormsModule, MatIcon],
  templateUrl: './doc-sustento-taxes.component.html',
  styles: ``,
})
export class DocSustentoTaxesComponent {
  docSustentoArray = input.required<FormArray>();
  taxGroup = input.required<any>();
  taxes = input.required<Impuesto[]>();
  tarifaImpuestos = input.required<TarifaImpuesto[]>();
  indexTax = input.required<number>();
  tarifaImpuestosFiltered = input.required<TarifaImpuesto[]>();
  // tarifaImpuestosFiltered: TarifaImpuesto[] = [];
  selectTarifa(tax: any) {
    // this.tarifaImpuestosFiltered() = this.tarifaImpuestos().filter(
    //     (x) => x.codImpuesto === tax.codImpuestoDocSustento,
    // );
  }
  removeTax(docIndex: number, taxIndex: number): void {
    const taxesArray = this.docSustentoArray()
      .at(docIndex)
      .get('impuestos') as FormArray;

    if (taxIndex >= 0 && taxIndex < taxesArray.length) {
      taxesArray.removeAt(taxIndex);
    }
  }
}

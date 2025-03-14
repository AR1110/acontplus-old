import { AfterViewInit, Component, input, signal } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Impuesto } from '@sri/domain/models/impuesto';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { MatIcon } from '@angular/material/icon';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-doc-sustento-taxes',
  imports: [FormsModule, ReactiveFormsModule, MatIcon, ThemeButtonComponent],
  templateUrl: './doc-sustento-taxes.component.html',
  styles: ``,
})
export class DocSustentoTaxesComponent implements AfterViewInit {
  indexDoc = input.required<number>();
  indexTax = input.required<number>();
  docSustentoArray = input.required<FormArray>();
  taxGroup = input.required<any>();
  taxes = input.required<Impuesto[]>();
  tarifaImpuestos = input.required<TarifaImpuesto[]>();
  tarifaImpuestosFiltered = signal<TarifaImpuesto[]>([]); // Signal mutable

  selectTax(tax: any) {
    console.log(tax);
    console.log(this.tarifaImpuestos());
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

  removeTax(indexDoc: number, taxIndex: number): void {
    const taxesArray = this.docSustentoArray()
      .at(indexDoc)
      .get('impuestos') as FormArray;

    if (taxIndex >= 0 && taxIndex < taxesArray.length) {
      taxesArray.removeAt(taxIndex);
    }
  }

  selectTarifa(value: any) {}
}

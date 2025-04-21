import { AfterViewInit, Component, input, signal } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Impuesto } from '@sri/domain/models/impuesto';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';

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

  removeTax(): void {
    const taxesArray = this.docSustentoArray()
      .at(this.indexDoc())
      .get('taxes') as FormArray;

    if (this.indexTax() >= 0 && this.indexTax() < taxesArray.length) {
      taxesArray.removeAt(this.indexTax());
    }
  }

  selectTarifa(value: any) {}
}

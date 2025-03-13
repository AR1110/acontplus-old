import { AfterViewInit, Component, inject, input, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { SustentoTributario } from '@sri/domain/models/sustento-tributario';
import { DocumentoSustento } from '@sri/domain/models/documento-sustento';
import { TipoPago } from '@sri/domain/models/tipo-pago';
import { TipoRegimenFe } from '@sri/domain/models/tipo-regimen-fe';
import { Pais } from '@sri/domain/models/pais';
import { GenericModel } from '@core/models/generic.model';
import { DocSustentoUseCase } from '@billing/domain/use-cases/doc-sustento.use-case';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { Impuesto } from '@sri/domain/models/impuesto';
import { DocSustentoTaxesComponent } from '@billing/ui/retencion-ats/components/doc-sustento-add-edit/doc-sustento-taxes/doc-sustento-taxes.component';

@Component({
  selector: 'app-doc-sustento-add-edit',
  imports: [
    FormsModule,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    ReactiveFormsModule,
    ThemeButtonComponent,
    DocSustentoTaxesComponent,
  ],
  templateUrl: './doc-sustento-add-edit.component.html',
  styles: ``,
})
export class DocSustentoAddEditComponent implements AfterViewInit {
  docSustentoGroup = input.required<any>();
  docSustentoArray = input.required<FormArray>();
  indexDoc = input.required<number>();
  documentosSustento = input.required<DocumentoSustento[]>();
  sustentosTributarios = input.required<SustentoTributario[]>();
  tiposPago = input.required<TipoPago[]>();
  tiposRegimenFe = input.required<TipoRegimenFe[]>();
  countries = input.required<Pais[]>();
  generic = input.required<GenericModel[]>();
  tarifaImpuestos = input.required<TarifaImpuesto[]>();
  taxes = input.required<Impuesto[]>();
  panelOpenState = -1;
  sustentosFiltered = signal<SustentoTributario[]>([]);
  isPagoResidente = true;

  private readonly _fb = inject(FormBuilder);
  private readonly _docSustentoUseCase = inject(DocSustentoUseCase);

  setPanelOpen(index: number) {
    this.panelOpenState = index;
  }

  selectSustento(index: number) {
    // Filter sustentos based on document type
    this.sustentosFiltered.set([]);
    const codDocSustento =
      this.docSustentoArray().controls[index].get('codDocSustento')?.value;

    this.sustentosFiltered.set(
      this.sustentosTributarios().filter(
        (x) => x.codDocSustento === codDocSustento,
      ),
    );
  }

  enableControls(): void {
    // this.isPagoResidente = pagoLocExt === 'LOCAL';
  }

  getCountries(): void {
    // Load countries based on regime type
  }

  getTaxesArray(docIndex: number): FormArray {
    return this.docSustentoArray().at(docIndex).get('impuestos') as FormArray;
  }

  ngAfterViewInit(): void {
    this.selectSustento(this.indexDoc());
  }

  createTaxGroup(): FormGroup {
    return this._fb.group({
      impuesto: [''],
      porcentaje: [''],
      codImpuestoDocSustento: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      codigoPorcentaje: [''],
      baseImponible: ['', Validators.required],
      tarifa: [''],
      valorImpuesto: [''],
    });
  }

  createTax(docIndex: number, tax: any): void {
    const taxesArray = this.getTaxesArray(docIndex);
    const taxGroup = this.createTaxGroup();
    taxGroup.patchValue(tax);
    taxesArray.push(taxGroup);
  }

  addTaxes($index: number) {
    const documentId =
      this.docSustentoArray().controls[$index].get('idDocumento')?.value;
    const isAutomatic =
      this.docSustentoArray().controls[$index].get('isAutomatic')?.value;

    this._docSustentoUseCase
      .getTaxes({ documentId, isAutomatic })
      .subscribe((response) => {
        response.taxes.forEach((tax) => {
          this.createTax($index, tax);
        });
      });
  }

  docPreview(item: any): void {
    // Preview document logic
  }

  // Remove a docSustento at a specific index
  removeDocSustento(index: number) {
    this.docSustentoArray().removeAt(index);
  }

  protected readonly FormArray = FormArray;
}

import { AfterViewInit, Component, inject, input, signal } from '@angular/core';
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
import { DocSustentoTaxComponent } from '@billing/ui/retencion-ats/components/doc-sustento-add-edit/doc-sustento-tax/doc-sustento-tax.component';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { DocSustentoRetencionComponent } from '@billing/ui/retencion-ats/components/doc-sustento-add-edit/doc-sustento-retencion/doc-sustento-retencion.component';
import { ImpuestoRetencion } from '@sri/domain/models/impuesto-retencion';
import { CodigoRetencion } from '@sri/domain/models/codigo-retencion';
import { PorcentajeRetIva } from '@modules/sri/domain/models/porcentaje-ret-iva';

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
    DocSustentoTaxComponent,
    DocSustentoRetencionComponent,
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
  impuestosRetencion = input.required<ImpuestoRetencion[]>();
  codigosRetencion = input.required<CodigoRetencion[]>();
  porcentajesRetIva = input.required<PorcentajeRetIva[]>();
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

  pagoLocExtSelect(): void {
    // this.isPagoResidente = pagoLocExt === 'LOCAL';
  }

  getCountries(): void {
    // Load countries based on regime type
  }

  getTaxesArray(indexDoc: number): FormArray {
    return this.docSustentoArray().at(indexDoc).get('impuestos') as FormArray;
  }

  getRetencionesArray(indexDoc: number): FormArray {
    return this.docSustentoArray().at(indexDoc).get('retenciones') as FormArray;
  }

  ngAfterViewInit(): void {
    this.selectSustento(this.indexDoc());
  }

  createTaxGroup(): FormGroup {
    return this._fb.group({
      idRetencionAts: [0],
      impuesto: [''],
      porcentaje: [''],
      idImpuesto: [0],
      idTarifaImpuesto: [0],
      baseImponible: [0, Validators.required],
      tarifa: [0],
      valorImpuesto: [0],
      uniqueIdDoc: [generateUuidv4(), [Validators.required]],
    });
  }

  createRetencionGroup(): FormGroup {
    return this._fb.group({
      idRetencionAtsRet: [0],
      idRetencionAts: [0],
      idRetencionAtsDocSustento: [0],
      uniqueIdDoc: [generateUuidv4(), [Validators.required]],
      impuesto: [''],
      idImpuestoRetencion: [0, [Validators.required]],
      codigoDescripcion: [''],
      codigoRetencion: ['', [Validators.required]],
      baseImponible: [0, [Validators.required]],
      porcentajeRetener: [0, [Validators.required]],
      valorRetenido: [0, [Validators.required]],
    });
  }

  createTax(indexDoc: number, tax: any): void {
    const taxesArray = this.getTaxesArray(indexDoc);
    const taxGroup = this.createTaxGroup();
    taxGroup.patchValue(tax);
    taxesArray.push(taxGroup);
  }

  createRetencion(indexDoc: number, retencion: any): void {
    const retencionesArray = this.getRetencionesArray(indexDoc);
    const retencionGroup = this.createRetencionGroup();
    if (retencion != typeof 'object') {
      retencionGroup.patchValue(retencion);
    }
    retencionesArray.push(retencionGroup);
  }

  addTaxes(indexDoc: number) {
    const documentId =
      this.docSustentoArray().controls[indexDoc].get('idDocumento')?.value;
    const isAutomatic =
      this.docSustentoArray().controls[indexDoc].get('isAutomatic')?.value;

    this._docSustentoUseCase
      .getTaxes({ documentId, isAutomatic })
      .subscribe((response) => {
        let totalSinImpuestos = 0;
        response.taxes.forEach((tax: any) => {
          this.createTax(indexDoc, tax);
          totalSinImpuestos += tax.baseImponible;
        });
        console.log(totalSinImpuestos);
        this.docSustentoArray()
          .controls[indexDoc].get('totalSinImpuestos')
          ?.setValue(totalSinImpuestos);
      });
  }

  addRetencion(indexDoc: number) {
    this.createRetencion(indexDoc, {});
  }

  docPreview(item: any): void {
    // Preview document logic
  }

  // Remove a docSustento at a specific index
  removeDocSustento(index: number) {
    this.docSustentoArray().removeAt(index);
  }
}

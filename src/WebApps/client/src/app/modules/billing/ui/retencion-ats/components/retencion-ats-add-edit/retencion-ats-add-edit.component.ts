import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupedEstab } from '@core/models/estab.model';
import { RetencionAtsUseCase } from '@billing/domain/use-cases/retencion-ats.use-case';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
} from '@angular/material/card';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { SupplierSearch } from '@customer/core/domain/supplier.interface';
import { DialogService } from '@core/services/dialog.service';
import { SupplierDocsComponent } from '@billing/ui/retencion-ats/components/supplier-docs/supplier-docs.component';
import { RetAtsDocSustento } from '@billing/domain/models/retencion-ats/ret-ats-doc-sustento';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { DatePipe } from '@angular/common';
import { DocumentoSustento } from '@sri/domain/models/documento-sustento';
import { SustentoTributario } from '@sri/domain/models/sustento-tributario';
import { TipoPago } from '@sri/domain/models/tipo-pago';
import { TipoRegimenFe } from '@sri/domain/models/tipo-regimen-fe';
import { PuntoEmision } from '@core/models/punto-emision.model';
import { TipoIdentificacion } from '@core/models/tipo-identificacion';
import { SujetoRetenido } from '@sri/domain/models/sujeto-retenido';
import { Pais } from '@sri/domain/models/pais';
import { Impuesto } from '@sri/domain/models/impuesto';
import { GenericModel } from '@core/models/generic.model';
import { DocSustentoUseCase } from '@billing/domain/use-cases/doc-sustento.use-case';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ambienteSriOptions } from '@shared/models/ambiente-sri';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import {
  DocSustentoAddEditComponent
} from "@billing/ui/retencion-ats/components/doc-sustento-add-edit/doc-sustento-add-edit.component";
@Component({
  selector: 'app-retencion-ats-add-edit',
  imports: [
    MatCustomDialogComponent,
    ReactiveFormsModule,
    MatIcon,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    SupplierSearchComponent,
    MatCardActions,
    ThemeButtonComponent,
    FaIconComponent,
    DocSustentoAddEditComponent,
  ],
  templateUrl: './retencion-ats-add-edit.component.html',
  styles: ``,
})
export class RetencionAtsAddEditComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  readonly data = inject<unknown>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(
    MatDialogRef<RetencionAtsAddEditComponent>,
  );
  private readonly _retencionAtsUseCase = inject(RetencionAtsUseCase);
  private readonly _dialogService = inject(DialogService);
  private readonly _docSustentoUseCase = inject(DocSustentoUseCase);

  retencionAtsForm = this._fb.group({
    idRetencionAts: [0],
    idPuntoEmision: [0],
    contribuyenteEspecial: [''],
    obligadoContabilidad: [''],
    tipoIdentificacionSujetoRetenido: [''],
    tipoSujetoRetenido: [''],
    parteRel: [''],
    razonSocialSujetoRetenido: [''],
    identificacionSujetoRetenido: [''],
    idProveedor: [0],
    periodoFiscal: [''],
    fechaEmision: [''],
    docSustento: this._fb.array([]),
    infoAdicional: this._fb.array([]),
  });

  isVisibleInfoComprobante = true;
  idDocumentoElectronico = 0;
  estabs: GroupedEstab[] = [];
  puntosEmision: PuntoEmision[] = [];
  subContribuyente = '';
  tiposIdentificacion: TipoIdentificacion[] = [];
  tiposSujRetenido: SujetoRetenido[] = [];
  isNotForeign = true;
  generic: GenericModel[] = [{ code: 'SI' }, { code: 'NO' }];
  retAtsDocSustentos: RetAtsDocSustento[] = [];
  documentosSustento: DocumentoSustento[] = [];
  sustentosTributarios: SustentoTributario[] = [];
  sustentosFiltered: SustentoTributario[] = [];
  isPagoResidente = true;
  tiposPago: TipoPago[] = [];
  tiposRegimenFe: TipoRegimenFe[] = [];
  countries: Pais[] = [];
  taxes: Impuesto[] = [];
  tarifaImpuestos: TarifaImpuesto[] = [];
  tarifaImpuestosFiltered: TarifaImpuesto[] = [];
  btnIcon = 'save';
  btnText = 'Guardar';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number[] = [];
  paginationLimit = 5;

  // Info adicional
  infoAdicional: unknown[] = [];
  panelOpenState = -1;
  // Computed properties

  dialogIcon = signal('add');
  dialogTitle = signal('Registrar Retención ATS');

  // Services

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return this.startIndex + this.itemsPerPage;
  }

  get docSustentoArray() {
    return this.retencionAtsForm.get('docSustento') as FormArray;
  }

  addDocSustento() {
    this.docSustentoArray.push(this.createDocSustentoGroup());
  }
  // Add a docSustento with predefined values
  addDocSustentoWithValues(doc: any) {
    const docGroup = this.createDocSustentoGroup();

    let formattedFecha = '';

    // Check if fecha is a valid date before formatting
    if (doc.fechaEmisionDocSustento) {
      const parsedDate = new Date(doc.fechaEmisionDocSustento);
      if (!isNaN(parsedDate.getTime())) {
        formattedFecha = parsedDate.toISOString().split('T')[0];
      }
    }
    console.log(formattedFecha);
    // Patch the values into the form
    docGroup.patchValue({ ...doc, fechaEmisionDocSustento: formattedFecha });
    this.docSustentoArray.push(docGroup);
  }

  // Remove a docSustento at a specific index
  removeDocSustento(index: number) {
    this.docSustentoArray.removeAt(index);
  }
  // Create a new docSustento FormGroup
  createDocSustentoGroup() {
    return this._fb.group({
      idRetAtsDocSustento: [0],
      idDocumento: [0],
      uniqueIdDoc: [''],
      codSustento: [''],
      codDocSustento: [''],
      numDocSustento: [''],
      fechaEmisionDocSustento: [''],
      fechaRegistroContable: [''],
      numAutDocSustento: [''],
      pagoLocExt: [''],
      tipoRegi: [''],
      paisEfecPago: [''],
      aplicConvDobTrib: [''],
      pagExtSujRetNorLeg: [''],
      pagoRegFis: [''],
      totalComprobantesReembolsos: [''],
      totalBaseImponibleReembolso: [''],
      totalImpuestoReembolso: [''],
      totalSinImpuestos: [''],
      importeTotal: [''],
      taxes: this._fb.array([]),
      retenciones: this._fb.array([]),
      reembolsos: this._fb.group({
        id: [0],
        taxes: this._fb.array([]),
      }),
      payments: this._fb.array([]),
      isAutomatic: [false],
    });
  }

  getTaxesArray(docIndex: number): FormArray {
    return this.docSustentoArray.at(docIndex).get('taxes') as FormArray;
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

  removeTax(docIndex: number, taxIndex: number): void {
    const taxesArray = this.getTaxesArray(docIndex);

    if (taxIndex >= 0 && taxIndex < taxesArray.length) {
      taxesArray.removeAt(taxIndex);
    }
  }

  initialLoad() {
    this._retencionAtsUseCase.getDataForm({}).subscribe((response) => {
      this.estabs = response.estabs;
      this.tiposIdentificacion = response.tiposIdentificacion;
      this.tiposSujRetenido = response.sujetoRetenido;
      this.documentosSustento = response.documentoSustento;
      this.sustentosTributarios = response.sustentoTributario;
      this.tiposPago = response.tiposPago;
      this.tiposRegimenFe = response.tiposRegimen;
      this.taxes = response.taxes;
      this.tarifaImpuestos = response.tarifaImpuestos;
    });
  }

  ngOnInit() {
    this.retencionAtsForm
      .get('fechaEmision')
      ?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.initialLoad();
  }

  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    console.log(this.retencionAtsForm.value);
  }

  onClickVisibleInfoComprobante(): void {
    this.isVisibleInfoComprobante = !this.isVisibleInfoComprobante;
  }

  onChangeEstablecimiento(): void {
    // Implementation
  }

  onChangePtoEmi(): void {
    // Implementation
  }

  getPeriod() {
    const fechaEmision = this.retencionAtsForm.get('fechaEmision')?.value;
    if (fechaEmision) {
      const date = new Date(fechaEmision);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const period = month < 10 ? `0${month}/${year}` : `${month}/${year}`;
      this.retencionAtsForm.get('periodoFiscal')?.setValue(period);
    }
  }

  showTipoSujetoRetenido(): void {
    // Implementation based on the selected identification type
    // this.isNotForeign = tipoIdentificacion !== 'FOREIGN';
  }

  getProveedor(searchType: number = 0): void {
    // Implementation
  }

  onSupplierSelected(data: SupplierSearch) {
    this.retencionAtsForm
      .get('identificacionSujetoRetenido')
      ?.setValue(data.identificacionComprador);
    this.retencionAtsForm.get('idProveedor')?.setValue(data.idProveedor);
  }

  supplierResultEmptyInput() {
    this.retencionAtsForm.get('identificacionSujetoRetenido')?.setValue('');
  }

  searchDocs() {
    const dialogRef = this._dialogService.open(SupplierDocsComponent, {
      size: 'lg',
      data: {
        idProveedor: this.retencionAtsForm.get('idProveedor')?.value,
        idCard: this.retencionAtsForm.get('identificacionSujetoRetenido')
          ?.value,
      },
    });

    dialogRef.subscribe((response) => {
      if (response !== 'undefined') {
        const { documents } = response;
        if (documents.length > 0) {
          this.retAtsDocSustentos = documents;
          this.retAtsDocSustentos.forEach((doc) => {
            this.addDocSustentoWithValues(doc);
          });
        }
      }
    });
  }

  selectSustento(index: number) {
    // Filter sustentos based on document type
    this.sustentosFiltered = [];
    const codDocSustento =
      this.docSustentoArray.controls[index].get('codDocSustento')?.value;

    this.sustentosFiltered = this.sustentosTributarios.filter(
      (x) => x.codDocSustento === codDocSustento,
    );
  }

  enableControls(): void {
    // this.isPagoResidente = pagoLocExt === 'LOCAL';
  }

  getCountries(): void {
    // Load countries based on regime type
  }

  removeTaxTemp(index: number): void {
    this.taxes.splice(index, 1);
  }

  updateDocSustento(): void {
    // Update document sustento logic
  }

  docPreview(item: any): void {
    // Preview document logic
  }

  editDocSust(index: number): void {
    // Edit document logic
  }

  // Pagination methods
  changePage(page: number): void {
    if (
      page >= 1 &&
      page <= Math.ceil(this.documentosSustento.length / this.itemsPerPage)
    ) {
      this.currentPage = page;
    }
  }

  setPanelOpen(index: number) {
    this.panelOpenState = index;
  }

  // Info adicional
  addInfoAdicional(info: any): void {
    this.infoAdicional.push(info);
  }

  addTaxes($index: number) {
    const documentId =
      this.docSustentoArray.controls[$index].get('idDocumento')?.value;
    const isAutomatic =
      this.docSustentoArray.controls[$index].get('isAutomatic')?.value;

    this._docSustentoUseCase
      .getTaxes({ documentId, isAutomatic })
      .subscribe((response) => {
        response.taxes.forEach((tax) => {
          this.selectTarifa(tax);
          this.createTax($index, tax);
        });
      });
  }

  protected readonly ambientes = ambienteSriOptions;

  selectTarifa(tax: any) {
    this.tarifaImpuestosFiltered = [];
    this.tarifaImpuestosFiltered = this.tarifaImpuestos.filter(
      (x) => x.codImpuesto === tax.codImpuestoDocSustento,
    );
  }
}

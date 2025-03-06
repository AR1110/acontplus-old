import { Component, inject, signal } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgClass, SlicePipe } from '@angular/common';
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
  MatCardHeader,
  MatCardTitle,
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
import { DocumentoSustento } from '@billing/domain/models/retencion-ats/documento-sustento';
@Component({
  selector: 'app-retencion-ats-add-edit',
  imports: [
    MatCustomDialogComponent,
    ReactiveFormsModule,
    NgClass,
    MatIcon,
    CurrencyPipe,
    DatePipe,
    SlicePipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    SupplierSearchComponent,
    MatCardActions,
  ],
  templateUrl: './retencion-ats-add-edit.component.html',
  styles: ``,
})
export class RetencionAtsAddEditComponent {
  private readonly _fb = inject(FormBuilder);
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
    docSustento: this._fb.array([
      this._fb.group({
        idRetAtsDocSustento: [0],
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
      }),
    ]),
    infoAdicional: this._fb.array([]),
  });

  isVisibleInfoComprobante = true;
  idDocumentoElectronico = 0;
  estabs: GroupedEstab[] = [];
  puntosEmision: any[] = [];
  subContribuyente = '';
  tiposIdentificacion: any[] = [];
  tiposSujRetenido: any[] = [];
  isNotForeign = true;
  genericAnswer: any[] = [{ codigo: 'SI' }, { codigo: 'NO' }];
  docSustento: DocumentoSustento[] = [];
  documentos: any[] = [];
  sustentosFiltered: any[] = [];
  isPagoResidente = true;
  tiposPago: any[] = [];
  tiposRegimenFE: any[] = [];
  countries: any[] = [];
  tempTaxes: any[] = [];
  docsAdded: any[] = [];
  btnIcon = 'save';
  btnText = 'Guardar';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages: number[] = [];
  paginationLimit = 5;

  // Info adicional
  infoAdicional: any[] = [];
  panelOpenState = -1;
  // Computed properties
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return this.startIndex + this.itemsPerPage;
  }

  dialogIcon = signal('add');
  dialogTitle = signal('Registrar Retención ATS');

  // Services

  readonly data = inject<unknown>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(
    MatDialogRef<RetencionAtsAddEditComponent>,
  );
  private readonly _retencionAtsUseCase = inject(RetencionAtsUseCase);
  private readonly _dialogService = inject(DialogService);

  initialLoad() {
    this._retencionAtsUseCase.getDataForm({}).subscribe((response) => {
      this.estabs = response.estabs;
      this.tiposIdentificacion = response.tiposIdentificacion;
      this.tiposSujRetenido = response.sujetoRetenido;
    });
  }

  ngOnInit() {
    this.initialLoad();
  }

  onClose() {
    this.dialogRef.close();
  }
  onSave() {}

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
      const { documents } = response;
      if (documents.length > 0) {
        this.docSustento = documents;
        console.log(this.docSustento);
      }
    });
  }

  selectSutento(): void {
    // Filter sustentos based on document type
  }

  enableControls(): void {
    // this.isPagoResidente = pagoLocExt === 'LOCAL';
  }

  getCountries(): void {
    // Load countries based on regime type
  }

  removeTaxTemp(index: number): void {
    this.tempTaxes.splice(index, 1);
  }

  addDocSustento(validate: boolean): void {
    // Add document sustento logic
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

  deleteDocSust(index: number): void {
    // Delete document logic
  }

  // Pagination methods
  changePage(page: number): void {
    if (
      page >= 1 &&
      page <= Math.ceil(this.docsAdded.length / this.itemsPerPage)
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
}

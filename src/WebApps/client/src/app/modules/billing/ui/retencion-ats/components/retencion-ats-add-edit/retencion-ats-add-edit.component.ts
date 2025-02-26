import { Component, inject, signal } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgClass, SlicePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  ],
  templateUrl: './retencion-ats-add-edit.component.html',
  styles: ``,
})
export class RetencionAtsAddEditComponent {
  retencionAtsForm = new FormGroup({
    id: new FormControl(0),
  });

  isVisibleInfoComprobante = true;
  infoCompRet: any = {};
  idDocumentoElectronico = 0;
  estabs: any[] = [];
  puntosEmision: any[] = [];
  subContribuyente = '';
  tiposIdentificacion: any[] = [];
  tiposSujRetenido: any[] = [];
  isNotForeign = true;
  genericAnswer: any[] = [];
  docSustento: any = {};
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

  getPeriod(): void {
    if (this.infoCompRet.fechaEmision) {
      const date = new Date(this.infoCompRet.fechaEmision);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      this.infoCompRet.periodoFiscal =
        month < 10 ? `0${month}/${year}` : `${month}/${year}`;
    }
  }

  showTipoSujetoRetenido(tipoIdentificacion: string): void {
    // Implementation based on the selected identification type
    this.isNotForeign = tipoIdentificacion !== 'FOREIGN';
  }

  getProveedor(searchType: number = 0): void {
    // Implementation
  }

  searchDocs(): void {
    // Search for documents to retain
  }

  selectSutento(codDocSustento: string): void {
    // Filter sustentos based on document type
  }

  enableControls(pagoLocExt: string): void {
    this.isPagoResidente = pagoLocExt === 'LOCAL';
  }

  getCountries(tipoRegi: string): void {
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

  // Info adicional
  addInfoAdicional(info: any): void {
    this.infoAdicional.push(info);
  }
}

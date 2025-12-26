import { AfterViewInit, Component, inject, input, OnInit, signal } from '@angular/core';
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
import { Button } from '@acontplus/ng-components';
import { SustentoTributario } from '@sri/domain/models/sustento-tributario';
import { TipoComprobante } from '@sri/domain/models/tipo-comprobante';
import { TipoPago } from '@sri/domain/models/tipo-pago';
import { TipoRegimenFiscalExterior } from '@sri/domain/models/tipo-regimen-fiscal-exterior';
import { Pais } from '@sri/domain/models/pais';
import { GenericModel } from '@core/models/generic.model';
import { DocSustentoUseCase } from '@billing/domain/use-cases/retencion-ats/doc-sustento.use-case';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { Impuesto } from '@sri/domain/models/impuesto';
import { DocSustentoTaxComponent } from '@billing/ui/retencion-ats/components/doc-sustento-add-edit/doc-sustento-tax/doc-sustento-tax.component';
import { DocSustentoRetencionComponent } from '@billing/ui/retencion-ats/components/doc-sustento-add-edit/doc-sustento-retencion/doc-sustento-retencion.component';
import { ImpuestoRetencion } from '@sri/domain/models/impuesto-retencion';
import { ConceptoRetencionAir } from '@sri/domain/models/concepto-retencion-air';
import { PorcentajeRetencionIva } from '@sri/domain/models/porcentaje-retencion-iva';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { DocSustentoPaymentComponent } from '@billing/ui/retencion-ats/components/doc-sustento-add-edit/doc-sustento-payment/doc-sustento-payment.component';
import { FormaPago } from '@sri/domain/models/forma-pago';
import {
  RetAtsDocSustento,
  RetencionAtsDocPayment,
} from '@billing/domain/models/retencion-ats/ret-ats-doc-sustento.model';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { RECEIVED_DOCUMENT_HTTP_TOKEN } from '@purchases/data/purchases-token';
import { DialogService } from '@core/services/dialog.service';
import { DocElectViewerComponent } from '@shared/components/doc-elect-viewer/doc-elect-viewer.component';
import { RetencionAts } from '@billing/domain/models/retencion-ats/retencion-ats.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doc-sustento-add-edit',
  imports: [
    FormsModule,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    ReactiveFormsModule,
    Button,
    DocSustentoTaxComponent,
    DocSustentoRetencionComponent,
    MatFormField,
    MatSelectModule,
    MatInput,
    DocSustentoPaymentComponent,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
  ],
  templateUrl: './doc-sustento-add-edit.component.html',
  styles: ``,
})
export class DocSustentoAddEditComponent implements AfterViewInit, OnInit {
  docSustentoGroup = input.required<any>();
  docSustentoArray = input.required<FormArray>();
  indexDoc = input.required<number>();
  dataLoaded = input.required<boolean>();
  tiposComprobante = input.required<TipoComprobante[]>();
  sustentosTributarios = input.required<SustentoTributario[]>();
  tiposPago = input.required<TipoPago[]>();
  tiposRegimenFiscalExterior = input.required<TipoRegimenFiscalExterior[]>();
  countries = input.required<Pais[]>();
  generic = input.required<GenericModel[]>();
  tarifaImpuestos = input.required<TarifaImpuesto[]>();
  taxes = input.required<Impuesto[]>();
  impuestosRetencion = input.required<ImpuestoRetencion[]>();
  conceptosRetencionAir = input.required<ConceptoRetencionAir[]>();
  porcentajesRetIva = input.required<PorcentajeRetencionIva[]>();
  formasPago = input.required<FormaPago[]>();
  panelOpenState = -1;
  sustentosFiltered = signal<SustentoTributario[]>([]);
  isPagoResidente = true;
  uniqueIdDoc = input.required<string>();
  private readonly _data = inject<RetencionAts>(MAT_DIALOG_DATA);
  private readonly _fb = inject(FormBuilder);
  private readonly _docSustentoUseCase = inject(DocSustentoUseCase);
  private readonly _tS = inject(ToastrNotificationService);
  private readonly _receivedDocumentSvc = inject(RECEIVED_DOCUMENT_HTTP_TOKEN);
  private readonly _dialogService = inject(DialogService);

  setPanelOpen(index: number) {
    this.panelOpenState = index;
  }

  selectSustento(index: number) {
    // Filter sustentos based on document type
    this.sustentosFiltered.set([]);
    const tipoComprobanteId =
      this.docSustentoArray().controls[index].get('tipoComprobanteId')?.value;

    this.sustentosFiltered.set(
      this.sustentosTributarios().filter((x) => x.tipoComprobanteId === tipoComprobanteId),
    );
  }

  pagoLocExtSelect(): void {
    // this.isPagoResidente = pagoLocExt === 'LOCAL';
  }

  getCountries(): void {
    // Load countries based on regime type
  }

  getTaxesArray(indexDoc: number): FormArray {
    return this.docSustentoArray().at(indexDoc).get('taxes') as FormArray;
  }

  getRetencionesArray(indexDoc: number): FormArray {
    return this.docSustentoArray().at(indexDoc).get('retenciones') as FormArray;
  }
  getPaymentsArray(indexDoc: number): FormArray {
    return this.docSustentoArray().at(indexDoc).get('payments') as FormArray;
  }

  ngAfterViewInit(): void {
    this.selectSustento(this.indexDoc());
  }
  ngOnInit(): void {
    if (this._data) {
      const parsedData = {
        ...this._data,
        documentosSustento: JSON.parse(this._data.documentosSustento || '[]'),
        infoAdicional: JSON.parse(this._data.infoAdicional || '[]'),
      };

      this.docSustentoArray()
        .at(this.indexDoc())
        .get('idRetencionAts')
        ?.setValue(parsedData.idRetencionAts);

      parsedData.documentosSustento.forEach((doc: RetAtsDocSustento) => {
        if (doc.taxes) {
          doc.taxes.forEach((tax) => {
            this.createTaxWithValue(this.indexDoc(), tax);
          });
        }
        if (doc.retenciones) {
          doc.retenciones.forEach((retencion) => {
            this.createRetencion(this.indexDoc(), retencion);
          });
        }
        if (doc.payments) {
          doc.payments.forEach((payment) => {
            this.createPaymentWithValue(this.indexDoc(), payment);
          });
        }
      });
    } else {
      this.docSustentoArray().at(this.indexDoc()).get('pagoLocExt')?.setValue('01');
    }
  }

  createTaxGroup(): FormGroup {
    return this._fb.group({
      idRetAtsImpDocSustento: [0],
      idRetAtsDocSustento: [0],
      idRetencionAts: [0],
      uniqueIdDoc: [this.uniqueIdDoc(), [Validators.required]],
      idImpuesto: [0],
      idTarifaImpuesto: [0],
      codigo: [''],
      codigoPorcentaje: [''],
      tarifa: [0],
      baseImponible: [0, Validators.required],
      valorImpuesto: [0],
    });
  }

  createRetencionGroup(): FormGroup {
    return this._fb.group({
      idRetencionAtsRet: [0],
      idRetAtsDocSustento: [0],
      idRetencionAts: [0],
      uniqueIdDoc: [this.uniqueIdDoc(), [Validators.required]],
      impuestoRetencionId: [0, [Validators.required]],
      codigoRetencion: ['', Validators.required],
      baseImponible: [0, [Validators.required]],
      porcentajeRetener: [0],
      valorRetenido: [0],
    });
  }

  createPaymentGroup(): FormGroup {
    return this._fb.group({
      idRetencionAtsPago: [0],
      idRetAtsDocSustento: [0],
      idRetencionAts: [0],
      uniqueIdDoc: [this.uniqueIdDoc(), [Validators.required]],
      formaPagoId: [0, [Validators.required]],
      total: [0, [Validators.required, Validators.min(0)]],
    });
  }

  createTaxWithValue(indexDoc: number, tax: any): void {
    const taxesArray = this.getTaxesArray(indexDoc);
    const taxGroup = this.createTaxGroup();
    tax.idRetAtsDocSustento =
      this.docSustentoArray().controls[this.indexDoc()].get('idRetAtsDocSustento')?.value;
    taxGroup.patchValue(tax);
    taxesArray.push(taxGroup);
  }
  createTax(indexDoc: number): void {
    const taxesArray = this.getTaxesArray(indexDoc);
    const taxGroup = this.createTaxGroup();
    taxGroup.patchValue({
      idRetAtsDocSustento:
        this.docSustentoArray().controls[this.indexDoc()].get('idRetAtsDocSustento')?.value,
    });
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
  createPaymentWithValue(indexDoc: number, payment: RetencionAtsDocPayment): void {
    const paymentsArray = this.getPaymentsArray(indexDoc);
    const paymentGroup = this.createPaymentGroup();

    paymentGroup.patchValue(payment);

    paymentsArray.push(paymentGroup);
  }
  createPayment(indexDoc: number): void {
    const paymentsArray = this.getPaymentsArray(indexDoc);
    const paymentGroup = this.createPaymentGroup();

    paymentsArray.push(paymentGroup);
  }

  addTaxes(indexDoc: number) {
    const documentId = this.docSustentoArray().controls[indexDoc].get('idDocumento')?.value;
    const isAutomatic = this.docSustentoArray().controls[indexDoc].get('isAutomatic')?.value;

    this._docSustentoUseCase.getTaxes({ documentId, isAutomatic }).subscribe((response) => {
      let totalSinImpuestos = 0;
      response.taxes.forEach((tax: any) => {
        this.createTaxWithValue(indexDoc, tax);
        totalSinImpuestos += tax.baseImponible;
      });

      const docSustento = this.docSustentoArray().controls[indexDoc].value;
      docSustento.totalSinImpuestos = totalSinImpuestos;
      this.docSustentoArray().controls[this.indexDoc()].setValue(docSustento);
      const payments = this.docSustentoArray().at(this.indexDoc()).get('payments') as FormArray;
      if (docSustento.idRetAtsDocSustento > 0 && payments.length > 0) return;
      response.payments.forEach((payment: RetencionAtsDocPayment) => {
        this.createPaymentWithValue(indexDoc, payment);
      });
    });
  }
  addTaxesManual(indexDoc: number) {
    this.createTax(indexDoc);
  }

  addRetencion(indexDoc: number) {
    this.createRetencion(indexDoc, {
      idRetAtsDocSustento:
        this.docSustentoArray().controls[this.indexDoc()].get('idRetAtsDocSustento')?.value,
    });
  }

  docPreview(index: number): void {
    const doc = this.docSustentoArray().controls[index].value as RetAtsDocSustento;
    if (doc.isAutomatic) {
      if (!doc.idDocumento) return;
      this._receivedDocumentSvc.previewXml(doc.idDocumento).subscribe((response) => {
        this._dialogService.open(DocElectViewerComponent, {
          size: 'xxl',
          data: response.payload,
        });
      });
    } else {
      this._tS.show({
        type: 'info',
        message: 'No disponible para documentos manuales',
      });
    }
  }

  // Remove a docSustento at a specific index
  async removeDocSustento(index: number) {
    const doc = this.docSustentoArray().controls[index].value as RetAtsDocSustento;

    if (doc.idRetAtsDocSustento > 0) {
      const { isConfirmed } = await Swal.fire({
        title: 'Eliminar documento',
        icon: 'warning',
        text: `Esta seguro(a) de eliminar el documento nro. ${doc.numDocSustento} de esta retención, de manera permanente?`,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      });
      if (isConfirmed) {
        this._docSustentoUseCase.delete(doc.idRetAtsDocSustento).subscribe((response) => {
          this._tS.show({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code === '1') {
            this.removeByIndex(index);
          }
        });
      }
    } else {
      await this.removeByIndex(index);
    }
  }

  async removeByIndex(index: number) {
    this.docSustentoArray().removeAt(index);
  }

  addPayment(indexDoc: number) {
    const payment = {
      idRetAtsDocSustento: this.docSustentoArray().at(indexDoc).get('idRetAtsDocSustento')?.value,
      total: this.docSustentoArray().at(this.indexDoc()).get('importeTotal')?.value,
    };
    this.createPaymentWithValue(indexDoc, payment as RetencionAtsDocPayment);
  }

  onSave(index: number) {
    const docSustento = this.docSustentoArray().controls[index].value as RetAtsDocSustento;

    const taxes = this.getTaxesArray(index).controls.map((tax) => tax.value);
    const retenciones = this.getRetencionesArray(index).controls.map(
      (retencion) => retencion.value,
    );
    const payments = this.getPaymentsArray(index).controls.map((payment) => payment.value);

    docSustento.taxes = taxes;
    docSustento.retenciones = retenciones;
    docSustento.payments = payments;

    this.docSustentoGroup().patchValue(docSustento);

    if (docSustento.idRetAtsDocSustento > 0) {
      this._docSustentoUseCase
        .update(docSustento.idRetAtsDocSustento, docSustento)
        .subscribe((response) => {
          this._tS.show({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
        });
    } else {
      this._docSustentoUseCase.create(docSustento).subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code === '1') {
          const { idRetAtsDocSustento } = JSON.parse(response.payload as string);
          this.docSustentoArray()
            .controls[index].get('idRetAtsDocSustento')
            ?.setValue(idRetAtsDocSustento);
        }
      });
    }
  }
}

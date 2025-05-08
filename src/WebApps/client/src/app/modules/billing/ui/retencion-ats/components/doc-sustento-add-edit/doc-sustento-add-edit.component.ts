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
import { TipoComprobante } from '@sri/domain/models/tipo-comprobante';
import { TipoPago } from '@sri/domain/models/tipo-pago';
import { TipoRegimenFiscalExterior } from '@sri/domain/models/tipo-regimen-fiscal-exterior';
import { Pais } from '@sri/domain/models/pais';
import { GenericModel } from '@core/models/generic.model';
import { DocSustentoUseCase } from '@billing/domain/use-cases/doc-sustento.use-case';
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
import { ToasterService } from '@core/services/toaster.service';

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
export class DocSustentoAddEditComponent implements AfterViewInit {
  docSustentoGroup = input.required<any>();
  docSustentoArray = input.required<FormArray>();
  indexDoc = input.required<number>();
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

  private readonly _fb = inject(FormBuilder);
  private readonly _docSustentoUseCase = inject(DocSustentoUseCase);
  private readonly _tS = inject(ToasterService);

  setPanelOpen(index: number) {
    this.panelOpenState = index;
  }

  selectSustento(index: number) {
    // Filter sustentos based on document type
    this.sustentosFiltered.set([]);
    const tipoComprobanteId =
      this.docSustentoArray().controls[index].get('tipoComprobanteId')?.value;

    this.sustentosFiltered.set(
      this.sustentosTributarios().filter(
        (x) => x.tipoComprobanteId === tipoComprobanteId,
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

  createTaxGroup(): FormGroup {
    return this._fb.group({
      idRetAtsImpDocSustento: [0],
      idRetAtsDocSustento: [0],
      idRetencionAts: [0],
      uniqueIdDoc: [this.uniqueIdDoc(), [Validators.required]],
      idImpuesto: [0],
      idTarifaImpuesto: [0],
      porcentaje: [''],
      tarifa: [0],
      baseImponible: [0, Validators.required],
      valorImpuesto: [0],
    });
  }

  createRetencionGroup(): FormGroup {
    return this._fb.group({
      idRetencionAtsRet: [0],
      idRetencionAtsDocSustento: [0],
      idRetencionAts: [0],
      uniqueIdDoc: [this.uniqueIdDoc(), [Validators.required]],
      impuestoRetencionId: [0, [Validators.required]],
      codigoRetencion: ['', Validators.required],
      baseImponible: [0, [Validators.required]],
      porcentajeRetener: [0],
      valorRetenido: [0, [Validators.required, Validators.min(0)]],
    });
  }

  createPaymentGroup(): FormGroup {
    return this._fb.group({
      idRetencionAtsPago: [0],
      idRetencionAtsDocSustento: [0],
      idRetencionAts: [0],
      uniqueIdDoc: [this.uniqueIdDoc(), [Validators.required]],
      formaPagoId: [0, [Validators.required]],
      total: [0, [Validators.required, Validators.min(0)]],
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
  createPayment(indexDoc: number, payment: RetencionAtsDocPayment): void {
    const paymentsArray = this.getPaymentsArray(indexDoc);
    const paymentGroup = this.createPaymentGroup();

    paymentGroup.patchValue(payment);

    paymentsArray.push(paymentGroup);
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

        response.payments.forEach((payment: RetencionAtsDocPayment) => {
          this.createPayment(indexDoc, payment);
        });
      });
  }

  addRetencion(indexDoc: number) {
    this.createRetencion(indexDoc, {});
  }

  docPreview(index: number): void {
    const doc = this.docSustentoArray().controls[index]
      .value as RetAtsDocSustento;
    if (doc.isAutomatic) {
      console.log(doc);
    } else {
      this._tS.toastr({
        type: 'info',
        message: 'No disponible para documentos manuales',
      });
    }
  }

  // Remove a docSustento at a specific index
  removeDocSustento(index: number) {
    this.docSustentoArray().removeAt(index);
  }

  addPayment(indexDoc: number) {
    const payment = {};
    this.createPayment(indexDoc, payment as RetencionAtsDocPayment);
  }
}

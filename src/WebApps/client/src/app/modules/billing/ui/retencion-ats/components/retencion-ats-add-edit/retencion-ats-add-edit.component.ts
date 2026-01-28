import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { RetencionAtsUseCase } from '@billing/domain/use-cases/retencion-ats/retencion-ats.use-case';
import { DynamicCard } from '@acontplus/ng-components';
import { MatAccordion } from '@angular/material/expansion';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';
import { DialogService } from '@core/services/dialog.service';
import { SupplierDocsComponent } from '@billing/ui/retencion-ats/components/supplier-docs/supplier-docs.component';
import { RetAtsDocSustento } from '@billing/domain/models/retencion-ats/ret-ats-doc-sustento.model';
import { TipoComprobante } from '@sri/domain/models/tipo-comprobante';
import { TipoPago } from '@sri/domain/models/tipo-pago';
import { TipoRegimenFiscalExterior } from '@sri/domain/models/tipo-regimen-fiscal-exterior';
import { TipoIdentificacion } from '@core/models/tipo-identificacion';
import { TipoIdentificacionProveedor } from '@sri/domain/models/tipo-identificacion-proveedor';
import { Pais } from '@sri/domain/models/pais';
import { Impuesto } from '@sri/domain/models/impuesto';
import { GenericModel } from '@core/models/generic.model';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { SustentoTributario } from '@sri/domain/models/sustento-tributario';
import { DocSustentoAddEditComponent } from '@billing/ui/retencion-ats/components/doc-sustento-add-edit/doc-sustento-add-edit.component';
import { Button } from '@acontplus/ng-components';
import { ImpuestoRetencion } from '@sri/domain/models/impuesto-retencion';
import { ConceptoRetencionAir } from '@sri/domain/models/concepto-retencion-air';
import { PorcentajeRetencionIva } from '@sri/domain/models/porcentaje-retencion-iva';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { FormaPago } from '@sri/domain/models/forma-pago';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import {
  RetAtsInfoAdicional,
  RetencionAts,
} from '@billing/domain/models/retencion-ats/retencion-ats.model';
import { RetencionAtsInfoAdicionalAddEditComponent } from '@billing/ui/retencion-ats/components/retencion-ats-info-adicional-add-edit/retencion-ats-info-adicional-add-edit.component';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDate } from '@core/utils/date.util';

@Component({
  selector: 'app-retencion-ats-add-edit',
  imports: [
    MatCustomDialogComponent,
    ReactiveFormsModule,
    DynamicCard,
    MatAccordion,
    SupplierSearchComponent,
    DocSustentoAddEditComponent,
    Button,
    MatFormField,
    MatSelectModule,
    MatInput,
    RetencionAtsInfoAdicionalAddEditComponent,
    MatDatepickerModule,
  ],
  templateUrl: './retencion-ats-add-edit.component.html',
  styles: ``,
})
export class RetencionAtsAddEditComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  readonly _data = inject<RetencionAts>(MAT_DIALOG_DATA);
  private readonly _dialogRef = inject(MatDialogRef<RetencionAtsAddEditComponent>);
  private readonly _retencionAtsUseCase = inject(RetencionAtsUseCase);
  private readonly _dialogService = inject(DialogService);
  private readonly _tS = inject(ToastrNotificationService);

  retencionAtsForm = this._fb.group({
    idRetencionAts: [0],
    idEstablecimiento: [0],
    idPuntoEmision: [0, [Validators.required]],
    tipoIdentificacionSujetoRetenido: [''],
    tipoSujetoRetenido: [''],
    parteRel: [''],
    razonSocialSujetoRetenido: [''],
    identificacionSujetoRetenido: [''],
    idProveedor: [0],
    periodoFiscal: [''],
    fechaEmision: [''],
    documentosSustento: this._fb.array([]),
    infoAdicional: this._fb.array([]),
  });

  idDocumentoElectronico = 0;
  isDisabledEmitionDate: boolean = true;
  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] | undefined = [];
  subContribuyente = '';
  tiposIdentificacion: TipoIdentificacion[] = [];
  tiposIdentificacionProveedor: TipoIdentificacionProveedor[] = [];
  generic: GenericModel[] = [{ code: 'SI' }, { code: 'NO' }];
  retAtsDocSustentos: RetAtsDocSustento[] = [];
  tiposComprobante: TipoComprobante[] = [];
  sustentosTributarios: SustentoTributario[] = [];
  tiposPago: TipoPago[] = [];
  tiposRegimen: TipoRegimenFiscalExterior[] = [];
  countries: Pais[] = [];
  taxes: Impuesto[] = [];
  tarifaImpuestos: TarifaImpuesto[] = [];
  impuestosRetencion: ImpuestoRetencion[] = [];
  conceptosRetencionAir: ConceptoRetencionAir[] = [];
  porcentajesRetIva: PorcentajeRetencionIva[] = [];
  formasPago: FormaPago[] = [];
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  // Info adicional
  infoAdicional: RetAtsInfoAdicional[] = [];
  supplierSelected = '';
  dataLoaded = false;

  // Computed properties
  dialogIcon = signal('add');
  dialogTitle = signal('Registrar Retención ATS');

  // Services

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get docSustentoArray(): FormArray {
    return this.retencionAtsForm.get('documentosSustento') as FormArray;
  }

  get infoAdicionalArray(): FormArray {
    return this.retencionAtsForm.get('infoAdicional') as FormArray;
  }

  // Create a new docSustento FormGroup
  createDocSustentoGroup() {
    return this._fb.group({
      idRetencionAts: [0],
      idRetAtsDocSustento: [0],
      idDocumento: [0],
      uniqueIdDoc: [generateUuidv4(), [Validators.required]],
      documentoSustentoTributarioId: [0, [Validators.required]],
      tipoComprobanteId: [0],
      numDocSustento: [''],
      fechaEmisionDocSustento: [''],
      fechaRegistroContable: [''],
      numAutDocSustento: [''],
      pagoLocExt: [''],
      tipoRegimenFiscalExteriorId: [0],
      paisEfecPago: [''],
      aplicConvDobTrib: [''],
      pagExtSujRetNorLeg: [''],
      pagoRegFis: [''],
      totalComprobantesReembolso: [0],
      totalBaseImponibleReembolso: [0],
      totalImpuestoReembolso: [0],
      totalSinImpuestos: [0],
      importeTotal: [0],
      taxes: this._fb.array([], [Validators.required]),
      retenciones: this._fb.array([], [Validators.required]),
      reembolsos: this._fb.group({
        id: [0],
        taxes: this._fb.array([]),
      }),
      payments: this._fb.array([], [Validators.required]),
      isAutomatic: [false],
    });
  }

  createInfoAdicional() {
    return this._fb.group({
      idRetAtsInfoAdicional: [0],
      idRetencionAts: [0],
      nombre: ['', [Validators.required]],
      valor: ['', [Validators.required]],
    });
  }

  // Add a docSustento with predefined values

  addDocSustento(doc: RetAtsDocSustento) {
    const docGroup = this.createDocSustentoGroup();

    let formattedFecha = '';

    // Check if fecha is a valid date before formatting
    if (doc.fechaEmisionDocSustento) {
      const parsedDate = new Date(doc.fechaEmisionDocSustento);
      if (!isNaN(parsedDate.getTime())) {
        formattedFecha = parsedDate.toISOString().split('T')[0];
      }
    }

    // Patch the values into the form
    docGroup.patchValue({
      ...doc,
      fechaEmisionDocSustento: formattedFecha,
    });
    this.docSustentoArray.push(docGroup);
  }

  addInfoAdicional() {
    this.infoAdicionalArray.push(this.createInfoAdicional());
  }

  addInfoAdicionalWithValues(infoAdicional: RetAtsInfoAdicional) {
    const infoAdicionalGroup = this.createInfoAdicional();
    infoAdicionalGroup.patchValue(infoAdicional);
    this.infoAdicionalArray.push(infoAdicionalGroup);
  }
  initialLoad() {
    this._retencionAtsUseCase.getDataForm({}).subscribe((response) => {
      this.estabs = groupEstabUtil({
        estabs: response.estabs,
        isGroupPuntoEmision: true,
      });
      const idEstablecimiento = this.estabs.find((x) => x.defaultEstab)?.idEstablecimiento || 0;
      this.retencionAtsForm.get('idEstablecimiento')?.setValue(idEstablecimiento);

      if (idEstablecimiento > 0) {
        this.onSelectEstablecimiento();
      }
      this.tiposIdentificacion = response.tiposIdentificacion;
      this.tiposIdentificacionProveedor = response.tiposIdentificacionProveedor;
      this.tiposComprobante = response.tiposComprobante;
      this.sustentosTributarios = response.sustentosTributarios;
      this.tiposPago = response.tiposPago;
      this.tiposRegimen = response.tiposRegimen;
      this.taxes = response.taxes;
      this.tarifaImpuestos = response.tarifaImpuestos;
      this.impuestosRetencion = response.impuestosRetencion;
      this.conceptosRetencionAir = response.conceptosRetencionAir;
      this.porcentajesRetIva = response.porcentajesRetIva;
      this.formasPago = response.formasPago;
      this.dataLoaded = true;
    });
  }

  ngOnInit() {
    this.initialLoad();
    if (this._data && this._data.idRetencionAts > 0) {
      this.supplierSelected = this._data.razonSocialSujetoRetenido;
      const parsedData = {
        ...this._data,
        documentosSustento: JSON.parse(this._data.documentosSustento || '[]'),
        infoAdicional: JSON.parse(this._data.infoAdicional || '[]'),
      };
      // console.log(parsedData);
      this.retencionAtsForm.patchValue(parsedData);
      const formatedDate = formatDate(this._data.fechaEmision);
      this.retencionAtsForm.get('fechaEmision')?.setValue(formatedDate.toISOString());
      this.getPeriod();
      this.retAtsDocSustentos = parsedData.documentosSustento;
      this.retAtsDocSustentos.forEach((doc) => {
        this.addDocSustento(doc);
      });
      this.infoAdicional = parsedData.infoAdicional;
      this.infoAdicional.forEach((info) => {
        this.addInfoAdicionalWithValues(info);
      });
      this.isDisabledEmitionDate = false;
    } else {
      this.retencionAtsForm.get('fechaEmision')?.setValue(formatDate(new Date()).toISOString());

      this.retencionAtsForm.get('parteRel')?.setValue('NO');
      this.getPeriod();
    }
  }

  onClose() {
    this._dialogRef.close();
  }

  onSelectEstablecimiento(): void {
    const idEstablecimiento = this.retencionAtsForm.get('idEstablecimiento')?.value;

    if (idEstablecimiento) {
      const estab = this.estabs.find((x) => x.idEstablecimiento == idEstablecimiento);

      this.puntosEmision = estab?.puntosEmision;

      if (this.puntosEmision && this.puntosEmision.length > 0) {
        const idPuntoEmision = this.puntosEmision.find((x) => x.defaultPtoEmi)?.idPuntoEmision;

        if (idPuntoEmision) {
          this.retencionAtsForm.get('idPuntoEmision')?.setValue(idPuntoEmision);
        }
      }
    }
  }

  onSelectPuntoEmision(): void {
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

  onSupplierSelected(data: SupplierSearch) {
    this.retencionAtsForm
      .get('identificacionSujetoRetenido')
      ?.setValue(data.identificacionComprador);
    this.retencionAtsForm.get('idProveedor')?.setValue(data.idProveedor);

    this.retencionAtsForm
      .get('tipoIdentificacionSujetoRetenido')
      ?.setValue(data.codigoTipoIdentificacion);

    // if (infrastructure.codigoTipoIdentificacion === '06' || infrastructure.codigoTipoIdentificacion === '08') {
    //   this.retencionAtsForm.get('tipoSujetoRetenido')?.setValue('EXTERNO');
    // }
  }

  clearSupplierSearch() {
    this.retencionAtsForm.get('identificacionSujetoRetenido')?.setValue('');
  }

  searchDocs() {
    const dialogRef = this._dialogService.open(SupplierDocsComponent, {
      size: 'lg',
      data: {
        idProveedor: this.retencionAtsForm.get('idProveedor')?.value,
        idCard: this.retencionAtsForm.get('identificacionSujetoRetenido')?.value,
      },
    });

    dialogRef.subscribe((response) => {
      if (typeof response !== 'undefined') {
        const { documents } = response;
        if (documents.length > 0) {
          this.retAtsDocSustentos = documents;
          this.retAtsDocSustentos.forEach((doc) => {
            this.addDocSustento(doc);
          });
        }
      }
    });
  }

  onSave() {
    if (this._data && this._data.idRetencionAts > 0) {
      this._retencionAtsUseCase
        .update(this._data.idRetencionAts, this.retencionAtsForm.value)
        .subscribe((response) => {
          this._tS.show({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code === '1') {
            this._dialogRef.close(response);
          }
        });
    } else {
      this._retencionAtsUseCase.create(this.retencionAtsForm.value).subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code === '1') {
          this._dialogRef.close(response);
        }
      });
    }
  }
}

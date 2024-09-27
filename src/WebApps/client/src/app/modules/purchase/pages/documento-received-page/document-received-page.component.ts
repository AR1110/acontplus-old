import { Component, inject, signal } from '@angular/core';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { SupplierSearchComponent } from '@customer/supplier/components/supplier-search/supplier-search.component';
import { FormsModule } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MatTooltip } from '@angular/material/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subcategory } from '@accounting/models/subcategory';
import { InputNumberDirective } from '@shared/directives/ui/input-number.directive';
import { MatButton } from '@angular/material/button';
import { ToasterService } from '@core/services/toaster.service';
import Swal from 'sweetalert2';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { ModalService } from '@core/services/modal.service';
import { DocManualUploadComponent } from '@purchase/components/document-received/doc-manual-upload/doc-manual-upload.component';
import { SharedService } from '@core/services/shared.service';
import { DocumentoReceived } from '@purchase/models/document-received.model';
import { DocumentReceivedService } from '@purchase/services/document-received.service';
import { MatPagination } from '@shared/models/pagination.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-documento-received-page',
  standalone: true,
  imports: [
    MatDynamicTableComponent,
    BreadcrumbComponent,
    MatCard,
    MatCardContent,
    DateRangeSelectionComponent,
    SupplierSearchComponent,
    FormsModule,
    MatTooltip,
    FaIconComponent,
    InputNumberDirective,
    MatButton,
    MatPaginator,
  ],
  templateUrl: './document-received-page.component.html',
  styles: ``,
})
export class DocumentReceivedPageComponent {
  documents: DocumentoReceived[] = [];
  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'fechaEmision', label: 'Subcategoría', type: 'string' },
    { key: 'subcategoryName', label: 'Fecha Emisión', type: 'string' },
    { key: 'serieComprobante', label: 'Serie', type: 'string' },
    { key: 'importeTotal', label: 'Total', type: 'number' },
    { key: 'rucEmisor', label: 'Ruc Emisor', type: 'string' },
    { key: 'razonSocialEmisor', label: 'Razón Social Emisor', type: 'string' },
    { key: 'claveAcceso', label: 'No. Aut.', type: 'string' },
    { key: 'fechaAutorizacion', label: 'F. Aut.', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSearch = {
    codDoc: '',
    codEstab: '',
    serieComprobante: '',
    subcategoryId: 0,
    startDate: '',
    endDate: '',
    claveAcceso: '',
    rucProveedor: '',
  };
  tipoComprobantes: any[] = [];
  extraOptionsIcon: IconProp = 'eye';
  extraOptionsTooltip: string = 'Ver más filtros';
  moreOptionsFilter: boolean = false;
  subcategories: Subcategory[] = [];
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  pagination = signal(new MatPagination());
  private readonly _documentReceivedService = inject(DocumentReceivedService);
  private readonly _modalService = inject(ModalService);
  private readonly _sharedService = inject(SharedService);
  private readonly _tS = inject(ToasterService);

  async alertEstabSelected() {
    if (this.establecimientos.length === 0) {
      return this._tS.toastr({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
        positionClass: 'toast-top-center',
      });
    }
    let dataEstab = this.establecimientos.find(
      (estab) => estab.codEstab === this.dataSearch.codEstab,
    );
    if (dataEstab) {
      let { isConfirmed } = await Swal.fire({
        title: 'Estab.: ' + dataEstab.nombreComercial,
        text: 'Esta seguro de realizar una nueva importación de comprobantes en este establecimiento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Proceder',
        cancelButtonText: 'No, cancelar',
      });
      return isConfirmed;
    }
    return false;
  }

  getEstabs() {
    this._sharedService.getEstabAsign().subscribe((response) => {
      this.establecimientos = response;
      let codEstabFound = this.establecimientos.find(
        (x) => x.predeterminado,
      )?.codEstab;
      if (codEstabFound) {
        this.dataSearch.codEstab = codEstabFound;
        this.loadData();
      }
    });
  }

  loadData() {
    const dataSearch = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      codEstab: this.dataSearch.codEstab,
      rucProveedor: this.dataSearch.rucProveedor,
      claveAcceso: this.dataSearch.claveAcceso,
      ckBoxFecha: true,
      startDate: this.dataSearch.startDate,
      endDate: this.dataSearch.endDate,
      codDoc: this.dataSearch.codDoc,
      serieComprobante: this.dataSearch.serieComprobante,
      subcategoryId: this.dataSearch.subcategoryId,
      tipo: 1,
    };
    this._documentReceivedService.get(dataSearch).subscribe((response) => {
      this.documents = response.documents;
      this.pagination().totalRecords = this.documents[0]?.totalRecords ?? 0;
    });
  }

  ngOnInit() {
    this.getEstabs();
  }

  onDateRangeSelection($event: { from: string; to: string }) {
    console.log('selecting dates');
    this.dataSearch.startDate = $event.from;
    this.dataSearch.endDate = $event.to;
    this.loadData();
  }

  onSupplierSelected($event: { data: any }) {}

  onChangeTipoDoc() {}

  onClickBtnMore() {
    this.moreOptionsFilter = !this.moreOptionsFilter;
    if (this.moreOptionsFilter) {
      this.extraOptionsIcon = 'eye-slash';
      this.extraOptionsTooltip = 'Ocultar filtros';
    } else {
      this.extraOptionsIcon = 'eye';
      this.extraOptionsTooltip = 'Ver más filtros';
    }
  }

  onChangeSerieComprobante() {}

  openModalAutomaticUpload() {}

  async openModalManualUpload() {
    if (!(await this.alertEstabSelected())) return;
    let subcategoriesFound = this.subcategories || [];

    if (subcategoriesFound.length == 0) {
      return this._tS.toastr({
        type: 'warning',
        message:
          'Debe de registrar subcategorías de compra en el módulo de contabilidad',
      });
    }
    const modalRef = this._modalService.openModalCustom(
      DocManualUploadComponent,
      {
        size: 'xl',
        centered: true,
      },
    );
  }

  openModalChangeEstab() {}

  editSubcategory() {}

  onChangeEstab() {}

  onPageChanged($event: PageEvent) {
    this.pagination().pageIndex = $event.pageIndex;
    this.pagination().pageSize = $event.pageSize;
    this.loadData();
  }
}

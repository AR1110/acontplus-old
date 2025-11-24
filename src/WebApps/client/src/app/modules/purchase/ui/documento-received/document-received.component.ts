import { Component, inject, signal, OnInit } from '@angular/core';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';

import { Subcategory } from '@accounting/sub-category/domain/subcategory';
import { InputNumberDirective } from '@shared/directives/ui/input-number.directive';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import Swal from 'sweetalert2';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { DocManualUploadComponent } from '@purchase/ui/documento-received/components/doc-manual-upload/doc-manual-upload.component';
import { SharedService } from '@core/services/shared.service';
import { DocumentReceived } from '@purchase/domain/document-received.model';
import { Pagination, DynamicCard } from '@acontplus/ng-components';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RetencionHtmlComponent } from '@billing/ui/shared/components/retencion-html/retencion-html.component';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { InvoiceHtmlComponent } from '@billing/ui/shared/components/invoice-html/invoice-html.component';
import { CreditNoteHtmlComponent } from '@billing/ui/shared/components/credit-note-html/credit-note-html.component';
import { DialogService } from '@core/services/dialog.service';
import { SubCategoryUseCase } from '@accounting/sub-category/application/sub-category.use-case';
import { DocumentReceivedUseCase } from '@purchase/domain/use-cases/document-received.use-case';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';
import { Button } from '@acontplus/ng-components';

@Component({
  selector: 'app-documento-received',
  imports: [
    DynamicCard,
    MatDynamicTableComponent,
    BreadcrumbComponent,
    MatCard,
    MatCardContent,
    DateRangeSelectionComponent,
    SupplierSearchComponent,
    FormsModule,
    InputNumberDirective,
    MatPaginator,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatButton,
    Button,
  ],
  templateUrl: './document-received.component.html',
  styles: ``,
})
export class DocumentReceivedComponent implements OnInit {
  documents: DocumentReceived[] = [];
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
  textSearch = '';
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
  documentTypes: TipoDoc[] = [];
  extraOptionsIcon = 'visibility';
  extraOptionsTooltip = 'Ver más filtros';
  moreOptionsFilter = false;
  subcategories: Subcategory[] = [];
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  pagination = signal(new Pagination());
  private readonly _documentReceivedUseCase = inject(DocumentReceivedUseCase);
  private readonly _dialogService = inject(DialogService);
  private readonly _sharedService = inject(SharedService);
  private readonly _subCategoryUseCase = inject(SubCategoryUseCase);

  private readonly _tS = inject(ToastrNotificationService);

  async alertEstabSelected() {
    if (this.establecimientos.length === 0) {
      return this._tS.show({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
      });
    }
    const dataEstab = this.establecimientos.find(
      (estab) => estab.codEstab === this.dataSearch.codEstab,
    );
    if (dataEstab) {
      const { isConfirmed } = await Swal.fire({
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

  loadFilters() {
    this._documentReceivedUseCase.getDataFilter().subscribe((response) => {
      this.establecimientos = response.establecimientos;
      this.documentTypes = response.documentTypes;
      const codEstabFound = this.establecimientos.find((x) => x.predeterminado)?.codEstab;
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
    this._documentReceivedUseCase.get(dataSearch).subscribe((response) => {
      this.documents = response.documents;
      this.pagination().totalRecords = this.documents[0]?.totalRecords ?? 0;
    });
  }

  ngOnInit() {
    this.loadFilters();
  }

  onDateRangeSelection($event: { from: string; to: string }) {
    console.log('selecting dates');
    this.dataSearch.startDate = $event.from;
    this.dataSearch.endDate = $event.to;
    this.loadData();
  }

  onSupplierSelected($event: SupplierSearch) {}

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

    this._subCategoryUseCase.getAll({}).subscribe((response) => {
      this.subcategories = response;
      if (this.subcategories.length > 0) {
        const dialogRef = this._dialogService.open(DocManualUploadComponent, {
          size: 'lg',
          data: {
            codEstab: this.dataSearch.codEstab,
            nombreComercial: this.establecimientos.find(
              (x) => x.codEstab == this.dataSearch.codEstab,
            )?.nombreComercial,
          },
        });
      } else {
        return this._tS.show({
          type: 'warning',
          message: 'Debe de registrar subcategorías de compra en el módulo de contabilidad',
        });
      }
    });
  }

  openModalChangeEstab() {}

  editSubcategory() {}

  onChangeEstab() {}

  onPageChanged($event: PageEvent) {
    this.pagination().pageIndex = $event.pageIndex;
    this.pagination().pageSize = $event.pageSize;
    this.loadData();
  }

  openModalDocument(item: any) {
    switch (item.codDoc) {
      case '07':
        this._dialogService.open(RetencionHtmlComponent, {
          size: 'xl',
        });
        break;
      case '04':
        this._dialogService.open(CreditNoteHtmlComponent, {
          size: 'xl',
        });
        break;
      default:
        this._dialogService.open(InvoiceHtmlComponent, {
          size: 'xl',
        });
        break;
    }
    // this._documentReceivedService
    //   .getById(item.idDocumento)
    //   .subscribe((response) => {
    //     if (!response.payload) {
    //       this._tS.toastr({
    //         type: 'warning',
    //         message: 'Aun no se actualizado el Xml del SRI',
    //       });
    //     }
    //   });
  }

  getMergedDocs(item: any) {}

  putXml(item: any) {}

  downloadXml(item: any) {}

  askToDelete(item: any) {}

  getRide(item: any) {}
}

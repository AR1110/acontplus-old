import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { Button, DynamicCard, DataGrid, DataGridColumn } from '@acontplus/ng-components';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { FormsModule } from '@angular/forms';
import { InputNumberDirective } from '@shared/directives/ui/input-number.directive';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { LOOKUP_HTTP_TOKEN, RECEIVED_DOCUMENT_HTTP_TOKEN } from '@purchases/data/purchases-token';
import { DialogService } from '@core/services/dialog.service';
import { SUB_CATEGORY_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import Swal from 'sweetalert2';
import { SupplierSearch } from '@customer/domain/models/supplier.interface';
import { DocManualUploadComponent } from '@purchases/ui/received-document/components/doc-manual-upload/doc-manual-upload.component';
import { RetencionHtmlComponent } from '@billing/ui/shared/components/retencion-html/retencion-html.component';
import { CreditNoteHtmlComponent } from '@billing/ui/shared/components/credit-note-html/credit-note-html.component';
import { InvoiceHtmlComponent } from '@billing/ui/shared/components/invoice-html/invoice-html.component';
import { ReceivedDocumentList } from '@purchases/data/models/received-document';
import { ContextType, LookupItem, ModuleType } from '@core/models/lookup-type';

@Component({
  selector: 'app-received-document',
  imports: [
    BreadcrumbComponent,
    Button,
    DateRangeSelectionComponent,
    DynamicCard,
    FormsModule,
    InputNumberDirective,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    DataGrid,
    SupplierSearchComponent,
  ],
  templateUrl: './received-document.html',
  styleUrl: './received-document.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceivedDocument implements OnInit {
  documents = signal<ReceivedDocumentList[]>([]);
  columns: DataGridColumn[] = [
    {
      header: 'Fecha Emisión',
      field: 'fechaEmision',
      sortable: true,
    },
    {
      header: 'Subcategoría',
      field: 'subcategoryName',
      sortable: true,
    },
    {
      header: 'Serie',
      field: 'serieComprobante',
      sortable: true,
    },
    {
      header: 'Total',
      field: 'importeTotal',
      sortable: true,
    },
    {
      header: 'Ruc Emisor',
      field: 'rucEmisor',
      sortable: true,
    },
    {
      header: 'Razón Social Emisor',
      field: 'razonSocialEmisor',
      sortable: true,
    },
    {
      header: 'No. Aut.',
      field: 'claveAcceso',
      sortable: true,
    },
    {
      header: 'F. Aut.',
      field: 'fechaAutorizacion',
      sortable: true,
    },
    {
      header: 'Acciones',
      field: 'actions',
      sortable: false,
    },
  ];
  textSearch = '';
  dataSearch = {
    codDoc: '',
    estabId: 0,
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
  subcategories = signal<LookupItem[]>([]);
  establishments = signal<LookupItem[]>([]);

  // DataGrid pagination properties
  page = 0;
  pageSize = 10;
  pageCount = 0;

  private readonly _lookupRepository = inject(LOOKUP_HTTP_TOKEN);
  private readonly _receivedDocumentSvc = inject(RECEIVED_DOCUMENT_HTTP_TOKEN);
  private readonly _dialogService = inject(DialogService);
  private readonly _subCategoryHttp = inject(SUB_CATEGORY_HTTP_TOKEN);
  private readonly _tS = inject(ToastrNotificationService);

  async alertEstabSelected() {
    if (this.establishments().length === 0) {
      return this._tS.show({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
      });
    }
    const dataEstab = this.establishments().find((estab) => estab.id === this.dataSearch.estabId);
    if (dataEstab) {
      const { isConfirmed } = await Swal.fire({
        title: 'Estab.: ' + dataEstab.value,
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
    this._lookupRepository
      .getLookup({
        module: ModuleType.ReceivedDocument,
        context: ContextType.Filters,
      })
      .subscribe((response) => {
        this.establishments.set(response.establishments);

        const newEstablishment: LookupItem = {
          id: 0,
          code: '',
          value: 'Todos',
          displayOrder: 0,
          isActive: false,
          isDefault: true,
        };
        response.subcategories.unshift(newEstablishment);

        this.subcategories.set(response.subcategories);

        // Set default establishment
        const estabDefault = this.establishments().find((estab) => estab.isDefault);
        if (estabDefault) {
          this.dataSearch.estabId = estabDefault.id;
          this.loadData();
        } else {
          this._tS.show({
            type: 'warning',
            message: 'No hay establecimientos predeterminados',
          });
        }
      });
  }

  loadData() {
    const dataSearch = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
      estabId: this.dataSearch.estabId,
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

    console.log(dataSearch);

    this._receivedDocumentSvc.get(dataSearch).subscribe((response) => {
      this.documents.set(response.documents);
      this.pageCount = this.documents()[0]?.totalRecords ?? 0;
    });
  }

  ngOnInit() {
    this.loadFilters();
  }

  onDateRangeSelection($event: { from: string; to: string }) {
    this.dataSearch.startDate = $event.from;
    this.dataSearch.endDate = $event.to;
    this.loadData();
  }

  onSupplierSelected(_$event: SupplierSearch) {
    // TODO: Implement supplier selection logic
  }

  onChangeTipoDoc() {
    // TODO: Implement document type change logic
  }

  onClickBtnMore() {
    this.moreOptionsFilter = !this.moreOptionsFilter;
    if (this.moreOptionsFilter) {
      this.extraOptionsIcon = 'visibility_off';
      this.extraOptionsTooltip = 'Ocultar filtros';
    } else {
      this.extraOptionsIcon = 'visibility';
      this.extraOptionsTooltip = 'Ver más filtros';
    }
  }

  onChangeSerieComprobante() {
    // TODO: Implement serie comprobante change logic
  }

  openModalAutomaticUpload() {
    // TODO: Implement automatic upload modal
  }

  async openModalManualUpload() {
    if (!(await this.alertEstabSelected())) return;

    this._subCategoryHttp.getAll({}).subscribe((response) => {
      if (this.subcategories().length > 0) {
        this._dialogService.open(DocManualUploadComponent, {
          size: 'lg',
          data: {
            estabId: this.dataSearch.estabId,
            nombreComercial: this.establishments().find((x) => x.id == this.dataSearch.estabId)
              ?.value,
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

  openModalChangeEstab() {
    // TODO: Implement change establishment modal
  }

  editSubcategory() {
    // TODO: Implement edit subcategory-page logic
  }

  onChangeEstab() {
    // TODO: Implement establishment change logic
  }

  onPageChanged(event: { pageIndex: number; pageSize: number }) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  openModalDocument(item: ReceivedDocumentList) {
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
  }

  getMergedDocs(_item: ReceivedDocumentList) {
    // TODO: Implement get merged documents logic
  }

  putXml(_item: ReceivedDocumentList) {
    // TODO: Implement update XML logic
  }

  downloadXml(_item: ReceivedDocumentList) {
    // TODO: Implement download XML logic
  }

  askToDelete(_item: ReceivedDocumentList) {
    // TODO: Implement delete confirmation logic
  }

  getRide(_item: ReceivedDocumentList) {
    // TODO: Implement get RIDE logic
  }
}

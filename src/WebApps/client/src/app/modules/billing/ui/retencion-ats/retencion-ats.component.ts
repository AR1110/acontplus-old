import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DynamicCard } from '@acontplus/ng-components';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  RetencionAts,
  RetencionAtsList,
} from '@billing/domain/models/retencion-ats/retencion-ats.model';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { Pagination } from '@acontplus/ng-components';
import { RetencionAtsUseCase } from '@billing/domain/use-cases/retencion-ats/retencion-ats.use-case';
import { DialogService } from '@core/services/dialog.service';
import { RetencionAtsAddEditComponent } from './components/retencion-ats-add-edit/retencion-ats-add-edit.component';
import { MatTooltip } from '@angular/material/tooltip';
import { SharedService } from '@core/services/shared.service';
import { REPORT_CODE } from '@core/constants/global.constants';
import { SendMailDialogDirective } from '@shared/directives/send-mail-dialog.directive';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { DocumentoElectronicoUseCase } from '@billing/domain/use-cases/documento-electronico.use-case';
import { isApiResponse } from '@core/models/api-response-legacy';
import { DocElectFiltersComponent } from '@shared/components/doc-elect-filters/doc-elect-filters.component';
import {
  FilterOptions,
  getMergedDocElectFilterOptions,
} from '@billing/domain/models/documento-electronico.model';
import { PersonType } from '@customer/shared/enums/customer.enum';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-retencion-ats',
  imports: [
    BreadcrumbComponent,
    DynamicCard,
    MatMenuTrigger,
    MatIconButton,
    MatIcon,
    MatMenuItem,
    MatMenu,
    MatDynamicTableComponent,
    MatPaginator,
    MatTooltip,
    SendMailDialogDirective,
    DocElectFiltersComponent,
  ],
  templateUrl: './retencion-ats.component.html',
  styles: ``,
})
export class RetencionAtsComponent implements OnInit {
  retenciones = signal<RetencionAtsList[]>([]);

  showMoreOptions = signal(false);
  dataSearch = signal<any>({});
  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'estado', label: 'Estado', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'serieComprobante', label: 'Serie', type: 'string' },
    { key: 'rucReceptor', label: 'Ruc Receptor', type: 'string' },
    { key: 'razonSocial', label: 'Razón Social ', type: 'string' },
    { key: 'claveAcceso', label: 'No. Aut.', type: 'string' },
    { key: 'fechaAutorizacion', label: 'F. Aut.', type: 'string' },
    { key: 'usuario', label: 'Usuario', type: 'string' },
    { key: 'importeTotal', label: 'Total Retenido', type: 'number' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  private readonly _dialogService = inject(DialogService);
  private readonly _documentoElectronicoUseCase = inject(DocumentoElectronicoUseCase);
  private readonly _retencionAtsUseCase = inject(RetencionAtsUseCase);
  private readonly _sharedService = inject(SharedService);
  private readonly _tS = inject(ToastrNotificationService);

  pagination = signal(new Pagination());

  loadData() {
    this.pagination().pageIndex = 1;
    const obj = {
      ...this.pagination(),
      ...this.dataSearch(),
    };
    this._retencionAtsUseCase.getAll(obj).subscribe((response) => {
      if (response.retenciones.length > 0) {
        this.retenciones.set(response.retenciones);
        this.pagination().totalRecords = response.retenciones[0].totalRecords || 0;
      } else this.retenciones.set([]);
    });
  }

  ngOnInit() {
    this.loadData();
  }

  onDialogOpen() {
    const dialogRef = this._dialogService.open(RetencionAtsAddEditComponent, {
      size: 'xxl',
    });

    dialogRef.subscribe((response) => {
      if (isApiResponse(response) && response.code === '1') {
        this.loadData();
      }
    });
  }

  onPageChanged($event: PageEvent) {
    this.pagination().pageIndex = $event.pageIndex + 1;
    this.pagination().pageSize = $event.pageSize;
    this.loadData();
  }

  downloadXml(item: RetencionAts) {
    this._documentoElectronicoUseCase.downloadXml(item.idDocumentoElectronico).subscribe();
  }

  getRide(item: RetencionAts) {
    const format = 'pdf';
    const parameters = {
      dataParams: JSON.stringify({
        versionComp: item.versionComp,
        idDocumentoElectronico: item.idDocumentoElectronico,
      }),
      reportParams: JSON.stringify({
        codigo: REPORT_CODE.RRC,
        codEstab: item.codEstab,
        format,
      }),
      hasService: true,
    };
    this._sharedService.getReport({ data: parameters, isOldVersion: true });
  }

  cancel(item: RetencionAtsList) {
    Swal.fire({
      title: '¿Está seguro de anular el documento?',
      text: 'Una vez cancelado no se podrá modificar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._retencionAtsUseCase.cancel(item.idDocumentoElectronico).subscribe((response) => {
          this._tS.show({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code === '1') {
            this.loadData();
          }
        });
      }
    });
  }

  authorize(item: RetencionAtsList) {
    Swal.fire({
      title: '¿Está seguro de autorizar el documento?',
      text: 'Una vez autorizado no se podrá modificar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, autorizar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._documentoElectronicoUseCase
          .authorize(item.idDocumentoElectronico)
          .subscribe((response) => {
            this._tS.show({
              type: response.code === '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code === '1') {
              this.loadData();
            }
          });
      }
    });
  }

  sendEmail(item: RetencionAtsList) {
    return {
      receptor: item.emailReceptor,
      idDocumentoElectronico: item.idDocumentoElectronico,
    };
  }

  sendWhatsApp(item: RetencionAtsList) {
    console.log(item);
  }

  edit(item: RetencionAtsList) {
    this._retencionAtsUseCase.getById(item.idRetencionAts).subscribe((response) => {
      const dialogRef = this._dialogService.open(RetencionAtsAddEditComponent, {
        size: 'xxl',
        data: response,
      });

      dialogRef.subscribe((response) => {
        if (isApiResponse(response) && response.code === '1') {
          this.loadData();
        }
      });
    });
  }

  refresh() {
    this.loadData();
  }

  onSearch(filterData: any): void {
    this.dataSearch.set(filterData);
    this.loadData();
  }

  onSelectCliente(cliente: any): void {
    console.log('Cliente selected:', cliente);
    // Additional logic if needed
  }

  onKeyupCliente(): void {
    console.log('Cliente search keyup');
    // Additional logic if needed
  }

  toggleMoreOptions(): void {
    this.showMoreOptions.set(!this.showMoreOptions());
  }

  onSelectUsuario(usuario: any): void {
    console.log('Usuario selected:', usuario);
    // Additional logic if needed
  }

  onKeyupUsuario(searchText: string) {
    console.log('Search usuario:', searchText);
    // Additional logic if needed
  }

  myCustomFilterOptions: FilterOptions = getMergedDocElectFilterOptions({
    showTipoDocumento: signal(false),
    personType: signal(PersonType.SUPPLIER),
  });
}

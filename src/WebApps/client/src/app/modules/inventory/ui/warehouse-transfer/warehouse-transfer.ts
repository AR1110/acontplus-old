import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { DynamicCard, Pagination } from '@acontplus/ng-components';
import { MatIconButton } from '@angular/material/button';
import { WAREHOUSE_TRANSFER_SERVICE } from '@inventory/tokens/inventory-token';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { finalize } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { DialogService } from '@core/services/dialog.service';
import { WarehouseTransferAddEdit } from '@inventory/ui/warehouse-transfer/warehouse-transfer-add-edit/warehouse-transfer-add-edit';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { DataGridColumn, DataGridRowClassFormatter } from '@shared/components/data-grid/types';
import {
  INVENTORY_CODE_REPORT,
  INVENTORY_MODULES_CODE,
} from '@inventory/domain/enums/inventory.enum';
import { ACTION_ALIASES } from '@core/constants/permission-actions';
import { HasPermissionDirective } from '@core/directives/permission';
import { usePermissions } from '@core/composables/use-permissions';
import { WarehouseTransferDetail } from '@inventory/ui/warehouse-transfer/warehouse-transfer-detail/warehouse-transfer-detail';
import Swal from 'sweetalert2';
import { GenerateReportUseCase } from '@modules/api/reports/application/generate-report.use-case';
import { ReportParamsBuilder } from '@shared/utils/report-params.builder';

@Component({
  selector: 'app-warehouse-transfer',
  imports: [
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    DynamicCard,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatSelectModule,
    FormsModule,
    MatInput,
    DataGrid,
    HasPermissionDirective,
  ],
  templateUrl: './warehouse-transfer.html',
  styleUrl: './warehouse-transfer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseTransfer implements OnInit {
  inventory_modules_code = signal(INVENTORY_MODULES_CODE);
  action_aliases = signal(ACTION_ALIASES);
  public perms = usePermissions(this.inventory_modules_code().WAREHOUSE_TRANSFER);
  private warehouseTransferService = inject(WAREHOUSE_TRANSFER_SERVICE);
  private _reportUseCase = inject(GenerateReportUseCase);
  private noti = inject(ToastrNotificationService);
  private dgSvc = inject(DialogService);
  list = signal<any[]>([]);

  rowClassFormatter: DataGridRowClassFormatter = {
    danger: (data) => data.estadoCodigo === 'A',
  };
  columns: DataGridColumn[] = [
    { header: 'Nro.', field: 'index' },

    {
      header: 'Op,',
      field: 'operation',
      width: '220px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'file_copy',
          tooltip: 'Duplicar',
          click: (rowData) => {
            if (!this.perms.canCreate()) {
              this.noti.warning({
                message: 'No tiene permisos para duplicar',
              });
              return;
            }
            this.handleDuplicated(rowData);
          },
        },
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Editar',
          click: (rowData: any) => {
            if (!this.perms.canEdit()) {
              this.noti.warning({
                message: 'No tiene permisos para editar',
              });
              return;
            }
            this.handleEdit(rowData);
          },
        },
        {
          type: 'icon',
          icon: 'cancel',
          tooltip: 'Anular',
          click: async (item: any) => {
            if (!this.perms.canCancel()) {
              this.noti.warning({
                message: 'No tiene permisos para anular',
              });
              return;
            }

            const { isConfirmed } = await Swal.fire({
              title: '<small>Anular Transferencia?</small>',
              html: `<small>Esta Ud. seguro de anular esta Transferencia <b>N° ${item.nroDoc}</b></small>?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si',
              cancelButtonText: 'No',
            });

            if (!isConfirmed) return;

            this.warehouseTransferService.updateStatus(item.id).subscribe((response) => {
              if (response.success) {
                this.noti.success({
                  message: response.message,
                });
                this.refresh();
              } else {
                this.noti.warning({
                  message: response.message,
                });
              }
            });
          },
        },
        {
          type: 'icon',
          icon: 'more_vert',
          tooltip: 'More',
          children: [
            {
              icon: 'description',
              text: 'Detalle',
              click: (rowData: any) => this.handleViewDetail(rowData),
            },
            {
              icon: 'download',
              text: 'Reporte',
              click: (row) => {
                if (!this.perms.canCancel()) {
                  this.noti.warning({
                    message: 'No tiene permisos para descargar',
                  });
                  return;
                }

                const additionalParams = {
                  id: row.id,
                };

                const reportParameters = ReportParamsBuilder.getReportParameters(
                  INVENTORY_CODE_REPORT.RTB,
                  additionalParams,
                );

                this._reportUseCase.execute({
                  data: reportParameters,
                });
              },
            },
          ],
        },
      ],
    },
    { header: 'Nro. Doc.', field: 'nroDoc' },
    { header: 'Fecha Emision', field: 'fechaEmision' },
    { header: 'Bodega Origen', field: 'nomBodegaOrigen' },
    { header: 'Bodega Destino', field: 'nomBodegaDestino' },
    { header: 'Total', field: 'total', type: 'number' },
    { header: 'Observación', field: 'obs' },
    { header: 'Estado', field: 'nomEstado' },
  ];
  pagination = signal(new Pagination());

  isLoadingResults = signal(false);

  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];

  dataSearch = {
    codEstab: '',
    puntoEmisionId: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    useFilterDate: true,
    nroSecuencial: '',
    obs: null,
  };

  isMoreFilter = signal(false);

  onChangeEstab() {
    const dataEstab = this.estabs.find((e) => e.codEstab === this.dataSearch.codEstab);
    if (dataEstab) {
      this.puntosEmision = dataEstab?.puntosEmision;
      const dataPtoEmi = this.puntosEmision.find((p) => p.defaultPtoEmi);
      if (dataPtoEmi) {
        this.dataSearch.puntoEmisionId = dataPtoEmi.idPuntoEmision;
        this.getAll();
      }
    }
  }

  onChangeDateRange(event: any) {
    this.dataSearch.fromDate = event.from;
    this.dataSearch.toDate = event.to;
    this.refresh();
  }

  refresh() {
    this.getAll();
  }

  openAddEditDialog(operation: 'add' | 'edit' | 'duplicate' = 'add', id?: number, data?: any) {
    this.dgSvc
      .open(WarehouseTransferAddEdit, {
        size: 'xl',
        data: {
          id: 0,
          operation,
          data,
        },
      })
      .subscribe((result) => {
        if (result && typeof result === 'object') {
          this.refresh();
        }
      });
  }

  private getParams() {
    return {
      codEstab: this.dataSearch.codEstab,
      idPuntoEmision: this.dataSearch.puntoEmisionId,
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      startDate: this.dataSearch.fromDate,
      endDate: this.dataSearch.toDate,

      ckFecha: this.dataSearch.useFilterDate,
      nroSecuencial: ValidatorUtils.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial),
      textSearch: ValidatorUtils.isValidField(this.dataSearch.obs),
    };
  }

  private getAll() {
    if (!isValidField(this.dataSearch.codEstab)) {
      throw new Error('CodEstab is required');
    }

    if (!getValidId(this.dataSearch.puntoEmisionId)) {
      throw new Error('idPuntoEmision is required');
    }

    if (this.dataSearch.nroSecuencial) {
      if (!ValidatorUtils.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial)) {
        this.dataSearch.useFilterDate = true;
        this.noti.warning({
          message: 'Define correctamente el número de secuencial o el rango de número secuencial!',
        });
        return;
      }
      this.dataSearch.useFilterDate = false;
      this.noti.info({
        message: 'Buscando por número secuencial',
      });
    }
    this.isLoadingResults.set(true);
    this.warehouseTransferService
      .getAll(this.getParams())
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.list.set(response.data);
        this.pagination.set(
          new Pagination(
            this.pagination().pageIndex,
            this.pagination().pageSize,
            response.totalRecords,
          ),
        );
      });
  }

  private getFilterData() {
    this.isLoadingResults.set(true);
    this.warehouseTransferService
      .getDataFilter()
      .pipe(finalize(() => this.isLoadingResults.set(false)))
      .subscribe((response) => {
        this.estabs = response.estabs;

        const dataEstab = this.estabs.find((e) => e.defaultEstab);
        if (dataEstab) {
          this.dataSearch.codEstab = dataEstab.codEstab;
          this.puntosEmision = dataEstab.puntosEmision;

          const dataPtoEmi = this.puntosEmision.find((p) => p.defaultPtoEmi);

          if (dataPtoEmi) {
            this.dataSearch.puntoEmisionId = dataPtoEmi.idPuntoEmision;

            this.getAll();
          }
        }
      });
  }

  ngOnInit() {
    this.getFilterData();
  }

  handleDuplicated(rowData: any) {
    this.warehouseTransferService.getById(rowData.id).subscribe((response) => {
      this.openAddEditDialog('duplicate', rowData.id, response);
    });
  }

  handleEdit(rowData: any) {
    this.warehouseTransferService.getById(rowData.id).subscribe((response) => {
      this.openAddEditDialog('edit', rowData.id, response);
    });
  }

  handleViewDetail(rowData: any) {
    this.dgSvc.open(WarehouseTransferDetail, {
      data: {
        id: rowData.id,
      },
      size: 'xl',
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}

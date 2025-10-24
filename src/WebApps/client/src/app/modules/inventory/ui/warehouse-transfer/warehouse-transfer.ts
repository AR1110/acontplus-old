import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatIconButton } from '@angular/material/button';
import {   MatMenuModule } from '@angular/material/menu';
import { WarehouseTransferUseCase } from '@inventory/domain/usecases/warehouse-transfer.use-case';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { formatDateToString } from '@core/utils/date.util';
import {getValidId, isValidField, ValidatorUtils} from '@core/utils/utils';
import { finalize } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatInput} from "@angular/material/input";
import {ToastrNotificationService} from "@core/services/toastr-notification.service";
import {DialogService} from "@core/services/dialog.service";
import {
  WarehouseTransferAddEdit
} from "@inventory/ui/warehouse-transfer/warehouse-transfer-add-edit/warehouse-transfer-add-edit";

@Component({
  selector: 'app-warehouse-transfer',
  imports: [
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    MatDynamicCardComponent,
    MatDynamicTableComponent,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatMenuModule,
    MatSelectModule,
    FormsModule,
    MatInput
  ],
  templateUrl: './warehouse-transfer.html',
  styleUrl: './warehouse-transfer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseTransfer implements OnInit {
  private _useCase = inject(WarehouseTransferUseCase);
  private noti = inject(ToastrNotificationService)
  private dgSvc = inject(DialogService)

  dataSource = signal<any[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: '#', type: 'string' },
    { key: 'nroDoc', label: 'Nro. Doc.', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'nomBodegaOrigen', label: 'Bodega Origen', type: 'string' },
    { key: 'nomBodegaDestino', label: 'Bodega Destino', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'obs', label: 'Observación', type: 'number' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map(colDef => colDef.key);

  pagination = signal(new MatPagination());

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

  refresh() {
    this.getAll();
  }

  openAddEditDialog() {
    console.log("openAddEditDialog");
    this.dgSvc.open(WarehouseTransferAddEdit, {
      size: 'xl',
      data: {
        id: 0
      }
    }).subscribe(result => {
      if(result && typeof result === 'object') {
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
      nroSecuencial: ValidatorUtils.validAndFormatedRangeSequential(
        this.dataSearch.nroSecuencial
      ),
      textSearch: ValidatorUtils.isValidField(this.dataSearch.obs)
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
      if (
        !ValidatorUtils.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial)
      ) {
        this.dataSearch.useFilterDate = true;
        this.noti.warning({
          message: "Define correctamente el número de secuencial o el rango de número secuencial!",
        })
        return;
      }
      this.dataSearch.useFilterDate = false;
      this.noti.info({
        message: "Buscando por número secuencial",
      });
    }
    this.isLoadingResults.set(true);
    this._useCase
      .getAll(this.getParams())
      .pipe(finalize(() => (this.isLoadingResults.set(false))))
      .subscribe(response => {
        this.dataSource.set(response.data);
        this.pagination.set({
          ...this.pagination(),
          totalRecords: response.totalRecords,
        });
      });
  }

  private getFilterData() {
    this._useCase.getDataFilter().subscribe(response => {
      this.estabs = response.estabs;

      const dataEstab = this.estabs.find(e => e.defaultEstab);
      if (dataEstab) {
        this.dataSearch.codEstab = dataEstab.codEstab;
        this.puntosEmision = dataEstab.puntosEmision;

        const dataPtoEmi = this.puntosEmision.find(p => p.defaultPtoEmi);

        if (dataPtoEmi) {
          this.dataSearch.puntoEmisionId = dataPtoEmi.idPuntoEmision;

          this.getAll();
        }
      }
    });
  }

  ngOnInit() {
    //this.getFilterData();
  }

  onChangeEstab() {
    const dataEstab = this.estabs.find(e => e.codEstab === this.dataSearch.codEstab);
    if (dataEstab) {
      this.puntosEmision = dataEstab?.puntosEmision;
      const dataPtoEmi = this.puntosEmision.find(p => p.defaultPtoEmi);
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

  handlePageEvent(e: PageEvent) {
    this.pagination.update(pag => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }
}

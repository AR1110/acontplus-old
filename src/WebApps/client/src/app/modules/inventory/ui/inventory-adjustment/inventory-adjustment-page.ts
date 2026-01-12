import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DynamicCard } from '@acontplus/ng-components';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { Pagination } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { Button } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';
import { InventoryAdjustmentAddEditComponent } from '@inventory/ui/inventory-adjustment/inventory-adjustment-add-edit/inventory-adjustment-add-edit.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { InventoryAdjustmentDetail } from '@inventory/ui/inventory-adjustment/inventory-adjustment-detail/inventory-adjustment-detail';
import { InventoryAdjustmentStore } from '@inventory/store/inventory-adjustment.store';

import { InventoryAdjustmentService } from '@inventory/services/inventory-adjustment.service';
import {
  InventoryAdjustmentFormDataDto,
  InventoryAdjustmentListDto,
} from '@inventory/data/dtos/inventory-adjustment.dto';

@Component({
  selector: 'app-inventory-adjustment',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BreadcrumbComponent,
    DynamicCard,
    MatDynamicTableComponent,
    FormsModule,
    DateRangeSelectionComponent,
    Button,
    MatIconButton,
    MatIcon,
    MatMenuModule,
  ],
  templateUrl: './inventory-adjustment-page.html',
  styles: ``,
})
export class InventoryAdjustmentPage implements OnInit {
  private inventorySvc = inject(InventoryAdjustmentService);

  private _tS = inject(ToastrNotificationService);
  private _dialogSvc = inject(DialogService);
  private $inventoryAdjustmentStore = inject(InventoryAdjustmentStore);

  isMoreFilter = signal(false);

  dataSource = signal<InventoryAdjustmentListDto[]>([]);
  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'tipoDocNombre', label: 'Tipo Documento', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'nroDoc', label: 'Nro. Documento', type: 'string' },
    { key: 'estadoNombre', label: 'Estado', type: 'string' },
    { key: 'observacion', label: 'Observación', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'usuarioNombre', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());

  tiposDoc = signal<any[]>([]);
  estabs = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);

  dataFilter = {
    text: '',
    useFilterDate: true,
    estabId: 0,
    tipoDocId: 0,
    serie: '',
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
  };

  private mainFormData = signal({} as InventoryAdjustmentFormDataDto);

  refresh() {
    this.getList();
  }

  private getDataParams() {
    let useFilterDate = this.dataFilter.useFilterDate;
    let serie = null;
    if (isValidField(this.dataFilter.serie)) {
      serie = ValidatorUtils.validAndFormatedRangeSequential(this.dataFilter.serie);
      if (!serie) {
        this._tS.warning({
          message: 'Define correctamente el número de secuencial o el rango de número secuencial!',
        });
        return;
      }
      useFilterDate = false;
      this._tS.info({
        message: 'Buscando por número secuencial',
      });
    }
    return {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      useFilterDate,
      startDate: this.dataFilter.startDate,
      endDate: this.dataFilter.endDate,
      serie,
      tipoDocId: getValidId(this.dataFilter.tipoDocId),
      textSearch: isValidField(this.dataFilter.text),
    };
  }

  private getList() {
    const params = this.getDataParams();
    if (!params) return;
    this.inventorySvc.getAll(params).subscribe((response) => {
      this.dataSource.set(response.data);
      this.pagination.update(
        (pag) => new Pagination(pag.pageIndex, pag.pageSize, response.totalRecords),
      );
    });
  }

  ngOnInit() {
    this.inventorySvc.getFormData().subscribe((response: any) => {
      this.$inventoryAdjustmentStore.setMainFormData(response);
      this.tiposDoc.set(response.tiposDoc);
      this.estabs.set(response.estabs);
      const dataEstab = this.estabs().find((e) => e.defaultEstab);
      if (dataEstab) {
        this.dataFilter.estabId = dataEstab.idEstablecimiento;
      }
      this.refresh();
    });
  }

  addEdit(item?: InventoryAdjustmentListDto) {
    const ref = this._dialogSvc.open(InventoryAdjustmentAddEditComponent, {
      size: 'xxl',
      data: {},
    });
    ref.subscribe((res) => {
      if (res && typeof res == 'object') {
        this.refresh();
      }
    });
  }

  openDetail(item: InventoryAdjustmentListDto) {
    this._dialogSvc.open(InventoryAdjustmentDetail, {
      size: 'xxl',
      data: {
        id: item.id,
      },
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

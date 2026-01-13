import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {
  DataGrid,
  DataGridColumn,
  Button,
  AdvancedDialogService,
  Pagination,
  DateRangePicker,
  DateRangeValue,
} from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { NotificationService } from '@acontplus/ng-notifications';
import { formatDateToString } from '@core/utils/date.util';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { InventoryAdjustmentAddEditComponent } from '@inventory/ui/inventory-adjustment/inventory-adjustment-add-edit/inventory-adjustment-add-edit.component';
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
    DataGrid,
    FormsModule,
    Button,
    MatIcon,
    MatMenuModule,
    DateRangePicker,
  ],
  templateUrl: './inventory-adjustment-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryAdjustmentPage implements OnInit {
  private inventorySvc = inject(InventoryAdjustmentService);

  private tS = inject(NotificationService);
  private dialogSvc = inject(AdvancedDialogService);
  private $inventoryAdjustmentStore = inject(InventoryAdjustmentStore);

  isMoreFilter = signal(false);

  dataSource = signal<InventoryAdjustmentListDto[]>([]);
  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'tipoDocNombre', header: 'Tipo Documento' },
    { field: 'fechaEmision', header: 'Fecha Emisión' },
    { field: 'nroDoc', header: 'Nro. Documento' },
    { field: 'estadoNombre', header: 'Estado' },
    { field: 'observacion', header: 'Observación' },
    { field: 'total', header: 'Total' },
    { field: 'usuarioNombre', header: 'Usuario' },
  ];

  pagination = signal(new Pagination());

  tiposDoc = signal<{ idTipoDocumento: number; descripcion: string }[]>([]);
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

  refresh() {
    this.getList();
  }

  private getDataParams() {
    let useFilterDate = this.dataFilter.useFilterDate;
    let serie = null;
    if (isValidField(this.dataFilter.serie)) {
      serie = ValidatorUtils.validAndFormatedRangeSequential(this.dataFilter.serie);
      if (!serie) {
        this.tS.warning({
          message: 'Define correctamente el número de secuencial o el rango de número secuencial!',
        });
        return;
      }
      useFilterDate = false;
      this.tS.info({
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
    this.inventorySvc.getFormData().subscribe((response: InventoryAdjustmentFormDataDto) => {
      this.$inventoryAdjustmentStore.setMainFormData(response);
      this.tiposDoc.set(response.tiposDoc as { idTipoDocumento: number; descripcion: string }[]);
      this.estabs.set(response.estabs);
      const dataEstab = this.estabs().find((e) => e.defaultEstab);
      if (dataEstab) {
        this.dataFilter.estabId = dataEstab.idEstablecimiento;
      }
      this.refresh();
    });
  }

  async addEdit(_item?: InventoryAdjustmentListDto) {
    const ref = await this.dialogSvc.openInWrapper(
      {
        component: InventoryAdjustmentAddEditComponent,
        title: 'Ajuste de Inventario',
        icon: 'inventory',
        showCloseButton: true,
        data: {},
      },
      {
        size: 'xxl',
      },
    );
    ref.afterClosed().subscribe((res: unknown) => {
      if (res && typeof res == 'object') {
        this.refresh();
      }
    });
  }

  async openDetail(item: InventoryAdjustmentListDto) {
    await this.dialogSvc.openInWrapper(
      {
        component: InventoryAdjustmentDetail,
        title: 'Detalle de Ajuste',
        icon: 'list',
        showCloseButton: true,
        data: {
          id: item.id,
        },
      },
      {
        size: 'xxl',
      },
    );
  }

  dateRangeSelected($event: DateRangeValue<true>) {
    this.dataFilter.startDate = $event.from;
    this.dataFilter.endDate = $event.to;
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

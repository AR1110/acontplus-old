import { Component, inject, signal, OnInit } from '@angular/core';
import { DynamicCard } from '@acontplus/ng-components';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ActionAddDirective } from '@shared/directives/permission/action-add.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ListWarehouseUseCase } from '@inventory/domain/usecases/warehouse/list-warehouse.use-case';
import { WarehouseList } from '@inventory/domain/models/warehouse.model';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { Button } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';
import { AddEditWarehouseComponent } from '@inventory/ui/warehouse/add-edit-warehouse/add-edit-warehouse.component';
import Swal from 'sweetalert2';
import { DeleteWarehouseUseCase } from '@inventory/domain/usecases/warehouse/delete-warehouse.use-case';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { SendMaxWarehousesUseCase } from '@modules/config/application/use-cases/general-config/list-general-config.use-case';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-warehouse',
  imports: [
    DynamicCard,
    BreadcrumbComponent,
    ActionAddDirective,
    MatButtonModule,
    MatIconModule,
    MatDynamicTableComponent,
    Button,
  ],
  templateUrl: './warehouse.component.html',
  styles: ``,
})
export class WarehouseComponent implements OnInit {
  private $listUseCase = inject(ListWarehouseUseCase);
  private $deleteUseCase = inject(DeleteWarehouseUseCase);
  private $sendMaxWarehousesUseCase = inject(SendMaxWarehousesUseCase);

  private _dialogSvc = inject(DialogService);
  private _tS = inject(ToastrNotificationService);
  dataSource = signal<WarehouseList[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nomEstab', label: 'Establecimiento', type: 'string' },
    { key: 'descripcion', label: 'Bodega', type: 'string' },
    { key: 'telefono', label: 'Teléfono', type: 'string' },
    { key: 'direccion', label: 'Dirección', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'boolean' },
  ];

  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  async openModalAddUpdate(params?: WarehouseList) {
    await firstValueFrom(this.$sendMaxWarehousesUseCase.execute());
    const ref = this._dialogSvc.open(AddEditWarehouseComponent, {
      data: structuredClone(params) || {},
    });
    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  refresh() {
    this.getList();
  }

  private getList() {
    const dataSearch = {
      pageIndex: 1,
      pageSize: 25,
    };
    this.$listUseCase.execute(dataSearch).subscribe((response) => {
      this.dataSource.set(response.data);
    });
  }
  ngOnInit() {
    this.refresh();
  }

  async askToEnabled(item: WarehouseList) {
    const { isConfirmed } = await Swal.fire({
      title: '<small>Confirmar eliminación</small>',
      html: `<small>¿Está seguro de que desea eliminar la bodega <strong>${item.descripcion}</strong>? Esta acción no se puede deshacer.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
      allowOutsideClick: false,
    });

    if (!isConfirmed) return;

    this.$deleteUseCase.execute({ idBodega: item.idBodega }).subscribe((response) => {
      if (response.code === '0') {
        this._tS.show({
          type: 'warning',
          message: response.message,
        });
      }
      if (response.code === '1') {
        this._tS.show({
          type: 'success',
          message: response.message,
        });
      }
    });
  }
}

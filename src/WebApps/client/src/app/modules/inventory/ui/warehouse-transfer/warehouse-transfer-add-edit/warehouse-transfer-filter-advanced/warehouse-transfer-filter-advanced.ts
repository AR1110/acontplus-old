import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GroupedEstabBodega } from '@core/models/estab.model';
import { Button } from '@acontplus/ng-components';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { WAREHOUSE_TRANSFER_SERVICE } from '@inventory/tokens/inventory-token';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ValidatorUtils } from '@core/utils/utils';
import { PageEvent } from '@angular/material/paginator';

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  name: string;
  subCategories: SubCategory[];
}

@Component({
  selector: 'app-warehouse-transfer-filter-advanced',
  imports: [
    MatSelectModule,
    MatInput,
    MatCustomDialogComponent,
    ReactiveFormsModule,
    Button,
    DataGrid,
  ],
  templateUrl: './warehouse-transfer-filter-advanced.html',
  styleUrl: './warehouse-transfer-filter-advanced.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseTransferFilterAdvanced implements OnInit {
  private warehouseTransferService = inject(WAREHOUSE_TRANSFER_SERVICE);
  private dgRef = inject(MatDialogRef<WarehouseTransferFilterAdvanced>);
  private notiSvc = inject(ToastrNotificationService);
  private params = inject<{
    sourceWarehouses: GroupedEstabBodega[];
    sourceWarehouseId: number;
    categories: any[];
  }>(MAT_DIALOG_DATA);

  sourceWarehouseText = signal<string | undefined>('');
  categories = signal<Category[]>([]);

  checkedCategories = new FormControl<(number | string)[]>([]);
  allValue = 'SELECT_ALL';

  columns: DataGridColumn[] = [
    { header: 'Nro.', field: 'index' },
    { header: 'Código', field: 'code' },
    { header: 'Descripción', field: 'description' },
    { header: 'Cantidad', field: 'quantity' },
    { header: 'Medida', field: 'measure' },
    {
      header: 'Precio Costo',
      field: 'costPrice',
      type: 'currency',
      typeParameter: { currencyCode: '$' },
    },
    { header: 'Total', field: 'total', type: 'currency', typeParameter: { currencyCode: '$' } },
  ];

  list = signal<any[]>([]);
  rowSelected = signal<any[]>([]);

  query = {
    page: 0,
    per_page: 100,
  };
  totalRecords = signal(0);

  log(e: any) {
    console.error(e);
  }

  ngOnInit() {
    this.categories.set(this.params.categories);
    this.sourceWarehouseText.set(
      this.params.sourceWarehouses.find((w) => w.idBodega === this.params.sourceWarehouseId)
        ?.descripcion,
    );
  }

  toggleSelectAll(event: any) {
    if (event.isUserInput) {
      if (event.source.selected) {
        // Seleccionar todo
        const allIds = this.getAllSubfamiliaIds();
        const allGroups = this.categories().map((f) => 'GROUP_' + f.name);
        this.checkedCategories.setValue([this.allValue, ...allGroups, ...allIds], {
          emitEvent: false,
        });
      } else {
        // Deseleccionar todo
        this.checkedCategories.setValue([], { emitEvent: false });
      }
    }
  }

  toggleGroup(event: any, familia: Category) {
    if (event.isUserInput) {
      const currentValue = this.checkedCategories.value || [];
      const groupKey = 'GROUP_' + familia.name;
      const groupIds = familia.subCategories.map((sf) => sf.id);

      if (event.source.selected) {
        // Seleccionar grupo - agregar todas las subfamilias
        const newValue = [...currentValue];
        groupIds.forEach((id) => {
          if (!newValue.includes(id)) {
            newValue.push(id);
          }
        });
        this.checkedCategories.setValue(newValue, { emitEvent: false });
        this.checkIfAllSelected();
      } else {
        // Deseleccionar grupo - quitar todas las subfamilias
        const newValue = currentValue.filter(
          (val) => !groupIds.includes(val as number) && val !== groupKey,
        );
        // Quitar "Seleccionar todo" también
        const finalValue = newValue.filter((v) => v !== this.allValue);
        this.checkedCategories.setValue(finalValue, { emitEvent: false });
      }
    }
  }

  onSelectionChange(_event: any) {
    this.updateGroupCheckboxes();
    this.checkIfAllSelected();
  }

  private updateGroupCheckboxes() {
    const selected = this.checkedCategories.value || [];
    const newValue = [...selected];
    let changed = false;

    this.categories().forEach((familia) => {
      const groupKey = 'GROUP_' + familia.name;
      const groupIds = familia.subCategories.map((sf) => sf.id);
      const allGroupSelected = groupIds.every((id) => selected.includes(id));
      const someGroupSelected = groupIds.some((id) => selected.includes(id));

      if (allGroupSelected && !selected.includes(groupKey)) {
        newValue.push(groupKey);
        changed = true;
      } else if (!someGroupSelected && selected.includes(groupKey)) {
        const index = newValue.indexOf(groupKey);
        if (index > -1) {
          newValue.splice(index, 1);
          changed = true;
        }
      }
    });

    if (changed) {
      this.checkedCategories.setValue(newValue, { emitEvent: false });
    }
  }

  private checkIfAllSelected() {
    const selected = this.checkedCategories.value || [];
    const allIds = this.getAllSubfamiliaIds();
    const allSelected = allIds.every((id) => selected.includes(id));

    if (allSelected && !selected.includes(this.allValue)) {
      this.checkedCategories.setValue([...selected, this.allValue], { emitEvent: false });
    } else if (!allSelected && selected.includes(this.allValue)) {
      const newValue = selected.filter((v) => v !== this.allValue);
      this.checkedCategories.setValue(newValue, { emitEvent: false });
    }
  }

  private getAllSubfamiliaIds(): number[] {
    return this.categories().flatMap((f) => f.subCategories.map((sf) => sf.id));
  }

  getDisplayValue(): string {
    const selected = this.checkedCategories.value || [];

    // Filtrar solo los IDs numéricos (subfamilias reales)
    const subfamiliaIds = selected.filter((val) => typeof val === 'number');

    if (subfamiliaIds.length === 0) {
      return '';
    }

    // Obtener los nombres de las subfamilias seleccionadas
    const nombres: string[] = [];
    this.categories().forEach((familia) => {
      familia.subCategories.forEach((sf) => {
        if (subfamiliaIds.includes(sf.id)) {
          nombres.push(sf.name);
        }
      });
    });

    return nombres.join(', ');
  }

  search() {
    if (!(this.params.sourceWarehouseId > 0)) {
      this.notiSvc.warning({
        message: 'Seleccione Bodega Origen',
      });
      return;
    }

    const subCategories = this.checkedCategories.value?.filter(Number).join(',');
    //  let selectedSubfamilias = $scope.selectedSubfamilias().map(sub => sub.idSubFamilia).join(",");

    const params = {
      sourceWarehouseId: this.params.sourceWarehouseId,
      subCategories: ValidatorUtils.isValidField(subCategories),
    };

    this.rowSelected.set([]);
    this.totalRecords.set(0);
    this.warehouseTransferService.getMassTransferProducts(params).subscribe((result: any) => {
      this.list.set(result.products);
      this.totalRecords.set(result.totalRecords);
    });
  }

  getNextPage(e: PageEvent) {
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
  }

  addToDetail() {
    this.dgRef.close({
      rowSelected: this.rowSelected(),
    });
  }

  close() {
    this.dgRef.close();
  }
}

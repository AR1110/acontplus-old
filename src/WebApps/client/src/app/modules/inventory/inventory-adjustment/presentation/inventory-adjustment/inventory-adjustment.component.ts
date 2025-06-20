import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { InventoryAdjustmentListUseCase } from '@inventory/inventory-adjustment/application/inventory-adjustment-list.use-case';
import { InventoryAdjustmentFormDataUseCase } from '@inventory/inventory-adjustment/application/inventory-adjustment-form-data.use-case';
import { PageEvent } from '@angular/material/paginator';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {GroupedEstab, GroupedEstabPuntoEmision} from "@core/models/estab.model";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {InventoryAdjustmentList} from "@inventory/inventory-adjustment/domain/inventory-adjustment.entity";
import {DialogService} from "@core/services/dialog.service";
import {
  InventoryAdjustmentAddEditComponent
} from "@inventory/inventory-adjustment/presentation/inventory-adjustment-add-edit/inventory-adjustment-add-edit.component";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {
  InventoryAdjustmentDetailComponent
} from "@inventory/inventory-adjustment/presentation/inventory-adjustment-detail/inventory-adjustment-detail.component";

@Component({
  selector: 'app-inventory-adjustment',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatDynamicTableComponent,
    FormsModule,
    DateRangeSelectionComponent,
    ThemeButtonComponent,
    MatIconButton,
    MatIcon,
    MatMenuModule
  ],
  templateUrl: './inventory-adjustment.component.html',
  styles: ``,
})
export class InventoryAdjustmentComponent implements OnInit {
  private $listUseCase = inject(InventoryAdjustmentListUseCase);
  private $formDataUseCase = inject(InventoryAdjustmentFormDataUseCase);
  private _tS = inject(ToastrNotificationService);
  private _dialogSvc = inject(DialogService);

  dataSource = signal<InventoryAdjustmentList[]>([]);
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

  pagination = signal(new MatPagination());

  tiposDoc = signal<any[]>([])
  estabs = signal<GroupedEstab[]>([])
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([])

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
    this.getList()
  }

  private getDataParams() {
    let useFilterDate = this.dataFilter.useFilterDate;
    let serie = null;
    if (isValidField(this.dataFilter.serie)) {
      serie = ValidatorUtils.validAndFormatedRangeSequential(
        this.dataFilter.serie
      );
      if (!serie) {
        this._tS.warning({
          message:
            'Define correctamente el número de secuencial o el rango de número secuencial!',
        });
        return;
      }
      useFilterDate = false;
      this._tS.info({
        message: 'Buscando por número secuencial',
      });
    }
    return {
      pageIndex: this.pagination().pageIndex+1,
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
    this.$listUseCase.execute(params).subscribe(response => {
      this.dataSource.set(response.data);
      this.pagination.update(pag=>({
        ...pag,
        totalRecords: response.totalRecords,
      }))
    })
  }

  ngOnInit() {
    // this.$formDataUseCase.execute().subscribe((response) => {
    //   this.tiposDoc.set(response.tiposDoc);
    //   this.estabs.set(response.estabs);
    //   const dataEstab = this.estabs().find(e=>e.defaultEstab);
    //   if(dataEstab) {
    //     this.dataFilter.estabId = dataEstab.idEstablecimiento;
    //   }
    //   this.refresh()
    // });
  }

  addEdit(item?: InventoryAdjustmentList){
    const ref = this._dialogSvc.open(InventoryAdjustmentAddEditComponent, {
      size: 'xxl',
      data: {

      }
    })
    ref.subscribe(res => {
      if(res && typeof res  == 'object'){
        this.refresh()
      }
    })
  }

  openDetail(item: InventoryAdjustmentList){
    this._dialogSvc.open(InventoryAdjustmentDetailComponent, {
      size: 'xxl',
      data: {
        id: item.id
      }
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
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

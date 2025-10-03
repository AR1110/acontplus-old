import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuModule} from "@angular/material/menu";
import {TransferenciaBodegaUseCase} from "@inventory/domain/usecases/transferencia-bodega.use-case";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatPagination} from "@shared/models/pagination.model";
import {GroupedEstab, GroupedEstabPuntoEmision} from "@core/models/estab.model";
import {formatDateToString} from "@core/utils/date.util";
import {getValidId, isValidField} from "@core/utils/utils";
import {finalize} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

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
    FormsModule
  ],
  templateUrl: './warehouse-transfer.component.html',
  styleUrl: './warehouse-transfer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseTransferComponent {
  private _useCase = inject(TransferenciaBodegaUseCase);

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
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

  isLoadingResults = false;

  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];

  dataSearch = {
    codEstab: '',
    puntoEmisionId: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
  };

  refresh() {
    this.getAll();
  }

  private getParams() {
    return {
      codEstab: this.dataSearch.codEstab,
      idPuntoEmision: this.dataSearch.puntoEmisionId,
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      startDate: this.dataSearch.fromDate,
      endDate: this.dataSearch.toDate,
    };
  }

  private getAll() {
    const params = this.getParams();
    if (!isValidField(params.codEstab)) {
      throw new Error('CodEstab is required');
    }

    if (!getValidId(params.idPuntoEmision)) {
      throw new Error('idPuntoEmision is required');
    }

    this.isLoadingResults = true;
    this._useCase
      .getAll(this.getParams())
      .pipe(finalize(() => (this.isLoadingResults = false)))
      .subscribe((response) => {
        this.dataSource.set(response.data);
        console.log(this.dataSource());
        this.pagination.set({
          ...this.pagination(),
          totalRecords: response.totalRecords,
        });
      });
  }

  ngOnInit() {
    this._useCase.getDataFilter().subscribe((response) => {
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

  onChangeEstab() {
    const dataEstab = this.estabs.find(
      (e) => e.codEstab === this.dataSearch.codEstab
    );
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

import { Component, inject, model, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId, isValidField } from '@core/utils/utils';
import { DocumentoElectronicoWebRepository } from '@billing/data/documento-electronico/documento-electronico-web.repository';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { finalize, forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-documento-electronico',
  imports: [
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    BreadcrumbComponent,
    CustomTableContainerComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent,
  ],
  templateUrl: './doc-elect.component.html',
  styles: ``,
})
export class DocElectComponent implements OnInit {
  private docElectSvc = inject(DocumentoElectronicoWebRepository);
  private tS = inject(ToastrNotificationService);

  estabs: GroupedEstab[] = [];
  puntosEmision: GroupedEstabPuntoEmision[] = [];
  tiposDoc: any[] = [];
  estadosDoc: any[] = [];

  isLoadingResults = signal(false);
  isSearchAdvanced = signal(false);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'estado', label: 'Estado', type: 'string' },
    { key: 'comprobante', label: 'Comprobante', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'fechaAutorizacion', label: 'Fecha Autorización', type: 'string' },
    { key: 'serieComprobante', label: 'Serie Comprobante', type: 'string' },
    { key: 'rucReceptor', label: 'Ruc Receptor', type: 'string' },
    {
      key: 'razonSocialReceptor',
      label: 'Razón Social Receptor	',
      type: 'string',
    },
    {
      key: 'claveAcceso',
      label: 'Clave de acceso/Nro. autorización',
      type: 'string',
    },
    { key: 'usuario', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map(colDef => colDef.key);

  dataSource = new MatTableDataSource<any>();

  pagination = signal(new MatPagination());

  dataSearch = model({
    codEstab: null as string | null | undefined,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    codDoc: 0 as string | number,
    codEstado: 0 as string | number | undefined,
    checkBoxDate: true,
    idPuntoEmision: 0,
    identificacionReceptor: null,
    idUsuario: 0,
  });

  refresh() {
    this.getDocElects();
  }

  private getDataParams() {
    const obj = {
      codDoc: isValidField(this.dataSearch().codDoc),
      codEstado: isValidField(this.dataSearch().codEstado),
      checkBoxDate: this.dataSearch().checkBoxDate,
      dateStart: this.dataSearch().fromDate,
      dateEnd: this.dataSearch().toDate,
      codEstab: this.dataSearch().codEstab,
      idPuntoEmision: this.dataSearch().idPuntoEmision,
      identificacionReceptor: isValidField(this.dataSearch().identificacionReceptor),
      idUsuario: getValidId(this.dataSearch().idUsuario),
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      //  nroSecuencial: fS.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial)
    };
    return obj;
  }

  private successResponseList(response: any) {
    this.dataSource = new MatTableDataSource(response.data);
    this.pagination.update(p => ({
      ...p,
      totalRecords: this.dataSource.data.length > 0 ? this.dataSource.data[0].totalRecords : 0,
    }));
  }

  private getDocElects() {
    if (this.isLoadingResults()) return; // Prevenir múltiples llamadas

    this.isLoadingResults.set(true);
    this.docElectSvc
      .getAll(this.getDataParams())
      .pipe(
        finalize(() => {
          this.isLoadingResults.set(false);
        }),
      )
      .subscribe(response => {
        this.successResponseList(response);
      });
  }

  ngOnInit() {
    this.isLoadingResults.set(true);
    this.docElectSvc
      .getFilters()
      .pipe(
        switchMap(initialData => {
          this.estabs = initialData.estabs;
          this.tiposDoc = initialData.tipoDocumentos;
          this.estadosDoc = initialData.estadoDocumentos;

          if (this.estabs.length > 0) {
            const dataEstab = this.estabs.find(estab => estab.defaultEstab);
            this.puntosEmision = dataEstab?.puntosEmision || [];
            this.dataSearch.update(e => {
              return {
                ...e,
                codEstab: dataEstab?.codEstab,
                idPuntoEmision:
                  this.puntosEmision.find(pto => pto.defaultPtoEmi)?.idPuntoEmision || 0,
              };
            });
          }
          return this.docElectSvc.getAll(this.getDataParams());
        }),
      )
      .pipe(
        finalize(() => {
          this.isLoadingResults.set(false);
        }),
      )
      .subscribe(response => {
        this.successResponseList(response);
      });
  }

  setDataSearch<K extends keyof ReturnType<typeof this.dataSearch>>(
    key: K,
    value: ReturnType<typeof this.dataSearch>[K],
  ) {
    this.dataSearch.update(ds => {
      return {
        ...ds,
        [key]: value,
      };
    });
  }

  onEstabChange() {
    const dataEstab = this.estabs.find(estab => estab.codEstab === this.dataSearch().codEstab);
    this.puntosEmision = dataEstab?.puntosEmision || [];

    if (this.puntosEmision.length > 0) {
      this.setDataSearch(
        'idPuntoEmision',
        this.puntosEmision.find(pto => pto.defaultPtoEmi)?.idPuntoEmision || 0,
      );
      this.getDocElects();
    } else {
      this.tS.show({
        type: 'warning',
        message: 'No tiene puntos de emisión asignados',
      });
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.update(e => {
      return {
        ...e,
        fromDate: range.from,
        toDate: range.to,
      };
    });
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

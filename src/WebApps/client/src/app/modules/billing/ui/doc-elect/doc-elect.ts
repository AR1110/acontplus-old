import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId, isValidField } from '@core/utils/utils';
import { DocElectHttpRepository } from '@billing/data/documento-electronico/doc-elect-http.repository';

import { Pagination } from '@acontplus/ng-components';
import { finalize, switchMap } from 'rxjs';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { DocElectList } from '@billing/domain/models/documento-electronico.model';

@Component({
  selector: 'app-doc-elect',
  imports: [
    FormsModule,
    DynamicCard,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    DataGrid,
  ],
  templateUrl: './doc-elect.html',
  styles: ``,
})
export class DocElect implements OnInit {
  private docElectSvc = inject(DocElectHttpRepository);
  private tS = inject(ToastrNotificationService);

  estabs = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  tiposDoc = signal<any[]>([]);
  estadosDoc = signal<any[]>([]);

  isLoadingResults = signal(false);
  isSearchAdvanced = signal(false);

  pagination = signal(new Pagination());

  dataSearch = {
    codEstab: null as string | null | undefined,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    codDoc: 0 as string | number,
    codEstado: 0 as string | number | undefined,
    checkBoxDate: true,
    idPuntoEmision: 0,
    identificacionReceptor: null,
    idUsuario: 0,
  };

  columns: DataGridColumn[] = [
    { header: 'Nro.', field: 'index' },
    { header: 'Op.', field: 'actions' },
    { header: 'Documento', field: 'document' },
    { header: 'Cliente', field: 'client' },
    { header: 'Fecha de emisión y autorización', field: 'dates' },
    { header: 'Versión', field: 'version' },
    { header: 'Estado', field: 'statusName' },
    { header: 'Usuario', field: 'user' },
  ];
  list = signal<DocElectList[]>([]);
  refresh() {
    this.getDocElects();
  }

  private getDataParams() {
    return {
      codDoc: isValidField(this.dataSearch.codDoc),
      codEstado: isValidField(this.dataSearch.codEstado),
      checkBoxDate: this.dataSearch.checkBoxDate,
      dateStart: this.dataSearch.fromDate,
      dateEnd: this.dataSearch.toDate,
      codEstab: this.dataSearch.codEstab,
      idPuntoEmision: this.dataSearch.idPuntoEmision,
      identificacionReceptor: isValidField(this.dataSearch.identificacionReceptor),
      idUsuario: getValidId(this.dataSearch.idUsuario),
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      //  nroSecuencial: fS.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial)
    };
  }

  private successResponseList(response: any) {
    this.list.set(response.data);
    this.pagination.update((p) => new Pagination(p.pageIndex, p.pageSize, response.totalRecords));
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
      .subscribe((response) => {
        this.successResponseList(response);
      });
  }

  ngOnInit() {
    this.isLoadingResults.set(true);
    this.docElectSvc
      .getFilters()
      .pipe(
        switchMap((initialData) => {
          this.estabs.set(initialData.estabs);
          this.tiposDoc.set(initialData.tipoDocumentos);
          this.estadosDoc.set(initialData.estadoDocumentos);

          if (this.estabs().length > 0) {
            const dataEstab = this.estabs().find((estab) => estab.defaultEstab);
            this.puntosEmision.set(dataEstab?.puntosEmision || []);
            this.dataSearch.codEstab = dataEstab?.codEstab || '';
            this.dataSearch.idPuntoEmision =
              this.puntosEmision().find((pto) => pto.defaultPtoEmi)?.idPuntoEmision || 0;
          }
          return this.docElectSvc.getAll(this.getDataParams());
        }),
      )
      .pipe(
        finalize(() => {
          this.isLoadingResults.set(false);
        }),
      )
      .subscribe((response) => {
        this.successResponseList(response);
      });
  }

  setDataSearch<K extends keyof typeof this.dataSearch>(
    key: K,
    value: (typeof this.dataSearch)[K],
  ) {
    this.dataSearch = {
      ...this.dataSearch,
      [key]: value,
    };
  }

  onEstabChange() {
    const dataEstab = this.estabs().find((estab) => estab.codEstab === this.dataSearch.codEstab);
    this.puntosEmision.set(dataEstab?.puntosEmision || []);

    if (this.puntosEmision().length > 0) {
      this.setDataSearch(
        'idPuntoEmision',
        this.puntosEmision().find((pto) => pto.defaultPtoEmi)?.idPuntoEmision || 0,
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
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.refresh();
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

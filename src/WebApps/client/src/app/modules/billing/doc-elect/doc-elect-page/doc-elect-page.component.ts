import { Component, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { formatDateToString } from '@core/utils/date.util';
import { DocElectService } from '@modules/billing/services/doc-elect.service';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-doc-elect-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    BreadcrumbComponent,
    CustomTableContainerComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent
  ],
  templateUrl: './doc-elect-page.component.html',
  styles: ``
})
export class DocElectPageComponent {

  private docElectSvc = inject(DocElectService)

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
    { key: 'razonSocialReceptor', label: 'Razón Social Receptor	', type: 'string' },
    { key: 'claveAcceso', label: 'Clave de acceso/Nro. autorización', type: 'string' },
    { key: 'usuario', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<any>();

  pagination = signal(new MatPagination());


  dataSearch = model({
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    codDoc: null,
    codEstado: null as number | null,
    checkBoxDate: true,
    codEstab: null as string | null,
    idPuntoEmision: 0,
    identificacionReceptor: null,
    idUsuario: 0
  })


  refresh() {
    this.getDocElects()
  }

  private getDataParams() {
    let obj = {

      codDoc: this.dataSearch().codDoc,
      codEstado: this.dataSearch().codEstado,
      checkBoxDate: this.dataSearch().checkBoxDate,
      dateStart: this.dataSearch().fromDate,
      dateEnd: this.dataSearch().toDate,
      codEstab: this.dataSearch().codEstab,
      idPuntoEmision: this.dataSearch().idPuntoEmision,
      identificacionReceptor: this.dataSearch().identificacionReceptor,
      idUsuario: this.dataSearch().idUsuario,
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      //  nroSecuencial: fS.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial)
    }
    return obj;
  }


  private successResponseList(response: any) {

    this.dataSource = new MatTableDataSource(response.data);

    console.log(this.dataSource.data)
    this.pagination.update((p) => ({
      ...p,
      totalRecords: this.dataSource.data.length > 0 ? this.dataSource.data[0].totalRecords : 0,
    }));

  }

  private getDocElects() {
    if (this.isLoadingResults()) return; // Prevenir múltiples llamadas

    this.isLoadingResults.set(true)
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

  private initLoad() {
    return forkJoin([
      this.docElectSvc.getDataFilter(),
      this.docElectSvc.getAll(this.getDataParams()),
    ]);
  }



  ngOnInit() {
    this.initLoad()
    .pipe(
      finalize(() => {
        this.isLoadingResults.set(false);
      }),
    )
    .subscribe({
      next: (response) => {
        const [dataForm, responseList] = response;
        console.log(response)
        // this.subCategorias.set(dataForm.subCategorias);
        // this.medidas.set(dataForm.medidas);
        // this.marcas.set(dataForm.marcas);
        // this.modelos.set(dataForm.modelos);
        // this.tiposIva.set(dataForm.tiposIva);

         this.successResponseList(responseList);
      },
      error: (err) => {
        console.error('Load Data :', err);
      },
    });
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.update(e => {
      return {
        ...e,
        fromDate: range.from,
        toDate: range.to
      }
    })
    this.refresh()
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

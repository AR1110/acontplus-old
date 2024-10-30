import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { NotaEntregaDetalleDialogDirective } from '@modules/sale/directives/nota-entrega-detalle-dialog.directive';
import { NotaEntregaService } from '@modules/sale/services/nota-entrega.service';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-nota-entrega-page',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    //components
    BreadcrumbComponent,
    CustomTableContainerComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent,

    //Directives
    NotaEntregaDetalleDialogDirective
  ],
  templateUrl: './nota-entrega-page.component.html',
  styles: ``
})
export class NotaEntregaPageComponent {

  private notaEntregaSvc = inject(NotaEntregaService)

  estabs:GroupedEstab[]=[];
  puntosEmision:GroupedEstabPuntoEmision[]=[]
  isSearchAdvanced = signal(false)
  isLoadingResults = signal(false)


  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'serieComprobante', label: 'Serie', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'fechaVencimiento', label: 'Fecha Vcto', type: 'string' },
    { key: 'razonSocialComprador', label: 'Cliente', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'abono', label: 'Abono', type: 'number' },
    { key: 'saldo', label: 'Saldo', type: 'number' },
    { key: 'estadoNom', label: 'Estado', type: 'string' },
    { key: 'usuario', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  dataSource = new MatTableDataSource<any>();

  pagination = signal(new MatPagination());

  dataSearch = model({
    codEstab: null as string | null,
    idPuntoEmision: 0,
    checkBoxDate: true
  })

  private getDataParams() {
    let params = {

      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,

    };
    return params;
  }


  private successResponseNotaEntregaAll(response: any) {

    this.dataSource = new MatTableDataSource(response.data);

    console.log(this.dataSource.data)
    this.pagination.update((p) => ({
      ...p,
      totalRecords: response.totalRecords,
    }));

  }

  private getNotasEntrega() {
    if (this.isLoadingResults()) return; // Prevenir múltiples llamadas

    this.isLoadingResults.set(true)
    this.notaEntregaSvc
      .getAll(this.getDataParams())
      .pipe(
        finalize(() => {
          this.isLoadingResults.set(false);
        }),
      )
      .subscribe((response) => {
        this.successResponseNotaEntregaAll(response);
      });
  }

  refresh() {
    this.getNotasEntrega()
  }

  ngOnInit(): void {
    this.getNotasEntrega()

  }

  onEstabChange(){

  }


  onDateRangeSelection(e:any){

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

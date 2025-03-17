import { Component, inject, signal, OnInit } from '@angular/core';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchMatComponent } from '@modules/customer/ui/company-customer/components/company-customer-search-mat/company-customer-search-mat.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { PageEvent } from '@angular/material/paginator';
import { GetGuiaRemisionFilterDataUseCase } from '@modules/billing/domain/use-cases/guia-remision/get-guia-remision-filter-data.use-case';
import { ListGuiasRemisionUseCase } from '@modules/billing/domain/use-cases/guia-remision/list-guias-remision.use-case';
import { finalize, forkJoin } from 'rxjs';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { getValidId, isValidField } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guia-remision',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchMatComponent,
  ],
  templateUrl: './guia-remision.component.html',
  styles: ``,
})
export class GuiaRemisionComponent implements OnInit {
  private $getGuiaRemisionFilterDataUseCase = inject(
    GetGuiaRemisionFilterDataUseCase
  );
  private $listGuiasRemisionUseCase = inject(ListGuiasRemisionUseCase);
  private tS = inject(ToasterService);

  estabs = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  estadosDoc: any[] = [];

  dataSearch = {
    codEstab: '',
    puntoEmisionId: 0,
  };

  loading = false;
  isFilterAdvanced = signal(false);

  dataSource = signal([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'usuario', label: 'Usuario', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'turno', label: 'Turno', type: 'string' },
    { key: 'actividad', label: 'Actividad', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

  private getParams() {
    if (!isValidField(this.dataSearch.codEstab)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Establecimiento no seleccionado',
      });
      return;
    }

    if (!getValidId(this.dataSearch.puntoEmisionId)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Punto Emisión no seleccionado',
      });
      return;
    }

    return {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
  }

  refresh() {
    this.getGuiasRemision();
  }

  private getGuiasRemision() {
    this.$listGuiasRemisionUseCase.execute(this.getParams());
  }

  ngOnInit() {
    this.loading = true;
    this.$getGuiaRemisionFilterDataUseCase
      .execute()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((filterData) => {
        this.estabs.set(filterData.estabs);
        this.estadosDoc = filterData.estadosDoc;

        if (this.estabs().length > 0) {
          const dataEstab = this.estabs().find((item) => item.defaultEstab);

          this.dataSearch.codEstab = dataEstab?.codEstab || '';
          this.puntosEmision.set(dataEstab?.puntosEmision || []);
          if (this.puntosEmision().length > 0) {
            const dataPuntoEmision = this.puntosEmision().find(
              (item) => item.defaultPtoEmi
            );

            this.dataSearch.puntoEmisionId =
              dataPuntoEmision?.idPuntoEmision || 0;
          }
        }
        this.refresh();
      });
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

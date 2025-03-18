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
import {getValidId, isValidField, ValidatorUtils} from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { FormsModule } from '@angular/forms';
import {formatDateToString} from "@core/utils/date.util";
import {GuiaRemisionList} from "@billing/domain/models/guia-remision.model";
import {AddEditProductDirective} from "@inventory/ui/product/directives/add-edit-product.directive";
import {CompraHabitualHistorialDirective} from "@purchase/directives/compra-habitual-historial.directive";
import {MatMenu, MatMenuItem, MatMenuModule} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";
import {ProductKardexModalDirective} from "@inventory/ui/product/directives/product-kardex-modal.directive";
import {DialogService} from "@core/services/dialog.service";
import {
  AddEditGuiaRemisionComponent
} from "@billing/ui/guia-remision/components/add-edit-guia-remision/add-edit-guia-remision.component";

@Component({
  selector: 'app-guia-remision',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatMenuModule,
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatDynamicTableComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchMatComponent,
    AddEditProductDirective,
    CompraHabitualHistorialDirective,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    ProductKardexModalDirective,
  ],
  templateUrl: './guia-remision.component.html',
  styles: ``,
})
export class GuiaRemisionComponent   {
  private $getGuiaRemisionFilterDataUseCase = inject(
    GetGuiaRemisionFilterDataUseCase
  );
  private $listGuiasRemisionUseCase = inject(ListGuiasRemisionUseCase);
  private tS = inject(ToasterService);
  private _dialogSvc = inject(DialogService)

  estabs = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  estadosDoc: any[] = [];

  dataSearch = {
    codEstab: '',
    puntoEmisionId: 0,
    filterByDate: true,
    clienteId: 0,
    usuarioId: 0,
    codEstado: null,
    nroSecuencial: "" as string  ,
    toDate: formatDateToString(new Date()),
    fromDate: formatDateToString(new Date())
  };

  loading = false;
  isFilterAdvanced = signal(false);

  dataSource = signal<GuiaRemisionList[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'serieComprobante', label: 'Serie Comprobante', type: 'string' },
    { key: 'razonSocialDestinatario', label: 'Cliente', type: 'string' },
    { key: 'fechaInicio', label: 'Fecha Inicio', type: 'string' },
    { key: 'fechaFin', label: 'Fecha Llegada', type: 'string' },
    { key: 'serieComprobanteInvoice', label: 'Doc', type: 'string' },
    { key: 'razonSocialTransportista', label: 'Transportista', type: 'string' },
    { key: 'nomUsuario', label: 'Usuario', type: 'string' },
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
      codEstab: this.dataSearch.codEstab,
      idPuntoEmision: this.dataSearch.puntoEmisionId,
      filterByDate: this.dataSearch.filterByDate, // Usamos el nuevo nombre
      idCliente: isValidField(this.dataSearch.clienteId),
      codEstado: isValidField(this.dataSearch.codEstado),
      byUsuario: isValidField(this.dataSearch.usuarioId),
      // Solo incluir las fechas si filterByDate es true
      fechaInicio: this.dataSearch.filterByDate ? isValidField(this.dataSearch.fromDate) : null,
      fechaFin: this.dataSearch.filterByDate ? isValidField(this.dataSearch.toDate) : null,
      secuencial: ValidatorUtils.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial),
    };
  }

  refresh() {
    this.getGuiasRemision();
  }

  private getGuiasRemision() {

    if (isValidField(this.dataSearch.nroSecuencial)) {
      if (!ValidatorUtils.validAndFormatedRangeSequential(this.dataSearch.nroSecuencial)) {
       this.dataSearch.filterByDate = true;
        this.tS.toastr({
          type: 'error',
          message: 'Define correctamente el número de secuencial o el rango de número secuencial!'
        })
        return
      }
      if (!(this.dataSearch.clienteId > 0)) {
        this.dataSearch.filterByDate = false;
      }
    }

    let params = this.getParams()
    if(!params) return;
    this.$listGuiasRemisionUseCase.execute(params).subscribe(response=>{
      console.log(response);
      this.dataSource.set(response.data);
      this.pagination.update(e=>{
        return {
          ...e,
          totalRecords: response.totalRecords
        }
      })
    })
  }

  // ngOnInit() {
  //   this.loading = true;
  //   this.$getGuiaRemisionFilterDataUseCase
  //     .execute()
  //     .pipe(finalize(() => (this.loading = false)))
  //     .subscribe((filterData) => {
  //       this.estabs.set(filterData.estabs);
  //       this.estadosDoc = filterData.estadosDoc;
  //
  //       if (this.estabs().length > 0) {
  //         const dataEstab = this.estabs().find((item) => item.defaultEstab);
  //
  //         this.dataSearch.codEstab = dataEstab?.codEstab || '';
  //         this.puntosEmision.set(dataEstab?.puntosEmision || []);
  //         if (this.puntosEmision().length > 0) {
  //           const dataPuntoEmision = this.puntosEmision().find(
  //             (item) => item.defaultPtoEmi
  //           );
  //
  //           this.dataSearch.puntoEmisionId =
  //             dataPuntoEmision?.idPuntoEmision || 0;
  //         }
  //       }
  //       this.refresh();
  //     });
  // }


  changeDateRange($event:any){
    this.dataSearch.fromDate = $event.from;
    this.dataSearch.toDate = $event.to;
    this.refresh()
  }


  public openAddEditModal(){
    let ref = this._dialogSvc.open(AddEditGuiaRemisionComponent, {
      size: 'xl',
      data: {

      }
    })
    ref.subscribe(rs=>{
      console.log(rs)
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

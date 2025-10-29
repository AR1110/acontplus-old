import {Component, inject, signal} from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {DataGrid} from "@shared/components/data-grid/data-grid";
import {DataGridColumn} from "@shared/components/data-grid/types";
import {PageEvent} from "@angular/material/paginator";
import {
  ProformaInvoiceFilterUseCase,
  ProformaInvoiceListUseCase
} from "@sale/domain/use-cases/proforma-invoice.use-case";
import {GroupedEstab, GroupedEstabPuntoEmision} from "@core/models/estab.model";
import {ToastrNotificationService} from "@core/services/toastr-notification.service";
import {MatPagination} from "@shared/models/pagination.model";
import {ProformaInvoiceList} from "@sale/domain/models/proforma-invoice";
import {finalize} from "rxjs/operators";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import { MatButtonModule} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import { MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {ACTION_ALIASES} from "@core/constants/permission-actions";
import {SALE_MODULES_CODE} from "@sale/domain/enums/sale.enum";
import {HasPermissionDirective} from "@core/directives/permission";
import {  MatMenuModule} from "@angular/material/menu";
import {DialogService} from "@core/services/dialog.service";
import {ProformaInvoiceDetail} from "@sale/ui/proforma-invoices/proforma-invoice-detail/proforma-invoice-detail";

@Component({
  selector: 'app-proforma-invoices',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DataGrid,
    DateRangeSelectionComponent,
    MatButtonModule,
    MatCheckbox,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatSelectModule,
    HasPermissionDirective,
    MatMenuModule
  ],
  templateUrl: './proforma-invoices.html',
  styles: ``,
})
export class ProformaInvoices {
  sale_modules_code = signal(SALE_MODULES_CODE);
  action_aliases = signal(ACTION_ALIASES);
  private _filterDataUseCase = inject(ProformaInvoiceFilterUseCase)
  private _listDataUseCase = inject(ProformaInvoiceListUseCase)
  private notiSvc = inject(ToastrNotificationService)
  private dgSvc = inject(DialogService)

  estabs = signal<GroupedEstab[]>([]);
  emissionPoints = signal<GroupedEstabPuntoEmision[]>([]);
  estadosDoc = [] as any[];
  isSearchAdvanced = signal(false);
  isLoadingResults = signal(false);

  dataSearch  = {
    estabId: 0,
    ptoEmiId: 0,
    codEstado: null,
    useFilterDate: true,
    fromDate: '',
    toDate: '',
    isTransferredToDoc: false,
    esBuscarCliente: false,
    esDatoAdicional: false,
    esBuscarPorNro: false,
    esBuscarUsuario: false,
  }
  pagination = signal(new MatPagination())

  columns: DataGridColumn[] = [
    { header: 'Nro.', field: 'index' },
    { header: 'Op.', field: 'actions' },
    { header: 'Documento', field: 'document' },
    { header: 'Cliente', field: 'client' },
    { header: 'Fecha de emisión', field: 'issuedDate' },
    { header: 'Total', field: 'total' },
    { header: 'Estado', field: 'statusName' },
    { header: 'Usuario', field: 'user' }
  ];
  list = signal<ProformaInvoiceList[]>([]);
  isLoading = signal(false);

  query = {
    q: 'user:nzbin',
    page: 0,
    per_page: 5,
  };

  get params() {
    const p = Object.assign({}, this.query);
    p.page += 1;
    return p;
  }

  private initLoad() {
    this._filterDataUseCase.execute().subscribe((response) => {

      this.estabs.set(response.estabs)
      const dataEstab = this.estabs().find(estab => estab.defaultEstab);
      if (!dataEstab) {
        this.notiSvc.warning({
          message: 'No se encontró establecimiento por defecto'
        })
        return
      }
      this.emissionPoints.set(dataEstab.puntosEmision)
      const dataPtoEmi = this.emissionPoints().find(pto => pto.defaultPtoEmi);
      if(!dataPtoEmi) {
        this.notiSvc.warning({
          message: 'No se encontró punto de emisión por defecto'
        })
        return
      }
      this.dataSearch.estabId = dataEstab.idEstablecimiento;
      this.dataSearch.ptoEmiId = dataPtoEmi.idPuntoEmision;
      console.log(this.dataSearch)
      this.getList()

    })
  }

  ngOnInit() {
    this.initLoad()
  }

  private getParams (){
    if(!(this.dataSearch.estabId>0)){
      throw new Error('Establecimiento no seleccionado')
    }
    return {
      estabId: this.dataSearch.estabId,
      ptoEmiId: this.dataSearch.ptoEmiId,
      codEstado: this.dataSearch.codEstado,
      fromDate: this.dataSearch.fromDate,
      toDate: this.dataSearch.toDate,
      isTransferredToDoc: this.dataSearch.isTransferredToDoc,
      esDatoAdicional: this.dataSearch.esDatoAdicional,
      esBuscarPorNro: this.dataSearch.esBuscarPorNro,
      esBuscarUsuario: this.dataSearch.esBuscarUsuario,
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    }
  }

  refresh(){
    this.getList()
  }

  getList() {
    this.isLoading.set(true);
    this.list.set([]);
    this._listDataUseCase.execute(this.getParams())
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe((response) => {
      this.list.set(response.data);
    });

  }

  onEstabChange(){

  }

  onDateRangeSelection($event:any){

  }


  openViewDetail(rowData: ProformaInvoiceList){
    this.dgSvc.open(ProformaInvoiceDetail, {
      data: {
        id: rowData.id
      },
      size: 'xl',
    })


  }
  getNextPage(e: PageEvent) {
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
    this.getList();
  }

}

import {Component, inject, signal, TemplateRef, ViewChild} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';

import { GroupedEstab } from "@core/models/estab.model";
import { ToasterService } from "@core/services/toaster.service";
import { formatDateToString } from "@core/utils/date.util";
import { hideLoader, showLoader } from "@core/utils/loader";
import { isValidField } from "@core/utils/utils";
import { UserCustomerRequest } from "@modules/config/domain/models/user-customer/user-customer-request.model";
import { UserCustomerRole } from "@modules/config/domain/models/user-customer/user-customer-role.model";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import {MatPagination } from "@shared/models/pagination.model";
import Swal from "sweetalert2";
import {SolicitudUsuarioUseCase} from "@modules/config/domain/use-cases/solicitud-usuario.use-case";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {PageEvent} from "@angular/material/paginator";
import {  MatFormFieldModule } from "@angular/material/form-field";
import {  MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'app-solicitud-usuario',
  imports: [
    FormsModule,
    NgbTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatDynamicCardComponent,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    MatDynamicTableComponent,
  ],
    templateUrl: './solicitud-usuario.component.html'
})
export class SolicitudUsuarioComponent {
  private readonly $solicitudUsuarioUseCase = inject(SolicitudUsuarioUseCase);
  private readonly tS = inject(ToasterService);
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  establecimientos: Array<GroupedEstab> = []
  dataSource: UserCustomerRequest[] = [];
  usersRole: UserCustomerRole[]=[];


  tiposDoc = [
    { code: '01', description: 'Factura' },
    {code: 'NE', description: 'Nota Entrega'},
    { code: '09', description: 'Proforma' },
  ]

  estadosDoc = [
    { code: 'P', description: 'Pendiente' },
    { code: 'A', description: 'Aprobada' },
    { code: 'F', description: 'Finalizada' },
  ]

  dataSearch = {
    codDoc: 0,
    codEstado: 0,
    usuarioSolicitanteId: 0,
    codEstab: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
  }

  columnsDefs: ColumnDefinition[] = [

    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'tipoDoc', label: 'Tipo Doc.', type: 'string' },
    { key: 'serieComprobante', label: 'Serie Comprobante', type: 'string' },
    { key: 'usuarioSolicitante', label: 'Solicitante', type: 'string' },
    { key: 'usuarioAprobante', label: 'Autorizador', type: 'string' },
    { key: 'accionDescripcion', label: 'Acción', type: 'string' },
    { key: 'observacion', label: 'Motivo', type: 'string' },
    { key: 'fechaRegistro', label: 'Fecha Registro', type: 'string' },
    { key: 'fechaAprobacion', label: 'Fecha Aprobación', type: 'string' },
    { key: 'estado', label: 'Estado', type: 'template' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  pagination = signal(new MatPagination());

  loading = false;

  fetchDataFilter(){
    showLoader()
    this.$solicitudUsuarioUseCase.getFilter().subscribe({
      next: (response) => {
        hideLoader();
        this.establecimientos = response.establecimientos;
        this.usersRole = response.usersRole;

        let dataEstab = this.establecimientos.find((e)=>e.defaultEstab)
        if(dataEstab){
          this.dataSearch.codEstab = dataEstab.codEstab;
          this.fetchAllData()
        }

      },
      error(err) {
        console.log(err)
        hideLoader();
      },
    })
  }
  fetchAllData() {
    let params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      checkBoxFecha: true,
      codEstab: this.dataSearch.codEstab,
      dateFrom: this.dataSearch.fromDate,
      dateTo: this.dataSearch.toDate,
      usuarioSolicitanteId: isValidField(this.dataSearch.usuarioSolicitanteId),
      codDoc: isValidField(this.dataSearch.codDoc),
      codEstado: isValidField(this.dataSearch.codEstado)
    }

    this.dataSource = [];
    this.$solicitudUsuarioUseCase.getAll(params).subscribe(  (response) => {
        this.dataSource = response.data;
    })
  }
  refresh(){
    this.fetchAllData()
  }
  ngOnInit() {
    this.fetchDataFilter();
  }

  ngAfterViewInit(): void {
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.statusTemplate;
      }
    });

  }



  onDateRangeSelection(range: { from: string, to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.fetchAllData()
  }


  askToApprobe(data: UserCustomerRequest) {
    try {
      Swal.fire({
        title: 'Aprobar Solicitud de Clave de Autorización',
        text: `Se está dando permiso al usuario para ${data.codigoAccion === 'E' ? 'editar' : 'anular'} el documento de venta!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aprobar!',
        cancelButtonText: 'Cancelar!'
      }).then(result=>{
        if(result.isConfirmed){
          try {
            let params = {
              tipo: 1,
              id: data.idSolicitud,
              rowguid: data.rowguid
            }
            this.$solicitudUsuarioUseCase.put(params).subscribe( (response)=>{


                  if (response.code === "0") {
                    this.tS.toastr({
                      type: 'warning',
                      message: response.message
                    })
                  }
                  if (response.code === "1") {
                    this.tS.toastr({
                      type: 'success',
                      message: response.message
                    })
                    this.fetchAllData()
                  }

            })
          } catch (error) {
            console.log(error)
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
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

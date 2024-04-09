import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { isApiResponse } from "@core/models/api-response";
import { GroupedEstab } from "@core/models/estab.model";
import { ToasterService } from "@core/services/toaster.service";
import { formatDateMoment } from '@core/utils/format-date-moment';
import { hideLoader, showLoader } from "@core/utils/loader";
import { isValidField } from "@core/utils/utils";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserCustomerRequest } from "@modules/config/models/user-customer/user-customer-request.model";
import { UserCustomerRole } from "@modules/config/models/user-customer/user-customer-role.model";
import { UserCustomerRequestService } from "@modules/config/services/user-customer/user-customer-request.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { Pagination } from '@shared/class/Pagination';
import Swal from "sweetalert2";

@Component({
  selector: 'app-user-customer-request-page',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    NgbTooltipModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent
  ],
  templateUrl: './user-customer-request-page.component.html'
})
export class UserCustomerRequestPageComponent {
  private readonly userCustomerRequestSvc = inject(UserCustomerRequestService);
  private readonly tS = inject(ToasterService);

  pagination = new Pagination();

  establecimientos: Array<GroupedEstab> = []
  userCustomerRequests: UserCustomerRequest[] = [];
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
    codDoc: '',
    codEstado: '',
    usuarioSolicitanteId: 0,
    codEstab: '',
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
  }

  fetchDataFilter(){
    showLoader()
    this.userCustomerRequestSvc.getDataFilter().subscribe({
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
    showLoader()
    let params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
      checkBoxFecha: true,
      codEstab: this.dataSearch.codEstab,
      dateFrom: this.dataSearch.fromDate,
      dateTo: this.dataSearch.toDate,
      usuarioSolicitanteId: isValidField(this.dataSearch.usuarioSolicitanteId),
      codDoc: isValidField(this.dataSearch.codDoc),
      codEstado: isValidField(this.dataSearch.codEstado)
    }

    this.userCustomerRequests = [];
    this.userCustomerRequestSvc.getAll(params).subscribe({
      next: (response) => {
        hideLoader();
        this.userCustomerRequests = response;

      },
      error(err) {
        hideLoader();
      },
    })
  }
  ngOnInit() {
    this.fetchDataFilter();
  }

  onDateRangeSelection(range: { from: string, to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.fetchAllData()
  }

  pageChanged(): void {
    this.fetchAllData();
  }

  changePageSize(): void {
    this.pagination.pageIndex = 1;
    this.fetchAllData();
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
            showLoader();
            let params = {
              tipo: 1,
              id: data.idSolicitud,
              rowguid: data.rowguid
            }
            this.userCustomerRequestSvc.put(params).subscribe({
              next:(response)=>{
                hideLoader()
                if(isApiResponse(response)){
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
                }
              },
              error(err) {
                console.log(err)
                  hideLoader();
              },
            })
          } catch (error) {
            hideLoader()
            console.log(error)
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }


}

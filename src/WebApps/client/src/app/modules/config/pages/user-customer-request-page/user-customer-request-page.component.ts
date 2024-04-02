import { Component, inject } from "@angular/core";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { isApiResponse } from "@core/models/api-response";
import { ToasterService } from "@core/services/toaster.service";
import { hideLoader, showLoader } from "@core/utils/loader";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserCustomerRequest } from "@modules/config/models/user-customer-request.model";
import { UserCustomerRequestService } from "@modules/config/services/user-customer-request.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";


@Component({
  selector: 'app-user-customer-request-page',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbTooltipModule,
    BreadcrumbComponent
  ],
  templateUrl: './user-customer-request-page.component.html'
})
export class UserCustomerRequestPageComponent {
  private readonly userCustomerRequestSvc = inject(UserCustomerRequestService);
  private readonly tS = inject(ToasterService);

  userCustomerRequests: UserCustomerRequest[] = [];
  fetchAllData() {
    showLoader()
    this.userCustomerRequestSvc.getAll().subscribe({
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
              id: data.idSolicitud
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

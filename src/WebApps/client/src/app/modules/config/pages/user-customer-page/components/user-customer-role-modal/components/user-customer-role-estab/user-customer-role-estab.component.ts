import { Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { hideLoader, showLoader } from "@core/utils/loader";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserCustomerCustomerRoleEstab } from "@modules/config/models/user-customer/user-customer-role-estab.model";
import { UserCustomerRoleEstabService } from "@modules/config/services/user-customer/user-customer-role-estab.service";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToasterService } from "@core/services/toaster.service";
import { isApiResponse } from "@core/models/api-response";
import Swal from "sweetalert2";
import { ModalService } from "@core/services/modal.service";
import { UserBodegaPuntoEmisionModalComponent } from "../user-bodega-punto-emision-modal/user-bodega-punto-emision-modal.component";

@Component({
  selector: 'app-user-customer-role-estab',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    FormsModule,
    FontAwesomeModule
  ],
  templateUrl: './user-customer-role-estab.component.html'
})
export class UserCustomerRoleEstabComponent {

  private readonly userCustomerRoleEstabSvc = inject(UserCustomerRoleEstabService)
  private readonly tS = inject(ToasterService);
  private modalSvc = inject(ModalService)

  userCustomerRoleEstabs: Array<UserCustomerCustomerRoleEstab> = [];

  idUsuarioRol = 0;

  getUserCustomerRoleEstabs(idUsuarioRol: number) {
    this.idUsuarioRol = idUsuarioRol;
    let obj = {
      idUsuarioRol
    }
    showLoader()
    this.userCustomerRoleEstabSvc.getAll(obj).subscribe({
      next: (response) => {
        hideLoader();
        this.userCustomerRoleEstabs = response;
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }


  onChangeDefault(data: UserCustomerCustomerRoleEstab) {
    showLoader();
    this.userCustomerRoleEstabSvc.put(data.idEstab_Asig).subscribe({
      next: (response) => {
        hideLoader();
        if (isApiResponse(response)) {
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
            this.getUserCustomerRoleEstabs(this.idUsuarioRol)
          }
        }
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }


  async addEstab(data: UserCustomerCustomerRoleEstab) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger m-2'
      },
      buttonsStyling: false
    })

    let {
      isConfirmed
    } = await swalWithBootstrapButtons.fire({
      html: `<small>Está seguro de ${data.idEstab_Asig > 0 ? 'quitar' : 'asignar'} este Establecimiento: <b>${data.nombreComercial}</b></small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${data.idEstab_Asig > 0 ? 'quitar' : 'asignar'}`,
      cancelButtonText: 'No, cancelar!',
      reverseButtons: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    })


    if (isConfirmed) {
      let params = {
        id: data.idEstab_Asig,
        idUsuarioRol: this.idUsuarioRol,
        codEstab: data.codEstab
      }
      this.userCustomerRoleEstabSvc.post(params).subscribe({
        next: (response) => {
          hideLoader();
          if (isApiResponse(response)) {
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
              this.getUserCustomerRoleEstabs(this.idUsuarioRol)
            }
          }
        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })

    }
  }

  modalBodegaPuntoEmision(data:UserCustomerCustomerRoleEstab){
    let modalRef = this.modalSvc.openModalCustom(UserBodegaPuntoEmisionModalComponent, {
      size: 'lg'
    })
    modalRef.componentInstance.params = data;
  }
}

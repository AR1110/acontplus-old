import { Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { isApiResponse } from "@core/models/api-response";
import { ToasterService } from "@core/services/toaster.service";
import { hideLoader, showLoader } from "@core/utils/loader";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserCustomerCustomerRoleBodega } from "@modules/config/models/user-customer-role-bodega.model";
import { UserCustomerCustomerRoleEstab } from "@modules/config/models/user-customer-role-estab.model";
import { UserCustomerCustomerRolePtoEmision } from "@modules/config/models/user-customer-role-punto-emision.model";
import { UserCustomerRoleBodegaService } from "@modules/config/services/user-customer/user-customer-role-bodega.service";
import { UserCustomerRolePuntoEmisionService } from "@modules/config/services/user-customer/user-customer-role-punto-emision.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin, Observable } from "rxjs";
import Swal from "sweetalert2";


@Component({
  selector: 'app-user-bodega-punto-emision-modal',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    FontAwesomeModule,
    FormsModule
  ],
  templateUrl: './user-bodega-punto-emision-modal.component.html'
})
export class UserBodegaPuntoEmisionModalComponent {
  @Input() params: UserCustomerCustomerRoleEstab = {
    idEstab_Asig: 0,
    codEstab_Asig: "",
    codEstab: "",
    estab: "",
    nombreComercial: "",
    defaultEstab: false,
    estado: false
  }

  modal = inject(NgbActiveModal);
  private userCustomerRoleBodegaSvc = inject(UserCustomerRoleBodegaService)
  private userCustomerRolePtoEmisionSvc = inject(UserCustomerRolePuntoEmisionService)
  private tS = inject(ToasterService)

  userCustomerRoleBodegas: UserCustomerCustomerRoleBodega[] = []
  userCustomerRolePuntosEmision: UserCustomerCustomerRolePtoEmision[] = []

  fetchAllData() {
    showLoader();
    forkJoin([
      this.userCustomerRoleBodegaSvc.getAll(this.params.codEstab_Asig),
      this.userCustomerRolePtoEmisionSvc.getAll(this.params.codEstab_Asig)
    ]).subscribe({
      next: (response) => {
        hideLoader()
        const [bodegas, puntosEmision] = response;
        this.userCustomerRoleBodegas = bodegas;
        this.userCustomerRolePuntosEmision = puntosEmision;

      },
      error(err) {
        hideLoader();
      },
    })
  }

  ngOnInit() {
    this.fetchAllData();
  }



  onChangePuntoEmisionDefault(item: UserCustomerCustomerRolePtoEmision) {
    try {
      showLoader();
      this.userCustomerRolePtoEmisionSvc.put(item.idPtoEmi_Asig).subscribe({
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
              this.fetchAllData()
            }
          }
        },
        error(err) {
          hideLoader()
        },
      })
    } catch (error) {
      hideLoader();
      console.log(error)
    }
  }

  async addPuntoEmision(item: UserCustomerCustomerRolePtoEmision) {
    try {
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
        icon: 'warning',
        html: `<small>Está seguro de ${item.idPtoEmi_Asig > 0 ? 'quitar' : 'asignar'} este Punto de Emisión: <b>${item.ptoEmi}</b> a Sucursal: <b>${this.params.nombreComercial}</b></small>`,
        showCancelButton: true,
        confirmButtonText: `Sí, ${item.idPtoEmi_Asig > 0 ? 'quitar' : 'asignar'}`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: false,
        allowOutsideClick: false
      })

      if (isConfirmed) {
        let params = {
          ...item,
          codEstab_Asig: this.params.codEstab_Asig

        }
        showLoader();
        this.userCustomerRolePtoEmisionSvc.post(params).subscribe({
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
                this.fetchAllData()
              }
            }
          },
          error(err) {
            hideLoader();
          },
        })
      }
    } catch (error) {
      hideLoader();
    }
  }



  //Bodegas
  onChangeBodegaDefault(item: UserCustomerCustomerRoleBodega) {
    try {
      showLoader();
      this.userCustomerRoleBodegaSvc.put(item.idBodeg_Asig).subscribe({
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
              this.fetchAllData()
            }
          }
        },
        error(err) {
          hideLoader()
        },
      })
    } catch (error) {
      hideLoader();
      console.log(error)
    }
  }

  async addBodega(item: UserCustomerCustomerRoleBodega) {
    try {
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
        icon: 'warning',
        html: `<small>Está seguro de ${item.idBodeg_Asig > 0 ? 'quitar' : 'asignar'} este Bodega: <b>${item.descripcion}</b> a Establecimiento: <b>${this.params.nombreComercial}</b></small>`,
        showCancelButton: true,
        confirmButtonText: `Sí, ${item.idBodeg_Asig > 0 ? 'quitar' : 'asignar'}`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: false,
        allowOutsideClick: false,
      })

      if (isConfirmed) {
        showLoader();
        const params = {
          ...item,
          codEstab_Asig: this.params.codEstab_Asig

        }
        this.userCustomerRoleBodegaSvc.post(params).subscribe({
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
                this.fetchAllData()
              }
            }
          },
          error(err) {
            hideLoader()
          },
        })
      }
    } catch (error) {
      hideLoader();
      console.log(error)
    }
  }

}


import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { ModalService } from "@core/services/modal.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SubEntidadFinancieraRead } from "@modules/accounting/models/subentidad-financiera.model";
import { SubEntidadFinancieraService } from "@modules/accounting/services/sub-entidad-financiera.service";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { SubEntidadFinancieraModalComponent } from "./sub-entidad-financiera-modal/sub-entidad-financiera-modal.component";
import { hideLoader, showLoader } from "@core/utils/loader";
import Swal from "sweetalert2";
import { isApiResponse } from "@core/models/api-response";
import { ToasterService } from "@core/services/toaster.service";
import {EntidadFinanciera} from "@accounting/interfaces/entidad-financiera.interface";



@Component({
    selector: 'app-sub-entidad-financiera-page',
    imports: [
        FontAwesomeModule,
        FormsModule,
        NgbAccordionModule,
        BreadcrumbComponent
    ],
    templateUrl: './sub-entidad-financiera-page.component.html'
})
export class SubEntidadFinancieraPageComponent {
  private readonly subEntidadFinancieraSvc = inject(SubEntidadFinancieraService);
  private readonly modalSvc = inject(ModalService);
  private readonly tS = inject(ToasterService)

  entidadesFinanciera: Array<EntidadFinanciera> = [];
  cloneSubEntidadesFinanciera: Array<SubEntidadFinancieraRead> = [];
  subEntidadesFinanciera: Array<SubEntidadFinancieraRead> = [];

  idEntidadFinanciera = 0;
  getData() {
    showLoader();
    this.subEntidadFinancieraSvc.getAll().subscribe({
      next: (value) => {
        hideLoader();
        this.entidadesFinanciera = value.entidadesFinancieras;
        this.cloneSubEntidadesFinanciera = value.subEntidadesFinancieras;
        if (this.idEntidadFinanciera > 0) {
          this.showAcordeon(this.idEntidadFinanciera)
        }
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }


  showAcordeon(idEntidadFinanciera: number) {
    this.idEntidadFinanciera = idEntidadFinanciera;

    this.subEntidadesFinanciera = this.cloneSubEntidadesFinanciera.filter(e => e.idEntidadFinanciera === idEntidadFinanciera);
  }

  hideAcordeon() {
    this.subEntidadesFinanciera = [];
  }

  ngOnInit() {
    this.getData();
  }

  openModal(dataEntidadFinanciera?: EntidadFinanciera, data?: SubEntidadFinancieraRead) {
    const modalRef = this.modalSvc.openModalCustom(
      SubEntidadFinancieraModalComponent
    )
    let params = {
      idEntidadFinanciera: dataEntidadFinanciera?.idEntidadFinanciera,
      nameEntidadFinanciera: dataEntidadFinanciera?.descripcion,
    }

    params = data ? { ...params, ...data } : params

    modalRef.componentInstance.params = params;
    modalRef.result.then(result => {
      if (result !== null && typeof result === 'object') {
        this.getData();
      }
    })
  }

  askToDelete(data: SubEntidadFinancieraRead) {
    try {
      Swal.fire({
        icon: 'warning',
        html: '<small>Esta seguro/a de eliminar este registro ahora?</small>',
        showDenyButton: true,
        confirmButtonText: `Si, eliminar`,
        denyButtonText: `No, cancelar`,
        allowOutsideClick: false
      }).then(result => {
        if (result.isConfirmed) {
          showLoader();
          this.subEntidadFinancieraSvc.delete(data.idSubEntidadFinanciera).subscribe({
            next: (value) => {
              hideLoader();
              if (isApiResponse(value)) {
                if (value.code === "0") {
                  this.tS.toastr({
                    type: 'warning',
                    message: value.message
                  })
                }
                if (value.code === "1") {
                  this.tS.toastr({
                    type: 'success',
                    message: value.message
                  })
                  this.getData();
                }
              }
            },
            error(err) {
              hideLoader();
              console.log(err)
            },
          })
        };
      });
    } catch (error) {
      hideLoader();
      console.log(error)
    }
  }
}

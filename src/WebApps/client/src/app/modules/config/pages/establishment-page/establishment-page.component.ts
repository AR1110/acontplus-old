import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { Tabulator } from 'tabulator-tables';
import { EstabAddEditModalComponent } from './components/estab-add-edit-modal/estab-add-edit-modal.component';
import { ModalService } from '@core/services/modal.service';
import { EstablishmentRead } from "@modules/config/models/sri/establishment.model";
import { NgbAccordionModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { PuntoEmisionRead } from '@core/models/punto-emision.model';
import { PrimaryStatusPipe } from '@shared/pipe/primary-status.pipe';

@Component({
  selector: 'app-establishment-page',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbAccordionModule,
    NgbTooltipModule,
    BreadcrumbComponent,
    PrimaryStatusPipe
  ],
  templateUrl: './establishment-page.component.html',
  styleUrl: './establishment-page.component.scss'
})
export class EstablishmentPageComponent {

  private estabSvc = inject(EstablishmentService);
  private modalSvc = inject(ModalService)
  private tS = inject(ToasterService)
  establishments: EstablishmentRead[] = [];
  puntosEmision: PuntoEmisionRead[]=[]

  dataSeach = {
    pageIndex: 1,
    pageSize: 25,

  }

  getEstabs() {
    let params = {
      pageIndex: this.dataSeach.pageIndex,
      pageSize: this.dataSeach.pageSize
    }
    this.estabSvc.getAll(params).subscribe(response => {
      this.establishments = response;
    })
  }

  ngOnInit() {
    this.getEstabs()
  }

  openModalAddEdit(id?: number) {
    const modalRef = this.modalSvc.openModalCustom(EstabAddEditModalComponent, {
      size: 'lg'
    })
    modalRef.componentInstance.params = {
      id: id
    }

    modalRef.result.then(result => {
      if (result !== null && typeof result === 'object')
        this.getEstabs()
    })
  }


  async askToCloseEstab(id: number) {
    const swal = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger m-l-5'
      },
      buttonsStyling: false
    })

    const { isConfirmed } = await swal.fire({
      title: 'Cerrar el Establecimiento',
      html: "<small>Esta seguro de cerrar el Establecimiento?</small>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar!',
      cancelButtonText: 'No, cancelar!',
      allowOutsideClick: false,
      reverseButtons: false
    })

    if (isConfirmed) {
      this.estabSvc.closeEstab(id).subscribe(response => {
        if (isApiResponse(response)) {
          if (response.code == "0") {
            this.tS.toastr({
              type: 'warning',
              message: response.message
            })
          }
          if (response.code == "1") {
            this.tS.toastr({
              type: 'success',
              message: response.message
            })
            this.getEstabs()
          }
        }
      })
    }
  }


  onEstabShow(id:number){
    this.puntosEmision = [];
    this.estabSvc.getId(id).subscribe(response=>{
      this.puntosEmision = response.puntosEmision;
    })
  }

  onEstabHide(){
    this.puntosEmision = [];
  }
}

import { Component, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { AppModule } from 'src/app/app.module';
import { AnticipoModalComponent } from './anticipo-modal/anticipo-modal.component';
import { AnticipoService } from '@modules/accounting/services/anticipo.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { AnticipoRead } from '@modules/accounting/models/anticipo.model';
import { SharedService } from '@core/services/shared.service';
import { CODE_REPORT } from '@core/constants/global.constants';
import Swal from 'sweetalert2';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-anticipo',
  standalone: true,
  imports: [AppModule],
  templateUrl: './anticipo.component.html',
  styleUrl: './anticipo.component.scss'
})
export class AnticipoComponent {

  private modalSvc = inject(ModalService)
  private anticipoSvc = inject(AnticipoService);
  private sharedSvc = inject(SharedService)
  private tS = inject(ToasterService)

  anticipos: Array<AnticipoRead> = [];

  recordsQuantity = [25, 50, 100]
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5
  }
  totalRecords = 0;
  getAnticipos() {
    let params = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize
    }
    showLoader();
    this.anticipoSvc.getAll(params).subscribe({
      next: (response) => {
        hideLoader();
        this.anticipos = response;
        this.totalRecords = this.anticipos.length > 0 ? this.anticipos[0].totalRecords : 0
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }

  ngOnInit() {
    this.getAnticipos()
  }

  refresh() {
    this.getAnticipos()
  }

  openModal<T>(data?: T) {
    const modalRef = this.modalSvc.openModalCustom(AnticipoModalComponent);
    modalRef.componentInstance.params = data;

    modalRef.result.then(result => {
      if (typeof result === 'object') {

      }
    })
  }

  getPrint(data: AnticipoRead) {
    let parameters = {
      idDocument: data.idAnticipo,
      idTipoDocumento: data.idTipoDocumento,
      codEstab: data.codEstab,
      codDoc: data.codDoc,
      nroIdentificacion: data.identificacionUsuario,
    }
    this.sharedSvc.askToPrint({
      parameters: JSON.stringify(parameters)
    })
  }
  getReport(data: AnticipoRead) {
    let format = 'pdf';

    let dataParms = {
      id: data.idAnticipo,
    }

    const parameters = {
      hasService: true,
      reportParams: JSON.stringify({
        hasParams: false,
        codigo: CODE_REPORT.RA,
        format,
        codEstab: data.codEstab,
        aditionalParams: []
      }),
      dataParams: JSON.stringify(dataParms)
    }

    this.sharedSvc.getReport(parameters, "pdf", true)
  }

  askToDelete(data: AnticipoRead) {

    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta caja ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false
      }).then(result => {
        if (result.isConfirmed) {
          showLoader();
          this.anticipoSvc.delete(data.idAnticipo).subscribe({
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
                  this.getAnticipos();
                }
              }
            }, error(err) {
              hideLoader();
              console.log(err)
            },
          })
        }
      })
    } catch (error) {
      hideLoader();
      console.log(error)
    }

  }


  pageChanged(): void {
    this.getAnticipos();
  }

  changePageSize(): void {
    this.dataSearch.pageIndex = 1;
    this.getAnticipos();
  }



}

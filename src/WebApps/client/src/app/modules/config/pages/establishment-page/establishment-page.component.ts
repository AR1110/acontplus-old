import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { PuntoEmisionRead } from '@core/models/punto-emision.model';
import { ModalService } from '@core/services/modal.service';
import { ToasterService } from '@core/services/toaster.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EstablishmentRead } from '@modules/config/models/sri/establishment.model';
import { PuntoEmisionAddEditModalComponent } from '@modules/config/pages/establishment-page/components/punto-emision-add-edit-modal/punto-emision-add-edit-modal.component';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import {
  NgbAccordionModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import Swal from 'sweetalert2';

import { EstabAddEditModalComponent } from './components/estab-add-edit-modal/estab-add-edit-modal.component';
import { PuntoEmisionService } from '@modules/config/services/sri/punto-emision.service';
import { FormsModule } from '@angular/forms';
import { EstablishmentLogoService } from '@modules/config/services/sri/establishment-logo.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-establishment-page',
    imports: [
        CommonModule,
        FontAwesomeModule,
        NgbAccordionModule,
        NgbTooltipModule,
        BreadcrumbComponent,
        PrimaryStatusPipe,
        FormsModule,
    ],
    templateUrl: './establishment-page.component.html',
    styleUrl: './establishment-page.component.scss'
})
export class EstablishmentPageComponent {
  establishments: EstablishmentRead[] = [];
  puntosEmision: PuntoEmisionRead[] = [];
  fileError: any = null;
  dataSeach = {
    pageIndex: 1,
    pageSize: 25,
  };
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  data: any = {};
  dataLogo: any = {};
  private estabSvc = inject(EstablishmentService);
  private ptoEmisionSvc = inject(PuntoEmisionService);
  private estabLogoSvc = inject(EstablishmentLogoService);
  private modalSvc = inject(ModalService);
  private tS = inject(ToasterService);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const maxSizeInBytes = 500 * 1024; // 500 KB en bytes

      // Validate file size
      if (this.selectedFile.size > maxSizeInBytes) {
        this.fileError = { type: 'size', size: this.selectedFile.size };
      } else if (!this.selectedFile.type.startsWith('image/')) {
        this.fileError = { type: 'type' };
      } else {
        this.fileError = null;
      }

      if (this.fileError) return;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          this.imageUrl = e.target.result;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  successResponseLogo = (response: any) => {
    if (isApiResponse(response)) {
      if (response.code == '0') {
        this.tS.toastr({
          type: 'warning',
          message: response.message,
        });
      }
      if (response.code == '1') {
        this.tS.toastr({
          type: 'success',
          message: response.message,
        });

        this.dataLogo = {};
        this.imageUrl = null;
        this.selectedFile = null;
        this.getDataLogo(this.data.idEstablecimiento);
      }
    }
  };

  uploadImage(): void {
    if (this.selectedFile) {
      if (this.dataLogo.id > 0) {
        this.estabLogoSvc
          .put(this.dataLogo.id, this.selectedFile)
          .subscribe(this.successResponseLogo);
      } else {
        this.estabLogoSvc
          .post(this.data.idEstablecimiento, this.selectedFile)
          .subscribe(this.successResponseLogo);
      }
    }
  }

  getEstabs() {
    let params = {
      pageIndex: this.dataSeach.pageIndex,
      pageSize: this.dataSeach.pageSize,
    };
    this.estabSvc.getAll(params).subscribe((response) => {
      this.establishments = response;
    });
  }

  ngOnInit() {
    this.getEstabs();
  }

  openModalAddEdit(id?: number) {
    const modalRef = this.modalSvc.openModalCustom(EstabAddEditModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.params = {
      id: id,
    };

    modalRef.result.then((result) => {
      if (result !== null && typeof result === 'object') this.getEstabs();
    });
  }

  async askToCloseEstab(id: number) {
    const swal = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger m-l-5',
      },
      buttonsStyling: false,
    });

    const { isConfirmed } = await swal.fire({
      title: 'Cerrar el Establecimiento',
      html: '<small>Esta seguro de cerrar el Establecimiento?</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar!',
      cancelButtonText: 'No, cancelar!',
      allowOutsideClick: false,
      reverseButtons: false,
    });

    if (isConfirmed) {
      this.estabSvc.closeEstab(id).subscribe((response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code == '1') {
            this.tS.toastr({
              type: 'success',
              message: response.message,
            });
            this.getEstabs();
          }
        }
      });
    }
  }

  onEstabShow(id: number) {
    this.puntosEmision = [];
    this.fileError = null;
    this.imageUrl = null;

    this.estabSvc.getId(id).subscribe((response) => {
      this.puntosEmision = response.puntosEmision;
      this.data = response.data;
    });

    this.getDataLogo(id);
  }

  getDataLogo(id: number) {
    this.estabLogoSvc.getDataLogo(id).subscribe((response) => {
      this.dataLogo = response;
      if (!this.dataLogo.isCompressed) {
        this.tS.toastr({
          type: 'warning',
          message:
            'Por favor actualize nuevamente el logo del establecimiento, gracias!',
          title: 'Aviso!',
        });
      }
      this.imageUrl = `data:${this.dataLogo.contentType};base64,${this.dataLogo.content}`;
    });
  }

  onEstabHide() {
    this.puntosEmision = [];
    this.data = {};
  }

  modalAddEditPuntoEmision(
    data: EstablishmentRead,
    dataPuntoEmision?: PuntoEmisionRead,
  ) {
    const modalRef = this.modalSvc.openModalCustom(
      PuntoEmisionAddEditModalComponent,
      {
        size: 'sm',
      },
    );

    modalRef.componentInstance.params = {
      codEstab: data.codEstab,
      establishmentName: data.nombreComercial,
      idPuntoEmision: dataPuntoEmision?.idPuntoEmision,
      estado: dataPuntoEmision?.estado ?? false,
      ptoEmi: dataPuntoEmision?.ptoEmi,
      ambiente: dataPuntoEmision?.ambiente,
    };

    modalRef.result.then((result) => {
      if (result !== null && typeof result === 'object') this.getEstabs();
    });
  }

  async clearImage() {
    if (!(this.dataLogo.id > 0)) {
      this.imageUrl = null;
      this.selectedFile = null;
      return;
    }

    const swal = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ml-2',
      },
      buttonsStyling: false,
    });

    let { isConfirmed } = await swal.fire({
      title: '<small>Eliminar Logo</small>',
      html: '<small>Esta seguro de eliminar logo?</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: false,
      allowOutsideClick: false,
    });

    if (isConfirmed) {
      this.estabLogoSvc.removeImage(this.dataLogo.id).subscribe((response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code == '1') {
            this.tS.toastr({
              type: 'success',
              message: 'Eliminado Correctamente',
            });
            this.dataLogo = {};
            this.imageUrl = null;
            this.selectedFile = null;
            this.getDataLogo(this.data.idEstablecimiento);
          }
        }
      });
    }
  }

  async askToDeletePtoEmision(id: number) {
    const swal = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger m-l-5',
      },
      buttonsStyling: false,
    });

    const { isConfirmed } = await swal.fire({
      title: 'Anular Punto de Emisión',
      html: '<small>¿Esta seguro de anular?</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, anular!',
      cancelButtonText: 'No, cancelar!',
      allowOutsideClick: false,
      reverseButtons: false,
    });

    if (isConfirmed) {
      this.ptoEmisionSvc.annul(id).subscribe((response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code == '1') {
            this.tS.toastr({
              type: 'success',
              message: response.message,
            });
            this.getEstabs();
          }
        }
      });
    }
  }

  configSaveFactElect() {
    this.estabSvc
      .putSriAuth(this.data.idEstablecimiento, this.data.autoSriAuth)
      .subscribe((response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code == '1') {
            this.tS.toastr({
              type: 'success',
              message: response.message,
            });
            this.getEstabs();
          }
        }
      });
  }
}

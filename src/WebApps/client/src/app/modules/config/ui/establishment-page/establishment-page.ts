import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { PuntoEmisionRead } from '@core/models/punto-emision.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { EstablishmentRead } from '@modules/config/data/models/establishment.model';
import { PuntoEmisionAddEditModalComponent } from '@modules/config/ui/establishment-page/punto-emision-add-edit-modal/punto-emision-add-edit-modal.component';
import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import Swal from 'sweetalert2';
import { EstabAddEditModalComponent } from '@modules/config/ui/establishment-page/estab-add-edit-modal/estab-add-edit-modal.component';
import { PuntoEmisionService } from '@modules/config/services/sri/punto-emision.service';
import { FormsModule } from '@angular/forms';
import { EstablishmentLogoService } from '@modules/config/services/sri/establishment-logo.service';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Button, DynamicCard, DataGrid, DataGridColumn } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';
import { SendMaxEstablishmentsUseCase } from '@modules/config/application/use-cases/general-config/list-general-config.use-case';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-establishment-page',
  imports: [
    BreadcrumbComponent,
    PrimaryStatusPipe,
    FormsModule,
    MatExpansionModule,
    MatRadioGroup,
    MatRadioButton,
    Button,
    DynamicCard,
    DataGrid,
  ],
  templateUrl: './establishment-page.html',
  styleUrl: './establishment-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstablishmentPage implements OnInit {
  establishments = signal<EstablishmentRead[]>([]);
  puntosEmision = signal<PuntoEmisionRead[]>([]);
  fileError: any = null;
  dataSeach = {
    pageIndex: 1,
    pageSize: 25,
  };
  imageUrl = signal<string | ArrayBuffer | null>(null);
  selectedFile: File | null = null;
  data: any = {};
  dataLogo: any = {};
  panelOpenState = -1;

  newEstablishmentImgUploaded = signal(false);

  private readonly _estabService = inject(EstablishmentService);
  private readonly _puntoEmisionService = inject(PuntoEmisionService);
  private readonly _estabLogService = inject(EstablishmentLogoService);
  private readonly _modalService = inject(DialogService);
  private readonly _tS = inject(ToastrNotificationService);
  private $sendMaxEstablishmentUseCase = inject(SendMaxEstablishmentsUseCase);

  columns: DataGridColumn[] = [
    { header: '', field: 'expand', showExpand: true },
    { header: 'Op.', field: 'op' },
    { header: 'Nro. Establecimiento', field: 'estab' },
    { header: 'Establecimiento', field: 'nombreComercial' },
    { header: 'Dir. Establecimiento', field: 'dirEstablecimiento' },
    { header: 'Estado', field: 'status' },
  ];

  columnsPuntosEmision: DataGridColumn[] = [
    { header: 'Op.', field: 'op' },
    { header: 'Nro.', field: 'index' },
    { header: 'Punto Emisión', field: 'ptoEmi' },
    { header: 'Ambiente', field: 'descripcion' },
    { header: 'Estado', field: 'status' },
  ];

  expanded(e: any) {
    if (!e.expanded) {
      this.puntosEmision.set([]);
      this.data = {};
      return;
    }
    this.onEstabShow(e.data.idEstablecimiento);
  }

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
          this.imageUrl.set(e.target.result);
          this.newEstablishmentImgUploaded.set(true);
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  commonResponse = (response: ApiResponseLegacy) => {
    this._tS.show({
      type: response.code === '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.dataLogo = {};
      this.imageUrl.set(null);
      this.selectedFile = null;
      this.newEstablishmentImgUploaded.set(false);
      this.getDataLogo(this.data.idEstablecimiento);
    }
  };

  uploadImage(): void {
    if (this.selectedFile) {
      if (this.dataLogo && this.dataLogo.id > 0) {
        this._estabLogService
          .put(this.dataLogo.id, this.selectedFile)
          .subscribe(this.commonResponse);
      } else {
        this._estabLogService
          .post(this.data.idEstablecimiento, this.selectedFile)
          .subscribe(this.commonResponse);
      }
    }
  }

  getEstabs() {
    const params = {
      pageIndex: this.dataSeach.pageIndex,
      pageSize: this.dataSeach.pageSize,
    };
    this._estabService.getAll(params).subscribe((response) => {
      this.establishments.set(response);
    });
  }

  ngOnInit() {
    this.getEstabs();
  }

  async openAddEstablishment() {
    await firstValueFrom(this.$sendMaxEstablishmentUseCase.execute());
    this.openModalAddEdit();
  }

  openModalAddEdit(id?: number) {
    const modalRef = this._modalService.open(EstabAddEditModalComponent, {
      size: 'lg',
      data: {
        id,
      },
    });
    modalRef.subscribe((result) => {
      if (result !== null && typeof result === 'object') this.getEstabs();
    });
  }

  async askToCloseEstab(id: number) {
    const swal = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ml-3',
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
      this._estabService.closeEstab(id).subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code == '1') {
          this.getEstabs();
        }
      });
    }
  }

  onEstabShow(id: number) {
    this.puntosEmision.set([]);
    this.fileError = null;
    this.imageUrl.set(null);

    this._estabService.getId(id).subscribe((response) => {
      this.puntosEmision.set(response.puntosEmision);
      this.data = response.data;
    });

    this.getDataLogo(id);
  }

  getDataLogo(id: number) {
    this._estabLogService.getDataLogo(id).subscribe((response) => {
      this.dataLogo = response;

      if (this.dataLogo && !this.dataLogo.isCompressed) {
        this._tS.show({
          type: 'warning',
          message: 'Por favor actualize nuevamente el logo del establecimiento, gracias!',
          title: 'Aviso!',
        });
      }
      if (this.dataLogo) {
        this.imageUrl.set(`data:${this.dataLogo.contentType};base64,${this.dataLogo.content}`);
      }
    });
  }
  modalAddEditPuntoEmision(data: EstablishmentRead, dataPuntoEmision?: PuntoEmisionRead) {
    const modalRef = this._modalService.open(PuntoEmisionAddEditModalComponent, {
      size: 'sm',
      data: {
        codEstab: data.codEstab,
        establishmentName: data.nombreComercial,
        idPuntoEmision: dataPuntoEmision?.idPuntoEmision,
        estado: dataPuntoEmision?.estado ?? false,
        ptoEmi: dataPuntoEmision?.ptoEmi,
        ambiente: dataPuntoEmision?.ambiente,
      },
    });

    modalRef.subscribe((result) => {
      if (result !== null && typeof result === 'object') this.getEstabs();
    });
  }

  async clearImage() {
    if (!(this.dataLogo.id > 0)) {
      this.imageUrl.set(null);
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

    const { isConfirmed } = await swal.fire({
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
      this._estabLogService.removeImage(this.dataLogo.id).subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code == '1') {
          this.dataLogo = {};
          this.imageUrl.set(null);
          this.selectedFile = null;
          this.getDataLogo(this.data.idEstablecimiento);
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
      this._puntoEmisionService.annul(id).subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code == '1') {
          this.getEstabs();
        }
      });
    }
  }

  configSaveFactElect() {
    this._estabService
      .putSriAuth(this.data.idEstablecimiento, this.data.autoSriAuth)
      .subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code == '1') {
          this.getEstabs();
        }
      });
  }
}

import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IForm } from '@core/Types/form-types';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader } from '@core/utils/loader';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Device } from '@modules/technical-support/models/device.model';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-device-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './device-modal.component.html',
  styles: ``,
})

export class DeviceModalComponent implements OnInit {
  @ViewChild('inputNameSpec') inputNameSpec: any;
  @Input() params = {} as Device;

  private deviceService = inject(DeviceService);
  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  private tS = inject(ToasterService);

  // --> Variables
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nuevo Equipo';
  categories: any = [];
  isUpdate = false;

  device: Device = {
    id: 0,
    categoryId: 0,
    name: '',
    serie: '',
    brand: '',
    model: '',
    year: 0,
    warranty: 0,
    color: '',
  };

  deviceFormGroup: IForm<Device> = {
    categoryId: [0, Validators.required],
    name: ['', Validators.required],
    serie: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: [0, Validators.required],
    warranty: [''],
    color: ['', Validators.required],
  };

  deviceForm = this.fb.group(this.deviceFormGroup);

  // --> Functions
  setDataFormModal() {
    this.device = this.params;
    this.deviceForm.patchValue(this.params);

    if (this.params.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Equipo';
      this.isUpdate = true;
    } else {
      this.isUpdate = false;
      this.modalIcon = 'plus';
      this.modalTitle = 'Nuevo Equipo';
    }
  }

  getDataForm() {
    this.deviceService.get(JSON.stringify({ tipo: 1 })).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          const tempArray = JSON.parse(response.payload as string);
          this.categories = tempArray.categorias;
        }
      },
      complete() {
        hideLoader();
      },
      error(error) {
        console.log(error);
        hideLoader();
      },
    });
  }

  onSave() {
    Object.assign(this.device, this.deviceForm.value);

    this.deviceService.post(this.device).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
          }
          this.tS.toastr({
            type: 'success',
            message: 'Debe seleccionar el cliente',
          });
          this.closeModal();
        }
      },
      complete() {
        hideLoader();
      },
      error(error) {
        console.log(error);
        hideLoader();
      },
    });
  }

  onUpdate() {
    Object.assign(this.device, this.deviceForm.value);
    this.deviceService.put(this.device.id, this.device).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
          }
          this.tS.toastr({
            type: 'success',
            message: 'Debe seleccionar el cliente',
          });
          this.closeModal();
        }
      },
      complete() {
        hideLoader();
      },
      error(error) {
        console.log(error);
        hideLoader();
      },
    });
  }

  closeModal() {
    this.deviceForm.reset();
    this.modalRef.close();
  }

  ngOnInit(): void {
    this.setDataFormModal();
    this.getDataForm();
  }
}

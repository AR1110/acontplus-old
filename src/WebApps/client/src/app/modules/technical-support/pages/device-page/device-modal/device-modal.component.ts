import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IForm } from '@core/Types/form-types';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
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
  private activeModal = inject(NgbActiveModal);
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

  validations = [null, "", undefined]
  validationsNumbers = [0, "", null, undefined]

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
    showLoader();
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
    const deviceUpdate = Object.assign(this.device, this.deviceForm.value);   
    if (!this.onValidate(deviceUpdate)) return;

    showLoader();
    this.deviceService.post(deviceUpdate).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
            return;
          }
          this.tS.toastr({
            type: 'success',
            message: response.message,
          });
          this.activeModal.close(response);
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
    const deviceUpdate = Object.assign(this.device, this.deviceForm.value);   
    if (!this.onValidate(deviceUpdate)) return;

    showLoader();
    this.deviceService.put(this.device.id, deviceUpdate).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
            return;
          }
          this.tS.toastr({
            type: 'success',
            message: response.message,
          });
          this.activeModal.close(response);
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

  onValidate(device: Device) {
    let isValid = true;

    try {
      if (this.validationsNumbers.includes(device.categoryId)) {
        this.tS.toastr({type: 'warning', message: `La categoría es requerida`});
        isValid = false;
      }

      if (this.validations.includes(device.name)) {
        this.tS.toastr({type: 'warning', message: `El nombre es requerido`});
        isValid = false;
      }

      if (this.validations.includes(device.serie)) {
        this.tS.toastr({type: 'warning', message: `La IMEI/Serie es requerido`});
        isValid = false;
      }
      
      if (this.validations.includes(device.brand)) {
        this.tS.toastr({type: 'warning', message: `La marca es requerido`});
        isValid = false;
      }
      
      if (this.validations.includes(device.model)) {
        this.tS.toastr({type: 'warning', message: `El model es requerido`});
        isValid = false;
      }

      if (this.validationsNumbers.includes(device.year)) {
        this.tS.toastr({type: 'warning', message: `El año es requerido`});
        isValid = false;
      }

      if (this.validations.includes(device.color)) {
        this.tS.toastr({type: 'warning', message: `El color es requerido`});
        isValid = false;
      }
      return isValid;      
    } catch (error) {
      isValid = false;
      this.tS.toastr({ type: 'success', message: `Error ${error}` });
    }
    return isValid;
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

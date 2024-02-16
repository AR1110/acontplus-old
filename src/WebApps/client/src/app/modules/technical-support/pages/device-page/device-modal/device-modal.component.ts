import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IForm } from '@core/Types/form-types';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Device, DeviceSpecs } from '@modules/technical-support/models/device.model';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { v4 as uuidv4 } from 'uuid';

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
  specs: any = [];
  specsTemp: any = [];
  specsType: any = [];
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
    customers: [],
  };

  deviceSpecs: DeviceSpecs = {
    specs: '',
  };

  validations = [null, '', undefined];
  validationsNumbers = [0, '', null, undefined];

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

  specForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    value: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  specTypeForm = new FormGroup({
    specName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  // --> Functions
  setDataFormModal() {
    this.device = this.params;
    this.deviceForm.patchValue(this.params);

    if (this.params.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Equipo';
      this.isUpdate = true;
      this.setDataSpecs(this.params.specs);
    } else {
      this.isUpdate = false;
      this.modalIcon = 'plus';
      this.modalTitle = 'Nuevo Equipo';
    }
  }

  setDataSpecs(specs: any) {
    for (const item in specs) {
      this.specsType.push({
        uuid: specs[item][0].uuid,
        name: item,
      });
      this.specs = this.specs.concat(specs[item]);
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
    let specsTemp = {};
    if (!this.onValidate(Object.assign(this.device, this.deviceForm.value))) {
      return;
    }
    if (!this.onValidateSpecs()) return;

    this.device.customers = [];
    specsTemp = Object.fromEntries(
      this.specsType.map(({ uuid, name }: any) => [
        name,
        this.specs.filter((x: any) => x.uuid == uuid),
      ])
    );
    this.device.specs = Object.assign(this.deviceSpecs, {
      specs: JSON.stringify(specsTemp),
    });
    const deviceInsert = Object.assign(this.device, this.deviceForm.value);

    showLoader();
    this.deviceService.post(deviceInsert).subscribe({
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
    let specsTemp = {};
    if (!this.onValidate(Object.assign(this.device, this.deviceForm.value))) {
      return;
    }
    if (!this.onValidateSpecs()) return;

    this.device.customers = [];
    specsTemp = Object.fromEntries(
      this.specsType.map(({ uuid, name }: any) => [
        name,
        this.specs.filter((x: any) => x.uuid == uuid),
      ])
    );

    this.device.specs = Object.assign(this.deviceSpecs, {
      specs: JSON.stringify(specsTemp),
    });
    const deviceUpdate = Object.assign(this.device, this.deviceForm.value);

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
        this.tS.toastr({
          type: 'warning',
          message: `La categoría es requerida`,
        });
        isValid = false;
      }

      if (this.validations.includes(device.name)) {
        this.tS.toastr({ type: 'warning', message: `El nombre es requerido` });
        isValid = false;
      }

      if (this.validations.includes(device.serie)) {
        this.tS.toastr({
          type: 'warning',
          message: `La IMEI/Serie es requerido`,
        });
        isValid = false;
      }
      if (this.validations.includes(device.brand)) {
        this.tS.toastr({ type: 'warning', message: `La marca es requerido` });
        isValid = false;
      }
      if (this.validations.includes(device.model)) {
        this.tS.toastr({ type: 'warning', message: `El model es requerido` });
        isValid = false;
      }

      if (this.validationsNumbers.includes(device.year)) {
        this.tS.toastr({ type: 'warning', message: `El año es requerido` });
        isValid = false;
      }

      if (this.validations.includes(device.color)) {
        this.tS.toastr({ type: 'warning', message: `El color es requerido` });
        isValid = false;
      }
      return isValid;
    } catch (error) {
      isValid = false;
      this.tS.toastr({ type: 'success', message: `Error ${error}` });
    }
    return isValid;
  }

  onValidateSpecs() {
    let isValid = true;
    try {
      if (this.specs?.length > 0) {
        for (const item of this.specsType) {
          if (
            this.specs.filter((x: any) => x.uuid === item.uuid).length === 0
          ) {
            this.tS.toastr({
              type: 'warning',
              message: `Debe de seleccionar los valores para la el tipo de specificación: ${item.name}}`,
            });
            isValid = false;
          }
        }
      }
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
  addSpecType() {
    this.specsType.push({
      uuid: uuidv4(),
      name: this.specTypeForm.get('specName')?.value,
    });
    setTimeout(() => {
      this.inputNameSpec.nativeElement.focus();
    }, 0);
    this.specTypeForm.patchValue({ specName: '' });
  }

  addSpec(uuid: string) {
    this.specs.push({
      uuid,
      name: this.specForm.get('name')?.value,
      value: this.specForm.get('value')?.value,
    });
    this.specsTemp = this.specs.filter((x: any) => x.uuid === uuid);
    this.specForm.patchValue({ name: '', value: '' });
    setTimeout(() => {
      this.inputNameSpec.nativeElement.focus();
    }, 0);
  }

  removeSpec(index: any) {
    this.specs.splice(index, 1);
  }

  filterAccordion(uuid: string) {
    if (this.specs.length > 0) {
      this.specsTemp = this.specs.filter((x: any) => x.uuid === uuid);
    }
  }

  ngOnInit(): void {
    this.setDataFormModal();
    this.getDataForm();
  }
}
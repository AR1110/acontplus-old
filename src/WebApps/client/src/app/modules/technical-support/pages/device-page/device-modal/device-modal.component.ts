import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IForm } from '@core/Types/form-types';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Device, DeviceTypeSpec, DeviceSpecs } from '@modules/technical-support/models/device.model';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { DeviceSpecsService } from '@modules/technical-support/services/device.spec.service';
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
  private deviceSepcsService = inject(DeviceSpecsService);
  private activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  private tS = inject(ToasterService);

  // --> Variables
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nuevo Equipo';
  categories: any = [];
  isUpdate = false;

  // By Danis.
  specsType01: any = [];
  specs02 = []

  validations = [null, '', undefined];
  validationsNumbers = [0, '', null, undefined];

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
    deviceSpecId: 0,
  };

  deviceSpecs: DeviceSpecs = {
    deviceSpecId: 0,
    specs: '',
  };

  deviceSpec: Array<DeviceTypeSpec> = [];

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
      this.setDataSpecs(this.device);
    } else {
      this.modalIcon = 'plus';
      this.modalTitle = 'Nuevo Equipo';
      this.isUpdate = false;
    }
  }

  setDataSpecs(device: Device) {
    let specsTemp: any = device.specs;

    if (specsTemp.length == 0) return;
    this.deviceSpecs.deviceSpecId = device.deviceSpecId;

    for (const item in specsTemp) {
      this.deviceSpec.push({
        uuid: specsTemp[item][0].uuid,
        name: item,
        specs: specsTemp[item].map((x: any) => {
          return {
            uuid: x.uuid,
            name: x.name,
            value: x.value,
          };
        }),
      });
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
    this.device.customers = [];
    this.device.specs = Object.assign(this.deviceSpecs, {
      specs: JSON.stringify(this.convertirFormato(this.deviceSpec)),
    });

    if (!this.onValidateSpecs()) return;

    const deviceInsert = Object.assign(this.device, this.deviceForm.value);
    if (!this.onValidate(deviceInsert)) return;

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
    this.device.specs = Object.assign(this.deviceSpecs, {
      specs: JSON.stringify(this.convertirFormato(this.deviceSpec)),
    });

    if (!this.onValidateSpecs()) return;

    const deviceUpdate = Object.assign(this.device, this.deviceForm.value);
    if (!this.onValidate(deviceUpdate)) return;
    this.onUpdateSpecs();

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

  onUpdateSpecs() {
    this.deviceSepcsService.put(this.device.deviceSpecId!, this.device.specs!).subscribe({
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
        }
      },
      error(error) {
        console.log(error);
      },
    });
  }

  convertirFormato(arrayObjetos: Array<DeviceTypeSpec>) {
    const objetoResultado: any = {};
    for (const item of arrayObjetos) {
      objetoResultado[item.name] = item.specs.map(spec => ({
        uuid: spec.uuid,
        name: spec.name,
        value: spec.value
      }));
    }
    return objetoResultado;
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
      for (const item of this.deviceSpec) {
        if (item.specs.filter((x: any) => x.uuid === item.uuid).length === 0) {
          this.tS.toastr({
            type: 'warning',
            message: `Debe de agregar los valores para el tipo de especificación: ${item.name}}`
          });
          isValid = false;
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

  addSpecTypeDevice() {
    this.deviceSpec.push({
      uuid: uuidv4(),
      name: this.specTypeForm.get('specName')?.value || '',
      specs: [],
    });

    // Clear input
    this.specTypeForm.patchValue({ specName: '' });
  }

  addSpecsDevice(uuid: string) {
    this.deviceSpec.forEach((item: any) => {
      if (item.uuid == uuid) {
        let object = {
          uuid: uuid,
          name: this.specForm.get('name')?.value,
          value: this.specForm.get('value')?.value,
        };
        console.log("object");
        console.log(object);
        item.specs.push(object);
      }
    });

    // Clear input
    this.specForm.patchValue({ name: '', value: '' });

    // Unfocus input
    setTimeout(() => {
      this.inputNameSpec.nativeElement.focus();
    }, 0);
  }

  removeSpec(index: any, uuid: string) {
    this.deviceSpec.forEach((item: any) => {
      if (item.uuid == uuid) {
        item.specs.splice(index, 1);
      }
    });
  }

  filterAccordion(uuid: string) {
    // if (this.specs.length > 0) {
    //   this.specsTemp = this.specs.filter((x: any) => x.uuid === uuid);
    // }
  }

  ngOnInit(): void {
    this.setDataFormModal();
    this.getDataForm();
  }
}
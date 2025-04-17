import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { IForm } from '@core/models/form-types';
import { ModalService } from '@core/services/modal.service';
import { ToasterService } from '@core/services/toaster.service';
import { Brand } from '@modules/technical-support/models/brand';
import {
  Device,
  DeviceSpecs,
  DeviceTypeSpec,
} from '@modules/technical-support/models/device.model';
import { Modelo } from '@modules/technical-support/models/modelo';
import { BrandService } from '@modules/technical-support/services/brand.service';
import { DeviceSpecsService } from '@modules/technical-support/services/device-spec.service';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { ModeloService } from '@modules/technical-support/services/modelo.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { BrandModalComponent } from '../../brand-page/brand-modal/brand-modal.component';
import { ModeloModalComponent } from '../../modelo-page/modelo-modal/modelo-modal.component';
import { CategoryModalComponent } from '../../category-page/category-modal/category-modal.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-device-modal',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgbAccordionModule,
    MatCard,
    MatCardContent,
    MatIcon,
    MatButton,
  ],
  templateUrl: './device-modal.component.html',
  styles: ``,
})
export class DeviceModalComponent implements OnInit {
  @ViewChild('inputNameSpec') inputNameSpec: any;
  @Input() params = {} as Device;
  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  private brandService = inject(BrandService);
  private deviceService = inject(DeviceService);
  private deviceSepcsService = inject(DeviceSpecsService);
  private modalService = inject(ModalService);
  private modeloService = inject(ModeloService);
  private tS = inject(ToasterService);
  brands: Brand[] = [];
  // --> Variables
  modalIcon: string = 'add';
  modalTitle = 'Nuevo Equipo';
  modelos: Modelo[] = [];
  categories: any = [];
  isUpdate = false;

  // By Danis.
  specsType01: any = [];
  specs02 = [];

  validations = [null, '', undefined];
  validationsNumbers = [0, '', null, undefined];

  data: Device = {
    id: 0,
    categoryId: 0,
    name: '',
    serie: '',
    warranty: 0,
    color: '',
    customers: [],
    deviceSpecId: 0,
    modeloId: 0,
    brandId: 0,
  };

  deviceSpecs: DeviceSpecs = {
    deviceSpecId: 0,
    specs: '',
  };

  deviceSpec: Array<DeviceTypeSpec> = [];

  deviceFormGroup: IForm<Device> = {
    categoryId: [0, Validators.required],
    brandId: [0, Validators.required],
    modeloId: [0, Validators.required],
    name: ['', Validators.required],
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

  unselectedCategory = true;
  unseletedBrand = true;
  addCategory() {
    const modalBrand = this.modalService.openModalCustom(
      CategoryModalComponent,
      {
        size: 'sm',
        centered: true,
      },
    );
    modalBrand.result.then((response) => {
      if (response !== null && typeof response === 'object') {
        this.getDataForm();
      }
    });
  }
  addBrand() {
    const modalBrand = this.modalService.openModalCustom(BrandModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalBrand.componentInstance.data = {
      categoryId: this.deviceForm.value.categoryId,
    };
    modalBrand.result.then((response) => {
      if (response !== null && typeof response === 'object') {
        let categoyId = Number(this.deviceForm.get('categoryId')?.value);
        this.onBrandGet(categoyId);
      }
    });
  }

  addModelo() {
    const modalModelo = this.modalService.openModalCustom(
      ModeloModalComponent,
      {
        size: 'lg',
        centered: true,
      },
    );
    modalModelo.componentInstance.data = {
      brandId: this.deviceForm.value.brandId,
    };
    modalModelo.result.then((response) => {
      if (response !== null && typeof response === 'object') {
        let brandId = Number(this.deviceForm.get('brandId')?.value);
        this.onModeloGet(brandId);
      }
    });
  }

  ngOnInit(): void {
    this.setDataFormModal();
    this.getDataForm();
  }

  onBrandChange($event: any) {
    let brandId = Number($event.target.value);
    if (!(brandId > 0)) {
      return;
    }
    this.unseletedBrand = false;
    this.onModeloGet(brandId);
  }

  onBrandGet(categoryId: number) {
    this.brands = [];
    this.brandService.get({ tipo: 2, categoryId }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        this.brands = JSON.parse(response.payload as string);
        if (this.brands.length > 0) {
          this.unseletedBrand = false;
          // this.deviceForm.get('brandId')?.setValue(this.brands[0].id);
          // this.onModeloGet(this.brands[0].id);
        }
      }
    });
  }
  onCategoryChange($event: any) {
    let categoryId = Number($event.target.value);
    if (!(categoryId > 0)) {
      return;
    }
    this.unselectedCategory = false;
    this.onBrandGet(categoryId);
  }
  onModeloChange($event: any) {}
  onModeloGet(brandId: number) {
    this.modelos = [];
    this.modeloService.get({ tipo: 2, brandId }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        this.modelos = JSON.parse(response.payload as string);
        if (this.modelos.length > 0) {
          // this.deviceForm.get('modeloId')?.setValue(this.modelos[0].id);
        }
      }
    });
  }
  setDataFormModal() {
    this.deviceForm.patchValue(this.data);
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Equipo';
      this.isUpdate = true;
      this.unselectedCategory = false;
      this.onBrandGet(this.data.categoryId);
      this.onModeloGet(this.data.brandId);
      this.setDataSpecs(this.data);
    } else {
      this.modalIcon = 'add';
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
    this.deviceService.get({ tipo: 1 }).subscribe((response) => {
      if (isApiResponse(response)) {
        const tempArray = JSON.parse(response.payload as string);
        this.categories = tempArray.categorias;
      }
    });
  }

  onSave() {
    this.data.customers = [];
    this.data.specs = Object.assign(this.deviceSpecs, {
      specs: JSON.stringify(this.convertirFormato(this.deviceSpec)),
    });

    if (!this.onValidateSpecs()) return;

    const deviceInsert = Object.assign(this.data, this.deviceForm.value);
    if (!this.onValidate(deviceInsert)) return;

    this.deviceService.post(deviceInsert).subscribe((response) => {
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
        this.modalRef.close(response.payload);
      }
    });
  }

  onUpdate() {
    this.data.specs = Object.assign(this.deviceSpecs, {
      specs: JSON.stringify(this.convertirFormato(this.deviceSpec)),
    });

    if (!this.onValidateSpecs()) return;

    const deviceUpdate = Object.assign(this.data, this.deviceForm.value);
    if (!this.onValidate(deviceUpdate)) return;
    this.onUpdateSpecs();

    this.deviceService.put(this.data.id, deviceUpdate).subscribe((response) => {
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
        this.modalRef.close(response);
      }
    });
  }

  onUpdateSpecs() {
    this.deviceSepcsService
      .put(this.data.deviceSpecId!, this.data.specs!)
      .subscribe({
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
      objetoResultado[item.name] = item.specs.map((spec) => ({
        uuid: spec.uuid,
        name: spec.name,
        value: spec.value,
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
            message: `Debe de agregar los valores para el tipo de especificación: ${item.name}}`,
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
    let specName = this.specTypeForm.get('specName')?.value || '';
    if (!specName || !(specName.length >= 3)) {
      return this.tS.toastr({
        type: 'warning',
        message: 'Ingrese una categoría valida!',
      });
    }
    this.deviceSpec.push({
      uuid: uuidv4(),
      name: specName,
      specs: [],
    });
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

  removeSpecCategory(uuid: string) {
    this.deviceSpec = this.deviceSpec.filter((x) => x.uuid !== uuid);
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
}

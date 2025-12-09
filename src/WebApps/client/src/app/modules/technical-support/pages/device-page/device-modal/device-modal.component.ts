import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isApiResponse } from '@core/models/api-response-legacy';
import { IForm } from '@core/models/form-types';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
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
import { BrandModalComponent } from '../../brand-page/brand-modal/brand-modal.component';
import { ModeloModalComponent } from '../../modelo-page/modelo-modal/modelo-modal.component';
import { CategoryModalComponent } from '../../category-page/category-modal/category-modal.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@core/services/dialog.service';
import { MatTabsModule } from '@angular/material/tabs';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';

@Component({
  selector: 'app-device-modal',
  imports: [
    DynamicCard,
    ReactiveFormsModule,
    FormsModule,
    MatIcon,
    MatButton,
    Button,
    MatCustomDialogComponent,
    MatTabsModule,
  ],
  templateUrl: './device-modal.component.html',
  styles: ``,
})
export class DeviceModalComponent implements OnInit {
  @ViewChild('inputNameSpec') inputNameSpec: any;
  params = inject<Device>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private modalRef = inject(MatDialogRef<DeviceModalComponent>);
  private brandService = inject(BrandService);
  private deviceService = inject(DeviceService);
  private deviceSepcsService = inject(DeviceSpecsService);
  private modalService = inject(DialogService);
  private modeloService = inject(ModeloService);
  private tS = inject(ToastrNotificationService);
  brands = signal<Brand[]>([]);
  // --> Variables
  modalIcon = 'add';
  modalTitle = 'Nuevo Equipo';
  modelos = signal<Modelo[]>([]);
  categories = signal<any[]>([]);
  isUpdate = false;

  selected = signal(0);
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

  deviceSpec = signal<DeviceTypeSpec[]>([]);

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
    specName: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  unselectedCategory = true;
  unseletedBrand = true;

  selectedIndexChange($event: number) {
    this.selected.set($event);
    const dataDeviceSpec = this.categories()[$event];
    if (dataDeviceSpec) {
      this.filterAccordion(dataDeviceSpec.uuid);
    }
  }

  addCategory() {
    const modalBrand = this.modalService.open(CategoryModalComponent, {
      size: 'sm',
      data: {},
    });
    modalBrand.subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        this.getDataForm();
      }
    });
  }
  addBrand() {
    const modalBrand = this.modalService.open(BrandModalComponent, {
      size: 'lg',
      data: {
        categoryId: this.deviceForm.value.categoryId,
      },
    });
    modalBrand.subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        const categoyId = Number(this.deviceForm.get('categoryId')?.value);
        this.onBrandGet(categoyId);
      }
    });
  }

  addModelo() {
    const modalModelo = this.modalService.open(ModeloModalComponent, {
      size: 'lg',
      data: {
        brandId: this.deviceForm.value.brandId,
      },
    });
    modalModelo.subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        const brandId = Number(this.deviceForm.get('brandId')?.value);
        this.onModeloGet(brandId);
      }
    });
  }

  ngOnInit(): void {
    this.setDataFormModal();
    this.getDataForm();
  }

  onBrandChange($event: any) {
    const brandId = Number($event.target.value);
    if (!(brandId > 0)) {
      return;
    }
    this.unseletedBrand = false;
    this.onModeloGet(brandId);
  }

  onBrandGet(categoryId: number) {
    this.brands.set([]);
    this.brandService.get({ tipo: 2, categoryId }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        this.brands.set(JSON.parse(response.payload as string));
        if (this.brands().length > 0) {
          this.unseletedBrand = false;
          // this.deviceForm.get('brandId')?.setValue(this.brands[0].id);
          // this.onModeloGet(this.brands[0].id);
        }
      }
    });
  }
  onCategoryChange($event: any) {
    const categoryId = Number($event.target.value);
    if (!(categoryId > 0)) {
      return;
    }
    this.unselectedCategory = false;
    this.onBrandGet(categoryId);
  }
  onModeloChange($event: any) {}
  onModeloGet(brandId: number) {
    this.modelos.set([]);
    this.modeloService.get({ tipo: 2, brandId }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        this.modelos.set(JSON.parse(response.payload as string));
        if (this.modelos().length > 0) {
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
    const specsTemp: any = device.specs;

    if (specsTemp.length == 0) return;
    this.deviceSpecs.deviceSpecId = device.deviceSpecId;

    for (const item in specsTemp) {
      this.deviceSpec.update((r) => [
        ...r,
        {
          uuid: specsTemp[item][0].uuid,
          name: item,
          specs: specsTemp[item].map((x: any) => {
            return {
              uuid: x.uuid,
              name: x.name,
              value: x.value,
            };
          }),
        },
      ]);
    }
  }

  getDataForm() {
    this.deviceService.get({ tipo: 1 }).subscribe((response) => {
      if (isApiResponse(response)) {
        const tempArray = JSON.parse(response.payload as string);
        this.categories.set(tempArray.categorias);
      }
    });
  }

  onSave() {
    this.data.customers = [];
    this.data.specs = Object.assign(this.deviceSpecs, {
      specs: JSON.stringify(this.convertirFormato(this.deviceSpec())),
    });

    if (!this.onValidateSpecs()) return;

    const deviceInsert = Object.assign(this.data, this.deviceForm.value);
    if (!this.onValidate(deviceInsert)) return;

    this.deviceService.post(deviceInsert).subscribe((response) => {
      if (isApiResponse(response)) {
        if (response.code == '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
          return;
        }
        this.tS.show({
          type: 'success',
          message: response.message,
        });
        this.modalRef.close(response.payload);
      }
    });
  }

  onUpdate() {
    this.data.specs = Object.assign(this.deviceSpecs, {
      specs: JSON.stringify(this.convertirFormato(this.deviceSpec())),
    });

    if (!this.onValidateSpecs()) return;

    const deviceUpdate = Object.assign(this.data, this.deviceForm.value);
    if (!this.onValidate(deviceUpdate)) return;
    this.onUpdateSpecs();

    this.deviceService.put(this.data.id, deviceUpdate).subscribe((response) => {
      if (isApiResponse(response)) {
        if (response.code == '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
          return;
        }
        this.tS.show({
          type: 'success',
          message: response.message,
        });
        this.modalRef.close(response);
      }
    });
  }

  onUpdateSpecs() {
    this.deviceSepcsService.put(this.data.deviceSpecId!, this.data.specs!).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
            return;
          }
          this.tS.show({
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

  convertirFormato(arrayObjetos: DeviceTypeSpec[]) {
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
        this.tS.show({
          type: 'warning',
          message: `La categoría es requerida`,
        });
        isValid = false;
      }

      if (this.validations.includes(device.name)) {
        this.tS.show({ type: 'warning', message: `El nombre es requerido` });
        isValid = false;
      }
      if (this.validations.includes(device.color)) {
        this.tS.show({ type: 'warning', message: `El color es requerido` });
        isValid = false;
      }
      return isValid;
    } catch (error) {
      isValid = false;
      this.tS.show({ type: 'success', message: `Error ${error}` });
    }
    return isValid;
  }

  onValidateSpecs() {
    let isValid = true;
    try {
      for (const item of this.deviceSpec()) {
        if (item.specs.filter((x: any) => x.uuid === item.uuid).length === 0) {
          this.tS.show({
            type: 'warning',
            message: `Debe de agregar los valores para el tipo de especificación: ${item.name}}`,
          });
          isValid = false;
        }
      }
    } catch (error) {
      isValid = false;
      this.tS.show({ type: 'success', message: `Error ${error}` });
    }
    return isValid;
  }

  onModalClose() {
    this.deviceForm.reset();
    this.modalRef.close();
  }

  addSpecTypeDevice() {
    const specName = this.specTypeForm.get('specName')?.value || '';
    if (!specName || !(specName.length >= 3)) {
      return this.tS.show({
        type: 'warning',
        message: 'Ingrese una categoría valida!',
      });
    }
    this.deviceSpec.update((r) => [
      ...r,
      {
        uuid: generateUuidv4(),
        name: specName,
        specs: [],
      },
    ]);
    this.specTypeForm.patchValue({ specName: '' });
  }

  addSpecsDevice(uuid: string) {
    this.deviceSpec().forEach((item: any) => {
      if (item.uuid == uuid) {
        item.specs.push({
          uuid: uuid,
          name: this.specForm.get('name')?.value,
          value: this.specForm.get('value')?.value,
        });
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
    this.deviceSpec.update((r) => r.filter((x: any) => x.uuid !== uuid));
  }

  removeSpec(index: any, uuid: string) {
    this.deviceSpec().forEach((item: any) => {
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

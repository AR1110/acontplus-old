import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IForm } from '@core/Types/form-types';
import { CompanyCustomerSearchComponent } from '@core/components/company-customer-search/company-customer-search.component';
import { isApiResponse } from '@core/models/api-response';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { ModalService } from '@core/services/modal.service';
import { ToasterService } from '@core/services/toaster.service';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isValidField } from '@core/utils/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { DeviceSearchModalComponent } from '@modules/technical-support/components/device-search-modal/device-search-modal.component';
import { OrderDetailComponent } from '@modules/technical-support/components/order-detail/order-detail.component';
import { Device } from '@modules/technical-support/models/device.model';
import { OrderDetail } from '@modules/technical-support/models/order-detail';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [
    AppModule,
    CompanyCustomerSearchComponent,
    NgbAccordionModule,
    OrderDetailComponent,
  ],
  templateUrl: './order-modal.component.html',
  styles: ``,
})
export class OrderModalComponent {
  @ViewChild('inputNameSpec') inputNameSpec: any;
  private deviceService = inject(DeviceService);
  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  private modalService = inject(ModalService);
  private orderService = inject(OrderService);
  private tS = inject(ToasterService);

  activeShowForm(accion: any, test: any) {
    console.log(accion);
    console.log(test);
  }
  categories: any = [];
  data: any = {};
  establecimientos: Array<GroupedEstab> = [];
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nueva Orden';
  order: any = {};
  orderDetails: OrderDetail[] = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  specs: any = [];
  specsTemp: any = [];
  specsType: any = [];

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

  orderForm = this.fb.group({
    establecimientoId: [0, Validators.required],
    puntoEmisionId: [0, Validators.required],
    customerCompanyId: [0, Validators.required],
    fechaEmision: '',
    encargado: '',
    obs: [''],
  });

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

  closeModal() {
    this.modalRef.close();
  }

  searchDevice() {
    const modalDevice = this.modalService.openModalCustom(
      DeviceSearchModalComponent,
      { size: 'sm' }
    );
  }

  filterAccordion(uuid: string) {
    if (this.specs.length > 0) {
      this.specsTemp = this.specs.filter((x: any) => x.uuid === uuid);
    }
  }

  private get() {
    const self = this;
    showLoader();
    this.orderService.get(JSON.stringify({ tipo: 1 })).subscribe({
      next(response) {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            let { puntosEmision, categories } = JSON.parse(
              response.payload as string
            );
            self.establecimientos = groupEstabUtil({
              estabs: puntosEmision,
            });
            const dataEstab = self.establecimientos.find(
              (estab) => estab.defaultEstab
            );
            if (dataEstab) {
              self.orderForm.patchValue({
                establecimientoId: dataEstab.idEstablecimiento,
              });
              self.order.codEstab = dataEstab.codEstab;
              self.puntosEmision = dataEstab.puntosEmision;
              const dataPuntoEmision = self.puntosEmision.find(
                (ptoEmi) => ptoEmi.defaultPtoEmi
              );
              if (dataPuntoEmision) {
                self.orderForm.patchValue({
                  puntoEmisionId: dataPuntoEmision.idPuntoEmision,
                });
              }
            }
            self.categories = categories;
          }
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
  ngOnInit(): void {
    this.get();
    this.orderDetails.push({
      uuid: uuidv4(),
      deviceId: 1,
    });
  }
  onDeviceSelected($event: any) {
    console.log($event);
  }
  onChangeEstab() {
    let establecimientoId = this.orderForm.get('establecimientoId')?.value;
    if (isValidField(establecimientoId)) {
      let estabs = this.establecimientos.find(
        (x) => x.idEstablecimiento == Number(establecimientoId)
      );
      this.puntosEmision = estabs?.puntosEmision || [];
      let puntoEmisionId =
        this.puntosEmision.find((ptoEmi) => ptoEmi.defaultPtoEmi)
          ?.idPuntoEmision || 0;
      this.orderForm.patchValue({ puntoEmisionId: puntoEmisionId });
    }
  }
  onCustomerSelected($event: any) {
    let { data } = $event;
    console.log(data.idCliente);
    this.orderForm.patchValue({ customerCompanyId: data.idCliente });
  }
  saveDevice() {
    const self = this;
    Object.assign(this.device, this.deviceForm.value);
    debugger;
    let customerCompanyId = this.orderForm.get('customerCompanyId')?.value;
    if (!customerCompanyId) {
      this.tS.toastr({
        type: 'warning',
        message: 'Debe seleccionar el cliente',
      });
      return;
    }
    let customers = [
      {
        customerCompanyId,
      },
    ];
    this.device.customers = customers;
    if (this.specs?.length > 0) {
      let specsTemp = {},
        specsToSave = [];
      for (const item of this.specsType) {
        if (this.specs.filter((x: any) => x.uuid === item.uuid).length === 0) {
          this.tS.toastr({
            type: 'warning',
            message: `Debe de seleccionar los valores para la el tipo de specificación: ${item.name}}`,
          });
          return;
        }
      }
      specsTemp = Object.fromEntries(
        this.specsType.map(({ uuid, name }: any) => [
          name,
          this.specs.filter((x: any) => x.uuid == uuid),
        ])
      );

      specsToSave.push({
        specs: JSON.stringify(specsTemp),
      });
      this.device.specs = specsToSave;
    }
    console.log(this.device);
    this.deviceService.post(this.device).subscribe({
      next(response) {
        if (isApiResponse(response)) {
          if (response.code == '0') {
            self.tS.toastr({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code == '1') {
            self.tS.toastr({
              type: 'success',
              message: response.message,
            });
            self.specs = [];
            self.orderDetails.push({
              uuid: uuidv4(),
              deviceId: response.payload as number,
            });
          }
        }
      },
      complete() {
        hideLoader();
      },
      error(err) {
        hideLoader();
        console.log(err);
      },
    });
  }

  removeSpec(index: any) {
    this.specs.splice(index, 1);
  }

  resetFormDevice() {}
}

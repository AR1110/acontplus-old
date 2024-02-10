import { Component, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IForm } from '@core/Types/form-types';
import { CompanyCustomerSearchComponent } from '@core/components/company-customer-search/company-customer-search.component';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
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
import { IconProp, icon } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { DeviceListModalComponent } from '@modules/technical-support/components/device-list-modal/device-list-modal.component';
import { DeviceSearchModalComponent } from '@modules/technical-support/components/device-search-modal/device-search-modal.component';
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
    TabulatorComponent,
  ],
  templateUrl: './order-modal.component.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None,
})
export class OrderModalComponent {
  @ViewChild('inputNameSpec') inputNameSpec: any;
  private deviceService = inject(DeviceService);
  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  private modalService = inject(ModalService);
  private orderService = inject(OrderService);
  private tS = inject(ToasterService);

  categories: any = [];
  columnNames: any[] = [
    { title: 'deviceId', field: 'deviceId', width: 150, visible: false },
    { title: 'Equipo', field: 'deviceName', width: 150 },
    { title: 'Obs.', field: 'obs', width: 150, editor: true },
    {
      cellClick: (e: any, cell: any) => {
        this.removeFromList(cell.getData().deviceId);
        cell.getRow().delete();
      },
      formatter: this.deleteButton,
      hozAlign: 'center',
      resizable: false,
      title: 'Opción',
      width: 100,
    },
  ];
  data: any = {};
  deviceFound: any = {};
  devices: any = [];
  establecimientos: Array<GroupedEstab> = [];
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nueva Orden';
  order: any = {};
  orderDetails: OrderDetail[] = [];

  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  specs: any = [];
  specsTemp: any = [];
  specsType: any = [];
  users: any = [];

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
    uuid: uuidv4(),
    establecimientoId: [0, Validators.required],
    puntoEmisionId: [0, Validators.required],
    customerCompanyId: [0, Validators.required],
    fechaEmision: '',
    userId: 0,
    obs: [''],
    orderStatusId: 1,
    orderDetails: [],
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

  addDetail(device: any) {
    device.deviceName = !device.deviceName ? device.name : device.deviceName;
    device.uuid = uuidv4();
    device.obs = '';
    console.log(device);
    this.orderDetails.push(device);
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

  filterAccordion(uuid: string) {
    if (this.specs.length > 0) {
      this.specsTemp = this.specs.filter((x: any) => x.uuid === uuid);
    }
  }

  closeModal() {
    this.modalRef.close();
  }

  deleteButton(cell: any, formatterParams: any) {
    //cell - the cell component
    //formatterParams - parameters set for the column

    //get the row data
    let data = cell.getRow().getData();

    //return the HTML code for the button, using Bootstrap classes and Angular routerLink
    return `<button class='btn btn-danger'>${icon(faTrashAlt).html.join(
      ''
    )}</button>`;
  }

  get() {
    showLoader();
    this.orderService.get(JSON.stringify({ tipo: 1 })).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            let { puntosEmision, categories, users } = JSON.parse(
              response.payload as string
            );
            this.establecimientos = groupEstabUtil({
              estabs: puntosEmision,
            });
            const dataEstab = this.establecimientos.find(
              (estab) => estab.defaultEstab
            );
            if (dataEstab) {
              this.orderForm.patchValue({
                establecimientoId: dataEstab.idEstablecimiento,
              });
              this.order.codEstab = dataEstab.codEstab;
              this.puntosEmision = dataEstab.puntosEmision;
              const dataPuntoEmision = this.puntosEmision.find(
                (ptoEmi) => ptoEmi.defaultPtoEmi
              );
              if (dataPuntoEmision) {
                this.orderForm.patchValue({
                  puntoEmisionId: dataPuntoEmision.idPuntoEmision,
                });
              }
            }
            this.categories = categories;
            this.users = users;
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

  getDevices() {
    const modalRef = this.modalService.openModalCustom(
      DeviceListModalComponent,
      { size: 'lg', centered: true }
    );
    modalRef.componentInstance.data = {
      customerCompanyId: this.order.customerCompanyId,
    };
    modalRef.result.then((result) => {
      this.device = result;
      console.log(this.device);
      this.deviceForm.patchValue(this.device);
      this.addDetail({ deviceId: this.device.id, name: this.device.name });
    });
  }

  ngOnInit(): void {
    this.get();
    if (this.data.id > 0) {
      this.orderForm.patchValue(this.data);
    }
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
      this.orderForm.patchValue({
        establecimientoId: establecimientoId,
        puntoEmisionId: puntoEmisionId,
      });
    }
  }
  onCustomerSelected($event: any) {
    let { data } = $event;
    this.order.customerCompanyId = data.idCliente;
    this.orderForm.patchValue({ customerCompanyId: data.idCliente });
  }

  removeFromList(deviceId: number) {
    let newArray = this.orderDetails.filter((x) => x.deviceId !== deviceId);
    this.orderDetails = newArray;
  }

  saveDevice() {
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
      next: (response) => {
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
            this.specs = [];
            this.addDetail({
              deviceId: response.payload as number,
              deviceName: this.device.name,
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

  saveOrder() {
    showLoader();
    const data = {
      ...this.orderForm.value,
      orderDetails: this.orderDetails,
    };

    if (this.orderDetails.length == 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Debe de añadir los detalles a la orden',
      });
    }
    console.log(data);
    this.orderService.post(data).subscribe({
      next: this.successResponse,
      error(err) {
        console.log(err);
        hideLoader();
      },
    });
  }

  searchDevice() {
    const modalDevice = this.modalService.openModalCustom(
      DeviceSearchModalComponent,
      { size: 'sm' }
    );
    modalDevice.result.then((response) => {
      this.addDetail(response);
    });
  }

  successResponse = (response: object) => {
    hideLoader();
    if (isApiResponse(response)) {
      if (response.code === '0') {
        this.tS.toastr({
          type: 'warning',
          message: response.message!,
        });
      }
      if (response.code === '1') {
        this.orderForm.patchValue({});
        this.orderDetails = [];
        this.order = {};
        this.tS.toastr({
          type: 'success',
          message: response.message!,
        });
        this.modalRef.close();
      }
    }
  };

  removeSpec(index: any) {
    this.specs.splice(index, 1);
  }

  resetFormDevice() {}
}

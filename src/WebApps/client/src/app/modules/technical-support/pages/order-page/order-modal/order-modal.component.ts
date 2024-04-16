import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { DeviceListModalComponent } from '@modules/technical-support/components/device-list-modal/device-list-modal.component';
import { DeviceSearchComponent } from '@modules/technical-support/components/device-search/device-search.component';
import { OrderDetail } from '@modules/technical-support/models/order-detail';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { v4 as uuidv4 } from 'uuid';
import { OrderDetailComponent } from './order-detail/order-detail.component';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [
    AppModule,
    CompanyCustomerSearchComponent,
    DeviceSearchComponent,
    NgbAccordionModule,
    OrderDetailComponent,
    TabulatorComponent,
  ],
  templateUrl: './order-modal.component.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None,
})
export class OrderModalComponent {
  @ViewChild('inputNameSpec') inputNameSpec: any;
  private modalRef = inject(NgbActiveModal);
  private modalService = inject(ModalService);
  private orderService = inject(OrderService);
  private tS = inject(ToasterService);
  data: any = {};
  deviceFound: any = {};
  devices: any = [];
  establecimientos: Array<GroupedEstab> = [];
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nueva Orden';
  order: any = {};
  orderDetails: OrderDetail[] = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  users: any = [];

  orderForm = new FormGroup({
    id: new FormControl(0),
    assignedUserId: new FormControl(0, Validators.required),
    uuid: new FormControl(uuidv4()),
    establecimientoId: new FormControl(0, Validators.required),
    puntoEmisionId: new FormControl(0, Validators.required),
    customerCompanyId: new FormControl(0, Validators.required),
    fechaEmision: new FormControl('', Validators.required),
    obs: new FormControl(''),
    orderStatusId: new FormControl(0),
  });

  addDetail(device: any) {
    let deviceToAdd: OrderDetail = {
      id: 0,
      deviceId: 0,
      deviceName: '',
      deviceSerie: '',
      deviceWarranty: '',
      uuid: '',
    };
    deviceToAdd.deviceId = device.id;
    deviceToAdd.deviceCustomerId = device.deviceCustomerId;
    deviceToAdd.deviceName = !device.deviceName
      ? device.name
      : device.deviceName;
    deviceToAdd.deviceSerie = !device.deviceSerie
      ? device.serie
      : device.deviceSerie;
    deviceToAdd.deviceWarranty = !device.deviceWarranty
      ? device.warranty
      : device.deviceWarranty;
    deviceToAdd.obs = '';
    deviceToAdd.uuid = uuidv4();
    deviceToAdd.assignedUserId = 0;
    this.orderDetails.push(deviceToAdd);
    // console.log(this.orderDetails);
  }

  closeModal() {
    this.modalRef.close();
  }

  get() {
    showLoader();
    let parameters = { tipo: 1, id: this.data.id };
    if (this.data.id > 0) {
      this.modalTitle = 'Editar Orden';
      this.modalIcon = 'edit';
    }
    this.orderService.get(parameters).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            let parsedResponse = JSON.parse(response.payload as string);
            let { puntosEmision, users } = parsedResponse;
            this.establecimientos = groupEstabUtil({
              estabs: puntosEmision,
              isGroupPuntoEmision: true,
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
            this.users = users;
            if (this.data.id > 0) {
              let { order, orderDetails } = parsedResponse;
              this.order = order[0];
              this.orderDetails = orderDetails || [];
              this.orderForm.patchValue(this.order);
            }
          }
        }
      },
      error(error) {
        console.log(error);
        hideLoader();
      },
      complete() {
        hideLoader();
      },
    });
  }

  getDevices() {
    const modalRef = this.modalService.openModalCustom(
      DeviceListModalComponent,
      { size: 'lg', centered: true, backdrop: true }
    );
    modalRef.componentInstance.data = {
      customerCompanyId: this.order.customerCompanyId,
    };
    modalRef.result.then((result) => {
      if (result) {
        this.addDetail({
          deviceCustomerId: result.deviceCustomerId,
          deviceSerie: result.deviceSerie,
          deviceWarranty: result.deviceWarranty,
          id: result.id,
          name: result.name,
        });
      }
    });
  }

  ngOnInit(): void {
    this.get();
    if (this.data.id > 0) {
      this.orderForm.patchValue(this.data);
    }
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
  onDeviceSelected($event: any) {
    console.log($event);
    this.addDetail($event.data);
  }

  save() {
    showLoader();
    if (this.orderDetails.length == 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Debe de añadir los detalles a la orden',
      });
    }
    const dataToSave = {
      ...this.orderForm.value,
      orderDetails: this.orderDetails,
    };
    if (this.data.id > 0) {
      this.orderService.put(this.data.id, dataToSave).subscribe({
        next: this.successResponse,
        error(err) {
          console.log(err);
          hideLoader();
        },
        complete() {
          hideLoader();
        },
      });
    } else {
      this.orderService.post(dataToSave).subscribe({
        next: this.successResponse,
        error(err) {
          console.log(err);
          hideLoader();
        },
        complete() {
          hideLoader();
        },
      });
    }
  }
  successResponse = (response: object) => {
    hideLoader();
    if (isApiResponse(response)) {
      this.tS.toastr({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message!,
      });
      if (response.code === '1') {
        this.orderForm.patchValue({});
        this.orderDetails = [];
        this.order = {};
        this.modalRef.close(response);
      }
    }
  };
}

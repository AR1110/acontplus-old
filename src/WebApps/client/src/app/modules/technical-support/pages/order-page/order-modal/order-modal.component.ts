import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
import { icon, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { DeviceListModalComponent } from '@modules/technical-support/components/device-list-modal/device-list-modal.component';
import { DeviceSearchComponent } from '@modules/technical-support/components/device-search/device-search.component';
import { OrderDetail } from '@modules/technical-support/models/order-detail';
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
    DeviceSearchComponent,
    NgbAccordionModule,
    TabulatorComponent,
  ],
  templateUrl: './order-modal.component.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None,
})
export class OrderModalComponent {
  @ViewChild('inputNameSpec') inputNameSpec: any;
  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  private modalService = inject(ModalService);
  private orderService = inject(OrderService);
  private tS = inject(ToasterService);

  columnNames = [
    { title: 'deviceId', field: 'deviceId', width: 150, visible: false },
    {
      title: 'deviceCustomerId',
      field: 'deviceCustomerId',
      width: 150,
      visible: false,
    },
    { title: 'Equipo', field: 'deviceName', width: 225 },
    { title: 'Serie', field: 'deviceSerie', width: 200, editor: true },
    {
      title: 'Garantia',
      field: 'deviceWarranty',
      width: 150,
      validator: ['numeric', 'min:0'],
      editor: true,
    },
    { title: 'Obs.', field: 'obs', width: 450, editor: true },
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
  users: any = [];

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

  addDetail(device: any) {
    (device.deviceId = device.id),
      (device.deviceCustomerId = device.deviceCustomerId);
    device.deviceName = !device.deviceName ? device.name : device.deviceName;
    device.deviceSerie = !device.deviceSerie
      ? device.serie
      : device.deviceSerie;
    device.deviceWarranty = !device.deviceWarranty
      ? device.warranty
      : device.deviceWarranty;
    device.obs = '';
    device.uuid = uuidv4();
    this.orderDetails.push(device);
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
    return `<button class='btn btn-danger btn-sm'>${icon(faTrashAlt).html.join(
      ''
    )}</button>`;
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
          console.log(response);
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
              this.orderDetails = orderDetails || [];
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

  removeFromList(deviceId: number) {
    let newArray = this.orderDetails.filter((x) => x.deviceId !== deviceId);
    this.orderDetails = newArray;
  }

  save() {
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
    this.orderService.post(data).subscribe({
      next: (response) => {
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
      },
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

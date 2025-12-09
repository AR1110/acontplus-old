import { Component, inject, signal, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { Button, TabulatorTable } from '@acontplus/ng-components';
import { isApiResponse } from '@core/models/api-response-legacy';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { isValidField } from '@core/utils/utils';

import { DeviceListModalComponent } from '@modules/technical-support/components/device-list-modal/device-list-modal.component';
import { DeviceSearchComponent } from '@modules/technical-support/components/device-search/device-search.component';
import { OrderDetail } from '@modules/technical-support/models/order-detail';
import { OrderService } from '@modules/technical-support/services/order.service';
import Swal from 'sweetalert2';
import { OrderDetailService } from '@modules/technical-support/services/order-detail.service';
import {
  ajustarFechaEmisionModificada,
  dateIsAfterCurrentDate,
  formatDate,
  formatDateToString,
  isDateValid,
} from '@core/utils/date.util';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-order-modal',
  imports: [
    ReactiveFormsModule,

    CompanyCustomerSearchComponent,
    DeviceSearchComponent,
    TabulatorTable,
    MatIcon,
    MatButton,
    Button,
    DatePipe,
    MatCustomDialogComponent,
  ],
  templateUrl: './order-modal.component.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class OrderModalComponent implements OnInit {
  @ViewChild('inputNameSpec') inputNameSpec: any;
  private datePipe = inject(DatePipe);
  private modalRef = inject(MatDialogRef<OrderModalComponent>);
  private modalService = inject(DialogService);
  private oDS = inject(OrderDetailService);
  private orderService = inject(OrderService);
  private tS = inject(ToastrNotificationService);

  columnNames = [
    { title: 'id', field: 'id', width: 150, visible: false },
    { title: 'deviceId', field: 'deviceId', width: 150, visible: false },
    {
      title: 'deviceCustomerId',
      field: 'deviceCustomerId',
      width: 150,
      visible: false,
    },
    { title: 'Equipo', field: 'deviceName', width: 225 },
    { title: 'Serie (IMEI)', field: 'deviceSerie', width: 200, editor: true },
    {
      title: 'Garantia (si aplica)',
      field: 'deviceWarranty',
      width: 130,
      editor: 'date',
      formatter: 'date',
      placeholder: 'dd/mm/yyyy',
      formatterParams: {
        inputFormat: 'yyyy-MM-dd',
        outputFormat: 'dd/MM/yyyy',
        invalidPlaceholder: '(invalid date)',
        timezone: 'America/Guayaquil',
      },
    },
    {
      title: 'Reparaciones Requeridas',
      field: 'obs',
      width: 450,
      editor: true,
    },
    {
      formatter: (cell: any) => {
        //let cellEl = cell.getElement();
        const rowDataMain = cell.getRow().getData();

        //create edit button
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.innerHTML = `<i class="material-icons" style="cursor:pointer;">save</i>`;
        editBtn.classList.add('btn', 'btn-success', 'btn-sm');
        editBtn.title = 'Guardar Detalle';
        editBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          this.editDetail(rowData);
        });

        //create delete button
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `<i class="material-icons" style="cursor:pointer;">delete</i>`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-r-5');
        delBtn.title = 'Eliminar detalle';
        delBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          console.log(rowData);
          if (rowData.id > 0) {
            this.askToDeleteDetail(rowData);
          } else {
            this.removeFromList(rowData.deviceId);
          }
        });

        const buttonHolder = document.createElement('span');
        buttonHolder.appendChild(delBtn);
        if (rowDataMain.id > 0) {
          buttonHolder.appendChild(editBtn);
        }
        return buttonHolder;
      },
      hozAlign: 'center',
      resizable: false,
      title: 'Opción',
      width: 100,
    },
  ];
  clearSearch = true;
  currentDate = new Date();
  customerBusinessName = '';
  data = inject<any>(MAT_DIALOG_DATA);
  deviceFound: any = {};
  devices = signal<any>([]);
  establecimientos = signal<GroupedEstab[]>([]);
  formatedDate: any = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  modalIcon = 'add';
  modalTitle = 'Nueva Orden';
  order: any = {};
  orderDetails = signal<OrderDetail[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  users = signal<any>([]);

  orderForm = new FormGroup({
    id: new FormControl(0),
    assignedUserId: new FormControl(0, Validators.required),
    uuid: new FormControl(generateUuidv4()),
    establecimientoId: new FormControl(0, Validators.required),
    puntoEmisionId: new FormControl(0, Validators.required),
    customerCompanyId: new FormControl(0, Validators.required),
    fechaEmision: new FormControl(this.formatedDate, Validators.required),
    obs: new FormControl(''),
    orderStatusId: new FormControl(0),
  });

  addDetail(device: any) {
    if (this.orderDetails().some((x) => x.deviceId == device.id)) {
      return this.tS.show({
        type: 'warning',
        message: 'Este equipo ya se encuentra agregado en el detalle',
      });
    }
    const deviceToAdd: OrderDetail = {
      id: 0,
      deviceId: 0,
      deviceName: '',
      deviceSerie: '',
      deviceWarranty: '',
      uuid: '',
    };
    deviceToAdd.deviceId = device.id;
    deviceToAdd.deviceCustomerId = device.deviceCustomerId;
    deviceToAdd.deviceName = !device.deviceName ? device.name : device.deviceName;
    deviceToAdd.deviceSerie = !device.deviceSerie ? device.serie : device.deviceSerie;
    deviceToAdd.deviceWarranty = !device.deviceWarranty ? device.warranty : device.deviceWarranty;
    deviceToAdd.obs = '';
    deviceToAdd.uuid = generateUuidv4();
    deviceToAdd.assignedUserId = 0;
    deviceToAdd.deviceCustomerId = !device.deviceCustomerId ? 0 : device.deviceCustomerId;
    deviceToAdd.deviceCustomerId = !device.deviceCustomerId ? 0 : device.deviceCustomerId;
    deviceToAdd.deviceSerie = !device.deviceSerie ? 0 : device.deviceSerie;
    deviceToAdd.deviceWarranty = !device.deviceWarranty ? '' : device.deviceWarranty;
    this.orderDetails.update((r) => [...r, deviceToAdd]);
  }

  askToDeleteDetail(detail: OrderDetail) {
    Swal.fire({
      icon: 'warning',
      text: `Esta seguro de eliminar este detalle?`,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((response) => {
      if (response.isConfirmed) {
        this.oDS.delete(detail.id).subscribe((response) => {
          if (isApiResponse(response)) {
            this.tS.show({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              this.orderDetails.update((r) => r.filter((x) => x.id != detail.id));
            }
          }
        });
      }
    });
  }

  onModalClose() {
    this.modalRef.close();
  }

  editDetail(detail: any) {
    this.oDS.put(detail.id, detail).subscribe((response) => {
      if (isApiResponse(response)) {
        this.tS.show({
          type: response.code == '1' ? 'success' : 'warning',
          message: response.message,
        });
      }
    });
  }

  get() {
    const parameters = { tipo: 1, id: this.data.id };
    if (this.data.id > 0) {
      this.modalTitle = 'Editar Orden';
      this.modalIcon = 'edit';
    }
    this.orderService.get(parameters).subscribe((response) => {
      if (isApiResponse(response)) {
        if (response.code == '1') {
          const parsedResponse = JSON.parse(response.payload as string);
          const { puntosEmision, users } = parsedResponse;
          const establecimientos = groupEstabUtil({
            estabs: puntosEmision,
            isGroupPuntoEmision: true,
          });
          this.establecimientos.set(establecimientos);
          const dataEstab = this.establecimientos().find((estab) => estab.defaultEstab);
          if (dataEstab) {
            this.orderForm.patchValue({
              establecimientoId: dataEstab.idEstablecimiento,
            });
            this.order.codEstab = dataEstab.codEstab;
            this.puntosEmision.set(dataEstab.puntosEmision);
            const dataPuntoEmision = this.puntosEmision().find((ptoEmi) => ptoEmi.defaultPtoEmi);
            if (dataPuntoEmision) {
              this.orderForm.patchValue({
                puntoEmisionId: dataPuntoEmision.idPuntoEmision,
              });
            }
          }
          this.users = users;
          if (this.data.id > 0) {
            const { order, orderDetails } = parsedResponse;
            this.order = order[0];
            this.customerBusinessName = this.order.businessName;
            this.orderDetails.set(orderDetails || []);
            this.orderForm.patchValue(this.order);
          }
        }
      }
    });
  }

  getDevices() {
    const modalRef = this.modalService.open(DeviceListModalComponent, {
      size: 'lg',

      data: {
        customerCompanyId: this.order.customerCompanyId,
      },
    });
    modalRef.subscribe((result) => {
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
    const establecimientoId = this.orderForm.get('establecimientoId')?.value;
    if (isValidField(establecimientoId)) {
      const estabs = this.establecimientos().find(
        (x) => x.idEstablecimiento == Number(establecimientoId),
      );
      this.puntosEmision.set(estabs?.puntosEmision || []);
      const puntoEmisionId =
        this.puntosEmision().find((ptoEmi) => ptoEmi.defaultPtoEmi)?.idPuntoEmision || 0;
      this.orderForm.patchValue({
        establecimientoId: establecimientoId,
        puntoEmisionId: puntoEmisionId,
      });
    }
  }
  onCustomerSelected(data: CompanyCustomerEntity) {
    this.order.customerCompanyId = data.idCliente;
    this.orderForm.patchValue({ customerCompanyId: data.idCliente });
  }
  onDeviceSelected($event: any) {
    this.addDetail($event.data);
    this.clearSearch = true;
  }

  removeFromList(deviceId: number) {
    this.orderDetails.update((r) => r.filter((x) => x.deviceId !== deviceId));
  }

  onChangeDate(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const dateObject: string = inputElement.value;

    this.orderForm.patchValue({ fechaEmision: dateObject }); // Emitir el nuevo valor al componente padre
  }

  save() {
    if (this.orderDetails().length == 0) {
      this.tS.show({
        type: 'warning',
        message: 'Debe de añadir los detalles a la orden',
      });
    }

    let fechaEmision: any = this.orderForm.value.fechaEmision;
    fechaEmision = formatDate(fechaEmision);

    if (!fechaEmision) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione le fecha',
      });
      return;
    }

    if (!isDateValid(fechaEmision)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese una fecha válida',
      });
      return;
    }

    if (dateIsAfterCurrentDate(fechaEmision)) {
      this.tS.show({
        type: 'warning',
        message: 'La fecha de emisión del documento no puede ser posterior a la fecha actual.',
      });
      return;
    }

    const ajusteFechaEmision = ajustarFechaEmisionModificada({
      fechaEmision: fechaEmision,
      setHoursZero: true,
    });

    const dataToSave = {
      ...this.orderForm.value,
      orderDetails: this.orderDetails(),
      fechaEmision: formatDateToString(ajusteFechaEmision),
    };
    if (this.data.id > 0) {
      this.orderService.put(this.data.id, dataToSave).subscribe({
        next: this.successResponse,
      });
    } else {
      this.orderService.post(dataToSave).subscribe({
        next: this.successResponse,
      });
    }
  }
  successResponse = (response: object) => {
    if (isApiResponse(response)) {
      this.tS.show({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code === '1') {
        this.orderForm.patchValue({});
        this.orderDetails.set([]);
        this.order = {};
        this.modalRef.close(response);
      }
    }
  };
}

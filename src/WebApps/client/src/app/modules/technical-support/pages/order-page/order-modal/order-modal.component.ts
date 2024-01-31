import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IForm } from '@core/Types/form-types';
import { CompanyCustomerSearchComponent } from '@core/components/company-customer-search/company-customer-search.component';
import { isApiResponse } from '@core/models/api-response';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { ToasterService } from '@core/services/toaster.service';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isValidField } from '@core/utils/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Device } from '@modules/technical-support/models/device.model';
import { OrderDetail } from '@modules/technical-support/models/order-detail';
import { DeviceService } from '@modules/technical-support/services/device.service';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [AppModule, CompanyCustomerSearchComponent],
  templateUrl: './order-modal.component.html',
  styles: ``,
})
export class OrderModalComponent {
  private deviceService = inject(DeviceService);
  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  private orderService = inject(OrderService);
  private tS = inject(ToasterService);

  activeShowForm(accion: any, test: any) {
    console.log(accion);
    console.log(test);
  }
  categories: any = [];
  data: any = {};
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

  establecimientos: Array<GroupedEstab> = [];
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nueva Orden';
  order: any = {};
  orderDetails: OrderDetail[] = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];

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

  closeModal() {
    this.modalRef.close();
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

  resetFormDevice() {}
}

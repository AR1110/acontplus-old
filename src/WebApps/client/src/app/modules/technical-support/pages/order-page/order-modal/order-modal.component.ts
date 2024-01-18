import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CompanyCustomerSearchComponent } from '@core/components/company-customer-search/company-customer-search.component';
import { isApiResponse } from '@core/models/api-response';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isValidField } from '@core/utils/utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [AppModule, CompanyCustomerSearchComponent],
  templateUrl: './order-modal.component.html',
  styles: ``,
})
export class OrderModalComponent {
  establecimientos: Array<GroupedEstab> = [];
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nueva Orden';
  order: any = {};
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];

  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  private orderService = inject(OrderService);

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
            let { puntosEmision } = JSON.parse(response.payload as string);
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
  onCustomerSelected($event: any) {}
}

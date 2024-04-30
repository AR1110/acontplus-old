import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderService } from '@modules/technical-support/services/order.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-delivery-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './order-delivery-modal.component.html',
  styles: ``
})
export class OrderDeliveryModalComponent implements OnInit {

  private modalRef = inject(NgbActiveModal);
  private orderService = inject(OrderService);
  private tS = inject(ToasterService);

  // * Status
  isOtherReceiver: boolean = false;

  // * Params.
  @Input() data: any = {};

  // * Forms.
  orderDeliveryForm = new FormGroup({
    receiverGovernmentId: new FormControl('', [Validators.required, Validators.minLength(3)]),
    receiver: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  ngOnInit(): void {;
    console.log(this.data);
  }

  closeModal() {
    this.modalRef.close();
  }

  enableIsOtherReceiver(): void {
    this.isOtherReceiver = !this.isOtherReceiver;
  }

  save() {
    showLoader();

    let dataModified = {
      isOtherReceiver : this.isOtherReceiver,
      receiverGovernmentId: this.orderDeliveryForm.value.receiverGovernmentId,
      receiver: this.orderDeliveryForm.value.receiver,
    }

    this.orderService.delivery(this.data.id, dataModified).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          this.tS.toastr({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });

          if (response.code == '1') {
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

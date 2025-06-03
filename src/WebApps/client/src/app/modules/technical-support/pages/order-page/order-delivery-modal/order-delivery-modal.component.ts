import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';

import { OrderService } from '@modules/technical-support/services/order.service';
import { MatIcon } from '@angular/material/icon';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";

@Component({
  selector: 'app-order-delivery-modal',
  imports: [
    FormsModule,
    MatIcon,
    MatCheckboxModule,
    ReactiveFormsModule,
    ThemeButtonComponent,
    MatCustomDialogComponent,
  ],
  templateUrl: './order-delivery-modal.component.html',
  styles: ``,
})
export class OrderDeliveryModalComponent implements OnInit {
  private modalRef = inject(MatDialogRef<OrderDeliveryModalComponent>);
  private orderService = inject(OrderService);
  private tS = inject(ToasterService);

  // * Status
  isOtherReceiver  = false;

  // * Params.
    data = inject(MAT_DIALOG_DATA);

  // * Forms.
  orderDeliveryForm = new FormGroup({
    receiverGovernmentId: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(13),
    ]),
    receiver: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  ngOnInit(): void {}

  onModalClose() {
    this.modalRef.close();
  }

  enableIsOtherReceiver(): void {
    this.isOtherReceiver = !this.isOtherReceiver;
  }

  save() {
    let dataModified = {
      isOtherReceiver: this.isOtherReceiver,
      receiverGovernmentId: this.orderDeliveryForm.value.receiverGovernmentId,
      receiver: this.orderDeliveryForm.value.receiver,
    };

    this.orderService.delivery(this.data.id, dataModified).subscribe( (response) => {
        if (isApiResponse(response)) {
          this.tS.toastr({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });

          if (response.code == '1') {
            this.modalRef.close(response);
          }
        }
    });
  }
}

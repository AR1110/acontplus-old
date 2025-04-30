
import { OrderListModalComponent } from '@ui/orders/components/order-list-modal/order-list-modal.component';
import { DialogService } from '@domain/services/dialog.service';
import { Directive, HostListener, inject, input,   output } from '@angular/core';
import {PermissionStore} from "@ui/store/permission.store";
import {ROUTES_PATH} from "@domain/enums/main.enum";

@Directive({
    selector: '[appActionOrderDialog]',
    standalone: true
})
export class ActionOrderDialogDirective {

    private dialogSvc = inject(DialogService)
  private $permissionStore = inject(PermissionStore)
  tableId = input<number>()
  roomId = input<number>()

    @HostListener('click', ['$event']) onClick($event: any) {
        $event.stopPropagation();
        let data = {
            tableId: this.tableId(),
          roomId: this.roomId()
        }
      this.$permissionStore.loadActions(ROUTES_PATH.ORDER)

       const dialogRef =  this.dialogSvc.open(OrderListModalComponent, {
            data,
            size: 'xl',

        })

        dialogRef.subscribe(result => {
          this.$permissionStore.loadActions(ROUTES_PATH.POS)
        })
    }

}

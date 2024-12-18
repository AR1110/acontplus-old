
import { OrderListModalComponent } from '@ui/orders/components/order-list-modal/order-list-modal.component';
import { DialogService } from '@/shared/services/dialog.service';
import { Directive, HostListener, inject, input,   output } from '@angular/core';

@Directive({
    selector: '[appActionOrderDialog]',
    standalone: true
})
export class ActionOrderDialogDirective {

    private dialogSvc = inject(DialogService)
    tableId = input<number>()

    @HostListener('click', ['$event']) onClick($event: any) {
        $event.stopPropagation();
        let data = {
            tableId: this.tableId()
        }
        this.dialogSvc.open(OrderListModalComponent, {
            data,
            size: 'xl',

        })

        // dialogRef.subscribe(result => {
        //     if (result && typeof result === 'object') {
        //         this.onResult.emit(result)
        //     }
        // })
    }

}

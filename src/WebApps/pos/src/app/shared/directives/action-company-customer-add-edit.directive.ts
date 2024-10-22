import { DialogService } from '@/shared/services/dialog.service';
import {Directive, HostListener, inject, input, Input, output} from '@angular/core';
import {
  CompanyCustomerAddEditModalComponent
} from "@company-customers/components/company-customer-add-edit-modal/company-customer-add-edit-modal.component";
@Directive({
  selector: '[appActionCompanyCustomerAddEditModal]',
  standalone: true
})
export class ActionCompanyCustomerAddEditModalDirective {

  private dialogSvc = inject(DialogService)
  onResult = output<unknown>()
  params = input<unknown>()
  id = input<number>()
 @HostListener('click', ['$event']) onClick($event:any){
   $event.stopPropagation();
   let data = {
     id: this.id() || 0
   }
   let dialogRef = this.dialogSvc.open(CompanyCustomerAddEditModalComponent, {
      data,
      size: 'lg'
    })

   dialogRef.subscribe(result=>{
     if(result && typeof result==='object'){
       this.onResult.emit(result)
     }
   })
 }

}

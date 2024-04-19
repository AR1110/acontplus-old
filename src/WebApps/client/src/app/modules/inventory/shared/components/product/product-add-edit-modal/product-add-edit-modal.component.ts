
import { Component, Input, inject } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbNavChangeEvent, NgbNavModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {SubCategoryModalDirective} from '@inventory/directives/sub-category.directive'
import { MeasureAddEditDirective } from '@modules/inventory/shared/directives/measure-add-edit.directive';

@Component({
  selector: 'app-product-add-edit-modal',
  standalone: true,
  imports: [
    NgbNavModule,
    FontAwesomeModule,
    SubCategoryModalDirective,
    MeasureAddEditDirective
  ],
  templateUrl: './product-add-edit-modal.component.html'
})

export class ProductAddEditModalComponent {
  @Input() params: any = {}

  //Inject Services
   private activeModal = inject(NgbActiveModal);
  activeTab = 1;

  onNavChange(changeEvent: NgbNavChangeEvent) {
    console.log(changeEvent)
    if (changeEvent.nextId === 1) {
      //changeEvent.preventDefault();
      setTimeout(() => {
        // this.drawTable();
      })
    }
  }


  closeModal(){
    this.activeModal.close();
  }
}

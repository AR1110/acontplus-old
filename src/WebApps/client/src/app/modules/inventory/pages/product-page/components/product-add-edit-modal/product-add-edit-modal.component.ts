
import { Component, Input } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SubCategoryModalDirective } from '@modules/inventory/directives/sub-category.directive';

import { NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-add-edit-modal',
  standalone: true,
  imports: [NgbNavModule, FontAwesomeModule, SubCategoryModalDirective],
  templateUrl: './product-add-edit-modal.component.html'
})

export class ProductAddEditModalComponent {


  @Input() params: any = {}
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


}

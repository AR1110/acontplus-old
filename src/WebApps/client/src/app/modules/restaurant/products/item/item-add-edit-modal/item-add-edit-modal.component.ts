import { Component } from '@angular/core';
import { ProductionArea } from '@restaurant/models/production-area';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Item } from '@restaurant/models/item.model';

@Component({
  selector: 'app-item-add-edit-modal',
  standalone: true,
  imports: [FaIconComponent, ReactiveFormsModule],
  templateUrl: './item-add-edit-modal.component.html',
  styles: ``,
})
export class ItemAddEditModalComponent {
  data = {} as Item;
  productionAreas: ProductionArea[] = [];
  modalIcon: IconProp = 'plus';
  modalTitle: string = 'Registrar Item';
  itemForm = new FormGroup({});

  ngOnInit() {
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Item';
    }
  }

  onModalClose() {}

  onSave() {}
}

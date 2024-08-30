import { Component } from '@angular/core';
import { ProductionArea } from '@restaurant/models/production-area';

@Component({
  selector: 'app-item-add-edit-modal',
  standalone: true,
  imports: [],
  templateUrl: './item-add-edit-modal.component.html',
  styles: ``,
})
export class ItemAddEditModalComponent {
  productionAreas: ProductionArea[] = [];

  ngOnInit() {}
}

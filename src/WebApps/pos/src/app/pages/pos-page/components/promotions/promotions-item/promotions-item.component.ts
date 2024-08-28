import { Component, input } from '@angular/core';
import { ItemCardComponent } from '../../item-card/item-card.component';

@Component({
  selector: 'app-promotions-item',
  standalone: true,
  imports: [
    ItemCardComponent
  ],
  templateUrl: './promotions-item.component.html',
  styleUrl: './promotions-item.component.scss'
})
export class PromotionsItemComponent {
  item = input<any>()

  items:any[]=[1,3,4,5,78,89,9,8,67]

}

import { Component, inject, input, signal } from '@angular/core';
import { ItemCardComponent } from '../../item-card/item-card.component';
import { PromotionMenuService } from '@/services/promotion-menu.service';
import { ItemRead } from '@/models/item.model';

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
  promotionId = input(0);
  private promotionItemSvc = inject(PromotionMenuService)

  items = signal<ItemRead[]>([])

  private getPromotionsMenu() {
    this.promotionItemSvc.getByPromotionId({
      promotionId: this.promotionId()
    }).subscribe(response => {
      this.items.set(response.items)
    })
  }

  ngOnInit(): void {
    this.getPromotionsMenu()
  }

}

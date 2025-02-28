import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PromotionService } from '@data/repositories/promotion/promotion.service';
import { MainStoreService } from '@domain/services/main-store.service';
import { PosStoreService } from '@ui/store/pos-store.service';
import { PromotionsItemComponent } from './promotions-item/promotions-item.component';

@Component({
  selector: 'app-promotions',
  imports: [MatButtonModule, MatIconModule, PromotionsItemComponent],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss',
})
export class PromotionsComponent {
  private promotionSvc = inject(PromotionService);
  private mainStoreSvc = inject(MainStoreService);
  private posStoreSvc = inject(PosStoreService);

  promotions = computed(() => this.posStoreSvc.state().promotionsMenu);

  setLoading(isLoading: boolean) {
    this.posStoreSvc.state.update((e) => ({
      ...e,
      isLoading,
    }));
  }

  // private getPromotions() {
  //   let params = {
  //     estabId: this.mainStoreSvc.state()?.establecimientoId
  //   }
  //   this.setLoading(true)
  //   this.promotionSvc.getPromotions(params).subscribe({
  //     next: response => {
  //       this.setLoading(false)
  //       this.promotions.set(response)
  //     },
  //     error: err => {
  //       this.setLoading(false)
  //       console.log(err)
  //     }
  //   })
  // }

  ngOnInit() {
    //  this.getPromotions()
  }

  toggleNode(node: any) {
    node.expanded = !node.expanded;

    this.posStoreSvc.state.update((e) => {
      let promotionsMenu = structuredClone(e.promotionsMenu);

      return {
        ...e,
        promotionsMenu: promotionsMenu.map((item) => {
          let newObj = {
            ...item,
            expanded: false,
          };
          return {
            ...newObj,
            expanded: item.id === node.id && node.expanded,
          };
        }),
      };
    });
  }
}

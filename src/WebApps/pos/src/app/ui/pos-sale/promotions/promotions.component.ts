import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PosStoreService } from '@ui/store/pos-store.service';
import { PromotionsItemComponent } from './promotions-item/promotions-item.component';

@Component({
  selector: 'app-promotions',
  imports: [MatButtonModule, MatIconModule, PromotionsItemComponent],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss',
})
export class PromotionsComponent {
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

  toggleNode(node: any) {
    node.expanded = !node.expanded;

    this.posStoreSvc.state.update((e) => {
      const promotionsMenu = structuredClone(e.promotionsMenu);

      return {
        ...e,
        promotionsMenu: promotionsMenu.map((item) => {
          const newObj = {
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

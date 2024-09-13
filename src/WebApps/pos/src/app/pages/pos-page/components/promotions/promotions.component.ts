import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PromotionsItemComponent } from './promotions-item/promotions-item.component';
import { PromotionService } from '@/services/promotion.service';
import { MainStoreService } from '@/store/main-store.service';
import { PosStoreService } from '@/store/pos-store.service';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    PromotionsItemComponent
  ],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss'
})
export class PromotionsComponent {

  private promotionSvc = inject(PromotionService)
  private mainStoreSvc = inject(MainStoreService)
  private posStoreSvc = inject(PosStoreService)
 
  promotions = computed(()=>this.posStoreSvc.state().promotionsMenu)

  setLoading(isLoading: boolean) {
    this.posStoreSvc.state.update(e => ({
      ...e,
      isLoading
    }))
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

    this.posStoreSvc.state.update(e => {

      let promotionsMenu = structuredClone(e.promotionsMenu);
      

      return  {
        ...e,
        promotionsMenu: promotionsMenu.map(item => {
          let newObj = {
            ...item,
            expanded: false
          }
          return {
            ...newObj,
            expanded: item.id === node.id && node.expanded
          }
        })

      }
      
      
    }) 
  }

}

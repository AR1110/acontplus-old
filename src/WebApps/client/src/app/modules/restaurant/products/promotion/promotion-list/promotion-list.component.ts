import { Component, inject, model, signal } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { RestaurantStoreService } from '@modules/restaurant/store/restaurant-store.service';
import { PromotionAddEditModalComponent } from '../promotion-add-edit-modal/promotion-add-edit-modal.component';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [],
  templateUrl: './promotion-list.component.html',
  styles: ``
})
export class PromotionListComponent {
  private restaurantStore = inject(RestaurantStoreService);

  private modalSvc = inject(ModalService)


  estabs = signal(this.restaurantStore.state().establecimientos);
  estabId = model(this.restaurantStore.state().establecimientoId);


  promotions = signal<any[]>([])

  openModalAddEdit(){
    console.log('this')
    let modalRef = this.modalSvc.open(PromotionAddEditModalComponent, 
      {
        size: 'lg',
        backdrop: "static",
        keyboard: false
      }
    )
  }


}

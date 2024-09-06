import { Component, inject, model, signal } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { RestaurantStoreService } from '@modules/restaurant/store/restaurant-store.service';
import { PromotionAddEditModalComponent } from '../promotion-add-edit-modal/promotion-add-edit-modal.component';
import { PromotionService } from '@modules/restaurant/services/promotion.service';
import { Pagination } from '@shared/models/pagination.model';

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
  private promotionSvc = inject(PromotionService)


  estabs = signal(this.restaurantStore.state().establecimientos);
  estabId = model(this.restaurantStore.state().establecimientoId);


  promotions = signal<any[]>([])

  pagination = signal(new Pagination())
  days = signal<any[]>([])

  openModalAddEdit() {
    console.log('this')
    let modalRef = this.modalSvc.open(PromotionAddEditModalComponent,
      {
        size: 'lg',
        backdrop: "static",
        keyboard: false,
      }
    )
    modalRef.componentInstance.params = {
      days: this.days()
    }
  }

  private getPromotions() {
    let params = {
      pageIndex: this.pagination().pageIndex,
      pageSize: this.pagination().pageSize,
    }
    this.promotionSvc.getAll(params).subscribe(response => {
      this.days.set(response.days)
    })
  }

  ngOnInit() {
    this.getPromotions()
  }


}

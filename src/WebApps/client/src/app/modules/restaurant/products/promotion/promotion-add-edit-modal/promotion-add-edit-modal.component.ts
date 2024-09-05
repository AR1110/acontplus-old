import { Component, inject, model, signal } from '@angular/core';
import { RestaurantStoreService } from '@modules/restaurant/store/restaurant-store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-promotion-add-edit-modal',
  standalone: true,
  imports: [],
  templateUrl: './promotion-add-edit-modal.component.html',
  styles: ``
})
export class PromotionAddEditModalComponent {
  private modalRef = inject(NgbActiveModal);
  private restaurantStore = inject(RestaurantStoreService); 

  estabs = signal(this.restaurantStore.state().establecimientos);
  estabId = model(this.restaurantStore.state().establecimientoId);

  selectedTab = signal(0)

  titleModal = signal('Nueva Promoción')

  daysOfWeek = signal([
    { name: 'Lunes', id: 'monday' },
    { name: 'Martes', id: 'tuesday' },
    { name: 'Miércoles', id: 'wednesday' },
    { name: 'Jueves', id: 'thursday' },
    { name: 'Viernes', id: 'friday' },
    { name: 'Sábado', id: 'saturday' },
    { name: 'Domingo', id: 'sunday' }
  ])


  close(){
    this.modalRef.close()
  }
}

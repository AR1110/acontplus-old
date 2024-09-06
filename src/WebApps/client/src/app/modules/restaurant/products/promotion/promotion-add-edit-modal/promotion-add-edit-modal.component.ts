import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { MenuSearchComponent } from '@modules/restaurant/components/menu-search/menu-search.component';
import { RestaurantStoreService } from '@modules/restaurant/store/restaurant-store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InputDateComponent } from '@shared/components/input-date/input-date.component';
import { TimeInputFormat24Directive } from '@shared/directives/time-input-format-directive.directive';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';

@Component({
  selector: 'app-promotion-add-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputDateComponent,
    ToUpperCaseDirective,
    TimeInputFormat24Directive,
    MenuSearchComponent
  ],
  templateUrl: './promotion-add-edit-modal.component.html',
  styles: ``
})
export class PromotionAddEditModalComponent {
  params = {} as any
  private modalRef = inject(NgbActiveModal);
  private restaurantStore = inject(RestaurantStoreService);
  private tS = inject(ToasterService)

  estabs = signal(this.restaurantStore.state().establecimientos);
  estabId = model(this.restaurantStore.state().establecimientoId);

  selectedTab = signal(0)

  titleModal = signal('Nueva Promoción')

  allDay = model(true);
  daysOfWeek = signal<any[]>([]);

  promotionMenus = signal<any[]>([])

  data = {
    id: 0,
    description: "",
    startDate: new Date(),
    endDate: new Date(),
  }

  constructor() {
    // effect(()=>{
    //   console.log(this.params())

    // })
  }

  ngOnInit() {
    this.daysOfWeek.set(this.params.days.map((item: any) => {
      return {
        idDia: item.idDia,
        diaSemana: item.diaSemana,
        descripcion: item.descripcion,
        horaInicio: "00:00",
        horaFin: "23:59",
        checked: true,
      }

    }))
  }


  onChangeAllDay() {
    console.log('onchang')
    this.daysOfWeek.update(e => {
      return e.map(item => ({ ...item, checked: this.allDay(), }))
    })
  }

  onChangeDay() {
    this.allDay.set(this.daysOfWeek().every(item => item.checked))
  }



  onProductSelected($event: any) {
    if (this.promotionMenus().some(e => e.menuId === $event.id)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ya existe agregado para la promoción'
      })
      return
    }




    let newPromotionMenu = {
      id: 0,
      promotionId: 0,
      menuId: $event.id,
      title: $event.title,
      s3ObjectUrl: $event.s3ObjectUrl
    };

    this.promotionMenus.update(e => {
      return [...e, newPromotionMenu]
    })

  }

  onRemove(id: number) {
    this.promotionMenus.update(e => {
      return e.filter(e => e.menuId !== id)
    })
  };

  close() {
    this.modalRef.close()
  }
}

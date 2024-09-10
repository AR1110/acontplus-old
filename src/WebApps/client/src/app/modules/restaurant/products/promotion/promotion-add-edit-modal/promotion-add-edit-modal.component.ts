import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, input, model, Renderer2, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { formatDateMoment } from '@core/utils/format-date-moment';
import { imgDefault, isValidField } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuSearchComponent } from '@modules/restaurant/components/menu-search/menu-search.component';
import { PromotionService } from '@modules/restaurant/services/promotion.service';
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
    FontAwesomeModule,
    InputDateComponent,
    ToUpperCaseDirective,
    TimeInputFormat24Directive,
    MenuSearchComponent
  ],
  templateUrl: './promotion-add-edit-modal.component.html',
  styleUrl: './promotion-add-edit-modal.component.scss',
  styles: ``
})
export class PromotionAddEditModalComponent {
  params = {} as any
  private modalRef = inject(NgbActiveModal);
  private restaurantStore = inject(RestaurantStoreService);
  private tS = inject(ToasterService)
  private promotionSvc = inject(PromotionService)

  estabs = signal(this.restaurantStore.state().establecimientos);
  estabId = model(this.restaurantStore.state().establecimientoId);

  selectedTab = signal(0)

  titleModal = signal('Nueva Promoción')
  titleBtnSave = signal('Guardar')

  allDay = model(true);
  daysOfWeek = signal<any[]>([]);

  promotionMenus = signal<any[]>([])

  data = {
    id: 0,
    description: "",
    startDate: new Date(),
    endDate: new Date(),
  }

  @ViewChild('imagePreview') imagePreview!: ElementRef; 

  imageUrl: string | ArrayBuffer | null = imgDefault();
  file:File | null = null;

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.file = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result; 
      };
      reader.readAsDataURL(file);
    }
  }

  onDelete(): void {
    this.imageUrl = imgDefault()
    this.file = null;
  }

  onEdit(): void {
    document.getElementById('imageUpload')?.click();
  }

  ngOnInit() {
    console.log(this.params)
    const {data, days}= this.params;
    if(data.id>0){
      //console.log()  

    }else{
      this.daysOfWeek.set(days.map((item: any) => {
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

  save() {
    try {
      if (!isValidField(this.estabId())) {
        this.tS.toastr({
          type: 'warning',
          message: 'Estab id undefined'
        })
        return
      }

      if (!isValidField(this.data.description)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la descripcón'
        })
        return
      }

      if (!isValidField(this.data.startDate)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la fecha de inicio'
        })
        return
      }

      if (!isValidField(this.data.endDate)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la fecha de fin'
        })
        return
      }

      if (this.daysOfWeek().some(e => e.checked && !(isValidField(e.horaInicio) || !isValidField(e.horaFin)))) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese hora de inicio o fin'
        })
        return
      }

      if (this.daysOfWeek().some(e => e.checked && !(e.horaInicio.includes(':')))) {
        this.tS.toastr({
          type: 'warning',
          message: 'Hora de inicio formato incorrecto'
        })
        return
      }

      if (this.daysOfWeek().some(e => e.checked && !(e.horaFin.includes(':')))) {
        this.tS.toastr({
          type: 'warning',
          message: 'Hora de fin formato incorrecto'
        })
        return
      }

      if (this.promotionMenus().length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'Agregué al menos un menú'
        })
        return
      }

      let newPromotionMenu = this.promotionMenus().map((e) => ({
        id: e.id, promotionId: e.promotionId, menuId: e.menuId
      }))
      console.log(newPromotionMenu);

      let promotionDays = JSON.stringify(this.daysOfWeek());
      let newObject = {
        estabId: this.estabId(),
        description: this.data.description,
        startDate: formatDateMoment(this.data.startDate),
        endDate: formatDateMoment(this.data.endDate),
        promotionDays,
        promotionMenus: newPromotionMenu,
      };

      this.promotionSvc.post(newObject, this.file).subscribe(response=>{
        console.log(response)
      })
      
    } catch (err) {
      console.log(err)

    }
  }

  close() {
    this.modalRef.close()
  }
}

import { Component, ElementRef, inject, model, signal, ViewChild, OnInit } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDate, formatDateToString } from '@core/utils/date.util';
import { imgDefault, isValidField } from '@core/utils/utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantStoreService } from '@restaurant/application/store/restaurant-store.service';
import { InputDateComponent } from '@shared/components/input-date/input-date.component';
import { PromotionMenuService } from '@restaurant/data/services/promotion-menu.service';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { PromotionService } from '@restaurant/data/services/promotion.service';
import { MatIcon } from '@angular/material/icon';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-promotion-form-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatIcon,
    InputDateComponent,
    ToUpperCaseDirective,
    Button,
    MatCustomDialogComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
  ],
  templateUrl: './promotion-add-edit-modal.component.html',
  styleUrl: './promotion-add-edit-modal.component.scss',
  styles: ``,
})
export class PromotionAddEditModalComponent implements OnInit {
  params = inject(MAT_DIALOG_DATA);
  private modalRef = inject(MatDialogRef<PromotionAddEditModalComponent>);
  private restaurantStore = inject(RestaurantStoreService);
  private tS = inject(ToastrNotificationService);
  private promotionSvc = inject(PromotionService);
  private promotionMenuSvc = inject(PromotionMenuService);

  estabs = signal(this.restaurantStore.state().establecimientos);
  estabId = model(this.restaurantStore.state().establecimientoId);

  selectedTab = signal(0);

  titleModal = signal('Nueva Promoción');
  titleBtnSave = signal('Guardar');

  allDay = model(true);
  daysOfWeek = signal<any[]>([]);

  promotionMenus = signal<any[]>([]);

  data = {
    id: 0,
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    enabled: true,
  };

  @ViewChild('imagePreview') imagePreview!: ElementRef;

  imageUrl: string | ArrayBuffer | null = imgDefault();
  file: File | null = null;

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
    this.imageUrl = imgDefault();
    this.file = null;
  }

  onEdit(): void {
    document.getElementById('imageUpload')?.click();
  }

  ngOnInit() {
    const { data, days } = this.params;
    if (data.id > 0) {
      this.titleModal = signal('Editar Promoción');
      this.titleBtnSave = signal('Actualizar');

      this.data.id = data.id;
      this.data.startDate = formatDate(data.startDate);
      this.data.endDate = formatDate(data.endDate);
      this.data.description = data.description;
      this.data.enabled = data.enabled;
      if (data.img) {
        this.imageUrl = data.img;
      }

      this.daysOfWeek.set(JSON.parse(data.promotionDays));

      this.promotionMenuSvc
        .getByPromotionId(data.id, {})
        .subscribe((response) => [this.promotionMenus.set(response.promotionMenus)]);
    } else {
      this.daysOfWeek.set(
        days.map((item: any) => {
          return {
            idDia: item.idDia,
            diaSemana: item.diaSemana,
            descripcion: item.descripcion,
            horaInicio: '00:00',
            horaFin: '23:59',
            checked: true,
          };
        }),
      );
    }
  }

  onChangeAllDay() {
    console.log('onchang');
    this.daysOfWeek.update((e) => {
      return e.map((item) => ({ ...item, checked: this.allDay() }));
    });
  }

  onChangeDay() {
    this.allDay.set(this.daysOfWeek().every((item) => item.checked));
  }

  onProductSelected($event: any) {
    if (this.promotionMenus().some((e) => e.menuId === $event.id)) {
      this.tS.show({
        type: 'warning',
        message: 'Ya existe agregado para la promoción',
      });
      return;
    }

    const newPromotionMenu = {
      id: 0,
      promotionId: 0,
      menuId: $event.id,
      title: $event.title,
      s3ObjectUrl: $event.s3ObjectUrl,
    };

    this.promotionMenus.update((e) => {
      return [...e, newPromotionMenu];
    });
  }

  onRemove(id: number) {
    this.promotionMenus.update((e) => {
      return e.filter((e) => e.menuId !== id);
    });
  }

  save() {
    try {
      if (!isValidField(this.estabId())) {
        this.tS.show({
          type: 'warning',
          message: 'Estab id undefined',
        });
        return;
      }

      if (!isValidField(this.data.description)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la descripcón',
        });
        return;
      }

      if (!isValidField(this.data.startDate)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la fecha de inicio',
        });
        return;
      }

      if (!isValidField(this.data.endDate)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la fecha de fin',
        });
        return;
      }

      if (
        this.daysOfWeek().some(
          (e) => e.checked && !(isValidField(e.horaInicio) || !isValidField(e.horaFin)),
        )
      ) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese hora de inicio o fin',
        });
        return;
      }

      if (this.daysOfWeek().some((e) => e.checked && !e.horaInicio.includes(':'))) {
        this.tS.show({
          type: 'warning',
          message: 'Hora de inicio formato incorrecto',
        });
        return;
      }

      if (this.daysOfWeek().some((e) => e.checked && !e.horaFin.includes(':'))) {
        this.tS.show({
          type: 'warning',
          message: 'Hora de fin formato incorrecto',
        });
        return;
      }

      if (this.promotionMenus().length === 0) {
        this.tS.show({
          type: 'warning',
          message: 'Agregué al menos un menú',
        });
        return;
      }

      const newPromotionMenu = this.promotionMenus().map((e) => ({
        id: e.id,
        promotionId: e.promotionId,
        menuId: e.menuId,
      }));

      const promotionDays = JSON.stringify(this.daysOfWeek());
      const newObject = {
        id: this.data.id,
        estabId: this.estabId(),
        description: this.data.description,
        startDate: formatDateToString(this.data.startDate),
        endDate: formatDateToString(this.data.endDate),
        promotionDays,
        promotionMenus: newPromotionMenu,
        enabled: this.data.enabled,
      };

      if (this.data.id > 0) {
        this.promotionSvc.put(this.data.id, newObject, this.file).subscribe((response) => {
          if (response.code === '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code === '1') {
            this.tS.show({
              type: 'success',
              message: response.message,
            });
            this.modalRef.close(response);
          }
        });
      } else {
        this.promotionSvc.post(newObject, this.file).subscribe((response) => {
          if (response.code === '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code === '1') {
            this.tS.show({
              type: 'success',
              message: response.message,
            });
            this.modalRef.close(response);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  close() {
    this.modalRef.close();
  }
}

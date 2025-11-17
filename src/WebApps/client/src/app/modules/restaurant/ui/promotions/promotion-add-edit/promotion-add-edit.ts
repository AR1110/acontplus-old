import {ChangeDetectionStrategy, Component, effect, inject, output, signal} from '@angular/core';
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {MatIcon} from "@angular/material/icon";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSelectModule} from "@angular/material/select";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatCardModule} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {Button} from "@acontplus/ng-components";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DAYS_OF_WEEK} from "@restaurant/domain/models/promotion";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTimepickerModule} from "@angular/material/timepicker";

@Component({
  selector: 'app-promotion-add-edit',
  imports: [
    MatFormField,
    MatInputModule,
    MatIcon,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTimepickerModule,
    DateRangeSelectionComponent,
    MatProgressSpinner,
    MatCardModule,
    MatDivider,
    Button
  ],
  templateUrl: './promotion-add-edit.html',
  styleUrl: './promotion-add-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionAddEdit {
   promotionSaved = output<void>();

  // Signals
  isSubmitting = signal<boolean>(false);
  selectedProducts = signal<any[]>([]);
  editingProduct = signal<string | null>(null);
  openSection = signal<string>('general');


  // Forms
    private fb = inject(FormBuilder)
  promotionForm!: FormGroup;
  productForm!: FormGroup;
  scheduleForm!: FormGroup;

  constructor(
  ) {
    this.promotionForm = this.createPromotionForm();
    this.productForm = this.createProductForm();
    this.initializeScheduleControls()
    // Effect para limpiar errores al cambiar valores
    effect(() => {
      const openSectionValue = this.openSection();
      // Lógica adicional si es necesaria
    });
  }



  private createPromotionForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['percentage', Validators.required],
      value: [
        '',
        [Validators.required, Validators.min(0.01)]
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isActive: [true],
      schedule: this.fb.array([])
    });
  }

  private createProductForm(): FormGroup {
    return this.fb.group({
      productSelection: ['', Validators.required],
      promoPrice: ['', [Validators.required, Validators.min(0)]],
      rate: ['', Validators.min(0)],
      unit: ['', Validators.required]
    });
  }

  private initializeScheduleControls(): void {
    const scheduleArray = this.promotionForm.get('schedule') as FormArray;

    scheduleArray.clear();

    const dateNow = new Date();

    const year = dateNow.getFullYear();

    DAYS_OF_WEEK.forEach(day => {
      scheduleArray.push(
        this.fb.group({
          day: [day],
          isActive: [false],
          startTime: [new Date(year, 0, 1, 0, 0, 0)],     // 12:00 AM
          endTime: [new Date(year, 0, 1, 23, 30, 0)]      // 11:30 PM
        })
      );
    });

  }

  get scheduleArray(): FormArray {
    console.log(this.promotionForm.value )
    return this.promotionForm.get('schedule') as FormArray;
  }


  // Validación y envío del formulario
  async onSubmit(): Promise<void> {
    console.log(this.promotionForm.value)
    // Validaciones
    // if (this.promotionForm.invalid) {
    //   this.promotionForm.markAllAsTouched();
    //   this.openSection.set('general');
    //   return;
    // }
    //
    // if (!this.validateDates()) {
    //   this.openSection.set('vigencia');
    //   this.snackBar.open('La fecha de finalización debe ser posterior a la de inicio', 'Cerrar', {
    //     duration: 3000
    //   });
    //   return;
    // }
    //
    // if (!this.validatePercentage()) {
    //   this.openSection.set('general');
    //   this.snackBar.open('El porcentaje no puede ser mayor a 100', 'Cerrar', {
    //     duration: 3000
    //   });
    //   return;
    // }
    //
    // if (!this.validateSchedule()) {
    //   this.openSection.set('schedule');
    //   this.snackBar.open('Debe activar al menos un día con horario válido', 'Cerrar', {
    //     duration: 3000
    //   });
    //   return;
    // }
    //
    // if (this.selectedProducts().length === 0) {
    //   this.openSection.set('products');
    //   this.snackBar.open('Debe agregar al menos un producto', 'Cerrar', {
    //     duration: 3000
    //   });
    //   return;
    // }

    // Preparar datos
    this.isSubmitting.set(true);

    // const formValue = this.promotionForm.value;
    // const scheduleData = this.scheduleArray.value;
    //
    // const promotion: Omit<Promotion, 'id'> = {
    //   name: formValue.name,
    //   type: formValue.type,
    //   value: Number(formValue.value),
    //   startDate: formValue.startDate,
    //   endDate: formValue.endDate,
    //   isActive: formValue.isActive,
    //   selectedProducts: this.selectedProducts(),
    //   schedule: scheduleData,
    //   createdBy: this.firebaseService.userId() || 'anonymous'
    // };

    // try {
    //   const docId = await this.promotionService.addPromotion(promotion);
    //
    //   this.snackBar.open(`¡Promoción guardada exitosamente! ID: ${docId}`, 'Cerrar', {
    //     duration: 5000
    //   });
    //
    //   // Resetear formulario
    //   this.resetForm();
    //
    //   // Emitir evento
    //   this.promotionSaved.emit();
    //
    // } catch (error: any) {
    //   this.snackBar.open(error.message, 'Cerrar', {
    //     duration: 5000
    //   });
    // } finally {
    //   this.isSubmitting.set(false);
    // }
  }

  getErrorMessage(controlName: string): string {
    const control = this.promotionForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('minLength')) return 'Mínimo 3 caracteres';
    if (control.hasError('min')) return 'El valor debe ser positivo';
    if (control.hasError('maxPercentage')) return 'El porcentaje no puede ser mayor a 100';
    if (control.hasError('invalidDate')) return 'Fecha inválida';

    return '';
  }


  toggleSection(section: string): void {
    this.openSection.set(this.openSection() === section ? '' : section);
  }
}

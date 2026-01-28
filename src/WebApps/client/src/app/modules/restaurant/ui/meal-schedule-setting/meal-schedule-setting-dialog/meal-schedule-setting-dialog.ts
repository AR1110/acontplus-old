import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CreateMealScheduleSettingUseCase } from '@restaurant/application/use-cases/meal-schedule-setting/create-meal-schedule-setting.use-case';
import { UpdateMealScheduleSettingUseCase } from '@restaurant/application/use-cases/meal-schedule-setting/update-meal-schedule-setting.use-case';
import {
  MealScheduleSettingCreate,
  MealScheduleSetting,
  MealScheduleSettingUpdate,
} from '@restaurant/data/models/meal-schedule-setting';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-meal-schedule-setting-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    MatSlideToggle,
    ReactiveFormsModule,
  ],
  templateUrl: './meal-schedule-setting-dialog.html',
  styleUrl: './meal-schedule-setting-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealScheduleSettingDialog implements OnInit {
  #dialogRef = inject(MatDialogRef<MealScheduleSettingDialog>);
  #data = inject<{ setting?: MealScheduleSetting; establishmentId: number }>(MAT_DIALOG_DATA);
  #fb = inject(FormBuilder);
  #createUseCase = inject(CreateMealScheduleSettingUseCase);
  #updateUseCase = inject(UpdateMealScheduleSettingUseCase);

  form!: FormGroup;
  isLoading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  ngOnInit(): void {
    this.isEditMode.set(!!this.#data.setting);
    this.initializeForm();
  }

  private initializeForm(): void {
    const setting = this.#data.setting;

    this.form = this.#fb.group({
      mealCode: [setting?.mealCode || '', [Validators.required, Validators.maxLength(50)]],
      description: [setting?.description || '', [Validators.required, Validators.maxLength(200)]],
      startTime: [
        setting?.startTime ? this.formatTimeForInput(setting.startTime) : '',
        [Validators.required],
      ],
      endTime: [
        setting?.endTime ? this.formatTimeForInput(setting.endTime) : '',
        [Validators.required],
      ],
      displayOrder: [setting?.displayOrder || 1, [Validators.required, Validators.min(1)]],
      isActive: [setting?.isActive ?? true],
    });

    // Add custom validator for time range
    this.form.setValidators(this.timeRangeValidator.bind(this));
  }

  private timeRangeValidator(control: AbstractControl): Record<string, boolean> | null {
    const formGroup = control as FormGroup;
    const startTime = formGroup.get('startTime')?.value;
    const endTime = formGroup.get('endTime')?.value;

    if (startTime && endTime && startTime >= endTime) {
      return { invalidTimeRange: true };
    }

    return null;
  }

  private formatTimeForInput(time: string): string {
    // Convert HH:mm:ss to HH:mm
    return time.substring(0, 5);
  }

  private formatTimeForApi(time: string): string {
    // Convert HH:mm to HH:mm:ss
    return `${time}:00`;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      void Swal.fire({
        icon: 'warning',
        title: 'Formulario Inválido',
        text: 'Por favor, revise los campos del formulario',
      });
      return;
    }

    const formValue = this.form.value;

    if (this.isEditMode()) {
      this.updateSetting(formValue);
    } else {
      this.createSetting(formValue);
    }
  }

  private createSetting(formValue: any): void {
    this.isLoading.set(true);

    const request: MealScheduleSettingCreate = {
      establishmentId: this.#data.establishmentId,
      mealCode: formValue.mealCode,
      description: formValue.description,
      startTime: this.formatTimeForApi(formValue.startTime),
      endTime: this.formatTimeForApi(formValue.endTime),
      displayOrder: formValue.displayOrder,
    };

    this.#createUseCase
      .execute(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          void Swal.fire({
            icon: 'success',
            title: 'Creado',
            text: 'Configuración creada correctamente',
            timer: 2000,
          });
          this.#dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating meal schedule setting:', error);
          void Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear la configuración',
          });
        },
      });
  }

  private updateSetting(formValue: any): void {
    if (!this.#data.setting) return;

    this.isLoading.set(true);

    const request: MealScheduleSettingUpdate = {
      id: this.#data.setting.id,
      establishmentId: this.#data.establishmentId,
      mealCode: formValue.mealCode,
      description: formValue.description,
      startTime: this.formatTimeForApi(formValue.startTime),
      endTime: this.formatTimeForApi(formValue.endTime),
      displayOrder: formValue.displayOrder,
      isActive: formValue.isActive,
    };

    this.#updateUseCase
      .execute({ id: this.#data.setting.id, data: request })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          void Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Configuración actualizada correctamente',
            timer: 2000,
          });
          this.#dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating meal schedule setting:', error);
          void Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar la configuración',
          });
        },
      });
  }

  onCancel(): void {
    this.#dialogRef.close(false);
  }

  get dialogTitle(): string {
    return this.isEditMode() ? 'Editar Configuración de Horario' : 'Nuevo Horario';
  }
}

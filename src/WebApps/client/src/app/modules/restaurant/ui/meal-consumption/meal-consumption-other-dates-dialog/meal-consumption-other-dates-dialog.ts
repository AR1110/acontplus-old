import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { format } from 'date-fns';
import {
  CustomerSearchResult,
  MealScheduleForCustomer,
} from '@restaurant/data/models/meal-consumption';
import { CreateMealConsumptionForOtherDateUseCase } from '@restaurant/application/use-cases/meal-consumption/create-meal-consumption-for-other-date.use-case';
import { PrintMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/print-meal-consumption.use-case';

interface DialogData {
  schedule: MealScheduleForCustomer;
  customer: CustomerSearchResult;
}

@Component({
  selector: 'app-meal-consumption-other-dates-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
    MatProgressSpinner
],
  templateUrl: './meal-consumption-other-dates-dialog.html',
  styleUrl: './meal-consumption-other-dates-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealConsumptionOtherDatesDialog {
  private readonly dialogRef = inject(MatDialogRef<MealConsumptionOtherDatesDialog>);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly createUseCase = inject(CreateMealConsumptionForOtherDateUseCase);
  private readonly printUseCase = inject(PrintMealConsumptionUseCase);

  form: FormGroup;
  isLoading = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      fechaConsumo: [new Date(), Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  get schedule(): MealScheduleForCustomer {
    return this.data.schedule;
  }

  get customer(): CustomerSearchResult {
    return this.data.customer;
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    const consumptionDate = formValue.fechaConsumo as Date;

    // Format date to Ecuador timezone (America/Guayaquil)
    const formattedDate = format(consumptionDate, 'yyyy-MM-dd h:mm a');

    this.isLoading.set(true);

    const request = {
      mealScheduleSettingId: this.schedule.mealScheduleSettingId,
      idCliente: this.customer.idCliente,
      consumptionDate: formattedDate,
      amount: formValue.cantidad as number,
    };

    this.createUseCase
      .execute(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.code === '1') {
            // Print the consumption
            if (response.data) {
              this.printConsumption(JSON.stringify(response.data));
            }

            void Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: response.message || 'Consumo guardado correctamente',
              timer: 2000,
            });

            this.dialogRef.close(true);
          } else {
            void Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message || 'No se pudo guardar el consumo',
            });
          }
        },
        error: (error) => {
          console.error('Error saving consumption:', error);
          void Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al guardar el consumo',
          });
        },
      });
  }

  printConsumption(payload: string): void {
    try {
      const printData = JSON.parse(payload);
      console.log('Print data:', printData);
      // TODO: Call actual print service
    } catch (error) {
      console.error('Error printing:', error);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

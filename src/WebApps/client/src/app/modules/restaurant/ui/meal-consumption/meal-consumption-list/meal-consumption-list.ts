import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { GetMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/get-meal-consumption-use-case';
import { CreateMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/create-meal-consumption.use-case';
import { UpdateMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/update-meal-consumption.use-case';
import { DeleteMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/delete-meal-consumption.use-case';
import { CancelMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/cancel-meal-consumption.use-case';
import { PaginationParams } from '@acontplus/core';
import { Pagination } from '@acontplus/ng-components';
import { MealConsumption, ConsumptionStatus } from '@restaurant/domain/models/meal-consumption';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-meal-consumption-list',
  imports: [
    MatIconButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatIcon,
    MatProgressSpinner,
    MatPaginator,
    DatePipe,
    BreadcrumbComponent
  ],
  templateUrl: './meal-consumption-list.html',
  styleUrl: './meal-consumption-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealConsumptionList implements OnInit {
  private readonly getUseCase = inject(GetMealConsumptionUseCase);
  private readonly createUseCase = inject(CreateMealConsumptionUseCase);
  private readonly updateUseCase = inject(UpdateMealConsumptionUseCase);
  private readonly deleteUseCase = inject(DeleteMealConsumptionUseCase);
  private readonly cancelUseCase = inject(CancelMealConsumptionUseCase);

  mealConsumptionConfig = signal(new Pagination(0, 10, 5, [5, 10, 25, 50]));

  paginationParams = signal(
    new PaginationParams({
      pageIndex: this.mealConsumptionConfig().pageIndex,
      pageSize: this.mealConsumptionConfig().pageSize,
      searchTerm: '',
    }),
  );
  mealConsumptions = signal<MealConsumption[]>([]);
  isLoading = signal<boolean>(false);

  // Table configuration
  displayedColumns = [
    'consumptionDate',
    'mealScheduleSettingName',
    'companyCustomerName',
    'amount',
    'consumptionStatus',
    'actions',
  ];

  ConsumptionStatus = ConsumptionStatus;

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    return this.getUseCase
      .execute(this.paginationParams())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.mealConsumptions.set(response.items);
          this.mealConsumptionConfig.update((current) => {
            current.totalRecords = response.totalCount;
            current.pageIndex = response.pageIndex - 1; // API uses 1-based, Material uses 0-based
            current.pageSize = response.pageSize;
            return current;
          });
        },
        error: (error) => {
          console.error('Error loading meal consumptions:', error);
          void Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los consumos',
          });
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.paginationParams.update((current) => {
      current.pageIndex = event.pageIndex + 1;
      current.pageSize = event.pageSize;
      return current;
    });
    this.mealConsumptionConfig.update((current) => {
      current.pageIndex = event.pageIndex;
      current.pageSize = event.pageSize;
      return current;
    });
    this.load();
  }

  async deleteConsumption(consumption: MealConsumption): Promise<void> {
    const result = await Swal.fire({
      title: '¿Está seguro/a de eliminar este consumo?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      this.isLoading.set(true);
      this.deleteUseCase
        .execute({ id: consumption.id })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            if (response.code === '1') {
              void Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: response.message || 'Consumo eliminado correctamente',
                timer: 2000,
              });
              this.load();
            } else {
              void Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message || 'No se pudo eliminar el consumo',
              });
            }
          },
          error: (error) => {
            console.error('Error deleting consumption:', error);
            void Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al eliminar el consumo',
            });
          },
        });
    }
  }

  async cancelConsumption(consumption: MealConsumption): Promise<void> {
    const result = await Swal.fire({
      title: '¿Está seguro/a de anular este consumo?',
      icon: 'warning',
      html: `<input type="text" id="motivoAnulacion" class="swal2-input" placeholder="Ingrese el motivo" />`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      preConfirm: () => {
        const input = document.getElementById('motivoAnulacion') as HTMLInputElement;
        const motivo = input?.value;
        if (!motivo) {
          Swal.showValidationMessage('Debe ingresar el motivo de anulación');
          return false;
        }
        return motivo;
      },
    });

    if (result.isConfirmed && result.value) {
      this.isLoading.set(true);
      const cancellationReason = result.value as string;
      this.cancelUseCase
        .execute({ id: consumption.id, cancellationReason })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            if (response.code === '1') {
              void Swal.fire({
                icon: 'success',
                title: 'Anulado',
                text: response.message || 'Consumo anulado correctamente',
                timer: 2000,
              });
              this.load();
            } else {
              void Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message || 'No se pudo anular el consumo',
              });
            }
          },
          error: (error) => {
            console.error('Error canceling consumption:', error);
            void Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al anular el consumo',
            });
          },
        });
    }
  }

  getStatusLabel(status: ConsumptionStatus): string {
    switch (status) {
      case ConsumptionStatus.Completed:
        return 'Completado';
      case ConsumptionStatus.Cancelled:
        return 'Anulado';
      case ConsumptionStatus.Pending:
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  }

  getStatusClass(status: ConsumptionStatus): string {
    switch (status) {
      case ConsumptionStatus.Completed:
        return 'status-completed';
      case ConsumptionStatus.Cancelled:
        return 'status-cancelled';
      case ConsumptionStatus.Pending:
        return 'status-pending';
      default:
        return '';
    }
  }
}

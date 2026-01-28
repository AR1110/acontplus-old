import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GetMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/get-meal-consumption-use-case';
import { CreateMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/create-meal-consumption.use-case';
import { UpdateMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/update-meal-consumption.use-case';
import { DeleteMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/delete-meal-consumption.use-case';
import { CancelMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/cancel-meal-consumption.use-case';
import { PrintMealConsumptionUseCase } from '@restaurant/application/use-cases/meal-consumption/print-meal-consumption.use-case';
import { GetCancellationDetailsUseCase } from '@restaurant/application/use-cases/meal-consumption/get-cancellation-details.use-case';
import { SearchCustomerUseCase } from '@restaurant/application/use-cases/meal-consumption/search-customer.use-case';
import { CreateMealConsumptionForOtherDateUseCase } from '@restaurant/application/use-cases/meal-consumption/create-meal-consumption-for-other-date.use-case';
import { PaginationParams } from '@acontplus/core';
import { Button, Pagination, DynamicCard } from '@acontplus/ng-components';
import {
  MealConsumption,
  ConsumptionStatus,
  CustomerSearchResult,
  MealScheduleForCustomer,
} from '@restaurant/data/models/meal-consumption';
import { MatDialog } from '@angular/material/dialog';
import { MealConsumptionOtherDatesDialog } from '../meal-consumption-other-dates-dialog/meal-consumption-other-dates-dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
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
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { GetMealScheduleSettingsUseCase } from '@restaurant/application/use-cases/meal-schedule-setting/get-meal-schedule-settings.use-case';
import { MealScheduleSetting } from '@restaurant/data/models/meal-schedule-setting';

@Component({
  selector: 'app-meal-consumption-list',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatCheckbox,
    DynamicCard,
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
    MatPaginator,
    MatFormField,
    MatLabel,
    MatSuffix,
    MatInput,
    MatSelect,
    MatOption,
    DatePipe,
    BreadcrumbComponent,
    Button,
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
  private readonly getMealScheduleSettingsUseCase = inject(GetMealScheduleSettingsUseCase);
  private readonly printUseCase = inject(PrintMealConsumptionUseCase);
  private readonly getCancellationDetailsUseCase = inject(GetCancellationDetailsUseCase);
  private readonly searchCustomerUseCase = inject(SearchCustomerUseCase);
  private readonly createForOtherDateUseCase = inject(CreateMealConsumptionForOtherDateUseCase);
  private readonly dialog = inject(MatDialog);

  mealConsumptionConfig = signal(new Pagination(0, 10, 5, [5, 10, 25, 50]));
  mealSchedulSettings = signal<MealScheduleSetting[]>([]);
  selectedConfigId = signal<number>(0);
  searchControl = new FormControl<string>('');

  // Customer search and registration
  customer = signal<CustomerSearchResult | null>(null);
  schedules = signal<MealScheduleForCustomer[]>([]);
  clientSearchControl = new FormControl<string>('');
  audioElement?: HTMLAudioElement;

  paginationParams = signal(
    new PaginationParams({
      pageIndex: this.mealConsumptionConfig().pageIndex,
      pageSize: this.mealConsumptionConfig().pageSize,
      searchTerm: '',
    }),
  );
  mealConsumptions = signal<MealConsumption[]>([]);

  // Table configuration
  displayedColumns = [
    'consumptionDate',
    'mealScheduleSettingName',
    'customerName',
    'amount',
    'status',
    'actions',
  ];

  ConsumptionStatus = ConsumptionStatus;

  ngOnInit(): void {
    this.loadConfigurations();
    // this.load();
    // Initialize audio element for consumption confirmation sound
    this.audioElement = new Audio('/assets/audio/consumotpv.mp3');
  }

  loadConfigurations(): void {
    const establishmentId = 421;
    this.getMealScheduleSettingsUseCase.execute(establishmentId).subscribe({
      next: (response) => {
        console.log('Meal schedule settings:', response);
        const configs = response ?? [];
        configs.push({
          displayOrder: 0,
          endTime: '',
          mealCode: 'All',
          startTime: '',
          id: 0,
          establishmentId: 0,
          description: 'Consolidado',
          onTime: false,
          isActive: true,
        });
        this.mealSchedulSettings.set(configs);

        // Auto-select the current active service
        const activeConfig = configs.find((c) => c.onTime);
        if (activeConfig) {
          this.selectedConfigId.set(activeConfig.id);
        } else {
          this.selectedConfigId.set(configs[0]?.id ?? 0);
        }
        this.load();
      },
      error: (error) => {
        console.error('Error loading configurations:', error);
      },
    });
  }

  onConfigurationChange(configId: number): void {
    this.selectedConfigId.set(configId);
    this.load();
  }

  load() {
    this.paginationParams().filters = {
      establishmentId: 421,
      mealScheduleSettingId: this.selectedConfigId(),
    };

    return this.getUseCase.execute(this.paginationParams()).subscribe({
      next: (response) => {
        this.mealConsumptions.set(response.items);
        this.mealConsumptionConfig.update((current) => {
          current.totalRecords = response.totalCount;
          current.pageIndex = response.pageIndex - 1; // API uses 1-based, Material uses 0-based
          current.pageSize = response.pageSize;
          return current;
        });
        console.log('Meal consumptions loaded:', this.mealConsumptions());
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
      this.deleteUseCase.execute({ id: consumption.id }).subscribe({
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
      const cancellationReason = result.value as string;
      this.cancelUseCase.execute({ id: consumption.id, cancellationReason }).subscribe({
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

  async printConsumption(consumption: MealConsumption): Promise<void> {
    this.printUseCase.execute({ id: consumption.id }).subscribe({
      next: (response) => {
        if (response.payload) {
          try {
            const printData = JSON.parse(response.payload);
            console.log('Print data:', printData);
            // TODO: Integrate with actual print service
          } catch (error) {
            console.error('Error parsing print data:', error);
          }
        }
      },
      error: (error) => {
        console.error('Error printing consumption:', error);
        void Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al imprimir el consumo',
        });
      },
    });
  }

  async getCancellationReason(consumption: MealConsumption): Promise<void> {
    this.getCancellationDetailsUseCase.execute({ id: consumption.id }).subscribe({
      next: (response) => {
        if (response.code === '1' && response.details) {
          void Swal.fire({
            title: 'Motivo Anulación',
            icon: 'info',
            text: response.details.cancellationReason,
            allowOutsideClick: false,
          });
        } else {
          void Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: response.message || 'No se encontró información de anulación',
          });
        }
      },
      error: (error) => {
        console.error('Error getting cancellation reason:', error);
        void Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener el motivo de anulación',
        });
      },
    });
  }

  getStatusLabel(status: ConsumptionStatus): string {
    console.log('getStatusLabel:', status);
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

  // Customer search and registration methods
  searchCustomer(event?: KeyboardEvent): void {
    const searchValue = this.clientSearchControl.value?.trim();

    if (!searchValue) {
      void Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debe ingresar el número de identificación',
      });
      return;
    }

    this.customer.set(null);
    this.schedules.set([]);

    this.searchCustomerUseCase.execute({ searchTerm: searchValue }).subscribe({
      next: (response) => {
        this.clientSearchControl.setValue('');

        if (response.customer) {
          this.customer.set(response.customer);
          this.schedules.set(response.schedules ?? []);

          if (response.customer.idEmpresa === 0) {
            void Swal.fire({
              icon: 'warning',
              title: 'Advertencia',
              text: 'Cliente aún no tiene asignada una empresa',
            });
          } else if (event && response.customer.idEmpresa > 0) {
            // Auto-save if enter was pressed and has company-page
            this.autoSaveAvailableServices();
          }
        }
      },
      error: (error) => {
        console.error('Error searching customer:', error);
        void Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al buscar el cliente',
        });
      },
    });
  }

  autoSaveAvailableServices(): void {
    const onTimeSchedules = this.schedules().filter((s) => s.onTime && !s.isActive);
    if (onTimeSchedules.length > 0) {
      // Auto-save the first available service
      void this.askToSave(onTimeSchedules[0]);
    }
  }

  async askToSave(schedule: MealScheduleForCustomer): Promise<void> {
    const customer = this.customer();
    if (!customer || customer.idEmpresa === 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Cliente aún no tiene asignada una empresa',
      });
      return;
    }

    if (schedule.mealScheduleSettingId <= 0) {
      void Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Aún no se ha guardado este servicio',
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Está seguro/a de guardar este consumo?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      html: `<div class="col-12">
        <div class="form-group">
          <label for="cantidadConsumo">Cantidad:</label>
          <input type="number" id="cantidadConsumo" onfocus="this.select();"
                 class="form-control text-center" value="1" min="1" />
        </div>
      </div>`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      preConfirm: () => {
        const input = document.getElementById('cantidadConsumo') as HTMLInputElement;
        const cantidad = input?.value;
        if (!cantidad || Number(cantidad) < 1) {
          Swal.showValidationMessage('Debe ingresar una cantidad válida');
          return false;
        }
        return Number(cantidad);
      },
    });

    if (result.isConfirmed && result.value) {
      this.saveConsumption(schedule, result.value as number);
    }
  }

  saveConsumption(schedule: MealScheduleForCustomer, cantidad: number): void {
    const customer = this.customer();
    if (!customer) return;

    const request = {
      mealScheduleSettingId: schedule.mealScheduleSettingId,
      companyCustomerMealPlanId: customer.idCliente,
      consumptionDate: new Date(),
      amount: cantidad,
      consumptionStatus: ConsumptionStatus.Pending,
      onTime: schedule.onTime,
      idCliente: customer.idCliente,
    };

    this.createUseCase.execute(request).subscribe({
      next: (response) => {
        if (response.code === '1') {
          if (response.data) {
            this.printConsumptionData(JSON.stringify(response.data));
          }

          void Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: response.message ?? 'Consumo guardado correctamente',
            timer: 2000,
          });

          this.playSound();
          this.resetRegistrationForm();
          this.load(); // Refresh the list
        } else {
          void Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message ?? 'No se pudo guardar el consumo',
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

  openOtherDatesDialog(schedule: MealScheduleForCustomer): void {
    const customer = this.customer();
    if (!customer) return;

    const dialogRef = this.dialog.open(MealConsumptionOtherDatesDialog, {
      width: '600px',
      data: {
        schedule,
        customer,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.playSound();
        this.resetRegistrationForm();
        this.load(); // Refresh the list
      }
    });
  }

  printConsumptionData(payload: string): void {
    try {
      const printData = JSON.parse(payload);
      console.log('Print data:', printData);
      // TODO: Call actual print service
    } catch (error) {
      console.error('Error printing:', error);
    }
  }

  playSound(): void {
    if (this.audioElement) {
      this.audioElement.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    }
  }

  resetRegistrationForm(): void {
    this.clientSearchControl.setValue('');
    this.customer.set(null);
    this.schedules.set([]);
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  }
}

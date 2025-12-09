import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
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
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { GetMealScheduleSettingsUseCase } from '@restaurant/application/use-cases/meal-schedule-setting/get-meal-schedule-settings.use-case';
import { DeleteMealScheduleSettingUseCase } from '@restaurant/application/use-cases/meal-schedule-setting/delete-meal-schedule-setting.use-case';
import { MatDialog } from '@angular/material/dialog';
import { MealScheduleSetting } from '@restaurant/domain/models/meal-schedule-setting';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MealScheduleSettingDialog } from '@restaurant/ui/meal-schedule-setting/meal-schedule-setting-dialog/meal-schedule-setting-dialog';

@Component({
  selector: 'app-meal-schedule-setting-list',
  imports: [
    MatButton,
    DynamicCard,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatSlideToggle,
    MatTable,
  ],
  templateUrl: './meal-schedule-setting-list.html',
  styleUrl: './meal-schedule-setting-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealScheduleSettingList implements OnInit {
  private readonly getMealScheduleSettingsUseCase = inject(GetMealScheduleSettingsUseCase);
  private readonly deleteMealScheduleSettingUseCase = inject(DeleteMealScheduleSettingUseCase);
  private readonly matDialog = inject(MatDialog);

  // State with signals
  settings = signal<MealScheduleSetting[]>([]);
  isLoading = signal<boolean>(false);
  establishmentId = signal<number>(1); // TODO: Get from user context/session

  // Table configuration
  displayedColumns = ['description', 'startTime', 'endTime', 'displayOrder', 'isActive', 'actions'];

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading.set(true);
    this.getMealScheduleSettingsUseCase
      .execute(this.establishmentId())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (settings) => {
          this.settings.set(settings);
        },
        error: (error) => {
          console.error('Error loading meal schedule settings:', error);
          void Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar las configuraciones de horarios de comida',
          });
        },
      });
  }

  openDialog(setting?: MealScheduleSetting) {
    const dialogRef = this.matDialog.open(MealScheduleSettingDialog, {
      width: '600px',
      data: {
        setting,
        establishmentId: this.establishmentId(),
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSettings();
      }
    });
  }

  async deleteSetting(setting: MealScheduleSetting): Promise<void> {
    const result = await Swal.fire({
      title: '¿Está seguro/a de eliminar esta configuración?',
      text: `Se eliminará la configuración de ${setting.description}`,
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
      this.deleteMealScheduleSettingUseCase
        .execute({ id: setting.id })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            if (response.code === '1') {
              void Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: response.message || 'Configuración eliminada correctamente',
                timer: 2000,
              });
              this.loadSettings();
            } else {
              void Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message || 'No se pudo eliminar la configuración',
              });
            }
          },
          error: (error) => {
            console.error('Error deleting meal schedule setting:', error);
            void Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al eliminar la configuración',
            });
          },
        });
    }
  }

  formatTime(time: string): string {
    // Format HH:mm:ss to HH:mm
    return time.substring(0, 5);
  }
}

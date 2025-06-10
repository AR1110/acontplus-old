import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiResponse } from '@core/models/api-response';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import {
  ajustarFechaEmisionModificada,
  dateIsAfterCurrentDate,
  formatDateToString,
  isDateValid,
} from '@core/utils/date.util';
import { isValidField } from '@core/utils/utils';

import { VehicleWebRepository } from '@mechanical/data/vehicle/vehicle-web.repository';
import { VehicleAddEditDirective } from '@mechanical/ui/directives/vehicle-add-edit.directive';
import { SupportUseCase } from '@mechanical/application/use-cases/support.use-case';
import { distinctUntilChanged, finalize, Observable, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatIconModule } from '@angular/material/icon';

interface PuntoEmision {
  establecimientoId: number;
  puntoEmisionId: number;
  ptoEmi: string;
  sequence: string;
}
interface Estab {
  establecimientoId: number;
  nombreComercial: string;
}
interface UserAssigned {
  userAssignedId: number;
  userName: string;
}

@Component({
  selector: 'app-support-add-edit-modal',
  imports: [
    CommonModule,

    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AsyncPipe,
    MatCustomDialogComponent,
    VehicleAddEditDirective,
  ],
  templateUrl: './support-add-edit-modal.component.html',
  providers: [provideNativeDateAdapter()],
})
export class SupportAddEditModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SupportAddEditModalComponent>);
  readonly params = inject<{
    id: number;
    descripcion: null | string;
  }>(MAT_DIALOG_DATA);

  supportUseCase = inject(SupportUseCase);
  vehicleSvc = inject(VehicleWebRepository);
  tS = inject(ToastrNotificationService);

  loading = signal(false);

  titleModal = signal('Nuevo Soporte');
  btnText = signal('Guardar');

  establishments = signal<Estab[]>([]);
  emissionPoints = signal<PuntoEmision[]>([]);
  cloneEmissionPoints = signal<PuntoEmision[]>([]);
  users = signal<UserAssigned[]>([]);

  data = {
    establecimientoId: 0,
    puntoEmisionId: 0,
    fechaEmision: new Date(),
    fechaEmisionDocCreado: null as Date | null,
    sequence: null as null | string,
    userAssignedId: 0,
    obs: null,
    vehicleCompanyId: 0,
    customerId: 0,
  };

  vehicle = {
    brand: '',
    model: '',
    licensePlate: '',
  };

  filteredCustomerVehicleLoading = signal(false);
  filteredCustomerVehicleFormControl = new FormControl<null | string>(null);
  filteredCustomerVehicles!: Observable<any[]>;

  successResponse = (response: ApiResponse) => {
    if (response.code === '0') {
      this.tS.toastr({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this.tS.toastr({
        type: 'success',
        message: response.message,
      });

      this.dialogRef.close(response);
    }
  };

  ngOnInit(): void {
    this.loading.set(true);
    this.supportUseCase
      .getDataForm()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.establishments.set(response.establishments);
        this.cloneEmissionPoints.set(response.emissionPoints);
        this.users.set(response.users);

        if (this.params.id > 0) {
          this.titleModal.set('Editar Soporte');
          this.btnText.set('Actualizar');

          this.loading.set(true);
          this.supportUseCase
            .getId(this.params.id)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe((value) => {
              this.data = value.data as any;

              this.vehicle = value.vehicle as any;
              const emissionPoints = this.cloneEmissionPoints().filter(
                (e) => e.establecimientoId === this.data.establecimientoId
              );
              this.emissionPoints.set(emissionPoints);

              this.filteredCustomerVehicleFormControl.setValue(
                value.customer.tradeName
              );
            });
          return;
        }
        this.data.establecimientoId =
          this.establishments().length > 0
            ? this.establishments()[0].establecimientoId
            : 0;
        this.onChangeEstab();
      });

    this.filteredCustomerVehicles =
      this.filteredCustomerVehicleFormControl.valueChanges.pipe(
        distinctUntilChanged(),
        switchMap((val) => {
          if (val && val.length > 2) {
            return this._filterCustomerVehicle(val);
          }
          return [];
        })
      );
  }

  private _filterCustomerVehicle(value: string) {
    this.filteredCustomerVehicleLoading.set(true);
    return this.supportUseCase.search({ textSearch: value }).pipe(
      finalize(() => {
        this.filteredCustomerVehicleLoading.set(false);
      })
    );
  }

  onChangeEstab() {
    const emissionPoints = this.cloneEmissionPoints().filter(
      (e) => e.establecimientoId === this.data.establecimientoId
    );
    this.emissionPoints.set(emissionPoints);

    if (this.emissionPoints().length > 0) {
      this.data.puntoEmisionId = this.emissionPoints()[0].puntoEmisionId;
      this.generateSequence();
    }
  }
  generateSequence() {
    const dataPuntoEmision = this.emissionPoints().find(
      (p) => p.puntoEmisionId === this.data.puntoEmisionId
    );
    if (dataPuntoEmision) {
      this.data.sequence =
        dataPuntoEmision.ptoEmi + '-' + dataPuntoEmision.sequence;
    }
  }

  onSelectCustomerVehicle(item: any) {
    this.getDataVehicleById(item.id);
  }

  getDataVehicleById(id: number) {
    this.vehicleSvc.getId(id).subscribe((response) => {
      const { customer, vehicle } = response;
      this.data.vehicleCompanyId = id;
      this.data.customerId = customer.id;
      this.vehicle = vehicle as any;

      this.filteredCustomerVehicleFormControl.setValue(customer.businessName);
    });
  }
  resultModalVehicle($event: any) {
    this.getDataVehicleById($event.id);
  }

  private isValidForm() {
    if (!(this.data.establecimientoId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el establecimiento!',
      });
      return;
    }

    if (!(this.data.puntoEmisionId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el punto de emisión!',
      });
      return;
    }

    if (!isDateValid(this.data.fechaEmision)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese una fecha válida',
      });
      return;
    }

    if (dateIsAfterCurrentDate(this.data.fechaEmision)) {
      this.tS.toastr({
        type: 'warning',
        message:
          'La fecha de emisión del documento no puede ser posterior a la fecha actual.',
      });
      return;
    }

    const ajusteFechaEmision = ajustarFechaEmisionModificada({
      fechaEmision: this.data.fechaEmision,
      fechaEmisionDocCreado: this.data.fechaEmisionDocCreado,
      setHoursZero: true,
    });

    if (ajusteFechaEmision) {
      this.data.fechaEmision = ajusteFechaEmision;
    } else {
      console.log('Error al justar la fecha de Emisión');
      return;
    }

    if (!(this.data.customerId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el cliente.',
      });
      return;
    }
    if (!(this.data.vehicleCompanyId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el vehículo.',
      });
      return;
    }

    if (!(this.data.userAssignedId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el técnico encargado.',
      });
      return;
    }

    if (!isValidField(this.data.obs)) {
      this.tS.toastr({
        type: 'warning',
        message:
          'Ingrese una breve descripción del soporte que se va a realizar.',
      });
      return;
    }

    return true;
  }

  private executeSave(secuencial?: string) {
    if (!this.isValidForm()) return;

    const textAction = this.params.id > 0 ? 'actualizar' : 'guardar';

    const txtSecuencial = secuencial
      ? ` Nro. Documento: ${secuencial}`
      : this.data.sequence;

    Swal.fire({
      // title: "Are you sure?",
      text: `¿Estás seguro de ${textAction} este documento ${txtSecuencial}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!',
      cancelButtonText: 'No!',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const data = {
            puntoEmisionId: this.data.puntoEmisionId,
            vehicleCompanyId: this.data.vehicleCompanyId,
            customerId: this.data.customerId,
            supportTypeId: 0,
            userAssignedId: this.data.userAssignedId,
            obs: this.data.obs,
            date: formatDateToString(this.data.fechaEmision),
          };

          if (!(this.params.id > 0)) {
            this.supportUseCase.post(data).subscribe(this.successResponse);
          }

          if (this.params.id > 0) {
            this.supportUseCase
              .put(this.params.id, data)
              .subscribe(this.successResponse);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  async save() {
    if (!(this.params.id > 0)) {
      this.supportUseCase
        .generateSequential(this.data.puntoEmisionId)
        .subscribe((res) => {
          this.executeSave(res);
        });
    } else {
      this.executeSave();
    }
  }

  close() {
    this.dialogRef.close();
  }
}

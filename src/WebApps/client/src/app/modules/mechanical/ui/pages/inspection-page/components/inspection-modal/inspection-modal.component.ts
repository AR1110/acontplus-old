import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { VEHICLE_PART_TYPE_CODE } from '@mechanical/domain/enums/mechanical.enum';
import { VehiclePart } from '@mechanical/domain/models/vehicle-part';
import { VehiclePartType } from '@mechanical/domain/models/vehicle-part-type';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import {
  ajustarFechaEmisionModificada,
  dateIsAfterCurrentDate,
  formatDateToString,
  isDateValid,
} from '@core/utils/date.util';
import { isValidField } from '@core/utils/utils';
import { MatChipsModule } from '@angular/material/chips';
import { InspectionUseCase } from '@mechanical/application/use-cases/inspection.use-case';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { firstValueFrom } from 'rxjs';

type VehiclePartNode = VehiclePart & {
  status: number;
  obs: string;
};
type VehiclePartTypeNode = VehiclePartType & {
  isCollapsed: boolean;
  nodes: VehiclePartNode[];
};
@Component({
  selector: 'app-inspection-modal',
  imports: [
    FormsModule,
    MatButtonToggleModule,
    MatChipsModule,
    Button,
    MatCustomDialogComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIcon,
    MatExpansionModule,
  ],
  templateUrl: './inspection-modal.component.html',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<InspectionModalComponent>);
  params = inject<{
    supportId: 0;
    inspectionId: 0;
  }>(MAT_DIALOG_DATA);

  _inspectionUseCase = inject(InspectionUseCase);
  tS = inject(ToastrNotificationService);

  titleModal = 'Registro Inspección';
  btnText = 'Guardar';
  icon = 'save';

  vehiclePartTypes: VehiclePartType[] = [];
  vehiclePartTypeNodes = signal<VehiclePartTypeNode[]>([]);
  vehicleParts: VehiclePart[] = [];

  support = {
    supportId: 0,
    sequence: '',
    brand: '',
    vehicleType: '',
    model: '',
    color: '',
    engine: '',
  };

  data = {
    id: 0,
    fechaEmision: new Date(),
    mileage: '',
    fuelLevel: '',
    obs: '',
    fechaEmisionDocCreado: null as null | Date,
  };

  successResponse = (response: any) => {
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

      this.dialogRef.close(response);
    }
  };

  addEventDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.data.fechaEmision = new Date(event.value);
    }
  }

  ngOnInit(): void {
    this.loadInspectionData().catch((error) =>
      console.error('Error al cargar datos de inspección:', error),
    );
  }

  private async loadInspectionData(): Promise<void> {
    const { supportId, inspectionId } = this.params;

    const response = await firstValueFrom(this._inspectionUseCase.getDataForm(supportId));
    this.support = response.support;
    this.vehiclePartTypes = response.vehiclePartTypes;
    this.vehicleParts = response.vehicleParts;

    if (inspectionId > 0) {
      this.btnText = 'Actualizar';
      this.icon = 'edit';

      const inspectionResponse = await firstValueFrom(this._inspectionUseCase.getId(inspectionId));
      this.data = inspectionResponse.data;

      const vehiclePartTypeNodes = this.buildVehiclePartTypeNodes(
        inspectionResponse.vehicleParts,
        true,
      );
      this.vehiclePartTypeNodes.set(vehiclePartTypeNodes);
    } else {
      const vehiclePartTypeNodes = this.buildVehiclePartTypeNodes(this.vehicleParts);
      this.vehiclePartTypeNodes.set(vehiclePartTypeNodes);
    }
  }

  private buildVehiclePartTypeNodes(vehicleParts: any[], checkStatus = false): any[] {
    return this.vehiclePartTypes.map((item) => {
      const nodes = vehicleParts.filter(
        (vp) => vp.vehiclePartTypeId === item.id,
      ) as VehiclePartNode[];

      const isCollapsed = checkStatus ? !nodes.some((n) => [1, 2, 3].includes(n.status)) : true;

      return {
        ...item,
        nodes,
        isCollapsed,
      };
    });
  }

  isValidForm() {
    if (!isDateValid(this.data.fechaEmision)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese una fecha válida',
      });
      return;
    }

    if (dateIsAfterCurrentDate(this.data.fechaEmision)) {
      this.tS.show({
        type: 'warning',
        message: 'La fecha de emisión del documento no puede ser posterior a la fecha actual.',
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

    if (!isValidField(this.data.mileage)) {
      this.tS.show({ type: 'warning', message: 'Ingreso el kimoletraje' });
      return;
    }

    if (!isValidField(this.data.fuelLevel)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingreso el nivel de Combustible',
      });
      return;
    }

    // const isSelectedStatus = this.vehiclePartTypeNodes().some(vtn =>
    //   vtn.nodes.some(n => n.status == 1 || n.status == 2 || n.status == 3),
    // );
    // if (!isSelectedStatus) {
    //   this.tS.show({
    //     type: 'warning',
    //     message: 'Seleccione al menos un tipo de inspección',
    //   });
    //   return;
    // }

    return true;
  }
  private mapVehiclePart(item: VehiclePartNode) {
    return {
      vehiclePartTypeId: item.vehiclePartTypeId,
      id: item.id,
      description: item.description,
      obs: item.obs,
      status: item.status,
    };
  }

  save() {
    try {
      if (!this.isValidForm()) return;

      //motor
      const engine = this.vehiclePartTypeNodes()
        .find((item) => item.code === VEHICLE_PART_TYPE_CODE.MT)
        ?.nodes.map(this.mapVehiclePart);

      //cabina
      const cabin = this.vehiclePartTypeNodes()
        .find((item) => item.code === VEHICLE_PART_TYPE_CODE.CB)
        ?.nodes.map(this.mapVehiclePart);

      // Sistema de Transmisión
      const transmission = this.vehiclePartTypeNodes()
        .find((item) => item.code === VEHICLE_PART_TYPE_CODE.ST)
        ?.nodes.map(this.mapVehiclePart);

      // Rodamiento
      const bearing = this.vehiclePartTypeNodes()
        .find((item) => item.code === VEHICLE_PART_TYPE_CODE.RD)
        ?.nodes.map(this.mapVehiclePart);

      // Sistema de Frenos
      const brake = this.vehiclePartTypeNodes()
        .find((item) => item.code === VEHICLE_PART_TYPE_CODE.SF)
        ?.nodes.map(this.mapVehiclePart);

      // Sistema de Dirección
      const steering = this.vehiclePartTypeNodes()
        .find((item) => item.code === VEHICLE_PART_TYPE_CODE.SD)
        ?.nodes.map(this.mapVehiclePart);

      // Sistema de Suspensión
      const suspension = this.vehiclePartTypeNodes()
        .find((item) => item.code === VEHICLE_PART_TYPE_CODE.SS)
        ?.nodes.map(this.mapVehiclePart);

      // Sistema de luces
      const lighting = this.vehiclePartTypeNodes()
        .find((item) => item.code === VEHICLE_PART_TYPE_CODE.SL)
        ?.nodes.map(this.mapVehiclePart);
      const data = {
        engine: JSON.stringify(engine),
        cabin: JSON.stringify(cabin),
        transmission: JSON.stringify(transmission),
        bearing: JSON.stringify(bearing),
        brake: JSON.stringify(brake),
        steering: JSON.stringify(steering),
        suspension: JSON.stringify(suspension),
        lighting: JSON.stringify(lighting),
        supportId: this.support.supportId,
        mileage: this.data.mileage,
        fuelLevel: this.data.fuelLevel,
        date: formatDateToString(this.data.fechaEmision),
        obs: isValidField(this.data.obs),
      };
      if (this.params.inspectionId > 0) {
        this._inspectionUseCase.put(this.params.inspectionId, data).subscribe(this.successResponse);
      }
      if (!(this.params.inspectionId > 0)) {
        this._inspectionUseCase.post(data).subscribe(this.successResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}

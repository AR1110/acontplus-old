import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { VEHICLE_PART_TYPE_CODE } from '@modules/mechanical/enums/mechanical.enum';
import { VehiclePart } from '@modules/mechanical/models/vehicle-part';
import { VehiclePartType } from '@modules/mechanical/models/vehicle-part-type';
import { InspectionService } from '@modules/mechanical/services/inspection.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InputDateComponent } from '@shared/components/input-date/input-date.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { ajustarFechaEmisionModificada, dateIsAfterCurrentDate, formatDateToString, isDateValid } from '@core/utils/date.util';
import { isValidField } from '@core/utils/utils';
import { isApiResponse } from '@core/models/api-response';
import { MatChipsModule } from '@angular/material/chips';

type VehiclePartNode = VehiclePart & {
  status: number
  obs: string
}
type VehiclePartTypeNode = VehiclePartType & {
  isCollapsed: boolean
  nodes: VehiclePartNode[]
}
@Component({
  selector: 'app-inspection-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbAccordionModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatRadioModule,
    InputDateComponent,
    MatChipsModule
  ],
  templateUrl: './inspection-modal.component.html',
})
export class InspectionModalComponent {
  @Input() params = {
    supportId: 0,
    inspectionId: 0
  }
  modal = inject(NgbActiveModal)
  inspectionSvc = inject(InspectionService);
  tS = inject(ToasterService)

  titleModal = 'Registro Inspección'
  btnText = 'Guardar';


  vehiclePartTypes: VehiclePartType[] = []
  vehiclePartTypeNodes: VehiclePartTypeNode[] = []
  vehicleParts: VehiclePart[] = [];

  support = {
    supportId: 0,
    sequence: '',
    brand: '',
    vehicleType: '',
    model: '',
    color: '',
    engine: ''
  }

  data = {
    id: 0,
    fechaEmision: new Date(),
    mileage: '',
    fuelLevel: '',
    obs: '',
    fechaEmisionDocCreado: null as null | Date
  }

  successResponse = {
    next: (response: any) => {

      if (isApiResponse(response)) {
        if (response.code === "0") {
          this.tS.toastr({
            type: 'warning',
            message: response.message
          })
        }
        if (response.code === "1") {
          this.tS.toastr({
            type: 'success',
            message: response.message
          })

          this.modal.close(response)
        }
      }
    }
  }

  ngOnInit(): void {
    try {


      this.inspectionSvc.getDataForm(this.params.supportId).subscribe({
        next: (response) => {


          this.support = response.support;

          this.vehiclePartTypes = response.vehiclePartTypes;
          this.vehicleParts = response.vehicleParts;

          if (this.params.inspectionId > 0) {
            this.btnText = 'Actualizar';

            this.inspectionSvc.getId(this.params.inspectionId).subscribe({
              next: (response) => {

                this.data = response.data;
                let vehiclePartTypeNodes = this.vehiclePartTypes.map(item => {
                  let nodes = response.vehicleParts.filter((vp) => vp.vehiclePartTypeId === item.id) as VehiclePartNode[];
                  let isCollapsed = nodes.some(n => [1,2,3].includes(n.status))
                  console.log(isCollapsed, `${item.description}`)
                  return {
                    ...item,
                    nodes,
                    isCollapsed: !isCollapsed
                  }
                })
                console.log(vehiclePartTypeNodes)
                this.vehiclePartTypeNodes = vehiclePartTypeNodes;
              },
            })
          } else {
            this.vehiclePartTypeNodes = this.vehiclePartTypes.map(item => {
              let nodes = this.vehicleParts.filter((vp) => vp.vehiclePartTypeId === item.id) as VehiclePartNode[]
              return {
                ...item,
                nodes,
                isCollapsed: true
              }
            })
          }

        },
        error(err) {
          ;
          console.log(err)
        },
      })
    } catch (error) {
      ;
      console.log(error)
    }
  }

  isValidForm() {
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

    let ajusteFechaEmision = ajustarFechaEmisionModificada({
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
      this.tS.toastr({ type: 'warning', message: 'Ingreso el kimoletraje' });
      return;
    }

    if (!isValidField(this.data.fuelLevel)) {
      this.tS.toastr({ type: 'warning', message: 'Ingreso el nivel de Combustible' });
      return;
    }


    let isSelectedStatus = this.vehiclePartTypeNodes.some(vtn => (
      vtn.nodes.some(n => n.status == 1 || n.status == 2 || n.status == 3)
    ))
    if (!isSelectedStatus) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione al menos un tipo de inspección'
      })
      return
    }

    console.log(this.vehiclePartTypeNodes)
    return true;
  }
  private mapVehiclePart(item: VehiclePartNode) {
    return {
      vehiclePartTypeId: item.vehiclePartTypeId,
      id: item.id,
      description: item.description,
      obs: item.obs,
      status: item.status
    }
  }

  save() {
    try {
      if (!this.isValidForm()) return

      //motor
      let engine = this.vehiclePartTypeNodes.find((item) => item.code === VEHICLE_PART_TYPE_CODE.MT)?.nodes.map(this.mapVehiclePart);

      //cabina
      let cabin = this.vehiclePartTypeNodes.find((item) => item.code === VEHICLE_PART_TYPE_CODE.CB)?.nodes.map(this.mapVehiclePart);

      // Sistema de Transmisión
      let transmission = this.vehiclePartTypeNodes.find((item) => item.code === VEHICLE_PART_TYPE_CODE.ST)?.nodes.map(this.mapVehiclePart);

      // Rodamiento
      let bearing = this.vehiclePartTypeNodes.find((item) => item.code === VEHICLE_PART_TYPE_CODE.RD)?.nodes.map(this.mapVehiclePart);

      // Sistema de Frenos
      let brake = this.vehiclePartTypeNodes.find((item) => item.code === VEHICLE_PART_TYPE_CODE.SF)?.nodes.map(this.mapVehiclePart);

      // Sistema de Dirección
      let steering = this.vehiclePartTypeNodes.find((item) => item.code === VEHICLE_PART_TYPE_CODE.SD)?.nodes.map(this.mapVehiclePart);

      // Sistema de Suspensión
      let suspension = this.vehiclePartTypeNodes.find((item) => item.code === VEHICLE_PART_TYPE_CODE.SS)?.nodes.map(this.mapVehiclePart);

      // Sistema de luces
      let lighting = this.vehiclePartTypeNodes.find((item) => item.code === VEHICLE_PART_TYPE_CODE.SL)?.nodes.map(this.mapVehiclePart);
      let data = {
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
        obs: isValidField(this.data.obs)
      }
      if (this.params.inspectionId > 0) {

        this.inspectionSvc.put(this.params.inspectionId, data).subscribe(this.successResponse)
      }
      if (!(this.params.inspectionId > 0)) {

        this.inspectionSvc.post(data).subscribe(this.successResponse)
      }
    } catch (error) {

      console.log(error)
    }
  }
}

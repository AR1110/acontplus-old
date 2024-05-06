
import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, Input, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { ajustarFechaEmisionModificada, dateIsAfterCurrentDate } from '@core/utils/date.util';
import { formatDateMoment, isDateValid } from '@core/utils/format-date-moment';
import { isValidField } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupportService } from '@modules/mechanical/services/support.service';
import { VehicleService } from '@modules/mechanical/services/vehicle.service';
import { VehicleAddEditDirective } from '@modules/mechanical/directives/vehicle-add-edit.directive';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { InputDateComponent } from '@shared/components/input-date/input-date.component';
import { catchError, distinctUntilChanged, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';

interface PuntoEmision {
  establecimientoId: number
  puntoEmisionId: number
  ptoEmi: string
  sequence: string
}
interface Estab {
  establecimientoId: number
  nombreComercial: string
}
interface UserAssigned {
  userAssignedId: number
  userName: string
}

@Component({
  selector: 'app-support-add-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbTypeaheadModule, JsonPipe,
    InputDateComponent,
    VehicleAddEditDirective
  ],
  templateUrl: './support-add-edit-modal.component.html',
})
export class SupportAddEditModalComponent {
  @Input() params = {
    id: 0
  }

  modal = inject(NgbActiveModal);
  supportSvc = inject(SupportService)
  vehicleSvc = inject(VehicleService)
  tS = inject(ToasterService)

  titleModal = 'Nuevo Soporte';
  btnText = 'Guardar';

  establishments: Estab[] = [];
  emissionPoints: PuntoEmision[] = [];
  cloneEmissionPoints: PuntoEmision[] = [];
  users: UserAssigned[] = [];


  data = {
    establecimientoId: 0,
    puntoEmisionId: 0,
    fechaEmision: new Date(),
    fechaEmisionDocCreado: null as (Date | null),
    sequence: null as null | string,
    userAssignedId: 0,
    obs: null,
    vehicleCompanyId: 0,
    customerId: 0
  }


  dataSearchVehicle = {
    searching: false,
    searchFailed: false,
    model: '' as string | null
  }

  vehicle = {
    brand: '',
    model: '',
    licensePlate: ''
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
    },
    error(err: any) {

      console.log(err)
    }
  }

  ngOnInit(): void {

    this.supportSvc.getDataForm().subscribe({
      next: (response) => {

        this.establishments = response.establishments;
        this.cloneEmissionPoints = response.emissionPoints;
        this.users = response.users;

        if (this.params.id > 0) {
          this.titleModal = 'Editar Soporte';
          this.btnText = 'Actualizar';


          this.supportSvc.getId(this.params.id).subscribe({
            next: (value) => {
              this.data = value.data as any;

              this.vehicle = value.vehicle as any;
              this.emissionPoints = this.cloneEmissionPoints.filter(e => e.establecimientoId === this.data.establecimientoId);
              this.dataSearchVehicle.model = value.customer.tradeName;

            },
            error(err) {
              console.log(err)

            },
          })
          return
        }
        this.data.establecimientoId = this.establishments.length > 0 ? this.establishments[0].establecimientoId : 0
        this.onChangeEstab();



      },
      error(err) {

        console.log(err)
      },
    })
  }

  onChangeEstab() {
    this.emissionPoints = this.cloneEmissionPoints.filter(e => e.establecimientoId === this.data.establecimientoId);

    if (this.emissionPoints.length > 0) {
      this.data.puntoEmisionId = this.emissionPoints[0].puntoEmisionId;
      this.generateSequence()
    }
  }
  generateSequence() {
    let dataPuntoEmision = this.emissionPoints.find(p => p.puntoEmisionId === this.data.puntoEmisionId);
    if (dataPuntoEmision) {
      this.data.sequence = dataPuntoEmision.ptoEmi + '-' + dataPuntoEmision.sequence;

    }
  }

  //search client-vehicle

  search: OperatorFunction<string, Array<any>> = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => (this.dataSearchVehicle.searching = true)),
      switchMap((textSearch) => {
        if (!textSearch || textSearch.length < 2) {
          return of([]);
        }
        return this.supportSvc.searchCustomerVehicle({ textSearch }).pipe(
          tap(() => (this.dataSearchVehicle.searchFailed = false)),
          catchError((error) => {
            console.log(error);
            this.dataSearchVehicle.searchFailed = true;
            return of([]);
          })
        );
      }),
      tap(() => (this.dataSearchVehicle.searching = false))
    );

  formatter(x: { tradeName: string }) {
    if (typeof x === 'string') {
      return x;
    }
    return x.tradeName
  };

  onKeyupSearchCustomerVehicle() {
    if (!isValidField(this.dataSearchVehicle.model)) {
      this.data.vehicleCompanyId = 0
      this.data.customerId = 0
      this.vehicle = {} as any
    }

  }

  onSelectCustomerVehicle({ item }: any) {
    this.getDataVehicleById(item.id)
  }

  getDataVehicleById(id: number) {
    try {

      this.vehicleSvc.getId(id).subscribe({
        next: (response) => {
          this.data.vehicleCompanyId = id;
          this.data.customerId = response.customer.id;
          this.dataSearchVehicle.model = response.customer.businessName;
          this.vehicle = response.vehicle as any;
        },
        error(err) {
          console.log(err)

        },
      })
    } catch (error) {
      console.log(error)
    }
  }
  resultModalVehicle($event: any) {
    this.getDataVehicleById($event.id);
  }

  private isValidForm() {
    if (!(this.data.establecimientoId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el establecimiento!'
      })
      return
    }

    if (!(this.data.puntoEmisionId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el punto de emisión!'
      })
      return
    }

    if (!isDateValid(this.data.fechaEmision)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese una fecha válida'
      })
      return
    }

    if (dateIsAfterCurrentDate(this.data.fechaEmision)) {
      this.tS.toastr({
        type: 'warning',
        message: 'La fecha de emisión del documento no puede ser posterior a la fecha actual.'
      })
      return
    }

    let ajusteFechaEmision = ajustarFechaEmisionModificada({
      fechaEmision: this.data.fechaEmision,
      fechaEmisionDocCreado: this.data.fechaEmisionDocCreado,
      setHoursZero: true
    });

    if (ajusteFechaEmision) {
      this.data.fechaEmision = ajusteFechaEmision;
    } else {
      console.log('Error al justar la fecha de Emisión')
      return
    }

    if (!(this.data.customerId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el cliente.'
      })
      return
    }
    if (!(this.data.vehicleCompanyId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el vehículo.'
      })
      return
    }

    if (!(this.data.userAssignedId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el técnico encargado.'
      })
      return
    }

    if (!isValidField(this.data.obs)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese una breve descripción del soporte que se va a realizar.'
      })
      return
    }

    return true;

  }

  save() {
    if (!this.isValidForm()) return

    let textAction = this.params.id > 0 ? 'actualizar' : 'guardar'

    Swal.fire({
      // title: "Are you sure?",
      text: `¿Estás seguro de ${textAction} este documento?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí!",
      cancelButtonText: 'No!'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          let data = {

            puntoEmisionId: this.data.puntoEmisionId,
            vehicleCompanyId: this.data.vehicleCompanyId,
            customerId: this.data.customerId,
            supportTypeId: 0,
            userAssignedId: this.data.userAssignedId,
            obs: this.data.obs,
            date: formatDateMoment(this.data.fechaEmision),

          }

          if (!(this.params.id > 0)) {
            this.supportSvc.post(data).subscribe(this.successResponse)

          }

          if (this.params.id > 0) {

            this.supportSvc.put(this.params.id, data).subscribe(this.successResponse)

          }
        } catch (error) {

          console.log(error)
        }
      }
    });

  }

}

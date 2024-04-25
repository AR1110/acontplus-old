import { establecimientos } from './../../../../../technical-support/store/tech-spec.store';
import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupportService } from '@modules/mechanical/services/support.service';
import { VehicleAddEditDirective } from '@modules/mechanical/shared/directives/vehicle-add-edit.directive';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { InputDateComponent } from '@shared/components/input-date/input-date.component';
import { catchError, distinctUntilChanged, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';

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
  styleUrl: './support-add-edit-modal.component.css',
})
export class SupportAddEditModalComponent {

  modal = inject(NgbActiveModal);
  supportSvc = inject(SupportService)

  titleModal = 'Nuevo Soporte';
  btnText = 'Guardar';

  establishments: Estab[] = [];
  emissionPoints: PuntoEmision[] = [];
  cloneEmissionPoints: PuntoEmision[] = [];
  users: UserAssigned[] = [];


  data = {
    establecimientoId: 0,
    puntoEmisionId: 0,
    sequence: null as null | string,
    userAssignedId: 0,
    obs: null
  }

  dataSearchVehicle = {
    searching: false,
    searchFailed: false,
    model: ''

  }

  ngOnInit(): void {
    showLoader();
    this.supportSvc.getDataForm().subscribe({
      next: (response) => {
        hideLoader()
        this.establishments = response.establishments;
        this.cloneEmissionPoints = response.emissionPoints;
        this.users = response.users;

        if (this.establishments.length > 0) {
          this.data.establecimientoId = this.establishments[0].establecimientoId;
          this.onChangeEstab();
        }
      },
      error(err) {
        hideLoader()
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

  formatter = (x: { name: string }) => x.name;

  resultModalVehicle($event: any) {
    console.log($event)
  }

}

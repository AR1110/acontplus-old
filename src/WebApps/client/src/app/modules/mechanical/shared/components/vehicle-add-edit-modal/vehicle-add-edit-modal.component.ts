import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse, isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isValidField } from '@core/utils/utils';
import { CompanyCustomerSearchComponent } from '@modules/customer/company-customer/components/company-customer-search/company-customer-search.component';
import { VehicleTypeSelectHtmlOnly } from '@modules/mechanical/models/vehicle-type.model';
import { VehicleService } from '@modules/mechanical/services/vehicle.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vehicle-add-edit-modal',
  standalone: true,
  imports: [
    FormsModule,
    CompanyCustomerSearchComponent
  ],
  templateUrl: './vehicle-add-edit-modal.component.html',
  styles: ``
})
export class VehicleAddEditModalComponent {
  @Input() params = {
    id: 0
  }
  modal = inject(NgbActiveModal)
  vehicleSvc = inject(VehicleService);
  tS = inject(ToasterService)

  titleModal = 'Nuevo Vehículo';
  btnText = 'Guardar';

  countries: any = [];
  vehicleTypes: VehicleTypeSelectHtmlOnly[] = []

  customer: any = {}
  data = {
    customerId: 0,
    countryId: 0,
    vehicleTypeId: 0,
    licensePlate: null,
    brand: null,
    model: null,
    year: null,
    color: null,
    engine: null,
    chassis: null,
    cylindraje: null
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
      hideLoader()
      console.log(err)
    }
  }

  ngOnInit() {
    showLoader()
    this.vehicleSvc.getDataForm().subscribe({
      next: (response) => {
        hideLoader()
        const {
          countries,
          vehicleTypes
        } = response;
        this.countries = countries;
        this.vehicleTypes = vehicleTypes;

        if (this.params.id > 0) {
          this.titleModal = 'Editar Vehículo';
          this.btnText = 'Actualizar';
          showLoader()
          this.vehicleSvc.getId(this.params.id).subscribe({
            next: (response) => {
              hideLoader()
              this.customer = response.customer;
              this.data = {
                ...this.data,
                ...response.vehicle
              };
            },
            error(err) {
              console.log(err)
              hideLoader()
            }
          })
        }
      },
      error(err) {
        console.log(err)
        hideLoader()
      }
    })
  }

  isValidForm() {


    if (!(this.data.customerId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Cliente / Conductor'
      });
      return;
    }

    if (!(this.data.vehicleTypeId)) {
      this.tS.toastr({ type: 'warning', message: 'Seleccione el tipo de Vehículo' });
      return;
    }

    if (!(this.data.countryId > 0)) {
      this.tS.toastr({ type: 'warning', message: 'Selecccion el país' });
      return;
    }

    if (!isValidField(this.data.licensePlate)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese la Placa' });
      return;
    }

    if (!isValidField(this.data.brand)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese una marca' });
      return;
    }

    if (!isValidField(this.data.year)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese un año de fabricación' });
      return;
    }

    if (!isValidField(this.data.color)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese el color' });
      return;
    }

    if (!isValidField(this.data.engine)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese el Motor' });
      return;
    }

    if (!isValidField(this.data.chassis)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese el Chasis' });
      return;
    }
    if (!isValidField(this.data.cylindraje)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese el cilindraje' });
      return;
    }
    return true;
  };

  onSubmit() {
    try {
      if (!this.isValidForm()) return;

      let dataParams = {
        customer: this.customer,
        vehicle: this.data
      }
      if (!(this.params.id > 0)) {
        this.vehicleSvc.post(dataParams).subscribe(this.successResponse)
      }

      if (this.params.id > 0) {
        this.vehicleSvc.put(this.params.id, dataParams).subscribe(this.successResponse)
      }
    } catch (error) {
      console.log(error)
    }
  }










}

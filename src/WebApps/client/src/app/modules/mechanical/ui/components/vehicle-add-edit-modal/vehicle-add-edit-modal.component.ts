import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { isValidField } from '@core/utils/utils';
import { VehicleTypeSelectHtmlOnly } from '@mechanical/domain/models/vehicle-type.model';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { CompanyCustomerSearchComponent } from '@modules/customer/ui/company-customer/components/company-customer-search/company-customer-search.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { VehicleUseCase } from '@mechanical/application/use-cases/vehicle.use-case';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import {CompanyCustomer} from "@customer/domain/models/company-customer";

@Component({
  selector: 'app-vehicle-add-edit-modal',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    ToUpperCaseDirective,
    MatCustomDialogComponent,
    MatDynamicCardComponent,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './vehicle-add-edit-modal.component.html',
  styles: ``,
})
export class VehicleAddEditModalComponent {
  readonly dialogRef = inject(MatDialogRef<VehicleAddEditModalComponent>);
  readonly data = inject<{
    id: number;
    descripcion: null | string;
  }>(MAT_DIALOG_DATA);

  vehicleUseCase = inject(VehicleUseCase);
  tS = inject(ToasterService);

  titleModal = 'Nuevo Vehículo';
  btnText = 'Guardar';

  countries: any = [];
  vehicleTypes: VehicleTypeSelectHtmlOnly[] = [];

  loading = false;

  customer = {
    idType: '',
    idCard: '',
    cardTypeId: 0,
    businessName: '',
    tradeName: '',
    email: '',
    telephone: '',
    address: '',
  };
  dataForm = {
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
    cylindraje: null,
  };

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  myControlCountry = new FormControl<any>('');
  optionsCountry: any[] = [];
  filteredCountryOptions!: any[];

  successResponse = {
    next: (response: ApiResponse) => {
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
        let id = 0;
        if (this.data.id > 0) {
          id = this.data.id;
        } else {
          let data = JSON.parse(response.payload as string);
          if (Array.isArray(data) && data.length > 0) {
            id = data[0].id;
          }
        }
        this.dialogRef.close({ id });
      }
    },
    error(err: any) {
      // hideLoader()
      console.log(err);
    },
  };

  ngOnInit() {
    if (this.data.id > 0) {
      this.titleModal = 'Editar Vehículo';
      this.btnText = 'Actualizar';
    }

    this.loading = true;
    this.vehicleUseCase
      .getDataForm()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => {
        const { countries, vehicleTypes } = response;
        this.countries = countries;
        this.vehicleTypes = vehicleTypes;

        this.optionsCountry = countries;
        this.filteredCountryOptions = countries.slice();

        if (this.data.id > 0) {
          this.titleModal = 'Editar Vehículo';
          this.btnText = 'Actualizar';
          this.loading = true;
          this.vehicleUseCase
            .getId(this.data.id)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe((response) => {
              // hideLoader()
              this.customer = response.customer as any;
              this.dataForm = {
                ...this.dataForm,
                ...response.vehicle,
              };

              this.myControlCountry.setValue(this.dataForm.countryId as any);
            });
        }
      });
  }

  onCustomerSelected(dataForm: CompanyCustomer) {
    this.dataForm.customerId = dataForm.idCliente;
    this.customer.idType = dataForm.codigoSri!;
    this.customer.idCard = dataForm.numeroIdentificacion;
    // cardTypeId = e.idTipoIdentificacion;
    this.customer.businessName = dataForm.nombreComercial!;
    this.customer.tradeName = dataForm.nombreFiscal;
    this.customer.email = dataForm.correo!;
    this.customer.telephone = dataForm.telefono!;
    this.customer.address = dataForm.direccion!;
  }

  getCountryTitle(countryId: number) {
    return this.countries.find((item: any) => item.countryId === countryId)
      ?.description;
  }

  filterCountry(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredCountryOptions = this.optionsCountry.filter((o) =>
      o.description.toLowerCase().includes(filterValue),
    );
  }

  isValidForm() {
    if (!(this.dataForm.customerId > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Cliente / Conductor',
      });
      return;
    }

    if (!this.dataForm.vehicleTypeId) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el tipo de Vehículo',
      });
      return;
    }

    if (!(this.dataForm.countryId > 0 || this.myControlCountry.value > 0)) {
      this.tS.toastr({ type: 'warning', message: 'Selecccion el país' });
      return;
    }

    if (!isValidField(this.dataForm.licensePlate)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese la Placa' });
      return;
    }

    if (!isValidField(this.dataForm.brand)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese una marca' });
      return;
    }

    if (!isValidField(this.dataForm.year)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese un año de fabricación',
      });
      return;
    }

    if (!isValidField(this.dataForm.color)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese el color' });
      return;
    }

    if (!isValidField(this.dataForm.engine)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese el Motor' });
      return;
    }

    if (!isValidField(this.dataForm.chassis)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese el Chasis' });
      return;
    }
    if (!isValidField(this.dataForm.cylindraje)) {
      this.tS.toastr({ type: 'warning', message: 'Ingrese el cilindraje' });
      return;
    }
    return true;
  }

  onSubmit() {
    try {
      if (!this.isValidForm()) return;

      this.dataForm.countryId = this.myControlCountry.value as any;
      let dataParams = {
        customer: this.customer,
        vehicle: this.dataForm,
      };
      if (!(this.data.id > 0)) {
        this.vehicleUseCase.post(dataParams).subscribe(this.successResponse);
      }

      if (this.data.id > 0) {
        this.vehicleUseCase
          .put(this.data.id, dataParams)
          .subscribe(this.successResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}

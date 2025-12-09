import { Component, ElementRef, inject, signal, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isValidField } from '@core/utils/utils';
import { VehicleTypeSelectHtmlOnly } from '@mechanical/domain/models/vehicle-type.model';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { DynamicCard } from '@acontplus/ng-components';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { VehicleUseCase } from '@mechanical/application/use-cases/vehicle.use-case';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';

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
    DynamicCard,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './vehicle-add-edit-modal.component.html',
  styles: ``,
})
export class VehicleAddEditModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<VehicleAddEditModalComponent>);
  readonly data = inject<{
    id: number;
    descripcion: null | string;
  }>(MAT_DIALOG_DATA);

  vehicleUseCase = inject(VehicleUseCase);
  tS = inject(ToastrNotificationService);

  titleModal = signal('Nuevo Vehículo');
  btnText = signal('Guardar');

  countries = signal<any[]>([]);
  vehicleTypes = signal<VehicleTypeSelectHtmlOnly[]>([]);

  loading = signal(false);

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
  optionsCountry = signal<any[]>([]);
  filteredCountryOptions = signal<any[]>([]);

  successResponse = {
    next: (response: ApiResponseLegacy) => {
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
        let id = 0;
        if (this.data.id > 0) {
          id = this.data.id;
        } else {
          const data = JSON.parse(response.payload as string);
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
      this.titleModal.set('Editar Vehículo');
      this.btnText.set('Actualizar');
    }

    this.loading.set(true);
    this.vehicleUseCase
      .getDataForm()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        const { countries, vehicleTypes } = response;
        this.countries.set(countries);
        this.vehicleTypes.set(vehicleTypes);

        this.optionsCountry.set(countries);
        this.filteredCountryOptions.set(countries.slice());

        if (this.data.id > 0) {
          this.titleModal.set('Editar Vehículo');
          this.btnText.set('Actualizar');
          this.loading.set(true);
          this.vehicleUseCase
            .getId(this.data.id)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe((response) => {
              // hideLoader()
              this.customer = response.customer;
              this.dataForm = {
                ...this.dataForm,
                ...response.vehicle,
              };

              this.myControlCountry.setValue(this.dataForm.countryId as any);
            });
        }
      });
  }

  onCustomerSelected(dataForm: CompanyCustomerEntity) {
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
    return this.countries().find((item: any) => item.countryId === countryId)?.description;
  }

  filterCountry(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    const filteredCountryOptions = this.optionsCountry().filter((o) =>
      o.description.toLowerCase().includes(filterValue),
    );
    this.filteredCountryOptions.set(filteredCountryOptions);
  }

  isValidForm() {
    if (!(this.dataForm.customerId > 0)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Cliente / Conductor',
      });
      return;
    }

    if (!this.dataForm.vehicleTypeId) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el tipo de Vehículo',
      });
      return;
    }

    if (!(this.dataForm.countryId > 0 || this.myControlCountry.value > 0)) {
      this.tS.show({ type: 'warning', message: 'Selecccion el país' });
      return;
    }

    if (!isValidField(this.dataForm.licensePlate)) {
      this.tS.show({ type: 'warning', message: 'Ingrese la Placa' });
      return;
    }

    if (!isValidField(this.dataForm.brand)) {
      this.tS.show({ type: 'warning', message: 'Ingrese una marca' });
      return;
    }

    if (!isValidField(this.dataForm.year)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese un año de fabricación',
      });
      return;
    }

    if (!isValidField(this.dataForm.color)) {
      this.tS.show({ type: 'warning', message: 'Ingrese el color' });
      return;
    }

    if (!isValidField(this.dataForm.engine)) {
      this.tS.show({ type: 'warning', message: 'Ingrese el Motor' });
      return;
    }

    if (!isValidField(this.dataForm.chassis)) {
      this.tS.show({ type: 'warning', message: 'Ingrese el Chasis' });
      return;
    }
    if (!isValidField(this.dataForm.cylindraje)) {
      this.tS.show({ type: 'warning', message: 'Ingrese el cilindraje' });
      return;
    }
    return true;
  }

  onSubmit() {
    try {
      if (!this.isValidForm()) return;

      this.dataForm.countryId = this.myControlCountry.value;
      const dataParams = {
        customer: this.customer,
        vehicle: this.dataForm,
      };
      if (!(this.data.id > 0)) {
        this.vehicleUseCase.post(dataParams).subscribe(this.successResponse);
      }

      if (this.data.id > 0) {
        this.vehicleUseCase.put(this.data.id, dataParams).subscribe(this.successResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}

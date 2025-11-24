import { Component, inject, OnInit, signal } from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PetType } from '@modules/vet/models/pet-type.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isApiResponse } from '@core/models/api-response-legacy';
import { Pet } from '@modules/vet/models/pet.model';
import { PetService } from '@modules/vet/services/pet.service';
import { Breed } from '@modules/vet/models/breed.model';
import { Gender } from '@modules/vet/models/gender.model';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

@Component({
  selector: 'app-pet-modal',
  imports: [
    DynamicCard,
    FormsModule,
    ReactiveFormsModule,
    CompanyCustomerSearchComponent,
    Button,
    MatCustomDialogComponent,
  ],
  templateUrl: './pet-modal.component.html',
  styles: ``,
})
export class PetModalComponent implements OnInit {
  breeds = signal<Breed[]>([]);
  breedsFiltered = signal<Breed[]>([]);
  customerBusinessName = '';
  data = inject<Pet>(MAT_DIALOG_DATA);
  genders = signal<Gender[]>([]);
  modalIcon = 'add';
  modalTitle = 'Registrar Mascota';
  petTypes = signal<PetType[]>([]);
  petForm = new FormGroup({
    id: new FormControl(0),
    petTypeId: new FormControl(0, [Validators.required]),
    breedId: new FormControl(0, [Validators.required]),
    genderId: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.min(3)]),
    color: new FormControl(''),
    birthdate: new FormControl(''),
    customerCompanyId: new FormControl(0, [Validators.required]),
    enabled: new FormControl(true),
  });
  private readonly petService = inject(PetService);
  private readonly modalRef = inject(MatDialogRef<PetModalComponent>);
  private readonly tS = inject(ToastrNotificationService);

  get() {
    this.petService.get({ tipo: 3 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { petTypes, breeds, genders } = JSON.parse(response.payload as string);
        this.petTypes.set(petTypes);
        this.breeds.set(breeds);
        this.genders.set(genders);
      }
    });
  }

  ngOnInit(): void {
    this.get();
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Mascota';
      if (this.data?.customer != null) {
        this.customerBusinessName = this.data?.customer;
      }
      this.petForm.patchValue(this.data);
    }
  }

  onCustomerSelected(data: CompanyCustomerEntity) {
    this.petForm.patchValue({ customerCompanyId: data.idCliente });
  }

  onModalClose() {
    this.modalRef.close();
  }

  onPetTypeChange($event: any) {
    this.breedsFiltered.set([]);
    const breedsFiltered = this.breeds().filter((x) => x.petTypeId === Number($event.target.value));
    this.breedsFiltered.set(breedsFiltered);
  }

  onSave() {
    const dataToSave = {
      ...this.petForm.value,
    };

    if (this.data.id > 0) {
      this.petService.put(this.data.id, dataToSave).subscribe((response) => {
        if (isApiResponse(response)) {
          this.tS.show({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code == '1') {
            this.modalRef.close(response);
          }
        }
      });
    } else {
      this.petService.post(dataToSave).subscribe((response) => {
        if (isApiResponse(response)) {
          this.tS.show({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code == '1') {
            this.modalRef.close(response);
          }
        }
      });
    }
  }
}

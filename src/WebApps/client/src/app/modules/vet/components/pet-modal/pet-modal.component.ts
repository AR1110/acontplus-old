import { Component, inject } from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PetType } from '@modules/vet/models/pet-type.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '@core/services/toaster.service';
import { isApiResponse } from '@core/models/api-response';
import { Pet } from '@modules/vet/models/pet.model';
import { PetService } from '@modules/vet/services/pet.service';
import { Breed } from '@modules/vet/models/breed.model';
import { Gender } from '@modules/vet/models/gender.model';
import { CompanyCustomerSearchComponent } from '@customer/ui/company-customer/components/company-customer-search/company-customer-search.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-pet-modal',
  imports: [
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    CompanyCustomerSearchComponent,
    MatCard,
    MatCardContent,
    MatButton,
  ],
  templateUrl: './pet-modal.component.html',
  styles: ``,
})
export class PetModalComponent {
  breeds: Breed[] = [];
  breedsFiltered: Breed[] = [];
  customerBusinessName = '';
  data = {} as Pet;
  genders: Gender[] = [];
  modalIcon = 'add';
  modalTitle = 'Registrar Mascota';
  petTypes: PetType[] = [];
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
  private readonly modalRef = inject(NgbActiveModal);
  private readonly tS = inject(ToasterService);

  get() {
    this.petService.get({ tipo: 3 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { petTypes, breeds, genders } = JSON.parse(
          response.payload as string,
        );
        this.petTypes = petTypes;
        this.breeds = breeds;
        this.genders = genders;
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

  onCustomerSelected($event: any) {
    const { data } = $event;
    this.petForm.patchValue({ customerCompanyId: data.idCliente });
  }

  onModalClose() {
    this.modalRef.close();
  }

  onPetTypeChange($event: any) {
    this.breedsFiltered = [];
    let breedsToFilter = this.breeds;
    this.breedsFiltered = breedsToFilter.filter(
      (x) => x.petTypeId === Number($event.target.value),
    );
  }

  onSave() {
    const dataToSave = {
      ...this.petForm.value,
    };

    if (this.data.id > 0) {
      this.petService.put(this.data.id, dataToSave).subscribe((response) => {
        if (isApiResponse(response)) {
          this.tS.toastr({
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
          this.tS.toastr({
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

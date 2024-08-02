import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Breed } from '@modules/vet/models/breed.model';
import { PetType } from '@modules/vet/models/pet-type.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BreedService } from '@modules/vet/services/breed.service';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { PetTypeService } from '@modules/vet/services/pet-type.service';

@Component({
  selector: 'app-breed-modal',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './breed-modal.component.html',
  styles: ``,
})
export class BreedModalComponent {
  data = {} as Breed;
  modalIcon: IconProp = 'plus';
  modalTitle = 'Registrar Raza';
  petTypes: PetType[] = [];
  breedForm = new FormGroup({
    id: new FormControl(0),
    petTypeId: new FormControl(0, [Validators.required]),
    code: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.maxLength(5),
    ]),
    name: new FormControl('', [Validators.required, Validators.min(3)]),
    description: new FormControl(''),
    enabled: new FormControl(true),
  });
  private readonly breedService = inject(BreedService);
  private readonly modalRef = inject(NgbActiveModal);
  private readonly petTypeService = inject(PetTypeService);
  private readonly tS = inject(ToasterService);

  loadPetTypes() {
    this.petTypeService.get({}).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        this.petTypes = response.payload as PetType[];
      }
    });
  }

  ngOnInit(): void {
    this.loadPetTypes();
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Raza';
      this.breedForm.patchValue(this.data);
    }
  }

  onModalClose() {
    this.modalRef.close();
  }

  onSave() {
    const dataToSave = {
      ...this.breedForm.value,
    };

    if (this.data.id > 0) {
      this.breedService.put(this.data.id, dataToSave).subscribe((response) => {
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
      this.breedService.post(dataToSave).subscribe((response) => {
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

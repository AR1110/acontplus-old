import { Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { PetType } from '@modules/vet/models/pet-type.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PetTypeService } from '@modules/vet/services/pet-type.service';
import { ToasterService } from '@core/services/toaster.service';
import { isApiResponse } from '@core/models/api-response';
import { Pet } from '@modules/vet/models/pet.model';
import { PetService } from '@modules/vet/services/pet.service';

@Component({
  selector: 'app-pet-modal',
  standalone: true,
  imports: [FaIconComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './pet-modal.component.html',
  styles: ``,
})
export class PetModalComponent {
  customerSelected: any = {};
  data = {} as Pet;
  modalIcon: IconProp = 'plus';
  modalTitle = 'Registrar Mascota';
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
  private readonly petService = inject(PetService);
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

  onPetTypeChange($event: any) {}

  onSave() {
    const dataToSave = {
      ...this.breedForm.value,
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

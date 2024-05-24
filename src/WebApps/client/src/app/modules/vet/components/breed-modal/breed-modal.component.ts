import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Breed } from '@modules/vet/models/breed.model';
import { PetType } from '@modules/vet/models/pet-type.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BreedService } from '@modules/vet/services/breed.service';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-breed-modal',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './breed-modal.component.html',
  styles: ``,
})
export class BreedModalComponent {
  breed = {} as Breed;
  modalIcon: IconProp = 'plus';
  modalTitle = 'Registrar Mascota';
  petTypes: PetType[] = [];
  private readonly breedService = inject(BreedService);
  private readonly modalRef = inject(NgbActiveModal);
  private readonly tS = inject(ToasterService);

  onModalClose() {
    this.modalRef.close();
  }

  onSave() {
    this.breedService.post(this.breed).subscribe((response) => {
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

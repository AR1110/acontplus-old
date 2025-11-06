import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Breed } from '@modules/vet/models/breed.model';
import { PetType } from '@modules/vet/models/pet-type.model';
import { BreedService } from '@modules/vet/services/breed.service';
import { isApiResponse } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { PetTypeService } from '@modules/vet/services/pet-type.service';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

@Component({
  selector: 'app-breed-modal',
  imports: [ReactiveFormsModule, ThemeButtonComponent, MatCustomDialogComponent],
  templateUrl: './breed-modal.component.html',
  styles: ``,
})
export class BreedModalComponent implements OnInit {
  data = inject<Breed>(MAT_DIALOG_DATA);
  modalIcon = 'add';
  modalTitle = 'Registrar Raza';
  petTypes = signal<PetType[]>([]);
  breedForm = new FormGroup({
    id: new FormControl(0),
    petTypeId: new FormControl(0, [Validators.required]),
    code: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(5)]),
    name: new FormControl('', [Validators.required, Validators.min(3)]),
    description: new FormControl(''),
    enabled: new FormControl(true),
  });
  private readonly breedService = inject(BreedService);
  private readonly modalRef = inject(MatDialogRef<BreedModalComponent>);
  private readonly petTypeService = inject(PetTypeService);
  private readonly tS = inject(ToastrNotificationService);

  loadPetTypes() {
    this.petTypeService.get({}).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        this.petTypes.set(response.payload as PetType[]);
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
      this.breedService.post(dataToSave).subscribe((response) => {
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

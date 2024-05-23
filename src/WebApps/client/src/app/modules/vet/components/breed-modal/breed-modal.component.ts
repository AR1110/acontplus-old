import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Breed } from '@modules/vet/models/breed.model';
import { PetType } from '@modules/vet/models/pet-type.model';

@Component({
  selector: 'app-breed-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './breed-modal.component.html',
  styles: ``,
})
export class BreedModalComponent {
  breed = {} as Breed;
  petTypes: PetType[] = [];

  onSave() {}
}

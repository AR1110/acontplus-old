import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Breed } from '@modules/vet/models/breed.model';

@Component({
  selector: 'app-breed-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breed-page.component.html',
  styles: ``,
})
export class BreedPageComponent {
  breeds: Breed[] = [];
}

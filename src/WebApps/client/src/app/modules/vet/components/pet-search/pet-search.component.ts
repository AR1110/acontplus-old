import {
  Component,
  inject,
  model,
  output,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { finalize, Observable, switchMap } from 'rxjs';
import { PetService } from '@modules/vet/services/pet.service';
import { Pet } from '@modules/vet/models/pet.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-pet-search',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './pet-search.component.html',
  styles: ``,
})
export class PetSearchComponent implements OnInit {
  onPetSelected = output<{ data: any }>();
  clearSearch = output();
  textSearch = model('');
  id = model(0);
  pet = {} as Pet;
  searching = false;
  searchFailed = false;
  private petService = inject(PetService);

  control = new FormControl('');
  filteredItems!: Observable<any[]>;
  isLoading = signal(false);
  ngOnInit() {
    this.filteredItems = this.control.valueChanges.pipe(
      switchMap((val) => {
        if (val && val.length > 2) {
          return this._filter(val);
          // return this.products as any[]
        }
        this.clearSearch.emit();
        return [];
      })
    );
  }

  private _filter(value: string) {
    return this.petService
      .search({ textSearch: value })
      .pipe(finalize(() => this.isLoading.set(false)));
  }

  onKeyupSearch() {
    if (!this.textSearch) {
      this.id.set(0);
      this.clearSearch.emit();
    }
  }

  onPetSelect($event: any) {
    this.pet = $event.item;
    this.id.set(this.pet.id);
    this.setPetData(this.pet);
  }

  setPetData(pet: Pet) {
    this.onEmitData(pet);
    setTimeout(() => {
      this.textSearch.set(pet.name + ' - ' + pet.customer);
    });
  }

  onResult($event: any) {
    this.onPetSelected.emit($event);
  }

  onEmitData(result: any) {
    this.onPetSelected.emit(result);
  }
}

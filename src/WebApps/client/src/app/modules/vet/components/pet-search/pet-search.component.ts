import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
  catchError,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from 'rxjs';
import { PetService } from '@modules/vet/services/pet.service';
import { Pet } from '@modules/vet/models/pet.model';

@Component({
  selector: 'app-pet-search',
  standalone: true,
  imports: [FormsModule, NgbTypeahead, NgbHighlight],
  templateUrl: './pet-search.component.html',
  styles: ``,
})
export class PetSearchComponent {
  @Output() onPetSelected = new EventEmitter<{ data: any }>();
  @Output() resultEmptyInput = new EventEmitter();
  @Input() textSearch = '';
  @Input() id = 0;
  pet = {} as Pet;
  searching = false;
  searchFailed = false;
  private petService = inject(PetService);

  onKeyupSearch() {
    if (!this.textSearch) {
      this.id = 0;
      this.resultEmptyInput.emit({});
    }
  }

  onPetSelect($event: any) {
    this.pet = $event.item;
    this.id = this.pet.id;
    this.setPetData(this.pet);
  }

  search: OperatorFunction<string, Array<Pet>> = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.id = 0;
      }),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }
        return this.petService.search({ textSearch: term }).pipe(
          tap(() => (this.searchFailed = false)),
          catchError((error) => {
            console.log(error);
            this.searchFailed = true;
            return of([]);
          }),
        );
      }),
      tap(() => (this.searching = false)),
    );

  setPetData(pet: Pet) {
    this.onEmitData(pet);
    setTimeout(() => {
      this.textSearch = pet.name + ' - ' + pet.customer;
    });
  }

  onResult($event: any) {
    this.onPetSelected.emit($event);
  }

  onEmitData(result: any) {
    this.onPetSelected.emit(result);
  }
}

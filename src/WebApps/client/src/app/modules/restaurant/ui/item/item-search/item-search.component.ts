import { Component, inject, input, model, output, signal, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ItemService } from '@restaurant/data/services/item.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-item-search',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './item-search.component.html',
  styles: ``,
})
export class ItemSearchComponent implements OnInit {
  clearInput = output();
  selectedEvent = output<any>();
  textSearch = model('');
  id = input(0);
  #itemService = inject(ItemService);
  control = new FormControl('');
  filteredItems!: Observable<any[]>;

  ngOnInit() {
    this.filteredItems = this.control.valueChanges.pipe(
      switchMap((val) => {
        if (val && val.length > 2) {
          return this._filter(val);
          // return this.products as any[]
        }
        this.clearInput.emit();
        return [];
      }),
    );
  }

  private _filter(value: string) {
    return this.#itemService.search({ textSearch: value });
  }

  onSelectionChange(data: any) {
    this.control.patchValue('');

    this.selectedEvent.emit(data);
  }
}

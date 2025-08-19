import {Component,   inject, input,  model, output,  signal, OnInit} from '@angular/core';
import {
  Observable,
  switchMap,
} from 'rxjs';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ItemService } from '@restaurant/data/services/item.service';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {finalize} from "rxjs/operators";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-item-search',
  imports: [FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule, AsyncPipe],
    templateUrl: './item-search.component.html',
    styles: ``
})
export class ItemSearchComponent implements OnInit {
  clearInput = output()
  selectedEvent = output<any>()
   textSearch = model('');
   id =  input(0)
  #itemService = inject(ItemService);

  isLoading = signal(false);

  control = new FormControl('');
  filteredItems!: Observable<any[]>;


  ngOnInit(){
    this.filteredItems = this.control.valueChanges.pipe(

      switchMap((val) => {
        if (val && val.length > 2) {
          return this._filter(val);
          // return this.products as any[]
        }
        this.clearInput.emit();
        return [];
      })
    );
  }

  private _filter(value: string) {
    return this.#itemService.search({ textSearch: value }).pipe(
      finalize(()=>this.isLoading.set(false)),

    );
  }


  onSelectionChange(data: any) {
    this.control.patchValue('');

    this.selectedEvent.emit(data);
  }


}

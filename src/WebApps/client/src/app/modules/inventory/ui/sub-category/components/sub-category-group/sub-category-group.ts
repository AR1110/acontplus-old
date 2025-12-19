import { AsyncPipe } from '@angular/common';
import { Component, inject, input, Input, output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { isValidField } from '@core/utils/utils';
import { Observable, tap } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface   ISubCategoryGroup {
  familia: string;
  subFamilias: any[];
}

const _filter = (opt: any[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.subFamilia.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-sub-category-group',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './sub-category-group.html',
  styles: ``,
})
export class SubCategoryGroup implements OnChanges {
  @Input({ required: true }) subCategoryGroups: ISubCategoryGroup[] = [];
  isInputMat = input(false);
  onSelected = output<number>();
  onEmptyData = output();
  _formBuilder = inject(FormBuilder);

  stateForm = this._formBuilder.group({
    subCategoryGroup: '',
  });

  stateGroupOptions!: Observable<ISubCategoryGroup[]>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subCategoryGroups']) {
      this.stateGroupOptions = this.stateForm.get('subCategoryGroup')!.valueChanges.pipe(
        startWith(''),
        tap((e) => {
          if (!isValidField(e)) {
            this.onEmptyData.emit();
          }
        }),
        map((value) => this._filterGroup(value || '')),
      );
    }
  }

  onSelectionChange(item: any) {
    this.onSelected.emit(item.idSubFamilia);
  }

  private _filterGroup(value: string): ISubCategoryGroup[] {
    if (value) {
      return this.subCategoryGroups
        .map((group) => ({
          familia: group.familia,
          subFamilias: _filter(group.subFamilias, value),
        }))
        .filter((group) => group.subFamilias.length > 0);
    }

    return this.subCategoryGroups;
  }
}

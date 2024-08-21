import { Component, inject, Input, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { isValidField } from '@core/utils/utils';

interface SubCategoryGroup {
  familia: string;
  subFamilias: any[];
}

const _filter = (opt: any[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) =>
    item.subFamilia.toLowerCase().includes(filterValue),
  );
};

@Component({
  selector: 'app-sub-category-group',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './sub-category-group.component.html',
  styles: ``,
})
export class SubCategoryGroupComponent {
  @Input({ required: true }) subCategoryGroups: SubCategoryGroup[] = [];
  onSelected = output<number>();
  onEmptyData = output();
  _formBuilder = inject(FormBuilder);

  stateForm = this._formBuilder.group({
    subCategoryGroup: '',
  });

  stateGroupOptions!: Observable<SubCategoryGroup[]>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subCategoryGroups']) {
      this.stateGroupOptions = this.stateForm
        .get('subCategoryGroup')!
        .valueChanges.pipe(
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

  private _filterGroup(value: string): SubCategoryGroup[] {
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

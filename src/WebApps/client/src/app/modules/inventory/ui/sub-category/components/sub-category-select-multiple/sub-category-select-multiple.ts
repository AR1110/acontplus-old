import { Component, input, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GroupedSubFamilia } from '@inventory/domain/models/sub-category.model';

@Component({
  selector: 'app-sub-category-select-multiple',
  templateUrl: './sub-category-select-multiple.html',
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, FormsModule],
})
export class SubCategorySelectMultiple {
  isMat = input(false);
  @Input() checkedSubCategorias = new FormControl([]);
  @Input() subCategorias: GroupedSubFamilia[] = [];
}

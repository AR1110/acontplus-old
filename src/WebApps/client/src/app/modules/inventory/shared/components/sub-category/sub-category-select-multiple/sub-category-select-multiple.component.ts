import { Component, Input } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { GroupedSubFamilia } from "@modules/inventory/models/sub-category.model";


@Component({
  selector: 'app-sub-category-select-multiple',
  standalone: true,
  templateUrl: './sub-category-select-multiple.component.html',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})

export class SubCategorySelectMultipleComponent {

  @Input() checkedSubCategorias = new FormControl('');
  @Input() subCategorias: Array<GroupedSubFamilia> = [];

}

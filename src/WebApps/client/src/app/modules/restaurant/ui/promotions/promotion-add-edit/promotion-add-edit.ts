import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatInput} from "@angular/material/input";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";

@Component({
  selector: 'app-promotion-add-edit',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    DateRangeSelectionComponent
  ],
  templateUrl: './promotion-add-edit.html',
  styleUrl: './promotion-add-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionAddEdit {

}

import { Component, input } from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Button } from '@acontplus/ng-components';

@Component({
  selector: 'app-retencion-ats-info-adicional-add-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    Button,
  ],
  templateUrl: './retencion-ats-info-adicional-add-edit.component.html',
  styles: ``,
})
export class RetencionAtsInfoAdicionalAddEditComponent {
  indexInfoAdicional = input.required<number>();
  infoAdicionalGroup = input.required<any>();
  infoAdicionalArray = input.required<FormArray>();

  removeInfoAdicional() {
    this.infoAdicionalArray().removeAt(this.indexInfoAdicional());
  }
}

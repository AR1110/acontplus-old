import { Component, signal } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vehicle-add-edit-modal',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './config-inspection-add-edit-modal.componet.html',
  styles: ``,
})
export class ConfigInspectionAddEditComponent {
  btnText = signal('');

  title = signal('Add Edit');

  loading = signal(false);
  dataForm = {} as any;

  onSubmit() {}

  close() {}
}

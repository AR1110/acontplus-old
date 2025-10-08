import { Component, signal } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vehicle-add-edit-modal',
  imports: [
    MatCustomDialogComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDynamicCardComponent,
    ReactiveFormsModule,
    ToUpperCaseDirective,
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

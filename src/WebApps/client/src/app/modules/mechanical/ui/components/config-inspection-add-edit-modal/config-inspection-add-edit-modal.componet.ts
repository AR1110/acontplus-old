import {Component} from '@angular/core';
import { MatDynamicCardComponent } from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import { MatInputModule } from "@angular/material/input";
import { MatCustomDialogComponent } from "@core/components/mat-custom-dialog/mat-custom-dialog.component";

@Component({
  selector: 'app-vehicle-add-edit-modal',
  imports: [MatDynamicCardComponent, MatInputModule, MatCustomDialogComponent],
  templateUrl: './config-inspection-add-edit-modal.componet.html',
  styles: ``,
})
export class ConfigInspectionAddEditComponent {

}

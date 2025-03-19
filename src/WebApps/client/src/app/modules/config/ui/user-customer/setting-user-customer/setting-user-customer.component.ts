import {Component, inject} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MatDialogRef} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";

@Component({
  selector: 'app-setting-user-customer',
  imports: [
    MatTabsModule,
    MatCustomDialogComponent
  ],
  templateUrl: './setting-user-customer.component.html',
  styles: ``
})
export class SettingUserCustomerComponent {
  private dialogRef = inject(MatDialogRef<SettingUserCustomerComponent>)



  close(){
    this.dialogRef.close()
  }
}

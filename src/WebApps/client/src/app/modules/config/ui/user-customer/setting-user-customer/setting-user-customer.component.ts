import {Component, inject} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {
  ListAsignacionEstabComponent
} from "@modules/config/ui/user-customer/setting-user-customer/list-asignacion-estab/list-asignacion-estab.component";
import {UserCustomerStore} from "@modules/config/ui/store/user-customer.store";
import {
  ListUserCustomerRoleUseCase
} from "@modules/config/domain/use-cases/user-customer-role/list-user-customer-role.use-case";
import {UserCustomerRole} from "@modules/config/domain/models/user-customer/user-customer-role.model";
import {MatListModule} from "@angular/material/list";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";

@Component({
  selector: 'app-setting-user-customer',
  imports: [
    MatTabsModule,
    MatListModule,
    MatCustomDialogComponent,
    MatDynamicCardComponent,
    ListAsignacionEstabComponent
  ],
  templateUrl: './setting-user-customer.component.html',
  styles: ``
})
export class SettingUserCustomerComponent {
  private dialogRef = inject(MatDialogRef<SettingUserCustomerComponent>)
  readonly params = inject<{
    idUsuario: number
    nombreCompleto: string
  }>(MAT_DIALOG_DATA);

  userCustomerRoleData = {} as UserCustomerRole

  private $listUserCustomerRoleUseCase = inject(ListUserCustomerRoleUseCase)
  private $userCustomerStore = inject(UserCustomerStore);

  ngOnInit(){
    this.$listUserCustomerRoleUseCase.execute({
      idUsuario: this.params.idUsuario
    }).subscribe(response=>{
      this.userCustomerRoleData = response.data[0];
      console.log(this.userCustomerRoleData)
      this.$userCustomerStore.setUserRoleId(this.userCustomerRoleData.idUsuarioRol)
    })
  }



  close(){
    this.dialogRef.close()
  }
}

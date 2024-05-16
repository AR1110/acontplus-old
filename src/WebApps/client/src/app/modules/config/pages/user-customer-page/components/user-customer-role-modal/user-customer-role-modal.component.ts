import { Component, inject, Input, ViewChild } from "@angular/core";
import { NgbAccordionModule, NgbActiveModal, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { UserCustomerRoleEstabComponent } from "./components/user-customer-role-estab/user-customer-role-estab.component";
import { UserCustomerRolePermissionComponent } from "./components/user-customer-role-permission/user-customer-role-permission.component";
import { UserCustomerRoleService } from "@modules/config/services/user-customer/user-customer-role.service";
import {
  UserCustomerRoleAccessComponent
} from "@modules/config/pages/user-customer-page/components/user-customer-role-modal/components/user-customer-role-access/user-customer-role-access.component";


@Component({
  selector: 'app-user-customer-role-modal',
  standalone: true,
  imports: [
    NgbAccordionModule,
    NgbNavModule,
    UserCustomerRoleEstabComponent,
    UserCustomerRolePermissionComponent,
    UserCustomerRoleAccessComponent
  ],
  templateUrl: './user-customer-role-modal.component.html'
})

export class UserCustomerRoleModalComponent {
  @Input() params = {
    idUsuario: 0,
    nombreCompleto: ''
  }
  @ViewChild(UserCustomerRoleEstabComponent) childEstab!: UserCustomerRoleEstabComponent;
  @ViewChild(UserCustomerRolePermissionComponent) childPermission!: UserCustomerRolePermissionComponent;

  modal = inject(NgbActiveModal);
  private readonly userCustomerRoleSvc = inject(UserCustomerRoleService)

  activeNav = 1;

  idUsuarioRol = 0;
  userCustomerRoles: Array<any> = [];


  ngOnInit(){
    this.userCustomerRoleSvc.getAll({idUsuario: this.params.idUsuario}).subscribe((response:any)=>{
        this.userCustomerRoles = response.userCustomerRoles;
    })
  }

  showAcordeon(data:any){
    this.activeNav = 1;
    this.idUsuarioRol = data.idUsuarioRol;

    setTimeout(()=>{
      this.childEstab?.getUserCustomerRoleEstabs(data.idUsuarioRol);
    }, 100)
  }
  onNavChange(data: any){

    setTimeout(()=>{
      if(this.activeNav===1){
        this.childEstab?.getUserCustomerRoleEstabs(data.idUsuarioRol);
      }
      if (this.activeNav === 2){
        this.childPermission?.getUserPermissions(data.idUsuarioRol)
      }

    })
  }

}

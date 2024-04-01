import { Component, inject, Input, ViewChild } from "@angular/core";
import { NgbAccordionModule, NgbActiveModal, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { UserCustomerRoleEstabComponent } from "./components/user-customer-role-estab/user-customer-role-estab.component";
import { UserCustomerRolePermissionComponent } from "./components/user-customer-role-permission/user-customer-role-permission.component";
import { UserCustomerRoleService } from "@modules/config/services/user-customer-role.service";

@Component({
  selector: 'app-user-customer-role-modal',
  standalone: true,
  imports: [
    NgbAccordionModule,
    NgbNavModule,
    UserCustomerRoleEstabComponent,
    UserCustomerRolePermissionComponent
  ],
  templateUrl: './user-customer-role-modal.component.html'
})

export class UserCustomerRoleModalComponent {
  @Input() params = {
    idUsuario: 0,
  }
  @ViewChild(UserCustomerRoleEstabComponent) childEstab!: UserCustomerRoleEstabComponent;

  modal = inject(NgbActiveModal);
  private readonly userCustomerRoleSvc = inject(UserCustomerRoleService)

  active = 1;
  items = ['First', 'Second', 'Third'];

  idUsuarioRol = 0;
  userCustomerRoles: Array<any> = [];


  ngOnInit(){
    this.userCustomerRoleSvc.getAll({idUsuario: this.params.idUsuario}).subscribe({
      next: (response:any) =>{
        this.userCustomerRoles = response.userCustomerRoles;
      },
    })
  }

  showAcordeon(data:any){
    this.idUsuarioRol = data.idUsuarioRol;
    this.childEstab.getUserCustomerRoleEstabs(data.idUsuarioRol);
  }
  clickNgbNavLink(data: any){
    setTimeout(()=>{
      this.childEstab.getUserCustomerRoleEstabs(data.idUsuarioRol);

    })
  }

}

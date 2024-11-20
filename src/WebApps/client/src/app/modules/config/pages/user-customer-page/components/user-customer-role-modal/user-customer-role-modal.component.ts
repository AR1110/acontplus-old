import { Component, inject, Input } from "@angular/core";
import { NgbAccordionModule, NgbActiveModal, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { UserCustomerRoleEstabComponent } from "./components/user-customer-role-estab/user-customer-role-estab.component";
import { UserCustomerRolePermissionComponent } from "./components/user-customer-role-permission/user-customer-role-permission.component";
import { UserCustomerRoleService } from "@modules/config/services/user-customer/user-customer-role.service";
import {
  UserCustomerRoleAccessComponent
} from "@modules/config/pages/user-customer-page/components/user-customer-role-modal/components/user-customer-role-access/user-customer-role-access.component";
import {UserCustomerRoleStateService} from "@modules/config/store/user-customer/user-customer-role-state.service";
import {IsAdminDirective} from "@shared/directives/permission/is-admin.directive";


@Component({
    selector: 'app-user-customer-role-modal',
    imports: [
        NgbAccordionModule,
        NgbNavModule,
        UserCustomerRoleEstabComponent,
        UserCustomerRolePermissionComponent,
        UserCustomerRoleAccessComponent,
        IsAdminDirective
    ],
    templateUrl: './user-customer-role-modal.component.html',
    providers: [
        UserCustomerRoleStateService
    ]
})

export class UserCustomerRoleModalComponent {
  @Input() params = {
    idUsuario: 0,
    nombreCompleto: ''
  }
  modal = inject(NgbActiveModal);
  private readonly userCustomerRoleSvc = inject(UserCustomerRoleService)
  state = inject(UserCustomerRoleStateService)

  activeNav = 1;

  userCustomerRoles: Array<any> = [];


  ngOnInit(){
    let params = {
      idUsuario: this.params.idUsuario
    }
    this.userCustomerRoleSvc.getAll(params).subscribe((response:any)=>{
        this.userCustomerRoles = response.userCustomerRoles;
    })

    this.state.setState({
      userRoleId: 0
    })
  }

  onClickAcordeon(data:any){
    this.activeNav = 1;
    this.state.setState({
      userRoleId: data.idUsuarioRol
    })
  }

}

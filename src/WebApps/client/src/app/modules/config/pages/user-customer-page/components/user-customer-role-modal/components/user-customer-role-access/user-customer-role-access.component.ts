
import {Component, inject} from '@angular/core';
import {UserCustomerRoleStateService} from "@modules/config/store/user-customer/user-customer-role-state.service";
import {UserCustomerRoleService} from "@modules/config/services/user-customer/user-customer-role.service";
import {Menu} from "@modules/config/models/menu.model";
import { NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@Component({
  selector: 'app-user-customer-role-access',
  standalone: true,
  imports: [NgbAccordionModule, FontAwesomeModule ],
  templateUrl: './user-customer-role-access.component.html',
  styles: ``
})
export class UserCustomerRoleAccessComponent {

  state = inject(UserCustomerRoleStateService)
  userRoleId = this.state.select("userRoleId")

  userCustomerRoleSvc = inject(UserCustomerRoleService)
  menus:Menu[] = [];

  getAccesses(){
    this.userCustomerRoleSvc.getAccesses(this.userRoleId()).subscribe(response=>{
      this.menus = response.menus;
    })
  }
  ngOnInit(){
    this.getAccesses()
  }

  askToDelete(data:any){

  }

  onActionsOpen(data:any){

  }

}

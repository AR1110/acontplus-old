import { Component, inject } from "@angular/core";
import { NgbAccordionModule, NgbActiveModal, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { UserCustomerRoleEstabComponent } from "./components/user-customer-role-estab/user-customer-role-estab.component";
import { UserCustomerRolePermissionComponent } from "./components/user-customer-role-permission/user-customer-role-permission.component";

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
  modal = inject(NgbActiveModal);

  active = 1;
  items = ['First', 'Second', 'Third'];

}

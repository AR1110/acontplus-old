import { Component, inject } from "@angular/core";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { ModalService } from "@core/services/modal.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserCustomerRead } from "@modules/config/models/user-customer.model";
import { UserCustomerService } from "@modules/config/services/user-customer.service";
import { UserCustomerRoleModalComponent } from "./components/user-customer-role-modal/user-customer-role-modal.component";


@Component({
  selector: 'app-user-customer-apge',
  standalone: true,
  imports: [
    FontAwesomeModule,
    BreadcrumbComponent
  ],
  templateUrl: './user-customer-page.component.html'
})
export class UserCustomerPageComponent {
  private readonly userCustomerSvc = inject(UserCustomerService);
  private readonly modalSvc = inject(ModalService)


  usersCustomer: Array<UserCustomerRead> = [];
  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    totalRecords: 0
  }
  getUsersCustomer() {
    let obj = {
      pageIndex: this.dataSearch.pageIndex,
      pageSize: this.dataSearch.pageSize
    }
    this.userCustomerSvc.getAll(obj).subscribe({
      next: (response: any) => {
        this.usersCustomer = response.userCustomers;;
      },
    })
  }

  ngOnInit() {
    this.getUsersCustomer()
  }

  openModalConfig(data: UserCustomerRead){
    let modalRef = this.modalSvc.openModalCustom(UserCustomerRoleModalComponent, {
      size: 'xl'
    })
    modalRef.componentInstance.params = {
      idUsuario: data.idUsuario
    }
  }

}

import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { ModalService } from "@core/services/modal.service";
import { hideLoader, showLoader } from "@core/utils/loader";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserCustomerRead } from "@modules/config/models/user-customer/user-customer.model";
import { UserCustomerService } from "@modules/config/services/user-customer/user-customer.service";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { Pagination } from "@shared/class/pagination";

import { UserCustomerAddEditModalComponent } from "./components/user-customer-add-edit-modal/user-customer-add-edit-modal.component";
import { UserCustomerRoleModalComponent } from "./components/user-customer-role-modal/user-customer-role-modal.component";

@Component({
  selector: 'app-user-customer-apge',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    NgbPaginationModule,
    BreadcrumbComponent
  ],
  templateUrl: './user-customer-page.component.html'
})
export class UserCustomerPageComponent {
  private readonly userCustomerSvc = inject(UserCustomerService);
  private readonly modalSvc = inject(ModalService)
  private router = inject(Router)


  pagination = new Pagination();
  usersCustomer: Array<UserCustomerRead> = [];

  getUsersCustomer() {
    let obj = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize
    }
    showLoader();
    this.userCustomerSvc.getAll(obj).subscribe({
      next: (response: any) => {
        hideLoader();
        this.usersCustomer = response.userCustomers;
        if(this.usersCustomer.length>0){
          this.pagination.totalRecords= this.usersCustomer[0].totalRecords;
        }
      },
      error(err) {
          hideLoader();
          console.log(err)
      },
    })
  }

  ngOnInit() {
    //   this.router.navigate(['/', 'accounting', 'cuenta-por-cobrar-page'])
 // this.router.navigate(['/', 'inventory', 'measure-page'])
 //   this.router.navigate(['/', 'inventory', 'product-page'])
   this.getUsersCustomer()
  }


  pageChanged(): void {
    this.getUsersCustomer();
  }

  changePageSize(): void {
    this.pagination.pageIndex = 1;
    this.getUsersCustomer();
  }


  openModalAddEdit(data?: UserCustomerRead){
    let modalRef = this.modalSvc.openModalCustom(UserCustomerAddEditModalComponent, )

    modalRef.componentInstance.params = data? data: {}

    modalRef.result.then(result=>{
      if(result!==null && typeof result==='object'){
        this.getUsersCustomer();
      }
    })
  }

  openModalConfig(data: UserCustomerRead){
    let modalRef = this.modalSvc.openModalCustom(UserCustomerRoleModalComponent, {
      size: 'xl'
    })
    modalRef.componentInstance.params = {
      idUsuario: data.idUsuario,
      nombreCompleto: data.nombreCompleto
    }
  }

}

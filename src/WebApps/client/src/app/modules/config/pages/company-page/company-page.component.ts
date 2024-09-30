import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CompanyService } from '@modules/config/services/company.service';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import { CompanyAddEditModalComponent } from '@modules/config/pages/company-page/components/company-add-edit-modal/company-add-edit-modal.component';

@Component({
  selector: 'app-company-page',
  standalone: true,
  imports: [BreadcrumbComponent, PrimaryStatusPipe, FontAwesomeModule],
  templateUrl: './company-page.component.html',
  styles: ``,
})
export class CompanyPageComponent {
  companySvc = inject(CompanyService);
  modalSvc = inject(ModalService);

  companies: any[] = [];

  getCompanies() {
    this.companySvc.getAll().subscribe((response) => {
      this.companies = response.companies;
    });
  }

  ngOnInit() {
    this.getCompanies();
  }

  openModalEdit(item: any) {
    let modalRef = this.modalSvc.open(CompanyAddEditModalComponent, {
      backdrop: 'static',
    });
    modalRef.componentInstance.params = item;

    modalRef.result.then((result) => {
      if (result && typeof result === 'object') {
        this.getCompanies();
      }
    });
  }
}

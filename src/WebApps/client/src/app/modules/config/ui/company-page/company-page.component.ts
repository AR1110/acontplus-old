import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CompanyService } from '@modules/config/services/company.service';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';

import { ModalService } from '@core/services/modal.service';
import { CompanyAddEditModalComponent } from '@modules/config/ui/company-page/company-add-edit-modal/company-add-edit-modal.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-company-page',
    imports: [
        BreadcrumbComponent,
        PrimaryStatusPipe,
        MatCardContent,
        MatCard,
        MatIcon,
        ThemeButtonComponent,
    ],
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

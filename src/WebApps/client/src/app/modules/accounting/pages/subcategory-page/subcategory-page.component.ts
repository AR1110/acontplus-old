import { Component, inject } from '@angular/core';
import { SubcategoryService } from '@modules/accounting/services/subcategory.service';
import { Subcategory } from '@modules/accounting/models/subcategory';
import { isApiResponse } from '@core/models/api-response';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import { SubcategoryModalComponent } from '@modules/accounting/pages/subcategory-page/subcategory-modal/subcategory-modal.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SecondaryStatusPipe } from '@shared/pipe/secondary-status.pipe';

@Component({
  selector: 'app-subcategory-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FaIconComponent,
    NgbDropdownModule,
    SecondaryStatusPipe,
  ],
  templateUrl: './subcategory-page.component.html',
  styles: ``,
})
export class SubcategoryPageComponent {
  data: Subcategory = {} as Subcategory;
  subcategories: Subcategory[] = [];
  private readonly modalService = inject(ModalService);
  private readonly subcategoryService = inject(SubcategoryService);

  edit(item: Subcategory) {
    this.data = item;
    this.onModalOpen();
  }

  get() {
    this.subcategoryService.get({ tipo: 1 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { subcategories } = JSON.parse(response.payload as string);
        this.subcategories = subcategories;
      }
    });
  }

  ngOnInit(): void {
    this.get();
  }

  onModalOpen() {
    const modalRef = this.modalService.openModalCustom(
      SubcategoryModalComponent,
      { size: 'sm', centered: true },
    );
    if (this.data.id > 0) {
      modalRef.componentInstance.data = this.data;
    }
    modalRef.result.then((response) => {
      if (response !== null && typeof response === 'object') {
        this.get();
      }
      this.data = {} as Subcategory;
    });
  }
}

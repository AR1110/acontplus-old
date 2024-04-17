import { Component, inject } from '@angular/core';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { Brand } from '@modules/technical-support/models/brand';
import { BrandService } from '@modules/technical-support/services/brand.service';
import { BrandModalComponent } from './brand-modal/brand-modal.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-brand-page',
  standalone: true,
  imports: [BreadcrumbComponent, FontAwesomeModule],
  templateUrl: './brand-page.component.html',
  styles: ``,
})
export class BrandPageComponent {
  private brandService = inject(BrandService);
  private modalService = inject(ModalService);
  brands: Brand[] = [];
  brandSelected: Brand = {
    id: 0,
    code: '',
    name: '',
    idFamilia: 0,
    descripcion: '',
    siglas: '',
    estado: true,
  };
  onEdit(item: Brand) {
    this.brandSelected = item;
    this.onModalOpen();
  }
  onGet() {
    showLoader();
    this.brandService.get({}).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            this.brands = JSON.parse(response.payload as string);
          }
        }
      },
      error(err) {
        hideLoader();
        console.error(err);
      },
      complete() {
        hideLoader();
      },
    });
  }
  onModalOpen() {
    const modalRef = this.modalService.openModalCustom(BrandModalComponent, {
      size: 'lg',
      centered: true,
    });
    if (this.brandSelected.id > 0) {
      modalRef.componentInstance.data = this.brandSelected;
    }
    modalRef.result.then((response) => {
      if (response !== null && typeof response == 'object') {
        this.onGet();
      }
    });
  }
}

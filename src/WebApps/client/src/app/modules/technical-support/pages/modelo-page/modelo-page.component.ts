import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { Modelo } from '@modules/technical-support/models/modelo';
import { ModeloService } from '@modules/technical-support/services/modelo.service';
import { ModeloModalComponent } from './modelo-modal/modelo-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-modelo-page',
  standalone: true,
  imports: [BreadcrumbComponent, FontAwesomeModule],
  templateUrl: './modelo-page.component.html',
  styles: ``,
})
export class ModeloPageComponent {
  private modeloService = inject(ModeloService);
  private modalService = inject(ModalService);
  modelos: Modelo[] = [];
  modeloSelected: Modelo = {
    id: 0,
    code: '',
    name: '',
    brandId: 0,
    brandName: '',
    categoryName: '',
  };
  ngOnInit(): void {
    this.onGet();
  }
  onEdit(item: Modelo) {
    this.modeloSelected = item;
    this.onModalOpen();
  }
  onGet() {
    showLoader();
    this.modeloService.get({ tipo: 1 }).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            this.modelos = JSON.parse(response.payload as string);
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
    const modalRef = this.modalService.openModalCustom(ModeloModalComponent, {
      size: 'lg',
      centered: true,
    });
    if (this.modeloSelected.id > 0) {
      modalRef.componentInstance.data = this.modeloSelected;
    }
    modalRef.result.then((response) => {
      if (response !== null && typeof response == 'object') {
        this.onGet();
      }
    });
  }
}

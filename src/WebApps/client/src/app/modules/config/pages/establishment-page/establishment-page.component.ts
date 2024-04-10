import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EstablishmentServiceService } from '@modules/config/services/sri/establishment-service.service';
import { Tabulator } from 'tabulator-tables';
import { EstabAddEditModalComponent } from './components/estab-add-edit-modal/estab-add-edit-modal.component';
import { ModalService } from '@core/services/modal.service';

@Component({
  selector: 'app-establishment-page',
  standalone: true,
  imports: [
    FontAwesomeModule,
    BreadcrumbComponent
  ],
  templateUrl: './establishment-page.component.html',
})
export class EstablishmentPageComponent {

  private estabSvc = inject(EstablishmentServiceService);
  private modalSvc = inject(ModalService)

  getEstabs(){
    this.estabSvc.getAll({}).subscribe({
      next: (response)=> {
        console.log(response)

      },
      error(err) {
          console.log(err)
      },
    })
  }

  ngOnInit() {
    this.getEstabs()
  }

  openModalAddEdit(){
    const modalRef = this.modalSvc.openModalCustom(EstabAddEditModalComponent, {
      size: 'lg'
    })
  }
}

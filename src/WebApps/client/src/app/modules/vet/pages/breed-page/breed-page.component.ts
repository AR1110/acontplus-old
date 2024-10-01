import { Component, inject } from '@angular/core';
import { Breed } from '@modules/vet/models/breed.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BreedService } from '@modules/vet/services/breed.service';
import { isApiResponse } from '@core/models/api-response';
import { ModalService } from '@core/services/modal.service';
import { BreedModalComponent } from '@modules/vet/components/breed-modal/breed-modal.component';
import swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import { SecondaryStatusPipe } from '@shared/pipes/secondary-status.pipe';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-breed-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FontAwesomeModule,
    SecondaryStatusPipe,
    NgbDropdownModule,
  ],
  templateUrl: './breed-page.component.html',
  styles: ``,
})
export class BreedPageComponent {
  data = {} as Breed;
  breeds: Breed[] = [];
  private readonly breedService = inject(BreedService);
  private readonly modalService = inject(ModalService);
  private readonly tS = inject(ToasterService);

  loadBreeds() {
    this.breedService.get({}).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        this.breeds = response.payload as Breed[];
      }
    });
  }

  ngOnInit(): void {
    this.loadBreeds();
  }

  onDelete(item: Breed) {
    swal
      .fire({
        icon: 'warning',
        title: 'Advertencia',
        text: `Esta seguro de eliminar la raza ${item.name}?`,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.breedService.delete(item.id).subscribe((response) => {
            if (isApiResponse(response)) {
              this.tS.toastr({
                type: response.code == '1' ? 'success' : 'warning',
                message: response.message,
              });
              if (response.code == '1') {
                this.loadBreeds();
              }
            }
          });
        }
      });
  }

  onEdit(item: Breed) {
    this.data = item;
    this.onModalOpen();
  }

  onModalOpen() {
    const modalRef = this.modalService.openModalCustom(BreedModalComponent, {
      centered: true,
    });
    if (this.data.id > 0) {
      modalRef.componentInstance.data = this.data;
    }
    modalRef.result.then((result) => {
      if (result !== null && typeof result === 'object') {
        this.loadBreeds();
      }
      if (this.data.id > 0) {
        this.data = {} as Breed;
      }
    });
  }
}

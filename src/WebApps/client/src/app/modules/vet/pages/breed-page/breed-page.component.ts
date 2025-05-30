import { Component, inject } from '@angular/core';
import { Breed } from '@modules/vet/models/breed.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { BreedService } from '@modules/vet/services/breed.service';
import { isApiResponse } from '@core/models/api-response';
import { BreedModalComponent } from '@modules/vet/components/breed-modal/breed-modal.component';
import swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import { SecondaryStatusPipe } from '@shared/pipes/secondary-status.pipe';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import {DialogService} from "@core/services/dialog.service";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";

@Component({
  selector: 'app-breed-page',
  imports: [
    BreadcrumbComponent,
    SecondaryStatusPipe,
    MatCard,
    MatCardContent,
    MatButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatIcon,
    MatDynamicCardComponent,
  ],
  templateUrl: './breed-page.component.html',
  styles: ``,
})
export class BreedPageComponent {
  data = {} as Breed;
  breeds: Breed[] = [];
  private readonly breedService = inject(BreedService);
  private readonly modalService = inject(DialogService);
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
    const modalRef = this.modalService.open(BreedModalComponent, {
       data: this.data.id > 0 ?structuredClone( this.data) : {}
    });
    modalRef.subscribe((result) => {
      if (result !== null && typeof result === 'object') {
        this.loadBreeds();
      }
      if (this.data.id > 0) {
        this.data = {} as Breed;
      }
    });
  }
}

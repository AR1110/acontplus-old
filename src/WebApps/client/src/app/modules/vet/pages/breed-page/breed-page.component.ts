import { Component, inject, OnInit, signal } from '@angular/core';
import { Breed } from '@modules/vet/models/breed.model';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { BreedService } from '@modules/vet/services/breed.service';
import { isApiResponse } from '@core/models/api-response-legacy';
import { BreedModalComponent } from '@modules/vet/components/breed-modal/breed-modal.component';
import swal from 'sweetalert2';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { SecondaryStatusPipe } from '@shared/pipes/secondary-status.pipe';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { DialogService } from '@core/services/dialog.service';
import { DynamicCard } from '@acontplus/ng-components';

@Component({
  selector: 'app-breed-page',
  imports: [
    BreadcrumbComponent,
    SecondaryStatusPipe,
    MatButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatIcon,
    DynamicCard,
  ],
  templateUrl: './breed-page.component.html',
  styles: ``,
})
export class BreedPageComponent implements OnInit {
  data = {} as Breed;
  breeds = signal<Breed[]>([]);
  private readonly breedService = inject(BreedService);
  private readonly modalService = inject(DialogService);
  private readonly tS = inject(ToastrNotificationService);

  loadBreeds() {
    this.breedService.get({}).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        this.breeds.set(response.payload as Breed[]);
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
              this.tS.show({
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
      data: this.data.id > 0 ? structuredClone(this.data) : {},
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

import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { isApiResponse } from '@core/models/api-response-legacy';
import { PetService } from '@modules/vet/services/pet.service';
import { PetModalComponent } from '@modules/vet/components/pet-modal/pet-modal.component';
import { Pagination, DynamicCard } from '@acontplus/ng-components';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ThemePalette } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { Pet } from '@modules/vet/models/pet.model';
import { Chart, registerables } from 'chart.js';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { DialogService } from '@core/services/dialog.service';

Chart.register(...registerables);

@Component({
  selector: 'app-pet-page',
  imports: [
    DynamicCard,
    BreadcrumbComponent,
    FormsModule,
    MatPaginator,
    MatSlideToggle,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatRowDef,
    MatNoDataRow,
    MatRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatInput,
    MatSort,
    MatButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatIcon,
  ],
  templateUrl: './pet-page.component.html',
  styles: ``,
})
export class PetPageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  colorToggle: ThemePalette = 'accent';
  data = {} as Pet;
  visibleColumns: string[] = [
    'op',
    'position',
    'name',
    'petType',
    'breed',
    'gender',
    'age',
    'color',
    'weight',
    'enabled',
  ];
  dataSource = new MatTableDataSource<Pet>();
  dataSearch = {};
  pagination = new Pagination();
  searching = false;

  private readonly petService = inject(PetService);
  private readonly modalService = inject(DialogService);
  private readonly tS = inject(ToastrNotificationService);

  applyFilter(event: Event) {
    this.searching = true;
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue && filterValue.length >= 3) {
      this.search(filterValue);
    }
    if (filterValue.length == 0) {
      this.dataSearch = {};
      this.loadPets();
    }
  }

  askToEnableDisable(event: MatSlideToggleChange, item: Pet) {
    if (!event.checked) {
      Swal.fire({
        icon: 'warning',
        title: 'Alerta',
        text: 'Esta seguro de inactivar esta suscripción?, Los usuarios de la empresa, perderan acceso a los aplicativos',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Si',
      }).then((result) => {
        if (result.isConfirmed) {
          event.source.checked = event.checked;
          //this.enableDisable(item.id, event.checked);
        } else {
          event.source.checked = !event.checked; // Reset the toggle state
        }
      });
    } else {
      //this.enableDisable(item.id, event.checked);
    }
  }

  // enableDisable(id: number, estado: boolean) {
  //   this.petService.putStatus(id, estado).subscribe({
  //     next: (response) => {
  //       if (isApiResponse(response)) {
  //         this.tS.toastr({
  //           type: response.code == '1' ? 'success' : 'warning',
  //           message: response.message,
  //         });
  //       }
  //     },
  //   });
  // }

  loadPets() {
    let petsModified: any[] = [];
    const params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
    };
    const clonedParams = Object.assign(params, this.dataSearch);
    this.petService.get(clonedParams).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
        const { pets } = JSON.parse(response.payload as string);
        petsModified = pets?.map((pet: any, index: number) => ({
          ...pet,
          position: index + 1,
        }));
      }
      this.dataSource = new MatTableDataSource(petsModified);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      setTimeout(() => {
        this.paginator.pageIndex = this.pagination.pageIndex;
        this.paginator.length = petsModified.length > 0 ? petsModified[0].totalRecords : 0;
      });
    });
  }

  ngOnInit(): void {
    this.loadPets();
  }

  onDelete(item: Pet) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: `Esta seguro de eliminar la mascota ${item.name}?`,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    }).then((response) => {
      if (response.isConfirmed) {
        this.petService.delete(item.id).subscribe((response) => {
          if (isApiResponse(response)) {
            this.tS.show({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              this.loadPets();
            }
          }
        });
      }
    });
  }

  onEdit(item: Pet) {
    this.data = item;
    this.onModalOpen();
  }

  onModalOpen() {
    const modalRef = this.modalService.open(PetModalComponent, {
      size: 'lg',
      data: this.data.id > 0 ? this.data : {},
    });

    modalRef.subscribe((result) => {
      if (result !== null && typeof result === 'object') {
        this.loadPets();
      }
      if (this.data.id > 0) {
        this.data = {} as Pet;
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.pageIndex = event.pageIndex == 0 ? 1 : event.pageIndex;
    this.loadPets();
  }

  search(textSearch: string) {
    this.dataSearch = { textSearch, tipo: 2 };
    this.loadPets();
  }
}

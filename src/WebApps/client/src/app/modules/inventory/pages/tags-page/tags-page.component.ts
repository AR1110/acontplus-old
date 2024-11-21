import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { ToasterService } from '@core/services/toaster.service';
import { TagsAddEditModalDirective } from '@modules/inventory/directives/tags-add-edit-modal.directive';
import { TagsService } from '@modules/inventory/services/tags.service';
import { MatPagination } from '@shared/models/pagination.model';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-tags-page',
    imports: [
        BreadcrumbComponent,
        PrimaryStatusPipe,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTableModule,
        CustomTableContainerComponent,
        TagsAddEditModalDirective,
    ],
    templateUrl: './tags-page.component.html',
    styles: ``
})
export class TagsPageComponent {
  tagsSvc = inject(TagsService);
  pagination = signal(new MatPagination());
  displayedColumns: string[] = [
    'index',
    'op',
    'description',
    'etiquetas',
    'estado',
  ];
  dataSource = signal<any[]>([]);
  isLoadingResults = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  private tS = inject(ToasterService);

  getTags() {
    let params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    this.isLoadingResults = true;
    this.tagsSvc.getAll(params).subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.dataSource.set(response.tags);
        if (this.dataSource().length > 0) {
          this.pagination.update((e) => {
            return {
              ...e,
              totalRecords: this.dataSource()[0].totalRecords,
            };
          });
        }
      },
      error: () => (this.isLoadingResults = false),
    });
  }

  ngOnInit() {
    this.getTags();
  }

  refresh() {
    this.getTags();
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.getTags();
  }

  askToDelete(data: any) {
    try {
      Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta Etiqueta ahora?</small>`,
        showConfirmButton: true,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.tagsSvc.updateStatus(data.idEtiqueta).subscribe((response) => {
            if (response.code == '0') {
              this.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code == '1') {
              this.tS.toastr({
                type: 'success',
                message: response.message,
              });
              this.refresh();
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

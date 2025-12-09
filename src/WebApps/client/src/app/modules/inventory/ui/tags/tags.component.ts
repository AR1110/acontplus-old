import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { TagsAddEditModalDirective } from '@inventory/ui/directives/tags-add-edit-modal.directive';
import { Pagination } from '@acontplus/ng-components';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import Swal from 'sweetalert2';
import { TagUseCase } from '@inventory/domain/usecases/tag.use-case';

@Component({
  selector: 'app-tags',
  imports: [
    BreadcrumbComponent,
    PrimaryStatusPipe,
    MatButtonModule,
    DynamicCard,
    MatIconModule,
    MatTableModule,
    CustomTableContainerComponent,
    TagsAddEditModalDirective,
  ],
  templateUrl: './tags.component.html',
  styles: ``,
})
export class TagsComponent implements OnInit {
  private _tagUseCase = inject(TagUseCase);
  pagination = signal(new Pagination());
  visibleColumns: string[] = ['index', 'op', 'description', 'etiquetas', 'estado'];
  dataSource = signal<any[]>([]);
  isLoadingResults = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  private tS = inject(ToastrNotificationService);

  getTags() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
    };
    this.isLoadingResults = true;
    this._tagUseCase.getAll(params).subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.dataSource.set(response.tags);
        if (this.dataSource().length > 0) {
          this.pagination.update(
            (e) => new Pagination(e.pageIndex, e.pageSize, this.dataSource()[0].totalRecords),
          );
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
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
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
          this._tagUseCase.updateStatus(data.idEtiqueta).subscribe((response) => {
            if (response.code == '0') {
              this.tS.show({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code == '1') {
              this.tS.show({
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

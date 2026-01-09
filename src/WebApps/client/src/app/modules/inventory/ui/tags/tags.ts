import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { NotificationService } from '@acontplus/ng-notifications';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { TAG_SERVICE } from '@inventory/data/inventory-token';
import { TagsAddEdit } from '@inventory/ui/tags/tags-add-edit/tags-add-edit';
import Swal from 'sweetalert2';

interface Tag {
  idEtiqueta: number;
  descripcion: string;
  etiquetas: string;
  estado: boolean;
  totalRecords?: number;
}

@Component({
  selector: 'app-tags',
  templateUrl: './tags.html',
  imports: [BreadcrumbComponent, DataGrid, Button],
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tags implements OnInit {
  list = signal<Tag[]>([]);
  isLoadingResults = signal(false);

  private tagService = inject(TAG_SERVICE);
  private tS = inject(NotificationService);
  private dgSvc = inject(AdvancedDialogService);

  page = 0;
  pageSize = 10;
  pageCount = 0;

  columns: DataGridColumn[] = [
    {
      header: 'Nro.',
      field: 'index',
      width: '60px',
      sortable: false,
    },
    {
      header: 'Op.',
      field: 'actions',
      sortable: false,
    },
    {
      header: 'Descripción',
      field: 'descripcion',
      sortable: true,
    },
    {
      header: 'Etiquetas',
      field: 'etiquetas',
      sortable: true,
    },
    {
      header: 'Estado',
      field: 'estado',
      sortable: true,
      type: 'boolean',
      formatter: (rowData: Tag) => {
        const badgeClass = rowData.estado ? 'badge bg-success' : 'badge bg-danger';
        const text = rowData.estado ? 'Activo' : 'Inactivo';
        return `<span class="${badgeClass}">${text}</span>`;
      },
    },
  ];

  add(): void {
    void this.openTagModal();
  }

  edit(data: Tag): void {
    void this.openTagModal(data);
  }

  private async openTagModal(data?: Tag): Promise<void> {
    const isEdit = !!data;
    const ref = await this.dgSvc.openInWrapper(
      {
        component: TagsAddEdit,
        title: isEdit ? 'Editar Etiqueta' : 'Nueva Etiqueta',
        icon: isEdit ? 'edit' : 'add',
        showCloseButton: true,
        data: data ?? {},
      },
      {
        size: 'sm',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  getTags(): void {
    const params = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.tagService.getAll(params).subscribe({
      next: (response: { tags: Tag[] }) => {
        this.isLoadingResults.set(false);
        this.list.set(response.tags);
        this.pageCount = this.list().length > 0 ? (this.list()[0].totalRecords ?? 0) : 0;
      },
      error: (err: unknown) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.getTags();
  }

  refresh(): void {
    this.getTags();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getTags();
  }

  async askToDelete(data: Tag): Promise<void> {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>Esta seguro/a de eliminar esta Etiqueta ahora?</small>`,
        confirmButtonText: 'Si, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.tagService
          .updateStatus(data.idEtiqueta)
          .subscribe((response: { code: string; message: string }) => {
            if (response.code === '0') {
              this.tS.warning({ message: response.message });
            }
            if (response.code === '1') {
              this.tS.success({ message: response.message });
              this.getTags();
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

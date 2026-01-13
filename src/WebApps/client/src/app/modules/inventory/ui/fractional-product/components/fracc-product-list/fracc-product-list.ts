import { Component, inject, input, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService, DataGridColumn } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { FRACTIONAL_PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import { DialogService } from '@core/services/dialog.service';
import { AddEditFractionalProduct } from '@inventory/ui/fractional-product/components/add-edit-fractional-product/add-edit-fractional-product';
import { NotificationService } from '@acontplus/ng-notifications';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fracc-product-list',
  imports: [DataGrid, Button],
  templateUrl: './fracc-product-list.html',
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FraccProductList implements OnInit {
  private $fractionalProductService = inject(FRACTIONAL_PRODUCT_SERVICE);
  private dialogSvc = inject(DialogService);
  private dgSvc = inject(AdvancedDialogService);
  private tS = inject(NotificationService);

  productId = input(0);
  isCalledFromProductModal = input(false);

  list = signal<any[]>([]);
  isLoadingResults = signal(false);

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
      header: 'Código',
      field: 'codigo',
      sortable: true,
    },
    {
      header: 'Producto',
      field: 'nomProducto',
      sortable: true,
    },
    {
      header: 'Conversión',
      field: 'conversion',
      sortable: true,
    },
    {
      header: 'Precio Costo Fraccionado',
      field: 'precioCostoFraccionado',
      sortable: true,
      type: 'number',
    },
    {
      header: 'Medida',
      field: 'nomMedida',
      sortable: true,
    },
    {
      header: 'Estado',
      field: 'nomEstado',
      sortable: true,
    },
  ];

  add(): void {
    this.openAddEdit();
  }

  edit(data: any): void {
    this.openAddEdit(data);
  }

  loadData(): void {
    const params = {
      pageIndex: this.page + 1,
      pageSize: this.pageSize,
      idArticulo: this.productId(),
    };
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);

    this.$fractionalProductService.getAll(params).subscribe({
      next: (response: any) => {
        this.isLoadingResults.set(false);
        const data = response.payload?.data ?? [];
        this.list.set(data);
        this.pageCount = response.payload?.totalRecords ?? 0;
      },
      error: (err: unknown) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  refresh(): void {
    this.loadData();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadData();
  }

  openAddEdit(item?: any): void {
    const data = {} as any;
    if (item) {
      data.id = item.idArticuloFraccionado;
    } else {
      data.productId = this.productId();
      data.isCalledFromProductModal = this.isCalledFromProductModal();
    }

    // Use AdvancedDialogService for consistency with brand-page pattern
    void this.openFractionalProductModal(data);
  }

  private async openFractionalProductModal(data: any): Promise<void> {
    const isEdit = !!data.id;
    const ref = await this.dgSvc.openInWrapper(
      {
        component: AddEditFractionalProduct,
        title: isEdit ? 'Editar Producto Fraccionado' : 'Nuevo Producto Fraccionado',
        icon: isEdit ? 'edit' : 'add',
        showCloseButton: true,
        data,
      },
      {
        size: 'xl',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  async askToDelete(data: any): Promise<void> {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        html: `<small>¿Está seguro/a de eliminar este Producto Fraccionado ahora?</small>`,
        confirmButtonText: 'Sí, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        // TODO: Implement delete/update status functionality
        console.log('Delete fractional product', data);
        this.tS.info({ message: 'Funcionalidad de eliminación pendiente de implementar' });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

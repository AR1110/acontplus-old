import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, Button, AdvancedDialogService,DataGridColumn } from '@acontplus/ng-components';
import { PageEvent } from '@angular/material/paginator';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MassiveTaxAdd } from '@inventory/ui/massive-tax-page/massive-tax-add/massive-tax-add';
import { finalize } from 'rxjs/operators';
import { MASSIVE_TAX_SERVICE } from '@inventory/data/inventory-token';

interface MassiveTaxRecord {
  id?: number;
  quantity: number;
  obs: string;
  createAt: string;
  user: string;
  totalRecords?: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-massive-tax-page',
  templateUrl: './massive-tax-page.html',
  imports: [BreadcrumbComponent, DataGrid, Button],
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
})
export class MassiveTaxPage implements OnInit {
  list = signal<MassiveTaxRecord[]>([]);
  isLoadingResults = signal(false);

  private readonly massiveTaxService = inject(MASSIVE_TAX_SERVICE);
  private dgSvc = inject(AdvancedDialogService);

  page = 0;
  pageSize = 10;
  pageCount = 0;

  columns: DataGridColumn[] = [
    {
      header: 'Op.',
      field: 'actions',
      sortable: false,
    },
    {
      header: '#',
      field: 'index',
      width: '60px',
      sortable: false,
    },
    {
      header: 'Cantidad Artículo',
      field: 'quantity',
      sortable: true,
    },
    {
      header: 'Observación',
      field: 'obs',
      sortable: true,
    },
    {
      header: 'Fecha Registro',
      field: 'createAt',
      sortable: true,
    },
    {
      header: 'Usuario',
      field: 'user',
      sortable: true,
    },
  ];

  add(): void {
    void this.openMassiveTaxModal();
  }

  private async openMassiveTaxModal(): Promise<void> {
    const ref = await this.dgSvc.openInWrapper(
      {
        component: MassiveTaxAdd,
        title: 'Cambio Masivo de Impuesto',
        icon: 'add',
        showCloseButton: true,
        data: {},
      },
      {
        size: 'lg',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  refresh(): void {
    this.getAll();
  }

  getAll(): void {
    try {
      if (this.isLoadingResults()) return;

      this.isLoadingResults.set(true);
      const params = {
        pageIndex: this.page + 1,
        pageSize: this.pageSize,
      };

      this.massiveTaxService
        .getAll(params)
        .pipe(finalize(() => this.isLoadingResults.set(false)))
        .subscribe({
          next: (response: MassiveTaxRecord[]) => {
            this.list.set(response);
            this.pageCount = this.list().length > 0 ? (this.list()[0].totalRecords ?? 0) : 0;
          },
          error: (err: unknown) => {
            console.error(err);
          },
        });
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit(): void {
    this.getAll();
  }

  handlePageEvent(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getAll();
  }
}

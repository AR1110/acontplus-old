import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { TARIFA_SERVICE } from '@inventory/data/inventory-token';
import { PrimaryStatusPipe } from '@shared/pipes/primary-status.pipe';
import { TarifaEditModalComponent } from '@inventory/ui/tarifa-page/tarifa-edit-modal/tarifa-edit-modal.component';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-tarifa-page',
  imports: [
    BreadcrumbComponent,
    PrimaryStatusPipe,
    MatButtonModule,
    DynamicCard,
    MatIconModule,
    MatTableModule,
    CustomTableContainerComponent,
  ],
  templateUrl: './tarifa-page.component.html',
  styles: ``,
})
export class TarifaPageComponent implements OnInit {
  tarifaSvc = inject(TARIFA_SERVICE);
  visibleColumns: string[] = [
    'index',
    'op',
    'code',
    'description',
    'default',
    'ventaPorMayor',
    'estado',
  ];
  dataSource = signal<any[]>([]);
  isLoadingResults = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;
  private modalSvc = inject(DialogService);

  getTarifas() {
    const params = {};
    this.isLoadingResults = true;
    this.tarifaSvc.getAll(params).subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.dataSource.set(response.tarifas);
      },
      error: () => (this.isLoadingResults = false),
    });
  }

  ngOnInit() {
    this.getTarifas();
  }

  refresh() {
    this.getTarifas();
  }

  onEdit(data: any) {
    const modalRef = this.modalSvc.open(TarifaEditModalComponent, {
      size: 'sm',
      data: data || {},
    });

    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getTarifas();
      }
    });
  }
}

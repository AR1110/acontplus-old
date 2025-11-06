import { PromotionAddEditModalComponent } from '../promotion-add-edit-modal/promotion-add-edit-modal.component';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { RestaurantStoreService } from '@restaurant/application/store/restaurant-store.service';
import { Button } from '@acontplus/ng-components';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { PromotionService } from '@restaurant/data/services/promotion.service';
import { Component, inject, model, signal, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPagination } from '@shared/models/pagination.model';
import { DialogService } from '@core/services/dialog.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-promotion-list',
  imports: [
    Button,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDynamicTableComponent,
    FormsModule,
  ],
  templateUrl: './promotion-list.component.html',
  styles: ``,
})
export class PromotionListComponent implements OnInit {
  private restaurantStore = inject(RestaurantStoreService);

  private modalSvc = inject(DialogService);
  private promotionSvc = inject(PromotionService);

  estabs = signal(this.restaurantStore.state().establecimientos);
  estabId = model(this.restaurantStore.state().establecimientoId);

  days = signal<any[]>([]);

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'img', label: 'Imagen', type: 'image' },
    { key: 'description', label: 'Descripción', type: 'string' },
    { key: 'startDate', label: 'Fecha Inicio', type: 'string' },
    { key: 'endDate', label: 'Fecha Fin', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);
  pagination = signal(new MatPagination());

  dataSource = signal<any>([]);

  openModalAddEdit<T>(data?: T) {
    const modalRef = this.modalSvc.open(PromotionAddEditModalComponent, {
      size: 'xl',
      data: {
        days: this.days(),
        data: (data && structuredClone(data)) || {},
      },
    });
    modalRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getPromotions();
      }
    });
  }

  private getPromotions() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      estabId: this.estabId(),
    };
    this.dataSource.set([]);
    this.promotionSvc.getAll(params).subscribe((response) => {
      this.dataSource.set(
        (response.promotions || []).map((item: any, index: number) => ({
          ...item,
          index: index + 1,
        })),
      );
      this.days.set(response.days);
      if (this.dataSource().length > 0) {
        this.pagination.update((e) => {
          return {
            ...e,
            totalRecords: this.dataSource()[0].totalRecords,
          };
        });
      }
    });
  }

  ngOnInit() {
    this.getPromotions();
  }

  refresh() {
    this.getPromotions();
  }

  onChangeEstab($event: any) {
    this.restaurantStore.state.update((e) => {
      return {
        ...e,
        establecimientoId: $event.value,
      };
    });
    this.refresh();
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }
}

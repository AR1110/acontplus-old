import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { Item } from '@restaurant/models/item.model';
import { ItemService } from '@restaurant/services/item.service';
import { Pagination } from '@shared/models/pagination.model';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    NgbPagination,
    FaIconComponent,
    NgOptimizedImage,
    FormsModule,
  ],
  templateUrl: './item-list.component.html',
  styles: ``,
})
export class ItemListComponent {
  items: Item[] = [];
  pagination = new Pagination();
  #itemService = inject(ItemService);

  loadData() {
    const obj = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
      tipo: 1,
    };
    this.#itemService.get(obj).subscribe((response) => {
      this.items = response;
      this.pagination.totalRecords = this.items[0]?.totalRecords ?? 0;
    });
  }

  ngOnInit() {
    this.loadData();
  }
}

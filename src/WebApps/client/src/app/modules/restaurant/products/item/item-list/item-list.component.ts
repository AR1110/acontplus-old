import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { Item } from '@restaurant/models/item.model';
import { ItemService } from '@restaurant/services/item.service';
import { Pagination } from '@shared/models/pagination.model';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@core/services/modal.service';
import { ItemAddEditModalComponent } from '@restaurant/products/item/item-add-edit-modal/item-add-edit-modal.component';
import { isValidField } from '@core/utils/utils';

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
  #modalService = inject(ModalService);

  loadData() {
    const obj = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
      tipo: 1,
      textSearch: isValidField(this.dataSearch.textSearch)
    };
    this.#itemService.get(obj).subscribe((response) => {
      this.items = response.items;
      this.pagination.totalRecords = this.items[0]?.totalRecords ?? 0;
    });
  }

  dataSearch = {
    textSearch: null as string | null
  }

  ngOnInit() {
    this.loadData();
  }

  refresh(){
    this.loadData()
  }

  onEdit(item: Item) {
    const modalRef = this.#modalService.openModalCustom(
      ItemAddEditModalComponent,
      {
        size: 'xl',
        centered: true,
      },
    );
    modalRef.componentInstance.data = item;
    modalRef.result.then((response) => {
      if (typeof response === 'object' && response.code === '1') {
        this.loadData();
      }
    });
  }
}

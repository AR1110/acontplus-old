import { Component, inject, signal } from '@angular/core';
import { Menu } from '@restaurant/domain/models/menu.model';
import { MenuService } from '@restaurant/data/services/menu.service';
import { ToasterService } from '@core/services/toaster.service';
import { Pagination } from '@shared/models/pagination.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import { MenuAddEditModalComponent } from '@restaurant/ui/menu/menu-add-edit-modal/menu-add-edit-modal.component';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader} from "@angular/material/card";

@Component({
    selector: 'app-menu-list',
  imports: [FaIconComponent, MatCardContent, MatCard, MatCardHeader, MatCardFooter],
    templateUrl: './menu-list.component.html',
    styles: ``
})
export class MenuListComponent {
  menus: Menu[] = [];
  pagination = signal(new Pagination());
  private readonly _menuService = inject(MenuService);
  private readonly _modalService = inject(ModalService);
  private readonly _tS = inject(ToasterService);

  loadData() {
    const obj = {
      // pageIndex: this.pagination().pageIndex,
      // pageSize: this.pagination().pageSize,
      tipo: 1,
    };
    this._menuService.get(obj).subscribe((response) => {
      this.menus = response.menus;
      // this.pagination().totalRecords = this.menus[0]?.totalRecords ?? 0;
    });
  }

  ngOnInit() {
    this.loadData();
  }

  onEdit(item: Menu) {
    const modalRef = this._modalService.openModalCustom(
      MenuAddEditModalComponent,
      {
        size: 'xl',
      },
    );
    modalRef.componentInstance.data = item;
  }
}

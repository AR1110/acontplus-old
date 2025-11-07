import { MenuAddEditModalComponent } from '@restaurant/ui/menu/menu-add-edit-modal/menu-add-edit-modal.component';
import { MenuService } from '@restaurant/data/services/menu.service';
import { Component, inject, signal, OnInit } from '@angular/core';
import { Pagination } from '@acontplus/ng-components';
import { Menu } from '@restaurant/domain/models/menu.model';

import { DialogService } from '@core/services/dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu-list',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
})
export class MenuListComponent implements OnInit {
  menus = signal<any[]>([]);
  pagination = signal(new Pagination());
  private readonly _menuService = inject(MenuService);
  private readonly _modalService = inject(DialogService);

  loadData() {
    const obj = {
      pageIndex: this.pagination().pageIndex,
      pageSize: this.pagination().pageSize,
      tipo: 1,
    };
    this._menuService.get(obj).subscribe((response) => {
      this.menus.set(response.menus);
      // this.pagination().totalRecords = this.menus[0]?.totalRecords ?? 0;
    });
  }

  ngOnInit() {
    this.loadData();
  }

  onEdit(item: Menu) {
    this._modalService
      .open(MenuAddEditModalComponent, {
        size: 'xl',
        data: structuredClone(item),
      })
      .subscribe((result) => {
        if (result && typeof result === 'object') {
          this.loadData();
        }
      });
  }
}

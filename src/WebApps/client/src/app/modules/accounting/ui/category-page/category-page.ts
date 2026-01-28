import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CategoryModalComponent } from '@accounting/ui/category-page/category-modal/category-modal.component';
import { SecondaryStatusPipe } from '@shared/pipes/secondary-status.pipe';
import { CATEGORY_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { Category } from '@accounting/data/models/category';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DataGrid, DataGridColumn, Button } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';

import {AdvancedDialogService} from '@acontplus/ng-components'
@Component({
  selector: 'app-category-page',
  imports: [
    BreadcrumbComponent,
    SecondaryStatusPipe,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DataGrid,
    Button,
  ],
  templateUrl: './category-page.html',
  styles: ``,
})
export class CategoryPage implements OnInit {
  categories = signal<Category[]>([]);
  data: Category = {} as Category;
  private _categoryHttp = inject(CATEGORY_HTTP_TOKEN);
  private readonly modalService = inject(AdvancedDialogService);

  columnsDefs: DataGridColumn[] = [
    { field: 'op', header: 'Opciones' },
    { field: 'index', header: '#' },
    { field: 'tipoName', header: 'Tipo' },
    { field: 'code', header: 'Código' },
    { field: 'name', header: 'Nombre' },
    { field: 'enabled', header: 'Estado' },
  ];

  edit(item: Category) {
    this.data = item;
    this.onModalOpen();
  }

  get() {
    this._categoryHttp.get({ tipo: 1 }).subscribe((response) => {
      if (response.code == '1') {
        const { categories } = JSON.parse(response.payload as string);
        this.categories.set(categories);
      }
    });
  }

  ngOnInit(): void {
    this.get();
  }

  async onModalOpen() {
    const modalRef = await this.modalService.openInWrapper({
      component: CategoryModalComponent,
      title: this.data.id>0?'Editar Categoria': 'Nuevo Categoria',
      data: this.data.id > 0 ? structuredClone(this.data) : {},

    }, {
      size: 'sm',
    });

    modalRef.afterClosed().subscribe((response:any) => {
      if (response !== null && typeof response === 'object') {
        this.get();
      }
      this.data = {} as Category;
    });
  }
}

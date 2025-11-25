import { Component, inject, signal, OnInit } from '@angular/core';
import { isApiResponse } from '@core/models/api-response-legacy';

import { Brand } from '@modules/technical-support/models/brand';
import { BrandService } from '@modules/technical-support/services/brand.service';
import { BrandModalComponent } from './brand-modal/brand-modal.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-brand-page',
  imports: [BreadcrumbComponent, MatButton, MatIcon, Button, DynamicCard],
  templateUrl: './brand-page.component.html',
  styles: ``,
})
export class BrandPageComponent implements OnInit {
  private brandService = inject(BrandService);
  private modalService = inject(DialogService);
  brands = signal<Brand[]>([]);
  brandSelected: Brand = {
    id: 0,
    code: '',
    name: '',
    categoryName: '',
    categoryId: 0,
  };
  ngOnInit(): void {
    this.onGet();
  }
  onEdit(item: Brand) {
    this.brandSelected = item;
    this.onModalOpen();
  }
  onGet() {
    this.brandService.get({ tipo: 1 }).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            this.brands.set(JSON.parse(response.payload as string));
          }
        }
      },
      error(err) {
        console.error(err);
      },
      complete() {},
    });
  }
  onModalOpen() {
    const modalRef = this.modalService.open(BrandModalComponent, {
      size: 'lg',
      data: this.brandSelected.id > 0 ? structuredClone(this.brandSelected) : {},
    });

    modalRef.subscribe((response) => {
      if (this.brandSelected.id > 0) {
        this.brandSelected = {} as Brand;
      }
      if (response !== null && typeof response == 'object') {
        this.onGet();
      }
    });
  }

  onDelete(item: Brand) {}
}

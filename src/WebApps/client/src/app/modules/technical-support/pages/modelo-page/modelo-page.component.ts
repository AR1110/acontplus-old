import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response-legacy';
import { Modelo } from '@modules/technical-support/models/modelo';
import { ModeloService } from '@modules/technical-support/services/modelo.service';
import { ModeloModalComponent } from './modelo-modal/modelo-modal.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';

@Component({
  selector: 'app-modelo-page',
  imports: [BreadcrumbComponent, MatButton, MatIcon, Button, DynamicCard],
  templateUrl: './modelo-page.component.html',
  styles: ``,
})
export class ModeloPageComponent implements OnInit {
  private modeloService = inject(ModeloService);
  private modalService = inject(DialogService);
  modelos = signal<Modelo[]>([]);
  modeloSelected: Modelo = {
    id: 0,
    code: '',
    name: '',
    brandId: 0,
    brandName: '',
    categoryName: '',
  };
  ngOnInit(): void {
    this.onGet();
  }
  onEdit(item: Modelo) {
    this.modeloSelected = item;
    this.onModalOpen();
  }
  onGet() {
    this.modeloService.get({ tipo: 1 }).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            this.modelos.set(JSON.parse(response.payload as string));
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
    const modalRef = this.modalService.open(ModeloModalComponent, {
      size: 'lg',
      data: this.modeloSelected.id > 0 ? structuredClone(this.modeloSelected) : {},
    });

    modalRef.subscribe((response) => {
      if (this.modeloSelected.id > 0) {
        this.modeloSelected = {} as Modelo;
      }
      if (response !== null && typeof response == 'object') {
        this.onGet();
      }
    });
  }

  onDelete(item: Modelo) {}
}

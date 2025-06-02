import { Component, inject, ViewChild, OnInit, signal } from '@angular/core';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import swal from 'sweetalert2';
import { ProductionAreaService } from '@restaurant/data/services/production-area.service';
import { ProductionAreaAddEditModalComponent } from '@restaurant/ui/production-area/production-area-add-edit-modal/production-area-add-edit-modal.component';

import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { DialogService } from '@core/services/dialog.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { ProductionArea } from '@modules/restaurant/domain/models/production-area';

@Component({
  selector: 'app-production-area-list',
  imports: [
    FormsModule,
    MatButton,
    NgClass,
    MatIcon,
    MatTabsModule,
    ThemeButtonComponent,
    MatDynamicCardComponent,
  ],
  templateUrl: './production-area-list.component.html',
  styles: ``,
})
export class ProductionAreaListComponent implements OnInit {
  establecimientoId = 0;
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  data = {} as ProductionArea;
  productionAreas: ProductionArea[] = [];
  #productionAreaService = inject(ProductionAreaService);
  #modalService = inject(DialogService);
  #sharedService = inject(SharedService);
  #tS = inject(ToasterService);

  selected = signal(0);

  selectedIndexChange($event: number) {
    this.selected.set($event);
    if (this.establecimientos.length > 0) {
      this.loadData(this.establecimientos[$event].idEstablecimiento);
    }
  }
  loadData(idEstablecimiento: number) {
    // if (!this.panelOpenState()) {
    //   return;
    // }
    this.establecimientoId = idEstablecimiento;
    this.#productionAreaService
      .getByEstab(this.establecimientoId)
      .subscribe((response) => {
        this.productionAreas = (response.payload as ProductionArea[]) || [];
      });
  }

  getEstabs() {
    this.#sharedService.getEstabAsign().subscribe((response) => {
      this.establecimientos = response;
    });
  }

  ngOnInit(): void {
    this.getEstabs();
  }

  onEdit(item: ProductionArea) {
    this.data = item;
    this.onModalOpen();
  }

  onDelete(item: ProductionArea) {
    swal
      .fire({
        icon: 'warning',
        title: 'Aviso!',
        text: `Esta seguro/a de eliminar esta área de producción: ${item.description}?`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        showCancelButton: true,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.#productionAreaService.delete(item.id).subscribe((result) => {
            this.#tS.toastr({
              type: result.code == '1' ? 'success' : 'warning',
              message: result.message,
            });
            if (result.code == '1') {
              this.loadData(this.establecimientoId);
            }
          });
        }
      });
  }

  onModalOpen() {
    const modalRef = this.#modalService.open(
      ProductionAreaAddEditModalComponent,
      {
        size: 'sm',
        data: Object.assign(this.data, {
          establecimientoId: this.establecimientoId,
        }),
      }
    );

    modalRef.subscribe((response) => {
      if (typeof response == 'object') {
        if (response.code == '1') {
          this.loadData(this.establecimientoId);
        }
        this.data = {} as ProductionArea;
      }
    });
  }

  onPanelToggle(item: EstablecimientoSelectHtmlOnly) {
    if (!this.accordionItem) return;
    const isOpen = !this.accordionItem.collapsed;
    if (isOpen) {
      this.loadData(item.idEstablecimiento);
    }
  }
}

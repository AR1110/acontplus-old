import { Component, inject, ViewChild } from '@angular/core';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import swal from 'sweetalert2';
import { ProductionAreaService } from '@restaurant/services/production-area.service';
import { ProductionAreaAddEditModalComponent } from '@restaurant/infrastructure/production-area/production-area-add-edit-modal/production-area-add-edit-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  NgbAccordionItem,
  NgbAccordionModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ProductionArea } from '@restaurant/models/production-area';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-production-area-list',
    imports: [
        FaIconComponent,
        FormsModule,
        MatButton,
        NgbAccordionModule,
        NgClass,
    ],
    templateUrl: './production-area-list.component.html',
    styles: ``
})
export class ProductionAreaListComponent {
  @ViewChild('accordionItem') accordionItem: NgbAccordionItem | undefined;

  establecimientoId: number = 0;
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  data = {} as ProductionArea;
  productionAreas: ProductionArea[] = [];
  #productionAreaService = inject(ProductionAreaService);
  #modalService = inject(ModalService);
  #sharedService = inject(SharedService);
  #tS = inject(ToasterService);

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
    const modalRef = this.#modalService.openModalCustom(
      ProductionAreaAddEditModalComponent,
      {
        size: 'sm',
        centered: true,
      },
    );
    const modalData = Object.assign(this.data, {
      establecimientoId: this.establecimientoId,
    });
    modalRef.componentInstance.data = modalData;
    if (this.data.id > 0) {
      modalRef.componentInstance.data = modalData;
    }
    modalRef.result.then((response) => {
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

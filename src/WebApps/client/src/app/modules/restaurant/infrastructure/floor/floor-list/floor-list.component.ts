import { Component, inject, ViewChild } from '@angular/core';
import { Floor } from '@restaurant/models/floor.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import { FloorAddEditModalComponent } from '@restaurant/infrastructure/floor/floor-add-edit-modal/floor-add-edit-modal.component';
import { FloorService } from '@restaurant/services/floor.service';
import { SharedService } from '@core/services/shared.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import {
  NgbAccordionItem,
  NgbAccordionModule,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-floor-list',
  standalone: true,
  imports: [
    FaIconComponent,
    NgbAccordionModule,
    MatExpansionModule,
    MatButton,
    NgClass,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownToggle,
  ],
  templateUrl: './floor-list.component.html',
  styles: ``,
})
export class FloorListComponent {
  @ViewChild('accordionItem') accordionItem: NgbAccordionItem | undefined;

  codEstab: string = '';
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  data = {} as Floor;
  floors: Floor[] = [];
  #floorService = inject(FloorService);
  #modalService = inject(ModalService);
  #sharedService = inject(SharedService);
  #tS = inject(ToasterService);

  loadData(codEstab: string) {
    // if (!this.panelOpenState()) {
    //   return;
    // }
    this.codEstab = codEstab;
    this.#floorService.getByEstab(codEstab).subscribe((response) => {
      this.floors = (response.payload as Floor[]) || [];
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

  onEdit(item: Floor) {
    this.data = item;
    this.onModalOpen();
  }

  onDelete(item: Floor) {
    swal
      .fire({
        icon: 'warning',
        title: 'Aviso!',
        text: `Esta seguro/a de eliminar este piso: ${item.description}?`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        showCancelButton: true,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.#floorService.delete(item.id).subscribe((result) => {
            this.#tS.toastr({
              type: result.code == '1' ? 'success' : 'warning',
              message: result.message,
            });
            if (result.code == '1') {
              this.loadData(this.codEstab);
            }
          });
        }
      });
  }

  onModalOpen() {
    const modalRef = this.#modalService.openModalCustom(
      FloorAddEditModalComponent,
      {
        size: 'lg',
        centered: true,
      },
    );
    const modalData = Object.assign(this.data, { codEstab: this.codEstab });
    modalRef.componentInstance.data = modalData;
    if (this.data.id > 0) {
      modalRef.componentInstance.data = modalData;
    }
    modalRef.result.then((response) => {
      if (typeof response == 'object') {
        if (response.code == '1') {
          this.loadData(this.codEstab);
        }
        this.data = {} as Floor;
      }
    });
  }

  onPanelToggle(item: EstablecimientoSelectHtmlOnly) {
    if (!this.accordionItem) return;
    const isOpen = !this.accordionItem.collapsed;
    if (isOpen) {
      this.loadData(item.codEstab);
    }
  }
}

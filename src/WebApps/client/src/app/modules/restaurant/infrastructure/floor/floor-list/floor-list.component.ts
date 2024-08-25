import { Component, inject, signal } from '@angular/core';
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
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-floor-list',
  standalone: true,
  imports: [
    FaIconComponent,
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
  readonly panelOpenState = signal(false);
  codEstab: string = '';
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  data = {} as Floor;
  floors: Floor[] = [];
  #floorService = inject(FloorService);
  #modalService = inject(ModalService);
  #sharedService = inject(SharedService);

  loadData(estab: EstablecimientoSelectHtmlOnly) {
    if (!this.panelOpenState()) {
      return;
    }
    this.codEstab = estab.codEstab;
    this.#floorService.getByEstab(estab.codEstab).subscribe((response) => {
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

  onDelete(item: Floor) {}

  onModalOpen() {
    const modalRef = this.#modalService.openModalCustom(
      FloorAddEditModalComponent,
      {
        size: 'lg',
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
          this.getEstabs();
        }
        this.data = {} as Floor;
      }
    });
  }
}

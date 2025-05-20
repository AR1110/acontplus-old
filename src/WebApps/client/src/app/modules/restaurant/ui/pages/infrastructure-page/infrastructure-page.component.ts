import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

import { RoomListComponent } from '@restaurant/ui/room/room-list/room-list.component';
import { FloorListComponent } from '@restaurant/ui/floor/floor-list/floor-list.component';
import { TableListComponent } from '@restaurant/ui/table/table-list/table-list.component';
import {MatCard, MatCardContent} from "@angular/material/card";


@Component({
    selector: 'app-infrastructure-page',
    imports: [
        BreadcrumbComponent,
        MatTabGroup,
        MatTab,
        RoomListComponent,
        FloorListComponent,
        TableListComponent,
        MatCard,
        MatCardContent,
    ],
    templateUrl: './infrastructure-page.component.html',
    styles: ``
})
export class InfrastructurePageComponent {
  isRoomTabActive: boolean = false;
  isTableTabActive: boolean = false;
  isProductionAreaTabActive: boolean = false;

  onTabChange(event: MatTabChangeEvent) {
    // Verificamos si la pestaña seleccionada es la de 'Salas'
    switch (event.index) {
      case 1: // '1' es el índice de la pestaña 'Salas'
        this.isRoomTabActive = true;
        break;
      case 2:
        this.isTableTabActive = true;
        break;
      case 3:
        this.isProductionAreaTabActive = true;
        break;
    }
  }
}

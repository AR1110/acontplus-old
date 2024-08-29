import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { MatCard } from '@angular/material/card';
import { RoomListComponent } from '@restaurant/infrastructure/room/room-list/room-list.component';
import { FloorListComponent } from '@restaurant/infrastructure/floor/floor-list/floor-list.component';
import { TableListComponent } from '@restaurant/infrastructure/table/table-list/table-list.component';

@Component({
  selector: 'app-infrastructure-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTabGroup,
    MatTab,
    MatCard,
    RoomListComponent,
    FloorListComponent,
    TableListComponent,
  ],
  templateUrl: './infrastructure-page.component.html',
  styles: ``,
})
export class InfrastructurePageComponent {
  isRoomTabActive = false;
  isTableTabActive = false;

  onTabChange(event: MatTabChangeEvent) {
    // Verificamos si la pestaña seleccionada es la de 'Salas'
    switch (event.index) {
      case 1: // '1' es el índice de la pestaña 'Salas'
        this.isRoomTabActive = true;
        break;
      case 2:
        this.isTableTabActive = true;
        break;
    }
  }
}

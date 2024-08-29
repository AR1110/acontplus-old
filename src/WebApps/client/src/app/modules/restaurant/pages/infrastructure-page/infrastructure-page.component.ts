import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { MatCard } from '@angular/material/card';
import { TablePageComponent } from '@restaurant/pages/table-page/table-page.component';
import { RoomListComponent } from '@restaurant/infrastructure/room/room-list/room-list.component';
import { FloorListComponent } from '@restaurant/infrastructure/floor/floor-list/floor-list.component';

@Component({
  selector: 'app-infrastructure-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTabGroup,
    MatTab,
    MatCard,
    TablePageComponent,
    RoomListComponent,
    FloorListComponent,
  ],
  templateUrl: './infrastructure-page.component.html',
  styles: ``,
})
export class InfrastructurePageComponent {
  isRoomTabActive = false;

  onTabChange(event: MatTabChangeEvent) {
    // Verificamos si la pestaña seleccionada es la de 'Salas'
    if (event.index === 1) {
      // '1' es el índice de la pestaña 'Salas'
      this.isRoomTabActive = true;
    }
  }
}

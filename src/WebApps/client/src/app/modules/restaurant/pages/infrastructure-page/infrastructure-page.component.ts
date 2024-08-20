import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
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
export class InfrastructurePageComponent {}

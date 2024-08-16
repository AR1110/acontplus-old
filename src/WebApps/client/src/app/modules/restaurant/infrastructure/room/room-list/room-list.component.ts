import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatButton } from '@angular/material/button';
import { Room } from '@restaurant/models/room.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [FaIconComponent, MatButton, NgClass],
  templateUrl: './room-list.component.html',
  styles: ``,
})
export class RoomListComponent {
  rooms: Room[] = [];

  onModalOpen() {}

  onEdit(item: Room) {}

  onDelete(item: Room) {}
}

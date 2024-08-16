import { Component } from '@angular/core';
import { Floor } from '@restaurant/models/floor.model';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-floor-list',
  standalone: true,
  imports: [NgClass, MatButton, FaIconComponent],
  templateUrl: './floor-list.component.html',
  styles: ``,
})
export class FloorListComponent {
  floors: Floor[] = [];

  onEdit(item: Floor) {}

  onDelete(item: Floor) {}

  onModalOpen() {}
}

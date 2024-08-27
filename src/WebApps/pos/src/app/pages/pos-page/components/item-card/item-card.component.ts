import { ItemRead } from '@/models/item.model';
import { Component, input, output } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss'
})
export class ItemCardComponent {
  item = input.required<ItemRead>();
  
  isSelectedItem = input(false);
  uniqueItemSelected = input<string | null>(null)
  onSelect = output<ItemRead>()
}

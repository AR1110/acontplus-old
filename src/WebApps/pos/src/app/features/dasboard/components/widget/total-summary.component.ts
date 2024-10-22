import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-total-summary',
  standalone: true,
  imports: [MatIcon],
  template: `
      <div class="d-flex gap-2 align-items-center">
    <p class="stat">
      {{total}}

    </p>
    <mat-icon class="text-white">arrow_circle_up</mat-icon>
   </div>
  `,
})
export class TotalSummaryComponent {
  total =Math.floor(Math.random() * 900) + 101;
}

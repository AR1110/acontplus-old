import {
  Component,
  computed,
  Inject,
  input,
  Input,
  SimpleChanges,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-total-summary',
  imports: [MatIcon],
  template: `
    <div class="d-flex gap-2 align-items-center">
      <p class="stat">
        {{ count() }}
      </p>
      <mat-icon class="text-white">arrow_circle_up</mat-icon>
    </div>
  `,
})
export class TotalSummaryComponent {
  count = input(0);
}

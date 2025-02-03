import { Component, Inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-total-summary',
    imports: [MatIcon],
    template: `
      <div class="d-flex gap-2 align-items-center">
    <p class="stat">
      {{input  }}
    </p>
    <mat-icon class="text-white">arrow_circle_up</mat-icon>
   </div>
  `
})
export class TotalSummaryComponent {
  @Input() input= 0;

  // constructor(@Inject('input') public injectedInput: number) {
  //   this.input = injectedInput
  // }
}

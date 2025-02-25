import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-custom-mat-spinner',
  imports: [MatProgressSpinnerModule],
  template: `@if (isLoadingResults() ) {
    <div class="loading-shade">
      @if (isLoadingResults()) {
      <mat-spinner [diameter]="50"></mat-spinner>
      }
    </div>
    } `,
  styles: `.loading-shade {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 56px;
    right: 0;
    background: rgba(0, 0, 0, 0.15);
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rate-limit-reached {
    max-width: 360px;
    text-align: center;
  }
  `,
})
export class CustomMatSpinnerComponent {
  isLoadingResults = input.required<boolean>();
  isRateLimitReached = input(false);
}

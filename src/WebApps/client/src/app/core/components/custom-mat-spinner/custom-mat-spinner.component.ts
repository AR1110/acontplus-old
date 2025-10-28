import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-custom-mat-spinner',
  imports: [MatProgressSpinnerModule],
  template: `
    @if (isLoadingResults() || isRateLimitReached()) {
      <div class="loading-shade">
        @if (isLoadingResults()) {
          <mat-spinner [diameter]="50"></mat-spinner>
        }
        @if (isRateLimitReached()) {
          <div class="rate-limit-reached">
            GitHub's API rate limit has been reached. It will be reset in one minute.
          </div>
        }
      </div>
    }
  `,
  styles: `
    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 56px;
      right: 0;
      background: rgba(0, 0, 0, 0.15);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
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

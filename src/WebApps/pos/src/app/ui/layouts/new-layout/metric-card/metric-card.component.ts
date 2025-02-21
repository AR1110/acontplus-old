import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-metric-card',
  template: `
    <mat-card class="metric-card" appearance="outlined">
      <div class="metric-header">
        <mat-icon>pending_actions</mat-icon>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item>
            <mat-icon>refresh</mat-icon>
            <span>Refresh</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
        </mat-menu>
      </div>
      <div class="metric-value">{{ metric.value }}</div>
      <div class="metric-title">{{ metric.title }}</div>
    </mat-card>
  `,
  styles: [
    `
      .metric-card {
        background-color: var(--metric-card-bg) !important;
        padding: 20px;
        height: 100%;
        box-sizing: border-box;
      }

      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        mat-icon {
          color: var(--color-pink);
        }
      }

      .metric-value {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--color-pink);
      }

      .metric-title {
        color: var(--text-secondary);
        font-size: 14px;
      }
    `,
  ],
  imports: [MatCardModule, MatIconModule, MatMenuModule, MatButtonModule],
})
export class MetricCardComponent {
  @Input() metric: any;
}

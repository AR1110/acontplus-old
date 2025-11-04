import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { AdminLayoutService } from '@core/services/admin-layout.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notification',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon
        [matBadge]="adminLayoutSvc.getNotifications().length"
        matBadgeColor="warn"
        aria-hidden="false"
        >notifications</mat-icon
      >
    </button>

    <mat-menu #menu="matMenu" class="notifications-menu">
      @for (noti of adminLayoutSvc.getNotifications(); track $index) {
        <button mat-menu-item class="notification-item">
          <mat-icon [ngClass]="'icon-' + noti.type">{{ noti.icon }}</mat-icon>
          <div class="notification-content">
            <div class="notification-title">{{ noti.title }}</div>
            <div class="notification-message">{{ noti.message }}</div>
          </div>
          <a [href]="" target="_blank" class="see-more">Ver más!</a>
        </button>
      }
    </mat-menu>
  `,
  styles: `
    :host ::ng-deep .mat-badge-content {
      --mat-badge-background-color: #ef0000;
      --mat-badge-text-color: #fff;
    }

    .notifications-menu {
      width: 360px;
      max-height: 450px;
      overflow-y: auto;
      padding: 0;

      .notification-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        .mat-icon {
          font-size: 24px;
          flex-shrink: 0;

          &.icon-info {
            color: #facc15;
          }
          &.icon-warning {
            color: #f97316;
          }
          &.icon-error {
            color: #ef4444;
          }
          &.icon-success {
            color: #22c55e;
          }
        }

        .notification-content {
          flex: 1;
          margin-left: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;

          .notification-title {
            font-weight: 600;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .notification-message {
            font-size: 12px;
            margin-top: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .notification-time {
            font-size: 11px;
            color: var(--mat-text-hint, #9ca3af);
            margin-top: 2px;
          }
        }

        .see-more {
          font-size: 12px;
          color: #3b82f6;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          margin-left: 8px;
          text-transform: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      > button {
        font-weight: 500;
        font-size: 13px;
        color: #3b82f6;
        text-transform: none;
        justify-content: center;

        &:hover {
          background-color: var(--mat-hover-background, #f3f4f6);
        }
      }
    }

    /* Badge */
    .badge {
      background-color: #ef4444;
      color: #ffffff;
      border-radius: 9999px;
      padding: 0 6px;
      font-size: 12px;
      position: absolute;
      top: 4px;
      right: 4px;
      line-height: 18px;
      text-align: center;
      min-width: 18px;
    }
  `,
  imports: [MatBadgeModule, MatButtonModule, MatIconModule, MatListModule, MatMenuModule, NgClass],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationButton {
  adminLayoutSvc = inject(AdminLayoutService);
  messages = ['Server Error Reports 1', 'Server Error Reports 2', 'Server Error Reports 3'];
}

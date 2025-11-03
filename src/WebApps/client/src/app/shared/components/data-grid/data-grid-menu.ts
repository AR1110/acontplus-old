import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component, input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {DataGridMenuItem} from "@shared/components/data-grid/types";
import {DataGridCellActionDisablePipe} from "@shared/pipes/data-grid.pipe";

@Component({
  selector: 'acp-data-grid-menu',
  exportAs: 'acpDataGridMenu',
  template: `
    <mat-menu class="mtx-grid-menu">
      @for (item of items(); track $index) {
        @if (!item.iif || item.iif(data())) {
          @if (item.children && item.children.length > 0) {
            <button
              mat-menu-item
              [matMenuTriggerFor]="gridMenu.menu"
              [disabled]="item | cellActionDisable: data()"
              [class]="item.class"
              (click)="item.click?.(data())"
            >
              <mat-icon *ngTemplateOutlet="iconTpl; context: { $implicit: item }" />
              <span>{{ item.text }}</span>
            </button>

            <acp-data-grid-menu #gridMenu [items]="item.children" [data]="data()" />
          } @else {
            <button
              mat-menu-item
              [disabled]="item | cellActionDisable: data()"
              [class]="item.class"
              (click)="item.click?.(data())"
            >
              <mat-icon *ngTemplateOutlet="iconTpl; context: { $implicit: item }" />
              <span>{{ item.text }}</span>
            </button>
          }
        }
      }
    </mat-menu>

    <ng-template #iconTpl let-item>
      @if (item.icon) {
        <mat-icon class="mtx-grid-icon">{{ item.icon }}</mat-icon>
      } @else if (item.fontIcon) {
        <mat-icon class="mtx-grid-icon" [fontIcon]="item.fontIcon" />
      } @else if (item.svgIcon) {
        <mat-icon class="mtx-grid-icon" [svgIcon]="item.svgIcon" />
      }
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatIcon,
    DataGridCellActionDisablePipe,
  ],
})
export class DataGridMenu {
  @ViewChild(MatMenu, { static: true }) menu!: MatMenu;

    items = input<DataGridMenuItem[]>([]);
    data = input< Record<string, any>>({});

}

import { Component, inject, input, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { Widget } from '../../interfaces/widget.interface';
import { DashboardStore } from '../../store/dashboard.store';

@Component({
    selector: 'app-widget-options',
    imports: [MatButtonModule, MatIcon, MatButtonToggleModule],
    template: `
  <button mat-icon-button class="close-button-w-options" (click)="showOptions.set(false)">
    <mat-icon>close</mat-icon>
  </button>
  <div  >
    Ancho
    <mat-button-toggle-group hideSingleSelectionIndicator="true" [value]="data().columns?? 1" (change)="dashboardStore.updateWidget(data().id, {columns: +$event.value})">
      <mat-button-toggle [value]="1">1</mat-button-toggle>
      <mat-button-toggle [value]="2">2</mat-button-toggle>
      <mat-button-toggle [value]="3">3</mat-button-toggle>
      <mat-button-toggle [value]="4">4</mat-button-toggle>
    </mat-button-toggle-group>
  </div>

  <div  >
    Altura
    <mat-button-toggle-group hideSingleSelectionIndicator="true" [value]="data().rows?? 1" (change)="dashboardStore.updateWidget(data().id, {rows: +$event.value})">
      <mat-button-toggle [value]="1">1</mat-button-toggle>
      <mat-button-toggle [value]="2">2</mat-button-toggle>
      <mat-button-toggle [value]="3">3</mat-button-toggle>
      <mat-button-toggle [value]="4">4</mat-button-toggle>
    </mat-button-toggle-group>
  </div>
  `,
    styles: `
   :host {
    position:absolute;
    z-index: 2;
    background:var(--mdc-elevated-card-container-color);
    color:inherit;
    top:0;
    left:0;
    border-radius: inherit;
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    box-sizing: border-box;
    --mat-standard-button-toggle-height:16px;
    > div {
      display:flex;
      gap:8px;
      align-items: center;
      margin-bottom:8px;
    }
   }

   .close-button-w-options{
    position:absolute;
    top: 0;
    right:0;
   }

  `
})
export class WidgetOptionsComponent {
  data = input.required<Widget>()
  showOptions = model(false)

  dashboardStore = inject(DashboardStore)
}

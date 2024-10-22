import { Component, input, signal } from '@angular/core';
import { Widget } from '../../interfaces/widget.interface';
import { NgComponentOutlet, NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WidgetOptionsComponent } from './widget-options.component';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    NgComponentOutlet,
    NgStyle,
    WidgetOptionsComponent
  ],
  template: `
  <div class="w-container mat-elevation-z3"
  [ngStyle]="{
    'background-color': data().backgroundColor || 'white',
    'color': data().color || 'white'
    }"
  >
    <h6 class="m-0">
      {{data().label}}
    </h6>
    <button mat-icon-button class="settings-button"
     (click)="showOptions.set(true)"
     [style.--mdc-icon-button-icon-color]="data().color ?? 'inherit'"

     >
      <mat-icon>settings</mat-icon>
    </button>
    <ng-container [ngComponentOutlet]="data().content"></ng-container>

    @if(showOptions()){

      <app-widget-options [data]="data()"  [(showOptions)]="showOptions"/>
    }
  </div>
  `,
  styles:  `
    :host {
      display: block;
      border-radius: 16px;
    }

    .w-container {
      position: relative;
      height:100%;
      width:100%;
      padding:32px;
      box-sizing: border-box;
      border-radius: inherit;
      overflow:hidden;
    }

    .settings-button{
      position: absolute;
      top:20px;
      right:20px;
    }
  `,
  host: {
    '[style.grid-area]': '"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)'
  }
})
export class WidgetComponent {
  data = input.required<Widget>()

  showOptions = signal(false)
}

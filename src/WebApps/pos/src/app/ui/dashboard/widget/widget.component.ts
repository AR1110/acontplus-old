import { Component, Injector, input, signal } from '@angular/core';
import { Widget } from '@domain/models/widget.model';
import { CommonModule, NgComponentOutlet, NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WidgetOptionsComponent } from './widget-options.component';

@Component({
  selector: 'app-widget',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    NgComponentOutlet,
    NgStyle,
    WidgetOptionsComponent,
  ],
  template: `
    <div
      class="w-container mat-elevation-z3"
      [ngStyle]="{
        'background-color': data().backgroundColor || 'inherit',
        color: data().color || 'inherit'
      }"
    >
      <h6 class="m-0">
        {{ data().label }}
      </h6>
      <button
        mat-icon-button
        class="settings-button"
        (click)="showOptions.set(true)"
        [style.--mdc-icon-button-icon-color]="data().color ?? 'inherit'"
      >
        <mat-icon>settings</mat-icon>
      </button>
      @if(data().input){
      <ng-template
        [ngComponentOutlet]="data().content"
        [ngComponentOutletInputs]="data().props"
      ></ng-template>
      }@else {
      <ng-template *ngComponentOutlet="data().content"></ng-template>

      } @if(showOptions()){

      <app-widget-options [data]="data()" [(showOptions)]="showOptions" />
      }
    </div>
  `,
  styles: `
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
    '[style.grid-area]':
      '"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)',
  },
})
export class WidgetComponent {
  data = input.required<Widget>();

  showOptions = signal(false);

  constructor(private injector: Injector) {}

  createInjector(item: Widget) {
    console.log(item);
    return Injector.create({
      providers: [
        {
          provide: 'input', // Proveer un valor usando una clave
          useValue: 100, // Usar null si no hay valor
        },
      ],
      // parent: this.injector,
    });
  }
}

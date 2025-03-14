import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  imports: [MatProgressSpinner],
  templateUrl: './spinner.component.html',
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  `,
})
export class SpinnerComponent {}

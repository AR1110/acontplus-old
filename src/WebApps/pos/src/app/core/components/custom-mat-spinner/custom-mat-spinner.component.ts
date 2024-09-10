import {Component, input} from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-custom-mat-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ],
  templateUrl: './custom-mat-spinner.component.html',
  styleUrl: './custom-mat-spinner.component.scss'
})
export class CustomMatSpinnerComponent {
  isLoadingResults = input.required<boolean>()
  isRateLimitReached = input.required<boolean>()
}

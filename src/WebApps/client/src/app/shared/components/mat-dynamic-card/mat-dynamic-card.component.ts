import {Component, input, output, ChangeDetectionStrategy} from '@angular/core';
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-mat-dynamic-card',
  imports: [
    MatCardModule
  ],
  templateUrl: './mat-dynamic-card.component.html',
  styles: `

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDynamicCardComponent {

    title = input<string | null>(null);
   subtitle = input<string | null>(null);
   primaryActionLabel = input('Aceptar');
   secondaryActionLabel = input('Cancelar');
    showActions = input(false)
    showHeader = input(false)

   primaryAction = output<void>();
   secondaryAction = output<void>();

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }
}

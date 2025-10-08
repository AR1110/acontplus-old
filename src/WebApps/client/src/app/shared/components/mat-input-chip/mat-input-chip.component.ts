import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
@Component({
  selector: 'app-mat-input-chip',
  imports: [MatChipsModule, MatIconModule, MatFormFieldModule, MatTooltipModule],
  templateUrl: './mat-input-chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .hint-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
        vertical-align: middle;
        margin-right: 4px;
        color: rgba(0, 0, 0, 0.6);
      }
      .text-muted {
        color: rgba(0, 0, 0, 0.6);
      }
    `,
  ],
})
export class MatInputChipComponent {
  chips = input.required<string[]>();
  labelText = input.required<string>();
  placelholder = input<string>('');
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.chips().push(value);
    }

    // Clear the input value
    event.chipInput.clear();
  }

  remove(value: string): void {
    const index = this.chips().indexOf(value);

    if (index >= 0) {
      this.chips().splice(index, 1);

      this.announcer.announce(`Removed ${value}`);
    }
  }

  edit(inputRaw: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove item if it no longer has a name
    if (!value) {
      this.remove(inputRaw);
      return;
    }

    // Edit existing item
    const index = this.chips().indexOf(inputRaw);
    if (index >= 0) {
      this.chips()[index] = value.replace(/\s+/g, '');
    }
  }

  getPlaceholderText(): string {
    const placeholder = this.placelholder();
    return placeholder || `Agregar ${this.labelText().toLowerCase()}...`;
  }

  getInputTooltip(): string {
    return `Escriba ${this.labelText().toLowerCase()} y presione Enter o coma para agregar`;
  }

  getHintText(): string {
    return `Ingrese ${this.labelText().toLowerCase()} y presione Enter para agregar`;
  }
}

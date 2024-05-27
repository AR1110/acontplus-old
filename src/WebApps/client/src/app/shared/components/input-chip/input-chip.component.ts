import {Component, inject, input} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
  selector: 'app-input-chip',
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './input-chip.component.html',
  styles: ``
})
export class InputChipComponent {
  chips = input.required<string[]>()
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
    event.chipInput!.clear();
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

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(inputRaw);
      return;
    }

    // Edit existing fruit
    const index = this.chips().indexOf(inputRaw);
    if (index >= 0) {
      this.chips()[index] = value.replace(/\s+/g, '');
    }
  }
}

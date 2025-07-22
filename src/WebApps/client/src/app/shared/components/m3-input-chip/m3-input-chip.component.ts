import {Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
    selector: 'app-m3-input-chip',
    imports: [
        MatChipsModule,
        MatIconModule,
        MatFormFieldModule
    ],
    templateUrl: './m3-input-chip.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3InputChipComponent {
  chips = input.required<string[]>()
  labelText = input.required<string>()
  placelholder = input<string>('')
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

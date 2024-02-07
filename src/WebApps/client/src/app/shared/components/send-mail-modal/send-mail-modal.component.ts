import { LiveAnnouncer } from "@angular/cdk/a11y";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, inject } from "@angular/core";
import { MatChipEditedEvent, MatChipInputEvent } from "@angular/material/chips";
import { MaterialModule } from "@core/material/material.module";
import { isValidEmail, isValidField } from "@core/utils/utils";
import { AppModule } from "src/app/app.module";
import Swal from "sweetalert2";


@Component({
  selector: 'app-send-mail-modal',
  imports: [AppModule, MaterialModule],
  standalone: true,
  templateUrl: './send-mail-modal.component.html'
})

export class SendMailModalComponent {
  announcer = inject(LiveAnnouncer);

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: Array<string> = [];


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      if (isValidEmail(value)) {
        this.emails.push(value);
      } else {
        Swal.fire({
          icon: 'warning',
          html: 'Verifique que la dirección de correo del destinatario esté ingresada correctamente.'
        })
      }
    }
    // Clear the input value
    //event.chipInput!.clear();
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);

      this.announcer.announce(`Removed ${email}`);
    }
  }

  edit(fruit: any, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    const index = this.emails.indexOf(fruit);
    if (index >= 0) {
      this.emails[index] = value;
    }
  }

}

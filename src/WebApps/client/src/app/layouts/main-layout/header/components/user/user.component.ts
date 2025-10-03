import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-user',
  imports: [MatIcon, MatMenuModule, MatButtonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  @Input() user: any;
  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();
  public flatlogicEmail = "https://flatlogic.com";

  public signOutEmit(): void {
    this.signOut.emit();
  }
}

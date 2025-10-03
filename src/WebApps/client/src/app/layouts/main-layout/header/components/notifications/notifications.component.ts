import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatBadge} from "@angular/material/badge";

@Component({
  selector: 'app-notifications',
  imports: [MatButtonModule, MatIcon, MatMenuModule, MatBadge],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {

}

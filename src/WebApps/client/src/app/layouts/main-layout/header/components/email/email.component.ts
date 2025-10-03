import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {NgClass} from "@angular/common";
import {ShortNamePipe} from "../../pipes/short-name.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-email',
  imports: [MatMenuModule, NgClass, ShortNamePipe, MatButtonModule, MatIcon],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailComponent {
   emails = input<any[]>([])
  public colors: string[] = [
    'yellow',
    'green',
    'blue',
    'ping'
  ];
}

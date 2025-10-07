import {Component, ViewEncapsulation} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-auth-layout',
  imports: [
    RouterOutlet,
    MatCardModule
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AuthLayoutComponent {

}

import { Component, computed, inject, model, signal } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-nav-user-info-toggle',
  imports: [
    OverlayModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './nav-user-info-toggle.component.html',
  styles: ``,
})
export class NavUserInfoToggleComponent {}

import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shift',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatDynamicCardComponent,
  ],
  templateUrl: './shift.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftComponent implements OnInit {
  ngOnInit() {
    console.log('ShiftComponent initialized');
  }
}

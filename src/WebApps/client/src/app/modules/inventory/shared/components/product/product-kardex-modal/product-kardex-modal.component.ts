import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-kardex-modal',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatChipsModule
  ],
  templateUrl: './product-kardex-modal.component.html',
  styles: ``
})
export class ProductKardexModalComponent {
  modal = inject(NgbActiveModal);
}

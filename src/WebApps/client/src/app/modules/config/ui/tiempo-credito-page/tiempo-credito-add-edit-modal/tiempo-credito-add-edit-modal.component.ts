import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';

@Component({
  selector: 'app-tiempo-credito-add-edit-modal',
  imports: [ReactiveFormsModule, ToUpperCaseDirective],
  templateUrl: './tiempo-credito-add-edit-modal.component.html',
  styleUrls: ['./tiempo-credito-add-edit-modal.component.scss'],
})
export class TiempoCreditoAddEditModalComponent {}

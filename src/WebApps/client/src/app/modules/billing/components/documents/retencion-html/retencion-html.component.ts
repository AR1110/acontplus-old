import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AmbienteSriPipe } from '@shared/pipes/ambiente-sri.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-retencion-html',
  standalone: true,
  imports: [FormsModule, AmbienteSriPipe, DatePipe],
  templateUrl: './retencion-html.component.html',
  styles: ``,
})
export class RetencionHtmlComponent {
  retencion: any = {};
  infoTributaria: any = {};
  infoCompRetencion: any = {};
  fullComprobante: any = {};
  infoAdicional: any = [];
  selected: any = [];

  constructor() {
    // Initialize variables
  }

  onSave() {
    // Handle save logic
  }

  closeModal() {
    // Handle modal close logic
  }

  getReport() {
    // Handle report generation
  }
}

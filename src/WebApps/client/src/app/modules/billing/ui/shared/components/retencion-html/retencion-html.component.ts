import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AmbienteSriPipe } from '@shared/pipes/ambiente-sri.pipe';
import { DatePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Button } from '@acontplus/ng-components';

@Component({
  selector: 'app-retencion-html',
  imports: [FormsModule, AmbienteSriPipe, DatePipe, MatCard, MatCardContent, Button],
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

  onModalClose() {
    // Handle modal close logic
  }

  getReport() {
    // Handle report generation
  }

  download() {}
}

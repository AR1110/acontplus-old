import {Component, inject, Input, input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SafeUrlPipe} from "@shared/pipes/safe-url.pipe";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService, PDFPrintRange} from "ngx-extended-pdf-viewer";
import {
  CustomContainerDialogComponent
} from "@core/components/custom-container-dialog/custom-container-dialog.component";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-pdf-viewer',
    imports: [
        NgxExtendedPdfViewerModule,
        SafeUrlPipe,
        CustomContainerDialogComponent,
        MatIconButton,
        MatIcon
    ],
    templateUrl: './pdf-viewer.component.html',
    styles: ``
})
export class PdfViewerComponent {
  @Input() params = {
    pdfSrc : ''
  }

  private activeModal = inject(NgbActiveModal)
  sanitizedPdfUrl: SafeResourceUrl | null = null;
  constructor(private sanitizer: DomSanitizer, private printService: NgxExtendedPdfViewerService) {}



  public print(): void {
    this.printService.print();
  }

  closeModal() {
    this.activeModal.close();
  }
}

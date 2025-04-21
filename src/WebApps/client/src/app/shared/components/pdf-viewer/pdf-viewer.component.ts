import {Component, inject, Input,  } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
// import {NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService, } from "ngx-extended-pdf-viewer";


@Component({
    selector: 'app-pdf-viewer',
    imports: [
        // NgxExtendedPdfViewerModule,
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
  // constructor(private sanitizer: DomSanitizer, private printService: NgxExtendedPdfViewerService) {}



  public print(): void {
   // this.printService.print();
  }

  onModalClose() {
    this.activeModal.close();
  }
}

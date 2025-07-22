import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'ambienteSri',
})
export class AmbienteSriPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(ambiente: string): SafeHtml {
    return ambiente
      ? this.sanitizer.bypassSecurityTrustHtml(
          "<span class='badge bg-danger font-weight-100'>Pruebas</span>",
        )
      : this.sanitizer.bypassSecurityTrustHtml(
          "<span class='badge bg-success font-weight-100'>Producción</span>",
        );
  }
}

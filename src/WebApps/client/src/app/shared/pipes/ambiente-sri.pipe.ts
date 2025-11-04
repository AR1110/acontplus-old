import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'ambienteSri',
})
export class AmbienteSriPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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

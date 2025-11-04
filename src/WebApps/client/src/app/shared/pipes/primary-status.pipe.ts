import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'primaryStatus',
})
export class PrimaryStatusPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  transform(estado: boolean): SafeHtml {
    return estado
      ? this.sanitizer.bypassSecurityTrustHtml(
          "<span class='badge bg-success font-weight-100'>Activo</span>",
        )
      : this.sanitizer.bypassSecurityTrustHtml(
          "<span class='badge bg-danger font-weight-100'>Inactivo</span>",
        );
  }
}

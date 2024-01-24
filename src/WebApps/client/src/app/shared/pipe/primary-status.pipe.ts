import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'primaryStatus',
  standalone: true
})
export class PrimaryStatusPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(estado: boolean): SafeHtml {
    return estado
      ? this.sanitizer.bypassSecurityTrustHtml("<span class='badge bg-success font-weight-100'>Activo</span>")
      : this.sanitizer.bypassSecurityTrustHtml("<span class='badge bg-danger font-weight-100'>Inactivo</span>");
  }
}

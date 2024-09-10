import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'primaryStatus',
  standalone: true,
})
export class PrimaryStatusPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(estado: boolean): SafeHtml {
    return estado
      ? this.sanitizer.bypassSecurityTrustHtml(
          "<span class='c-badge c-badge-success c-badge-small'>Activo</span>",
        )
      : this.sanitizer.bypassSecurityTrustHtml(
          "<span class='custom-badge custom-bg-danger '>Inactivo</span>",
        );
  }
}

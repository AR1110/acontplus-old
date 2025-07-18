import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'secondaryStatus',
})
export class SecondaryStatusPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(estado: boolean): SafeHtml {
    return estado
      ? this.sanitizer.bypassSecurityTrustHtml(
          "<span class='badge bg-success font-weight-100'>Activa</span>",
        )
      : this.sanitizer.bypassSecurityTrustHtml(
          "<span class='badge bg-danger font-weight-100'>Inactiva</span>",
        );
  }
}

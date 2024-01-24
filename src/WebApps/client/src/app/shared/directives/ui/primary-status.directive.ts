import { Directive, ElementRef, Input, Pipe, PipeTransform, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Directive({
  selector: '[appPrimaryStatus]',
})
export class PrimaryStatusDirective {

  @Input() isActive: boolean = false; // Input property to determine the active/inactive state

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.updateStatus();
  }

  private updateStatus() {
    const labelClass = this.isActive ? 'label-success' : 'label-danger';
    const labelText = this.isActive ? 'Activo' : 'Inactivo';

    const htmlContent = `<span class='label ${labelClass} font-weight-100'>${labelText}</span>`;

    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', htmlContent);
  }

}

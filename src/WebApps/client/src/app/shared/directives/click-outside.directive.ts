import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {

  @Output() clickOutside = new EventEmitter<MouseEvent>();
  @Output() txtSearch = null;
  @Output() isOverlayOpen = false;
  @Input() input!:any

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {

    const targetElement = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);

    if (targetElement && !clickedInside  ) {
        this.clickOutside.emit(event);

    }
  }
}

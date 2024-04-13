import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { PermissionStateService } from '@shared/store/permission-state.service';

@Directive({
  selector: '[appActionMovCaja]',
  standalone: true
})
export class ActionMovCajaDirective {

  constructor(private el: ElementRef, private renderer: Renderer2, private pS: PermissionStateService) { }

  ngOnInit() {

    this.pS.select('accion').subscribe({
      next: (value) => {
        if (value && value.movimiento) return
        this.renderer.removeChild(this.el.nativeElement.parentNode, this.el.nativeElement);
      },
    })
  }

}

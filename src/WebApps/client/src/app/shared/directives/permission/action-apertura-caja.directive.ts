import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { UserRoleStateService } from '@shared/store/user-role-state.service';

@Directive({
  selector: '[appActionAperturaCaja]',
  standalone: true
})
export class ActionAperturaCajaDirective {

  constructor(private el: ElementRef, private renderer: Renderer2, private pS: UserRoleStateService) { }

  ngOnInit() {

    this.pS.select('accion').subscribe({
      next: (value) => {
        if (value && value.aperturarCaja) return
        this.renderer.removeChild(this.el.nativeElement.parentNode, this.el.nativeElement);
      },
    })
  }

}

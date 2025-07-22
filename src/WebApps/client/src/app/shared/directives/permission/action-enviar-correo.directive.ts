import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';
import { UserRoleStateService } from '@shared/store/user-role-state.service';

@Directive({
  selector: '[appActionEnviarCorreo]',
})
export class ActionEnviarCorreoDirective {
  private el = inject(ElementRef);

  private renderer = inject(Renderer2);

  private pS = inject(UserRoleStateService)
  ngOnInit() {

    this.pS.select('accion').subscribe({
      next: (value) => {
        if (value && value.enviarCorreo) return
        this.renderer.removeChild(this.el.nativeElement.parentNode, this.el.nativeElement);
      },
    })
  }
}

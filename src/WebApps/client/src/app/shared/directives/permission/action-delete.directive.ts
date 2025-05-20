import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';
import { UserRoleStateService } from '@shared/store/user-role-state.service';

@Directive({
  selector: '[appActionDelete]',
  standalone: true,
})
export class ActionDeleteDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private pS: UserRoleStateService
  ) {}

  ngOnInit() {
    this.pS.select('accion').subscribe({
      next: (value) => {
        if (value && value.eliminar) return;
        this.renderer.removeChild(
          this.el.nativeElement.parentNode,
          this.el.nativeElement
        );
      },
    });
  }
}

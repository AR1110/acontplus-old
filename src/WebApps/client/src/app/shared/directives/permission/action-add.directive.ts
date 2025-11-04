import { Directive, ElementRef, Renderer2, OnInit, inject } from '@angular/core';
import { UserRoleStateService } from '@shared/store/user-role-state.service';

@Directive({
  selector: '[appActionAdd]',
})
export class ActionAddDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private pS = inject(UserRoleStateService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit() {
    this.pS.select('accion').subscribe({
      next: (value) => {
        if (value && value.crear) return;
        this.renderer.removeChild(this.el.nativeElement.parentNode, this.el.nativeElement);
      },
    });
  }
}

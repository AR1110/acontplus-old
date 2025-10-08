import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';
import { UserRoleStateService } from '@shared/store/user-role-state.service';
import { CODE_ROLE } from '@core/constants/global.constants';

@Directive({
  selector: '[appIsAdmin]',
})
export class IsAdminDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private pS: UserRoleStateService,
  ) {}

  ngOnInit() {
    this.pS.select('codeRole').subscribe({
      next: value => {
        if (value === CODE_ROLE.ADM) return;
        this.renderer.removeChild(this.el.nativeElement.parentNode, this.el.nativeElement);
      },
    });
  }
}

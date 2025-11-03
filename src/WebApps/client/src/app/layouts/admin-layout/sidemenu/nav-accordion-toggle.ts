import { NavAccordionItem } from './nav-accordion-item';
import { Directive, inject } from '@angular/core';

@Directive({
  selector: '[appNavAccordionToggle]',
  exportAs: 'appNavAccordionToggle',
  host: {
    '(click)': 'onClick($event)',
  },
})
export class NavAccordionToggle {
  private readonly navItem = inject(NavAccordionItem);

  onClick($event: any) {
    this.navItem.toggle();
  }
}

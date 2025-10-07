import { NavAccordionItem } from './nav-accordion-item';
import { Directive, inject } from '@angular/core';

@Directive({
  selector: '[navAccordionToggle]',
  exportAs: 'navAccordionToggle',
  host: {
    '(click)': 'onClick($event)',
  },
})
export class NavAccordionToggle {
  private readonly navItem = inject(NavAccordionItem);

  onClick() {
    this.navItem.toggle();
  }
}

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private breakpointObserver = inject(BreakpointObserver);

  // Definimos las señales (signals) para los diferentes tipos de pantallas
  isHandset = signal(false);
  isTablet = signal(false);
  isDesktop = signal(false);

  constructor() {
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      this.isHandset.set(result.matches);
    });
    this.breakpointObserver.observe(Breakpoints.Tablet).subscribe(result => {
      this.isTablet.set(result.matches);
    });
    this.breakpointObserver.observe(Breakpoints.Web).subscribe(result => {
      this.isDesktop.set(result.matches);
    });
  }

  public isMatching(breakpoint: string) {
    const matchingSignal = signal(false);
    this.breakpointObserver.observe([breakpoint]).subscribe(result => {
      matchingSignal.set(result.matches);
    });
    return matchingSignal;
  }
}

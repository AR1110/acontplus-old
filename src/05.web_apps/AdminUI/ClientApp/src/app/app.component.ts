import { ChangeDetectorRef, Component } from '@angular/core';
import { Menu } from './modules/home/menu.model';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  opened = true;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {}

  toggle(): void {
    this.opened = !this.opened;
  }

  menu: Menu = [
    // {
    //   title: 'Usuario',
    //   icon: 'face',
    //   link: '/usuario',
    //   color: '#ff7f0e',
    // },
    {
      title: 'Configuracion',
      icon: 'setting',
      color: '#ff7f0e',
      subMenu: [],
    },
  ];
}

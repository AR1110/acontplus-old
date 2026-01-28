import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { ThemeService } from 'acontplus-ui-components';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client';
  loading = signal(false);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    public themeService: ThemeService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel
      ) {
        this.loading.set(false);
      }
    });
  }
  ngOnInit() {
    this.themeService.loadMode();
  }
}

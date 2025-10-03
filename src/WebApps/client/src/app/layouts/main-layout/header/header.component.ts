import {Component, EventEmitter, inject, Input, Output, output, signal} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {OverlayModule} from "@angular/cdk/overlay";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {UserComponent} from "./components/user/user.component";
import {AsyncPipe} from "@angular/common";
import {NotificationsComponent} from "./components/notifications/notifications.component";
import {EmailComponent} from "./components/email/email.component";
import {SearchComponent} from "./components/search/search.component";

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    OverlayModule,
    UserComponent,
    AsyncPipe,
    NotificationsComponent,
    EmailComponent,
    SearchComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() isMenuOpened!: boolean;
  @Output() isShowSidebar = new EventEmitter<boolean>();
  public user$!: Observable<any>
  public emails = signal([
    {name: 'Jane Hew', time: '9:32', message: 'Hey! How is it going?'},
    {name: 'Lloyd Brown', time: '9:18', message: 'Check out my new Dashboard'},
    {name: 'Mark Winstein', time: '9:15', message: 'I want rearrange the appointment'},
    {name: 'Liana Dutti', time: '9:09', message: 'Good news from sale department'}
  ])
  private router = inject(Router);


  public openMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;

    this.isShowSidebar.emit(this.isMenuOpened);
  }

  public signOut(): void {
 //   this.router.navigate([this.routers.LOGIN]);
  }
}

import { AuthService } from '@/services/auth.service';
import { MainStoreService } from '@/store/main-store.service';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-nav-user-toggle',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './nav-user-toggle.component.html',
  styleUrl: './nav-user-toggle.component.scss'
})
export class NavUserToggleComponent {
  mainStore = inject(MainStoreService)
  authSvc = inject(AuthService)

  userName = computed(() => this.mainStore.state().userName);


  logout(){
    this.authSvc.logout()
    window.location.reload()
  }

}

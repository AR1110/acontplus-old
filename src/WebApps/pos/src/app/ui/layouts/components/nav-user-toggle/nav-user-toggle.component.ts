
import { MainStoreService } from '@domain/services/main-store.service';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {TokenUseCase} from "@domain/use-cases/token.use-case";

@Component({
    selector: 'app-nav-user-toggle',
    imports: [
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './nav-user-toggle.component.html',
})
export class NavUserToggleComponent {
  mainStore = inject(MainStoreService)
  private _tokenUseCase= inject(TokenUseCase)

  userName = computed(() => this.mainStore.state().userName);


  logout(){
    this._tokenUseCase.removeAllStorage()
    window.location.reload()
  }

}

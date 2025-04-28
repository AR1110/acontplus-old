
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {TokenUseCase} from "@domain/use-cases/token.use-case";
import {LayoutStore} from "@ui/store/layout.store";

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
  $layoutStore = inject(LayoutStore)
  private _tokenUseCase= inject(TokenUseCase)

  userName = computed(() => this.$layoutStore.userName());


  logout(){
    this._tokenUseCase.removeAllStorage()
    window.location.reload()
  }

}

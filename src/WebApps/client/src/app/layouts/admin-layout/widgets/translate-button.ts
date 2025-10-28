import { MatButtonModule } from '@angular/material/button';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SettingsService } from '@core/bootstrap';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-translate',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>translate</mat-icon>
    </button>

    <mat-menu #menu="matMenu">
      @for (lang of langs; track lang.value) {
        <button mat-menu-item (click)="changeLang(lang.value)">
          <span class="d-flex justify-content-between gap-8">
            {{ lang.name | translate }}
            @if (lang.value === options.language) {
              <mat-pseudo-checkbox state="checked" appearance="minimal" />
            }
          </span>
        </button>
      }
    </mat-menu>
  `,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatPseudoCheckbox, TranslatePipe],
})
export class TranslateButton {
  private settings = inject(SettingsService);

  options = this.settings.options;

  langs = [
    { value: 'es', name: 'es' },
    { value: 'en-US', name: 'en_us' },
    { value: 'auto', name: 'system' },
  ];

  changeLang(lang: string) {
    this.settings.setLanguage(lang);
  }
}

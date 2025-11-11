import { AppDirectionality, LocalStorageService } from '@shared/services';
import { enUS, Locale, zhCN, zhTW, es } from 'date-fns/locale';
import { AppSettings, defaults } from '../settings';
import { Injectable, inject, DOCUMENT } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Direction } from '@angular/cdk/bidi';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly key = 'ng-acontplus-settings';

  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private readonly store = inject(LocalStorageService);
  private readonly mediaMatcher = inject(MediaMatcher);
  private readonly dir = inject(AppDirectionality);

  private readonly notify$ = new BehaviorSubject<Partial<AppSettings>>({});

  get notify() {
    return this.notify$.asObservable();
  }

  private htmlElement = this.document.querySelector('html')!;

  private storedOptions: AppSettings = this.store.get(this.key);

  options: AppSettings = Object.assign(defaults, this.storedOptions);

  languages = ['es', 'en-US', 'zh-CN', 'zh-TW'];

  localeMap: Record<string, Locale> = { es: es, 'en-US': enUS, 'zh-CN': zhCN, 'zh-TW': zhTW };

  constructor() {
    this.translate.addLangs(this.languages);
  }

  reset() {
    this.store.remove(this.key);
  }

  setOptions(options?: Partial<AppSettings>) {
    this.options = Object.assign(defaults, this.options, options);
    this.store.set(this.key, this.options);
    this.notify$.next(this.options);
  }

  setDirection(dir?: Direction) {
    if (dir) {
      this.setOptions({ dir });
    }
    this.dir.value = this.options.dir;
    this.htmlElement.dir = this.options.dir;
  }

  getTranslateLang() {
    if (this.options.language === 'auto') {
      const browserLang = navigator.language;
      // const browserLang = 'es';
      return this.languages.includes(browserLang) ? browserLang : 'es';
    }
    return this.options.language;
  }

  setLanguage(language?: string) {
    if (language) {
      this.setOptions({ language });
    }
    this.translate.use(this.getTranslateLang());
  }

  getLocale() {
    return this.localeMap[this.getTranslateLang()];
  }
}

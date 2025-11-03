import { HttpBackend, HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export function customTranslateLoaderFactory(handler: HttpBackend) {
  return new CustomTranslateHttpLoader(handler);
}

export class CustomTranslateHttpLoader implements TranslateLoader {
  private http: HttpClient;

  constructor(
    handler: HttpBackend,
    private prefix = './assets/i18n/',
    private suffix = '.json',
  ) {
    this.http = new HttpClient(handler);
  }

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}

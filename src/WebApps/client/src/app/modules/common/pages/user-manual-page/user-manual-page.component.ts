import { Component } from '@angular/core';
import { UserManualService } from '@modules/common/services/user-manual.service';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';

interface Manual {
  content: string;
  safeEmbedCode?: SafeHtml;
}

@Component({
  selector: 'app-user-manual-page',
  standalone: true,
  imports: [BreadcrumbComponent, SafeHtmlPipe],
  templateUrl: './user-manual-page.component.html',
  styles: `
    .iframe-container {
      position: relative;
      overflow: hidden;
      padding-top: 56.25%; /* 16:9 Aspect Ratio */
    }

    :host ::ng-deep .iframe-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  `,
})
export class UserManualPageComponent {
  manuals: Manual[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private _userManualService: UserManualService,
  ) {}

  ngOnInit() {
    this._userManualService.get({}).subscribe((response) => {
      let tempArray = JSON.parse(response.payload as string) as Manual[];
      this.manuals = tempArray.map((manual: Manual) => ({
        ...manual,
        safeEmbedCode: this.sanitizer.bypassSecurityTrustHtml(
          manual.content
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;lt;/g, '&lt;')
            .replace(/&amp;gt;/g, '&gt;')
            .replace(/&quot;/g, '"'),
        ),
      }));
      console.log(this.manuals);
    });
  }
}

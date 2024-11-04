import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { UserManualService } from '@modules/common/services/user-manual.service';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { MatCardModule } from '@angular/material/card';
import { Menu } from '@core/models/menu.model';
import {
  MatOption,
  MatSelect,
  MatSelectChange,
} from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgStyle } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatPagination } from '@shared/models/pagination.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import {
  QuillEditorComponent,
  QuillModules,
  QuillViewComponent,
  QuillViewHTMLComponent,
} from 'ngx-quill';
import { FormsModule } from '@angular/forms';

interface Manual {
  id: number;
  title: string;
  content: string;
  safeEmbedCode?: SafeHtml;
  totalRecords?: number;
}

@Component({
  selector: 'app-user-manual-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatCardModule,
    SafeHtmlPipe,
    MatSelect,
    MatOption,
    MatExpansionModule,
    NgStyle,
    MatInput,
    MatPaginator,
    MatIcon,
    MatIconButton,
    QuillEditorComponent,
    FormsModule,
    QuillViewHTMLComponent,
    QuillViewComponent,
  ],
  templateUrl: './user-manual-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManualPageComponent {
  data = {
    menuId: 0,
    textSearch: '',
    pageIndex: 0,
    pageSize: 0,
  };
  modules: Menu[] = [];
  manuals: any[] = [];
  pagination = signal(new MatPagination());
  pageEvent!: PageEvent;
  panelOpenState = -1;
  quillModules: QuillModules = {}; // Will inherit from global config
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _userManualService = inject(UserManualService);

  loadData() {
    this.data.pageIndex = this.pagination().pageIndex + 1;
    this.data.pageSize = this.pagination().pageSize;
    this._userManualService.get(this.data).subscribe((response) => {
      this.modules = response.modules;
      // console.log(response.userManuals);
      this.manuals = response.userManuals.map((manual: Manual) => ({
        ...manual,
        safeEmbedCode: this._sanitizer.bypassSecurityTrustHtml(
          manual.content
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;lt;/g, '&lt;')
            .replace(/&amp;gt;/g, '&gt;')
            .replace(/&quot;/g, '"'),
        ),
        expanded: false,
      }));

      this.pagination.update((e) => {
        return {
          ...e,
          totalRecords: this.manuals[0]?.totalRecords || 0,
        };
      });
      // console.log(this.manuals);
    });
  }

  ngOnInit() {
    this.loadData();
  }

  onMenuChange($event: MatSelectChange) {
    this.data.menuId = $event.value;
    this.loadData();
  }

  onSearch($event: any) {
    const textSearch = $event.target.value;
    if (textSearch.length >= 3) {
      this.data.textSearch = textSearch;
      this.loadData();
    }
    if (!textSearch || textSearch === '' || textSearch.length === 0) {
      this.data.textSearch = '';
      this.loadData();
    }
  }

  onPageChanged($event: PageEvent) {
    this.pageEvent = $event;
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: $event.length,
        pageSize: $event.pageSize,
        pageIndex: $event.pageIndex,
      };
    });

    this.loadData();
  }

  onSearchClear(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.data.textSearch = '';
    this.loadData();
  }

  setPanelOpen(index: number) {
    this.panelOpenState = index;
  }
}

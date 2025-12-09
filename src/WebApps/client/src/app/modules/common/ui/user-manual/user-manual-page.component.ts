import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Menu } from '@core/models/menu.model';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Pagination } from '@acontplus/ng-components';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { QuillViewComponent } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { UserManualUseCase } from '@modules/common/core/use-cases/user-manual.use-case';
import { UserManual } from '@modules/common/core/domain/user-manual.model';
import { DynamicCard } from '@acontplus/ng-components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
interface MenuNode {
  title: string;
  name: string;
  videoId?: string;
  children?: MenuNode[];
  expanded?: boolean;
  safeEmbedCode?: SafeResourceUrl;
  selectedNode?: string;
}
@Component({
  selector: 'app-user-manual',
  imports: [
    BreadcrumbComponent,
    FormsModule,
    QuillViewComponent,
    DynamicCard,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatIcon,
    DynamicCard,
    MatTreeModule,
  ],
  templateUrl: './user-manual-page.component.html',
  styles: `
    .content-wrapper {
      display: flex;
      gap: 20px;
      min-height: 600px;
    }

    .menu-section {
      flex: 0 0 350px;
      border-right: 1px solid #e0e0e0;
      padding-right: 20px;
    }

    .video-section {
      flex: 1;
      padding-left: 20px;
    }

    .tree-menu {
      background: transparent;
    }

    .menu-item {
      width: 100%;
      justify-content: flex-start;
      text-align: left;
      padding: 8px 16px;
      margin: 2px 0;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .menu-item:hover {
      background-color: #f5f5f5;
      transform: translateX(4px);
    }

    .menu-item.selected {
      background-color: #3f51b5;
      color: white;
    }

    .menu-item.category {
      font-weight: 500;
      color: #666;
    }

    .toggle-button {
      margin-right: 8px;
    }

    .video-card {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      overflow: hidden;
    }

    .video-container {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
      border-radius: 8px;
    }

    .video-iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .content-wrapper {
        flex-direction: column;
      }

      .menu-section {
        flex: none;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
        padding-right: 0;
        padding-bottom: 20px;
      }

      .video-section {
        padding-left: 0;
        padding-top: 20px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManualPageComponent implements OnInit {
  data = {
    menuId: 0,
    textSearch: '',
    pageIndex: 0,
    pageSize: 0,
  };
  modules = signal<Menu[]>([]);
  manuals = signal<any[]>([]);

  selectedNode: MenuNode | null = null;
  expandedNodes = new Set<MenuNode>();

  manualTree = signal<MenuNode[]>([]);

  pagination = signal(new Pagination());
  pageEvent!: PageEvent;

  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _userManualUseCase = inject(UserManualUseCase);

  loadData() {
    this.data.pageIndex = this.pagination().pageIndex + 1;
    this.data.pageSize = this.pagination().pageSize;

    this._userManualUseCase.get(this.data).subscribe((response) => {
      this.modules.set(response.modules);
      const manuals = response.userManuals.map((manual: UserManual) => ({
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
      this.manuals.set(manuals);

      const manualsTree = (manuals as any).reduce((acc: any, manual: any) => {
        if (acc.find((x: any) => x.name === manual.module)) {
          acc.find((x: any) => x.name === manual.module)?.children?.push(manual);
        } else {
          acc.push({
            name: manual.module,
            children: [manual],
          });
        }
        return acc;
      }, []);
      this.manualTree.set(manualsTree);
      this.manualTree().forEach((node) => {
        if (node.children) {
          this.expandedNodes.add(node);
        }
      });

      this.pagination.update(
        (e) => new Pagination(e.pageIndex, e.pageSize, this.manuals()[0]?.totalRecords || 0),
      );
    });
  }

  ngOnInit() {
    this.loadData();
  }

  // Children accessor function for the new MatTree API
  childrenAccessor = (node: MenuNode) => node.children || [];

  hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;

  selectNode(node: MenuNode): void {
    this.selectedNode = node;

    // If it's a category with children, toggle it
    if (this.hasChild(0, node)) {
      this.toggleNode(node);
    }
  }

  toggleNode(node: MenuNode): void {
    if (this.expandedNodes.has(node)) {
      this.expandedNodes.delete(node);
    } else {
      this.expandedNodes.add(node);
    }
  }

  isExpanded(node: MenuNode): boolean {
    return this.expandedNodes.has(node);
  }

  onMenuChange($event: MatSelectChange) {
    this.data.menuId = $event.value;
    this.loadData();
  }

  onSearch($event: any) {
    $event.stopPropagation();
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
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent($event);
      return updated;
    });

    this.loadData();
  }
  refresh() {
    this.loadData();
  }
}

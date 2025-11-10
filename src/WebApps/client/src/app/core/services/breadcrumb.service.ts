import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // Dependencies
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  // Private signals
  private readonly breadcrumbsSignal = signal<BreadcrumbItem[]>([]);

  // Public readonly signals
  breadcrumbs = this.breadcrumbsSignal.asReadonly();

  // Computed properties
  breadcrumbString = computed(() =>
    this.breadcrumbsSignal()
      .map((b) => b.label)
      .join(' / '),
  );

  breadcrumbLabels = computed(() => this.breadcrumbsSignal().map((b) => b.label));

  constructor() {
    // Initialize breadcrumbs
    this.updateBreadcrumbs();

    // Listen to navigation changes
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
      this.breadcrumbsSignal.set(breadcrumbs);
    });
  }

  // Public methods
  updateBreadcrumbs(): void {
    const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
    this.breadcrumbsSignal.set(breadcrumbs);
  }

  getBreadcrumbString(separator = ' / '): string {
    return this.breadcrumbsSignal()
      .map((b) => b.label)
      .join(separator);
  }

  // Private methods
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: BreadcrumbItem[] = [],
  ): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      // Mark the last one as active
      if (breadcrumbs.length > 0) {
        breadcrumbs[breadcrumbs.length - 1].isActive = true;
      }
      return breadcrumbs;
    }

    for (const child of children) {
      if (!child.snapshot?.url) {
        continue;
      }
      const routeSegments = child.snapshot.url.map((seg) => seg.path).filter(Boolean);
      const routeURL = routeSegments.join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Look for label in breadcrumb, title or use the URL
      const label = child.snapshot.data['breadcrumb'] ?? child.snapshot.data['title'] ?? routeURL;

      if (label && !breadcrumbs.some((b) => b.url === url)) {
        breadcrumbs.push({
          label,
          url,
          isActive: false,
        });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}

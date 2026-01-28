import {Injectable, inject, signal, computed} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSignal = signal<BreadcrumbItem[]>([]);

  // Signals públicos
  breadcrumbs = this.breadcrumbsSignal.asReadonly();

  // String concatenado con separador personalizable
  breadcrumbString = computed(() =>
    this.breadcrumbsSignal().map(b => b.label).join(' / ')
  );

  // Solo las etiquetas como array
  breadcrumbLabels = computed(() =>
    this.breadcrumbsSignal().map(b => b.label)
  );

  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Escuchar cambios de navegación
    this.#router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        const breadcrumbs = this.buildBreadcrumbs(this.#activatedRoute.root);
        this.breadcrumbsSignal.set(breadcrumbs);
      });

    // Construir breadcrumbs inicial
    this.updateBreadcrumbs();
  }

  private buildBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      // Marcar el último como activo
      if (breadcrumbs.length > 0) {
        breadcrumbs[breadcrumbs.length - 1].isActive = true;
      }
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
      console.log(child.snapshot.data)

      // Buscar label en breadcrumb, title o usar la URL
      const label = child.snapshot.data['breadcrumb'] ||
        child.snapshot.data['title'] ||
        routeURL;
      console.log(label)

      if (label && !breadcrumbs.some(b => b.url === url)) {
        breadcrumbs.push({
          label,
          url,
          isActive: false
        });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  // Método para actualizar manualmente si es necesario
  updateBreadcrumbs(): void {
    const breadcrumbs = this.buildBreadcrumbs(this.#activatedRoute.root);
    this.breadcrumbsSignal.set(breadcrumbs);
  }

  // Método para obtener string con separador personalizado
  getBreadcrumbString(separator = ' / '): string {
    return this.breadcrumbsSignal().map(b => b.label).join(separator);
  }
}

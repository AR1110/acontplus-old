import { Component, computed, inject, input, signal } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { RouteBuilderUtils } from '@core/utils/route-builder.utils';
import { MatTooltip } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MenuItemList } from '../menu.types';
@Component({
  selector: 'app-menu-item',
  imports: [MatListModule, RouterModule, MatIcon, MatTooltip],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  animations: [
    trigger('expandContractMenu', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('500ms ease-in-out', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [animate('500ms ease-in-out', style({ opacity: 1, height: '0px' }))]),
    ]),
  ],
})
export class MenuItemComponent {
  item = input.required<MenuItemList>();
  collapsed = input(false);
  level = input(0);

  parentRoute = input<string | undefined>();
  allMenuItems = input<MenuItemList[]>([]);

  private router = inject(Router);

  expanded = signal(false);

  // Determina si el item es navegable
  isNavigable = computed(() => {
  //  return RouteBuilderUtils.isNavigableItem(this.item());
    return (this.item()?.subItems?.length || 0)===0
  });

  // Construye el routerLink apropiado
  routerLink = computed(() => {
    if (!this.isNavigable()) return null;

    // Si es container type, navegar a la ruta base
    if (this.isContainerType()) {
      return `/${this.item().route}`;
    }

    // Si tiene parent route (es un subitem)
    if (this.parentRoute()) {
      return `/${this.parentRoute()}/${this.item().route}`;
    }

    // Construir ruta completa
    if (this.allMenuItems.length > 0) {
      return RouteBuilderUtils.getFullRoute(this.item(), this.allMenuItems());
    }

    return `/${this.item().route}`;
  });

  // Opciones para routerLinkActive
  routerLinkOptions = computed(() => {
    // Para containers, usar exact: false para que marque activo los subitems
    if (this.isContainerType()) {
      return { exact: false };
    }
    return { exact: true };
  });

  // Verifica si tiene subitems
  hasSubItems = computed(() => {
    const { subItems } = this.item();
    if (subItems) {
      return subItems.length > 0;
    }
    return false;
  });

  // Verifica si es tipo container
  isContainerType = computed(() => {
    return (
      this.item().routeType === 'container' ||
      this.item().hasRootComponent ||
      !!this.item().rootComponent
    );
  });

  // Verifica si tiene subitems expandibles (no navegables directamente)
  hasExpandableSubItems = computed(() => {
    return this.hasSubItems() && !this.isContainerType();
  });

  // Determina si mostrar subitems
  shouldShowSubItems = computed(() => {
    if (!this.hasSubItems() || this.collapsed()) return false;

    // Para containers, mostrar siempre que estén expandidos
    if (this.isContainerType()) {
      return this.expanded();
    }

    // Para items directos, mostrar expandidos
    return this.expanded();
  });

  // Obtiene la ruta padre para subitems
  getParentRouteForSubItem = computed(() => {
    if (this.isContainerType()) {
      return this.item().route;
    }

    if (this.parentRoute()) {
      return `${this.parentRoute()}/${this.item().route}`;
    }

    return this.item().route;
  });

  // ===== PROPIEDADES DINÁMICAS BASADAS EN NIVEL =====

  // Padding izquierdo dinámico basado en el nivel
  dynamicPaddingLeft = computed(() => {
    const baseIndent = 16; // Padding base en pixels
    const levelIndent = 20; // Incremento por nivel
    return baseIndent + this.level() * levelIndent;
  });

  // Tamaño de fuente dinámico
  dynamicFontSize = computed(() => {
    const baseSize = 1; // 1rem
    const sizeDecrement = 0.05; // Reducir 0.05rem por nivel
    const minSize = 0.75; // Tamaño mínimo

    const calculatedSize = baseSize - this.level() * sizeDecrement;
    return Math.max(calculatedSize, minSize);
  });

  // Opacidad del icono basada en el nivel
  iconOpacity = computed(() => {
    const baseOpacity = 1;
    const opacityDecrement = 0.1;
    const minOpacity = 0.6;

    const calculatedOpacity = baseOpacity - this.level() * opacityDecrement;
    return Math.max(calculatedOpacity, minOpacity);
  });

  // Ancho del borde izquierdo para subitems
  borderWidth = computed(() => {
    return Math.max(1, 3 - this.level()); // Borde más grueso en niveles superiores
  });

  // Margen izquierdo para subitems
  subItemsMargin = computed(() => {
    return 12 + this.level() * 8; // Incremento progresivo
  });

  // Color del item basado en el nivel (opcional)
  itemColor = computed(() => {
    const colors = [
      '#333333', // Nivel 0
      '#555555', // Nivel 1
      '#777777', // Nivel 2
      '#999999', // Nivel 3+
    ];
    return colors[Math.min(this.level(), colors.length - 1)];
  });

  // Altura del item basada en el nivel
  itemHeight = computed(() => {
    const baseHeight = 48; // Altura base en pixels
    const heightDecrement = 4; // Reducir altura por nivel
    const minHeight = 36; // Altura mínima

    const calculatedHeight = baseHeight - this.level() * heightDecrement;
    return Math.max(calculatedHeight, minHeight);
  });

  toggleExpanded(event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (this.hasSubItems()) {
      this.expanded.update((current) => !current);
    }
  }
}

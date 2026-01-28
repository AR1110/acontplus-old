import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuDialogComponent } from '@modules/config/pages/menu-page/components/menu-dialog/menu-dialog.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { Menu } from '@modules/config/models/menu';
import { MenuService } from '@modules/config/services/menu.service';
import { ToastrNotificationService } from 'acontplus-utils';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import {
  AdvancedDialogService,
  MatDynamicCardComponent,
} from 'acontplus-ui-components';

@Component({
  selector: 'app-menu-page',
  imports: [
    BreadcrumbComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatTreeModule,
    MatProgressSpinner,
    MatDynamicCardComponent,
  ],
  templateUrl: './menu-page.component.html',
  styles: ``,
})
export class MenuPageComponent implements OnInit {
  // ViewChild reference to the tree for programmatic control
  // #tree = inject(MatTree<Menu>);
  private readonly menuService = inject(MenuService);
  private readonly toastrService = inject(ToastrNotificationService);
  private readonly dialog = inject(AdvancedDialogService);

  // Data source for the tree
  menus = signal<Menu[]>([]);
  loading = true;

  // Children accessor function for nested tree structure
  childrenAccessor = (node: Menu) => {
    try {
      // Parse the children string if it exists and is a string
      if (node.children && typeof node.children === 'string') {
        return JSON.parse(node.children) as Menu[];
      }
      return node.children ?? [];
    } catch (e) {
      console.error('Error parsing children for node:', node, e);
      return [];
    }
  };

  /**
   * Checks if a node has children (for tree node expansion)
   */
  hasChild = (_: number, node: Menu) => {
    try {
      if (node.children && typeof node.children === 'string') {
        const parsed = JSON.parse(node.children) as Menu[];
        return parsed.length > 0;
      }
      return !!node.children && node.children.length > 0;
    } catch (e) {
      console.error('Error checking children for node:', node, e);
      return false;
    }
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let textSearch = filterValue.trim().toLowerCase();
    this.loadMenus();
  }

  ngOnInit(): void {
    this.loadMenus();
  }

  /**
   * Loads menu data from the service
   */
  loadMenus(): void {
    this.loading = true;
    this.menuService.get({ tipo: 1 }).subscribe({
      next: (response) => {
        this.menus.set(response.menus);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading menus:', error);
        this.toastrService.show({
          type: 'error',
          message: 'Error al cargar los menús.',
        });
        this.loading = false;
      },
    });
  }

  /**
   * Opens the menu form dialog
   * @param isEdit Whether in edit mode
   * @param parentId Parent menu ID for submenus
   * @param menu Menu data to edit
   */
  async openDialog(isEdit = false, parentId?: number, menu?: Menu) {
    const dialogRef = await this.dialog.openInWrapper(
      {
        component: MenuDialogComponent,
        title: isEdit ? 'Editar Menú' : 'Crear Menú',
        icon: isEdit ? 'edit' : 'add',
        data: {
          ...menu,
          parentId: parentId,
        },
      },
      {
        size: 'md',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.code === '1') {
        this.loadMenus();
        this.toastrService.show({
          type: 'success',
          message: result.message || 'Operación realizada con éxito.',
        });
      } else if (result?.code === '0') {
        this.toastrService.show({
          type: 'warning',
          message: result.message || 'La operación no se pudo completar.',
        });
      }
    });
  }

  /**
   * Deletes a menu item after confirmation
   * @param id Menu ID to delete
   * @param menuName Menu name for confirmation message
   */
  async deleteMenu(id: number, menuName: string): Promise<void> {
    const result = await Swal.fire({
      title: '¿Estás seguro/a?',
      text: `Se eliminará el menú "${menuName}" y todos sus submenús asociados.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `¡Sí, eliminar!`,
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.menuService.delete(id).subscribe({
        next: (response) => {
          this.toastrService.show({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code === '1') {
            this.loadMenus();
          }
        },
        error: (error) => {
          console.error('Error deleting menu:', error);
          this.toastrService.show({
            type: 'error',
            message: 'Error al eliminar el menú.',
          });
        },
      });
    }
  }
}

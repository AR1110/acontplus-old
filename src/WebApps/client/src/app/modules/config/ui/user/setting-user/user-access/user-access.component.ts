import { Button } from '@acontplus/ng-components';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListAccessUserRoleUseCase } from '@modules/config/application/use-cases/user-role/list-access-user-role.use-case';
import { UpdateAccessUserRoleUseCase } from '@modules/config/application/use-cases/user-role/update-access-user-role.use-case';
import { UserStore } from '@modules/config/application/store/user.store';
import Swal from 'sweetalert2';

interface TreeNode {
  name: string;
  children?: TreeNode[];
  enabled?: boolean;
  level?: number;
}
@Component({
  selector: 'app-user-access',
  imports: [MatTreeModule, MatCheckboxModule, MatIcon, MatButtonModule, Button],
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss'],
})
export class UserAccessComponent implements OnInit {
  @ViewChild('tree') tree!: MatTree<TreeNode>;

  dataSource = signal<TreeNode[]>([]);
  checklistSelection = new SelectionModel<TreeNode>(true /* multiple */);
  private $listAccessUseCase = inject(ListAccessUserRoleUseCase);
  private $updateAccessUseCase = inject(UpdateAccessUserRoleUseCase);
  private $userStore = inject(UserStore);

  private actions: any[] = [];

  childrenAccessor = (node: TreeNode) => node.children || [];

  getAccesses() {
    this.dataSource.set([]);
    this.$listAccessUseCase
      .execute({
        userRoleId: this.$userStore.userRoleId(),
      })
      .subscribe((response) => {
        this.actions = response.actions;
        const makeMenusNode = [
          {
            name: 'Todos',
            children: response.menus,
          },
        ];
        this.checklistSelection = new SelectionModel<TreeNode>(true /* multiple */);
        this.dataSource.set(makeMenusNode);
        this.initializeCheckedNodes(this.dataSource());
        //    this.tree.expandAll()
      });
  }

  // Initialize checklistSelection with nodes that have checked=true
  initializeCheckedNodes(nodes: TreeNode[]): void {
    const checkNodes = (nodeArray: TreeNode[]) => {
      for (const node of nodeArray) {
        if (node.enabled) {
          this.checklistSelection.select(node);
        }

        if (node.children) {
          checkNodes(node.children);
        }
      }
    };

    checkNodes(nodes);

    nodes.forEach((node) => {
      if (node.children) {
        this.updateParentNodeCheckStatus(node);
      }
    });
  }

  // Update parent node status based on children
  updateParentNodeCheckStatus(node: TreeNode): void {
    if (!node.children || node.children.length === 0) {
      return;
    }

    const allChildrenChecked = node.children.every((child) =>
      this.checklistSelection.isSelected(child),
    );

    if (allChildrenChecked) {
      this.checklistSelection.select(node);
    } else {
      this.checklistSelection.deselect(node);
    }

    // Recursively update for nested children
    node.children.forEach((child) => {
      if (child.children) {
        this.updateParentNodeCheckStatus(child);
      }
    });
  }

  ngOnInit() {
    this.getAccesses();
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  // IMPORTANT: Add stopPropagation to prevent click event bubbling
  // This prevents matTreeNodeToggle from getting triggered when clicking checkbox
  onCheckboxClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  getDescendants(node: TreeNode): TreeNode[] {
    const descendants: TreeNode[] = [];

    const addDescendants = (currentNode: TreeNode) => {
      if (currentNode.children) {
        currentNode.children.forEach((child) => {
          descendants.push(child);
          addDescendants(child);
        });
      }
    };

    addDescendants(node);
    return descendants;
  }

  descendantsAllSelected(node: TreeNode): boolean {
    const descendants = this.getDescendants(node);
    return (
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child))
    );
  }

  descendantsPartiallySelected(node: TreeNode): boolean {
    const descendants = this.getDescendants(node);
    const result = descendants.some((child) => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  itemSelectionToggle(node: TreeNode): void {
    // Get current selection state before toggling
    const isSelected = this.checklistSelection.isSelected(node);

    // Toggle the node
    this.checklistSelection.toggle(node);
    const descendants = this.getDescendants(node);

    // If was previously selected and now deselected, deselect all descendants
    if (isSelected) {
      this.checklistSelection.deselect(...descendants);
    }
    // If was previously deselected and now selected, select all descendants
    else {
      this.checklistSelection.select(...descendants);
    }

    // Update all parent nodes
    this.checkAllParentsSelection(node);
  }

  leafItemSelectionToggle(node: TreeNode): void {
    // Stop event propagation
    // event.stopPropagation();

    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: TreeNode): void {
    let parent = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: TreeNode): void {
    const descendants = this.getDescendants(node);

    if (descendants.length === 0) {
      return; // Skip processing if there are no descendants
    }

    const descAllSelected = descendants.every((child) => this.checklistSelection.isSelected(child));
    const descNoneSelected = descendants.every(
      (child) => !this.checklistSelection.isSelected(child),
    );

    // If all descendants are selected, select the parent
    if (descAllSelected) {
      this.checklistSelection.select(node);
    }
    // If no descendants are selected, deselect the parent
    else if (descNoneSelected) {
      this.checklistSelection.deselect(node);
    }
    // Otherwise, it should be in an indeterminate state (neither selected nor deselected)
    else {
      this.checklistSelection.deselect(node);
    }
  }

  getParentNode(node: TreeNode): TreeNode | null {
    const findParent = (nodes: TreeNode[], target: TreeNode): TreeNode | null => {
      for (const current of nodes) {
        if (current.children?.includes(target)) {
          return current;
        }
        if (current.children) {
          const result = findParent(current.children, target);
          if (result) return result;
        }
      }
      return null;
    };

    return findParent(this.dataSource(), node);
  }

  successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      Swal.fire({
        icon: 'warning',
        html: response.message,
      });
    }
    if (response.code === '1') {
      Swal.fire({
        icon: 'success',
        html: response.message,
        timer: 1000,
      });
      this.getAccesses();
    }
  };

  onSave() {
    const menus = this.checklistSelection.selected.filter((cl) => cl.level === 3);
    const mergeDuplicateLevel3 = menus.reduce((acc: any, curr: any) => {
      const existingNode = acc.find((m: any) => m.menuId === curr.menuId);
      const action = this.actions.find((a) => a.code === curr.code);

      if (!existingNode) {
        acc.push({
          menuId: curr.menuId,
          actions: [action],
        });
      } else {
        if (action) {
          existingNode.actions.push(action);
        }
      }

      return acc;
    }, []);

    const mappedLevel3 = mergeDuplicateLevel3.map((acc: any) => ({
      menuId: acc.menuId,
      actions: JSON.stringify(acc.actions),
    }));

    if (menus.length === 0) {
      Swal.fire({
        icon: 'warning',
        text: 'Seleccione al menos una acción del SubMenú',
      });
      return;
    }

    Swal.fire({
      icon: 'warning',
      text: '¿Está seguro de actualizar los accesos de manera personalizada para el usuario seleccionado?',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          accesses: JSON.stringify(mappedLevel3),
        };

        const params = {
          data,
          userRoleId: this.$userStore.userRoleId(),
        };

        this.$updateAccessUseCase.execute(params).subscribe(this.successResponse);
      }
    });
  }

  async onDelete() {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: '¿Está seguro de quitar los accesos personalizados? Esto restablecerá los permisos predeterminados.',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
    });

    if (!isConfirmed) return;

    const data = {
      accesses: null,
    };
    const params = {
      data,
      userRoleId: this.$userStore.userRoleId(),
    };

    this.$updateAccessUseCase.execute(params).subscribe(this.successResponse);
  }
}

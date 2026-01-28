import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { Button } from '@acontplus/ng-components';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { isApiResponse } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { AccesoMenu } from '@modules/config/data/models/menu.model';
import { ListAccessUserRoleUseCase } from '@modules/config/application/use-cases/user-role/list-access-user-role.use-case';
import { UpdateAccessUserRoleUseCase } from '@modules/config/application/use-cases/user-role/update-access-user-role.use-case';
import { UserStore } from '@modules/config/application/store/user.store';
import Swal from 'sweetalert2';

interface MenuNode {
  name: string;
  children?: MenuNode[];
  checked?: boolean;
  menuId?: number;
  isActive?: boolean;
  codeAction?: string;
  unique?: string;
}

interface MenuFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  checked?: boolean;

  menuId?: number;
  isActive?: boolean;
  codeAction?: string;
  unique?: string;
}

@Component({
  selector: 'app-user-role-access',
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatSlideToggleModule,
    Button,
  ],
  templateUrl: './user-role-access.component.html',
  styles: ``,
})
export class UserRoleAccessComponent implements OnInit {
  private $listAccessUseCase = inject(ListAccessUserRoleUseCase);
  private $updateAccessUseCase = inject(UpdateAccessUserRoleUseCase);
  private $userStore = inject(UserStore);

  tS = inject(ToastrNotificationService);

  accesoMenus = signal<AccesoMenu[]>([]);

  cloneActions: any[] = [];
  actions: any[] = [];
  private transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      checked: node.checked,
      codeAction: node.codeAction,
      menuId: node.menuId,
      isActive: node.isActive,
      unique: node.unique,
    };
  };

  treeControl = new FlatTreeControl<MenuFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<MenuNode, MenuFlatNode>(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  checklistSelection = new SelectionModel<MenuFlatNode>(true /* multiple */);

  getAccesses() {
    this.$listAccessUseCase
      .execute({
        userRoleId: this.$userStore.userRoleId(),
      })
      .subscribe((response) => {
        this.accesoMenus.set(response.menus);

        this.actions = structuredClone(response.actions);

        this.cloneActions = structuredClone(this.actions);
        const makeMenusNode = [
          {
            name: 'Todos',
            children: this.accesoMenus().map((m) => {
              const { menus, ...rest } = m;

              const nodeSubMenus = menus.map((item: any) => {
                const { isActive, ...restSm } = item;

                const childrenActions = this.actions.map((a) => {
                  const isActive =
                    (item.isActive &&
                      item.actions.some((aRaw: any) => aRaw.code === a.codeAction)) ||
                    false;

                  return {
                    ...a,
                    menuId: item.menuId,
                    isActive,
                  };
                });

                return {
                  ...restSm,
                  // children: structuredClone(childrenActions)
                };
              });

              return {
                ...rest,
                children: nodeSubMenus,
              };
            }),
          },
        ];

        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.checklistSelection = new SelectionModel<MenuFlatNode>(true /* multiple */);
        this.dataSource.data = makeMenusNode;
        this.expandFirstLevelNodes();

        for (const node of this.treeControl.dataNodes) {
          // nivel 3 son las acciones

          if (!node.isActive) {
            continue;
          }

          this.todoItemSelectionToggle(node);
        }
      });
  }
  ngOnInit() {
    this.getAccesses();
  }

  hasChild = (_: number, node: MenuFlatNode) => node.expandable;

  todoItemSelectionToggle(node: MenuFlatNode): void {
    this.checklistSelection.toggle(node);
    this.toggleDescendantsSelection(node);
    this.checkAllParentsSelection(node);
  }

  toggleDescendantsSelection(node: MenuFlatNode): void {
    const descendants = this.treeControl?.getDescendants(node);
    descendants.forEach((child) => {
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(child)
        : this.checklistSelection.deselect(child);
      this.toggleDescendantsSelection(child);
    });
  }

  checkAllParentsSelection(node: MenuFlatNode): void {
    let parent: MenuFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: MenuFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: MenuFlatNode): MenuFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getLevel = (node: MenuFlatNode) => node.level;

  isNodeIndeterminate(node: MenuFlatNode): boolean {
    const descendants = this.treeControl?.getDescendants(node);
    const descAllSelected = descendants.every((child) => this.checklistSelection.isSelected(child));
    const descAllDeselected = descendants.every(
      (child) => !this.checklistSelection.isSelected(child),
    );

    return !descAllSelected && !descAllDeselected;
  }

  expandFirstLevelNodes(): void {
    this.treeControl.dataNodes.forEach((node) => {
      if (node.level === 0) {
        this.treeControl.expand(node);
      }
    });
  }

  /**  dataSubNode: any = {};
  onClickActions(node: MenuFlatNode){

    this.dataSubNode = node;
    for(let item of this.actions){
      item.checked = this.dataSubNode.actions.some((m:any)=>m.code===item.code)
    }
  }**/

  /** toggleAction(action:any){
    for(let item of this.treeControl.dataNodes){
      if(!item.menuId ||  !item.actions) continue;

      if(item.menuId===this.dataSubNode.menuId){
        if(action.checked){
          item.actions.push({
            code: action.code,
            name: action.name,
          })
        }else{
          item.actions =  item.actions.filter((a:any)=>a.code!==action.code)
        }
      }

    }
  }**/

  /**actionHidden(){
    this.dataSubNode = {};
    this.actions = structuredClone(this.cloneActions)
  }**/

  successResponse = (response: any) => {
    if (isApiResponse(response)) {
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
    }
  };

  onSave() {
    const checklistSelection = this.checklistSelection.selected;

    const filteredCheckedsLevel2 = this.treeControl.dataNodes.filter((ck) => ck.level === 2); //Nivel submenus
    const filteredCheckedsLevel3 = checklistSelection.filter((ck) => ck.level === 3); //Nivel acciones

    const mergeDuplicateLevel3 = filteredCheckedsLevel3.reduce((acc: any, curr: any) => {
      const menuId = filteredCheckedsLevel2.find((l2) => l2.unique === curr.unique)?.menuId;

      const existingNode = acc.find((m: any) => m.menuId === menuId);
      const action = this.actions.find((a) => a.codeAction === curr.codeAction);
      const { codeAction, ...restAction } = action;

      if (!existingNode) {
        acc.push({
          menuId,
          actions: [{ ...restAction, code: codeAction }],
        });
      } else {
        if (action) {
          existingNode.actions.push({ ...restAction, code: codeAction });
        }
      }

      return acc;
    }, []);

    const mappedLevel3 = mergeDuplicateLevel3.map((acc: any) => ({
      menuId: acc.menuId,
      actions: JSON.stringify(acc.actions),
    }));

    if (checklistSelection.length === 0) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione al menos un SubMenu',
      });
      return;
    }

    if (mappedLevel3.some((s: any) => s.actions?.length === 0)) {
      this.tS.show({
        type: 'warning',
        message: '¡Agregue al menos una acción de todos los submenús seleccionados!',
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

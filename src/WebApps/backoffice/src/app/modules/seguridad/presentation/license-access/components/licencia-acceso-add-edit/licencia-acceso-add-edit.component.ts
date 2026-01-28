import { Component, inject } from '@angular/core';

import { LicenseAccessService } from '@modules/seguridad/data/license-access/license-access.service';
import { LicenseSelectHtmlOnly } from '@modules/seguridad/models/license.model.';
import { RoleSelectHtmlOnly } from '@modules/seguridad/models/role';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from '@modules/config/services/menu.service';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

interface AccessNode {
  name: string;
  children?: AccessNode[];
  checked?: boolean;
  menuId?: number;
  isActive?: boolean;
  codeAction?: string;
}

interface AccessFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  checked?: boolean;

  menuId?: number;
  isActive?: boolean;
  codeAction?: string;
}

@Component({
  selector: 'app-licencia-acceso-add-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './licencia-acceso-add-edit.component.html',
  styles: ``,
})
export class LicenciaAccesoAddEditComponent {
  private dialogRef = inject(
    MatDialogRef<LicenciaAccesoAddEditComponent>,
  );

  licenciaAccesoSvc = inject(LicenseAccessService);
  menuSvc = inject(MenuService);

  licenses: LicenseSelectHtmlOnly[] = [];
  roles: RoleSelectHtmlOnly[] = [];

  data = {
    roleId: 0,
    licenciaId: 0,
  };

  private transformer = (node: AccessNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      checked: node.checked,
      codeAction: node.codeAction,
      menuId: node.menuId,
      isActive: node.isActive,
    };
  };

  treeControl = new FlatTreeControl<AccessFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<AccessNode, AccessFlatNode>(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  checklistSelection = new SelectionModel<AccessFlatNode>(true /* multiple */);

  getDataForm() {
    this.licenciaAccesoSvc.getDataForm().subscribe((response) => {
      console.log(response);
      this.licenses = response.licenses;
      this.roles = response.roles;
    });
  }

  ngOnInit() {
    this.getDataForm();
  }

  onLicenseChange() {
    //  this.onMenuGet($event.target.value);
    //  this.subscribeArrayChanges();
    this.getMenuByLicenseId();
  }

  getMenuByLicenseId() {
    this.menuSvc
      .getMenuByLicenseId(this.data.licenciaId)
      .subscribe((response) => {
        this.dataSource = new MatTreeFlatDataSource(
          this.treeControl,
          this.treeFlattener,
        );
        this.checklistSelection = new SelectionModel<AccessFlatNode>(
          true /* multiple */,
        );
        this.dataSource.data = response.accesses;
      });
  }

  hasChild = (_: number, node: AccessFlatNode) => node.expandable;

  todoItemSelectionToggle(node: AccessFlatNode): void {
    this.checklistSelection.toggle(node);
    this.toggleDescendantsSelection(node);
    this.checkAllParentsSelection(node);
  }

  toggleDescendantsSelection(node: AccessFlatNode): void {
    const descendants = this.treeControl?.getDescendants(node);
    descendants.forEach((child) => {
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(child)
        : this.checklistSelection.deselect(child);
      this.toggleDescendantsSelection(child);
    });
  }

  checkAllParentsSelection(node: AccessFlatNode): void {
    let parent: AccessFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: AccessFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child),
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: AccessFlatNode): AccessFlatNode | null {
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

  getLevel = (node: AccessFlatNode) => node.level;

  isNodeIndeterminate(node: AccessFlatNode): boolean {
    const descendants = this.treeControl?.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child),
    );
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

  dialogClose() {
    this.dialogRef.close();
  }
}

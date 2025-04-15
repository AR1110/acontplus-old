
// table-tree.component.ts
import {Component, inject, OnInit} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatChipsModule} from "@angular/material/chips";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {
  ListUserCustomerPermissionUseCase
} from "@modules/config/domain/use-cases/user-customer-permission/list-user-customer-permission.use-case";
import {UserCustomerStore} from "@modules/config/ui/store/user-customer.store";

// Estructura de nodo jerárquico
interface TreeNode {
  name: string;
  isSelected?: boolean;
  isExpanded?: boolean;
  children?: TreeNode[];
  level?: number; // Para uso interno
}
@Component({
  selector: 'app-test-tree',
  imports: [
    MatTableModule,
    MatChipsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './test-tree.component.html',
  styleUrl: './test-tree.component.scss'
})
export class TestTreeComponent {
  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<TreeNode>([]);
  private $listUseCase = inject(ListUserCustomerPermissionUseCase)
  private $userCustomerStore =inject(UserCustomerStore)
  // Datos jerárquicos con children
  treeData: TreeNode[] = [
    {
      name: 'Categoría 1',
      children: [
        { name: 'Elemento 1.1' },
        { name: 'Elemento 1.2' }
      ]
    },
    {
      name: 'Categoría 2',
      children: [
        { name: 'Elemento 2.1' },
        {
          name: 'Elemento 2.2',
          children: [
            { name: 'Elemento 2.2.1' },
            { name: 'Elemento 2.2.2' }
          ]
        }
      ]
    }
  ];

  // Datos aplanados para la tabla
  flattenedData: TreeNode[] = [];

  ngOnInit() {
    // Inicializar y convertir la estructura jerárquica a plana
    // this.initializeTreeData();
    // this.flattenTreeData();
    // this.updateTable();
    this.$listUseCase.execute({
      userRoleId: this.$userCustomerStore.userRoleId()
    }).subscribe(response=>{
      console.log(response.userCustomPermissions)
      this.treeData = response.userCustomPermissions

      this.initializeTreeData(response.userCustomPermissions);
      this.flattenTreeData();
       this.updateTable();
    })
  }

  // Inicializa los estados y asigna nivel inicial
  initializeTreeData(nodes: TreeNode[], level: number = 0) {
    nodes.forEach(node => {
      node.isSelected = false;
      node.isExpanded = false;
      node.level = level;

      if (node.children && node.children.length > 0) {
        this.initializeTreeData(node.children, level + 1);
      }
    });
  }

  // Convierte la estructura jerárquica a una lista plana para la tabla
  flattenTreeData() {
    this.flattenedData = [];
    this.processNodeForFlatten(this.treeData);
    this.updateTable();
  }

  // Procesa recursivamente los nodos y sus hijos
  processNodeForFlatten(nodes: TreeNode[]) {
    nodes.forEach(node => {
      this.flattenedData.push(node);

      if (node.children && node.children.length > 0 && node.isExpanded) {
        this.processNodeForFlatten(node.children);
      }
    });
  }

  // Actualiza la tabla con los datos visibles
  updateTable() {
    this.dataSource.data = this.flattenedData;
  }

  // Determina si un nodo tiene hijos
  hasChildren(node: TreeNode): boolean {
    return !!(node.children && node.children.length > 0);
  }

  // Expande o colapsa un nodo
  toggleNode(node: TreeNode) {
    if (!this.hasChildren(node)) return;

    node.isExpanded = !node.isExpanded;
    this.flattenTreeData();
  }

  // Maneja la selección de un nodo y sus hijos
  toggleSelection(node: TreeNode) {
    node.isSelected = !node.isSelected;

    // Si tiene hijos, aplicar el mismo estado a todos los hijos
    if (this.hasChildren(node)) {
      this.setChildrenSelection(node.children || [], node.isSelected);
    }

    this.updateParentSelectionStates();
  }

  // Actualiza recursivamente el estado de selección de los hijos
  setChildrenSelection(children: TreeNode[], isSelected: boolean) {
    children.forEach(child => {
      child.isSelected = isSelected;
      if (child.children && child.children.length > 0) {
        this.setChildrenSelection(child.children, isSelected);
      }
    });
  }

  // Actualiza el estado de selección de los padres basado en los hijos
  updateParentSelectionStates() {
    this.checkNodeChildrenSelection(this.treeData);
  }

  // Verifica si todos los hijos de un nodo están seleccionados
  checkNodeChildrenSelection(nodes: TreeNode[]): boolean {
    let allSelected = true;

    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        const childrenSelected = this.checkNodeChildrenSelection(node.children);

        // Si todos los hijos están seleccionados, el padre debe estarlo también
        if (childrenSelected && !node.isSelected) {
          node.isSelected = true;
        }
        // Si no todos los hijos están seleccionados, el padre no puede estarlo
        else if (!childrenSelected && node.isSelected) {
          node.isSelected = false;
        }

        allSelected = allSelected && childrenSelected;
      } else {
        allSelected = allSelected && (node.isSelected || false);
      }
    });

    return allSelected;
  }

  // Calcula el padding basado en el nivel
  getNodePadding(level: number): string {
    return `${(level || 0) * 20}px`;
  }
}

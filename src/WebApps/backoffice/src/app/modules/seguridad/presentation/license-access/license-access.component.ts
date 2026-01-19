import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LicenseAccessService } from '@modules/seguridad/data/license-access/license-access.service';
import { LicenciaAccesoEditDialogComponent } from '@modules/seguridad/presentation/license-access/components/licencia-acceso-edit-dialog/licencia-acceso-edit-dialog.component';
import { AdvancedDialogService } from 'acontplus-ui-components';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from 'acontplus-utils';
import { ActionsAccessDialogComponent } from '@modules/seguridad/components/actions-access-dialog/actions-access-dialog.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { LicenseAccessAddEditComponent } from './components/license-access-add-edit/license-access-add-edit.component';

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
    MatCard,
    MatCardContent,
    BreadcrumbComponent,
  ],
  templateUrl: './license-access.component.html',
  styleUrl: './license-access.component.scss',
})
export class LicenseAccessComponent implements OnInit {
  private $licenseAccessSvc = inject(LicenseAccessService);
  private advancedDialogService = inject(AdvancedDialogService);
  private tS = inject(ToastrNotificationService);

  displayedColumns: string[] = ['op', 'name', 'status'];
  dataSource = signal<any[]>([]);
  // Datos jerárquicos con children
  treeData: TreeNode[] = [
    {
      name: 'Categoría 1',
      children: [{ name: 'Elemento 1.1' }, { name: 'Elemento 1.2' }],
    },
    {
      name: 'Categoría 2',
      children: [
        { name: 'Elemento 2.1' },
        {
          name: 'Elemento 2.2',
          children: [{ name: 'Elemento 2.2.1' }, { name: 'Elemento 2.2.2' }],
        },
      ],
    },
  ];

  // Datos aplanados para la tabla
  flattenedData: TreeNode[] = [];

  getList() {
    this.$licenseAccessSvc.list({}).subscribe((response) => {
      const groupedTreeData = Object.values(
        response.data.reduce((acc, item) => {
          if (!acc[item.licenseTypeId]) {
            acc[item.licenseTypeId] = {
              name: item.licenseTypeName,
              children: [],
            };
          }
          acc[item.licenseTypeId].children.push({ ...item });
          return acc;
        }, {} as Record<number, { name: string; children: any[] }>)
      );

      this.treeData = groupedTreeData.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
      this.initializeTreeData(groupedTreeData);
      this.flattenTreeData();
      this.updateTable();
    });
  }

  refresh() {
    this.getList();
  }

  ngOnInit() {
    this.getList();
  }

  // Inicializa los estados y asigna nivel inicial
  initializeTreeData(nodes: TreeNode[], level = 0) {
    nodes.forEach((node) => {
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
    nodes.forEach((node) => {
      this.flattenedData.push(node);

      if (node.children && node.children.length > 0 && node.isExpanded) {
        this.processNodeForFlatten(node.children);
      }
    });
  }

  // Actualiza la tabla con los datos visibles
  updateTable() {
    this.dataSource.set(this.flattenedData);
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

  // Actualiza recursivamente el estado de selección de los hijos
  setChildrenSelection(children: TreeNode[], isSelected: boolean) {
    children.forEach((child) => {
      child.isSelected = isSelected;
      if (child.children && child.children.length > 0) {
        this.setChildrenSelection(child.children, isSelected);
      }
    });
  }

  // Calcula el padding basado en el nivel
  getNodePadding(level: number): string {
    return `${(level || 0) * 20}px`;
  }

  addLicenseAccess() {
    const ref = this.advancedDialogService.openInWrapper(
      {
        component: LicenseAccessAddEditComponent,
        title: 'Agregar Acceso a la Licencia',
        data: { tipo: 1 },
      },
      {
        size: 'full',
      }
    );
  }

  onEdit(item: any) {
    item.tipo = 3;
    this.advancedDialogService.openInWrapper(
      {
        component: LicenciaAccesoEditDialogComponent,
        title: 'Actualizar Accesos de la Licencia',
        data: item,
      },
      {
        size: 'full',
      }
    );
  }

  askToDelete(item: any) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: `Esta seguro de eliminar este acceso, esto afectara a todos los sistemas anexados a la licencia?`,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then((response) => {
      if (!response.isConfirmed) {
        return;
      }
      this.$licenseAccessSvc.delete(item.id).subscribe((response) => {
        if (response) {
          this.tS.show({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code == '1') {
            this.refresh();
          }
        }
      });
    });
  }

  openAccesses(item: any) {
    const dialogRef = this.advancedDialogService.openInWrapper(
      {
        component: ActionsAccessDialogComponent,
        title: 'Administrar de Acceso',
        data: { item },
      },
      { size: 'lg' }
    );
  }
}

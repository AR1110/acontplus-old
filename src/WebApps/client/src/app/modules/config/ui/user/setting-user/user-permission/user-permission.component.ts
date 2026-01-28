import { Button } from '@acontplus/ng-components';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { getValidId } from '@core/utils/utils';
import { UserPermission } from '@modules/config/data/models/user/user-permission.model';
import { UserRole } from '@modules/config/data/models/user/user-role.model';
import { ListUserPermissionUseCase } from '@modules/config/application/use-cases/user-permission/list-user-permission.use-case';
import { CreateUserPermissionUseCase } from '@modules/config/application/use-cases/user-permission/create-user-permission.use-case';
import { UpdateUserPermissionUseCase } from '@modules/config/application/use-cases/user-permission/update-user-permission.use-case';
import { UserStore } from '@modules/config/application/store/user.store';
import Swal from 'sweetalert2';

interface ModuleNode {
  name: string;
  children?: ModuleNode[];
  index?: number;
  expandable?: boolean;
  level?: number;
  hasStatus?: boolean;
  enabled?: boolean;
  securityType?: number;
  requiresKey?: boolean;
  users: any[];
  expanded?: boolean;
}

@Component({
  selector: 'app-user-permission',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggle,
    FormsModule,
    Button,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTreeModule,
  ],
  templateUrl: './user-permission.component.html',
  styles: `
    .mat-column-securityType {
      width: 400px;
    }
  `,
})
export class UserCustomerPermissionComponent implements OnInit {
  private $listUseCase = inject(ListUserPermissionUseCase);
  private $createUseCase = inject(CreateUserPermissionUseCase);
  private $updateUseCase = inject(UpdateUserPermissionUseCase);
  private $userStore = inject(UserStore);

  userPermissionData = {} as UserPermission;
  usersCustomerAdmin: UserRole[] = [];
  displayedColumns: string[] = ['index', 'name', 'status', 'securityType'];

  private transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      index: node.index,
      hasStatus: node.hasStatus,
      securityType: node.securityType,
      id: node.id,
      enabled: node.enabled,
      requiresKey: node.requiresKey,
      users: node.users,
    };
  };

  treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  refresh() {
    this.getList();
  }

  private getList() {
    this.$listUseCase
      .execute({
        userRoleId: this.$userStore.userRoleId(),
      })
      .subscribe((response) => {
        this.dataSource.data = response.userPermissions;
        this.userPermissionData = response.userPermissionData;
        this.usersCustomerAdmin = response.usersAdmin;
      });
  }

  ngOnInit(): void {
    this.getList();
  }

  private successResponse = (response: ApiResponseLegacy) => {
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
      this.getList();
    }
  };

  save() {
    const permissionsFiltered = this.treeControl.dataNodes.filter(
      (item) => item.level === 1 && item.enabled,
    );

    if (
      permissionsFiltered.some(
        ({ securityType, users }) => securityType === 2 && (!users || users.length === 0),
      )
    ) {
      Swal.fire({
        icon: 'warning',
        html: `<small>Hay una acción que requiere la selección de al menos un usuario aprobador antes de continuar.</small>`,
      });
      return;
    }

    const permissionsData = permissionsFiltered.map((item: any) => {
      return {
        userCustomPermissionId: item.id,
        enabled: item.enabled,
        requiresKey: item.requiresKey,
        users: item.users || [],
      };
    });
    // if(permissionsData.length===0){
    //   Swal.fire({
    //     icon: 'warning',
    //     html: 'Seleccione al menos una acción'
    //   })
    //   return
    // }

    const params = {
      userRoleId: this.$userStore.userRoleId(),
      permissionsData,
      id: this.userPermissionData.idUserPermission,
    };

    if (getValidId(this.userPermissionData.idUserPermission)) {
      this.$updateUseCase.execute(params).subscribe(this.successResponse);
    }

    if (!getValidId(this.userPermissionData.idUserPermission)) {
      this.$createUseCase.execute(params).subscribe(this.successResponse);
    }
  }
}

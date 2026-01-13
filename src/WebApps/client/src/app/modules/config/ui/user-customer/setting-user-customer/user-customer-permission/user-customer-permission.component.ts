import { Component, inject, OnInit } from '@angular/core';
import { ListUserCustomerPermissionUseCase } from '@modules/config/application/use-cases/user-customer-permission/list-user-customer-permission.use-case';
import { UserCustomerStore } from '@modules/config/application/store/user-customer.store';
import { MatTableModule } from '@angular/material/table';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from '@acontplus/ng-components';
import { CreateUserCustomerPermissionUseCase } from '@modules/config/application/use-cases/user-customer-permission/create-user-customer-permission.use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import Swal from 'sweetalert2';
import { UserCustomerPermission } from '@modules/config/data/models/user-customer/user-customer-permission.model';
import { UpdateUserCustomerPermissionUseCase } from '@modules/config/application/use-cases/user-customer-permission/update-user-customer-permission.use-case';
import { UserCustomerRole } from '@modules/config/data/models/user-customer/user-customer-role.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { getValidId } from '@core/utils/utils';

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
  selector: 'app-user-customer-permission',
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
  templateUrl: './user-customer-permission.component.html',
  styles: `
    .mat-column-securityType {
      width: 400px;
    }
  `,
})
export class UserCustomerPermissionComponent implements OnInit {
  private $listUseCase = inject(ListUserCustomerPermissionUseCase);
  private $createUseCase = inject(CreateUserCustomerPermissionUseCase);
  private $updateUseCase = inject(UpdateUserCustomerPermissionUseCase);
  private $userCustomerStore = inject(UserCustomerStore);

  userPermissionData = {} as UserCustomerPermission;
  usersCustomerAdmin: UserCustomerRole[] = [];
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
        userRoleId: this.$userCustomerStore.userRoleId(),
      })
      .subscribe((response) => {
        this.dataSource.data = response.userCustomPermissions;
        this.userPermissionData = response.userPermissionData;
        this.usersCustomerAdmin = response.usersCustomerAdmin;
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
      userRoleId: this.$userCustomerStore.userRoleId(),
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

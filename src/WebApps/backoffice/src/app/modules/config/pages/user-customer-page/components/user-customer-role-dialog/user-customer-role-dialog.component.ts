import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';

import { Role } from '@modules/config/models/role';
import { UserCustomerRoleService } from '@modules/config/services/user-customer-role.service';
import { UserCustomerService } from '@modules/config/services/user-customer.service';

import { CompanySearchComponent } from '@modules/config/components/company-search/company-search.component';
import { isValidField } from '@core/utils/data-validation';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-user-customer-role-dialog',
  imports: [
    FormsModule,
    CompanySearchComponent,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './user-customer-role-dialog.component.html',
  styles: ``,
})
export class UserCustomerRoleDialogComponent {
  @Input() params = {
    userCustomerId: 0,
    businessName: '',
    id: 0,
    companyUuid: '',
    roleId: 0,
  };
  private dialogRef = inject(MatDialogRef<UserCustomerRoleDialogComponent>);
  private tS = inject(ToastrNotificationService);
  private userCustomerSvc = inject(UserCustomerService);
  private userCustomerRoleSvc = inject(UserCustomerRoleService);

  roles: Role[] = [];

  dialogTitle = 'Nueva Asignación de Rol';
  titleBtn = 'Guardar';

  closeDialog() {
    this.dialogRef.close();
  }

  data = {
    userCustomerId: 0,
    businessName: '',
    id: 0,
    companyUuid: '',
    roleId: 0,
  };

  ngOnInit() {
    this.data.userCustomerId = this.params.userCustomerId;
    this.data.businessName = this.params.businessName;
    if (this.params && this.params.id > 0) {
      this.dialogTitle = 'Editar Asignación de Rol';
      this.titleBtn = 'Actualizar';
      this.data.id = this.params.id;
      this.data.companyUuid = this.params.companyUuid;
      this.data.roleId = this.params.roleId;
    }

    this.userCustomerSvc.getDataForm().subscribe((response) => {
      this.roles = response.roles;
    });
  }

  onSelectCompany($event: any) {
    this.data.companyUuid = $event.uuid;
  }

  onRoleChange($event: any) {
    if (!isValidField(this.data.companyUuid)) {
      return;
    }

    let params = {
      companyUuid: this.data.companyUuid,
      roleId: this.data.roleId,
    };
    this.userCustomerRoleSvc
      .getAccessByRoleId(params)
      .subscribe((response) => {});
    // this.userCustomerRoleSvc.get(parameters).subscribe({
    //   next: (response) => {
    //     if (response) {
    //       if (response.code == '0') {
    //         this.tS.show({
    //           type: 'warning',
    //           message: response.message,
    //         });
    //       }
    //       if (response.code == '1') {
    //         let { accesses } = JSON.parse(response.payload as string);
    //         console.log(accesses);
    //         // const nestedArray = this.updateKeyNameInArray(
    //         //   accesses[0]['accesses'],
    //         //   'submenus',
    //         //   '_children'
    //         // );

    //         this.accesses = accesses.map(
    //           (item: { id: any; name: any; url: any; _children: string }) => ({
    //             id: item.id,
    //             name: item.name,
    //             url: item.url,
    //             _children: JSON.parse(item._children).map(
    //               (submenu: {
    //                 id: any;
    //                 name: any;
    //                 url: any;
    //                 _children: string;
    //               }) => ({
    //                 id: submenu.id,
    //                 name: submenu.name,
    //                 url: submenu.url,
    //                 _children: JSON.parse(submenu._children),
    //               })
    //             ),
    //           })
    //         );
    //       }
    //     }
    //   },
    //   error(err) {
    //     console.log(err);
    //   },
    //   complete() { },
    // });
  }
  removeAccents(str: string | null) {
    str = str || '';
    return str.replace(/[^a-z0-9]/gi, '');
  }
  save() {
    try {
      const dataToSave = structuredClone(this.data);
      if (!dataToSave.companyUuid) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione la Empresa!',
        });
        return;
      }
      if (Number(dataToSave.roleId) == 0) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el rol!',
        });
        return;
      }

      if (Number(dataToSave.id) > 0) {
        this.userCustomerRoleSvc
          .put(Number(dataToSave.id), dataToSave)
          .subscribe({
            next: this.commonResponse,
          });
      }

      if (Number(dataToSave.id) == 0) {
        this.userCustomerRoleSvc.post(dataToSave).subscribe({
          next: this.commonResponse,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      if (response.code === '0') {
        this.tS.show({
          type: 'warning',
          message: response.message,
        });
      }
      if (response.code === '1') {
        this.tS.show({
          type: 'success',
          message: response.message,
        });
        this.dialogRef.close(response);
      }
    }
  };

  updateKeyNameInArray(array: any, oldKey: string, newKey: string) {
    let parsedArray = JSON.parse(array);
    console.log(parsedArray);
    return parsedArray.map((item: any) => {
      if (oldKey in item) {
        item[newKey] = item[oldKey];
        delete item[oldKey];
      }
      return item;
    });
  }
}

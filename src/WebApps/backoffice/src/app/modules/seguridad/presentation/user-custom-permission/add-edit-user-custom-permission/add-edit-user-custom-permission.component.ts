import { Component, inject, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GetUserCustomPermissionFormDataUseCase } from '@modules/seguridad/domain/use-cases/user-custom-permission/get-user-custom-permission-form-data.use-case';
import { Menu } from '@modules/config/models/menu';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getValidId } from '@core/utils/data-validation';
import { ActionModel } from '@modules/seguridad/domain/models/action.model';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { CreateUserCustomPermissionUseCase } from '@modules/seguridad/domain/use-cases/user-custom-permission/create-user-custom-permission.use-case';
import {
  MenuPermission,
  UserCustomPermissionList,
} from '@modules/seguridad/domain/models/user-custom-permission.model';
import { UpdateUserCustomPermissionUseCase } from '@modules/seguridad/domain/use-cases/user-custom-permission/update-user-custom-permission.use-case';
import { MatCardContent } from '@angular/material/card';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-add-edit-user-custom-permission',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './add-edit-user-custom-permission.component.html',
  styles: ``,
})
export class AddEditUserCustomPermissionComponent implements OnInit {
  private dialogRef = inject(
    MatDialogRef<AddEditUserCustomPermissionComponent>,
  );
  private $getUserCustomPermissionFormDataUseCase = inject(
    GetUserCustomPermissionFormDataUseCase,
  );
  private $createUserCustomPermissionUseCase = inject(
    CreateUserCustomPermissionUseCase,
  );
  private $updateUserCustomPermissionUseCase = inject(
    UpdateUserCustomPermissionUseCase,
  );

  private _tS = inject(ToastrNotificationService);

  params = inject<UserCustomPermissionList>(MAT_DIALOG_DATA);

  title = 'Nuevo Permiso Personalizado';

  menus = signal<MenuPermission[]>([]);
  public filteredMenus = signal<MenuPermission[]>([]);
  public filteredSubMenus = signal<MenuPermission[]>([]);

  private actions = signal<ActionModel[]>([]);
  public filteredActions = signal<ActionModel[]>([]);

  dataForm = {
    menuId: 0,
    actionId: 0,
    isActive: true,
    securityType: null as unknown,
  };

  ngOnInit() {
    this.$getUserCustomPermissionFormDataUseCase
      .execute()
      .subscribe((response) => {
        this.menus.set(response.menus);

        this.filteredMenus.set(this.menus().slice());
        this.actions.set(response.actions);
        this.filteredActions.set(this.actions().slice());

        if (this.isUpdate()) {
          this.dataForm.menuId = this.params.menuId;
          this.dataForm.actionId = this.params.actionId;
          this.dataForm.isActive = this.params.isActive;
          this.dataForm.securityType = this.params.securityType;
          this.changeMenu();
        }
      });
  }

  filterMenus($event: any) {
    const search = $event.target?.value?.toLowerCase();
    const filteredMenus = this.menus().filter(
      (item) => item.name.toLowerCase().indexOf(search) > -1,
    );
    this.filteredMenus.set(filteredMenus.slice());
  }

  changeMenu() {
    this.filteredSubMenus.set([
      {
        id: 0,
        name: 'Ninguno',
        menuId: 0,
        aplicacionId: 0,
        url: '',
        isActive: false,
      },
      ...this.getFilteredSubMenus(),
    ]);
  }

  private getFilteredSubMenus() {
    return this.menus().filter((item) => item.menuId === this.dataForm.menuId);
  }

  filterSubMenus($event: any) {
    // get the search keyword
    let search = $event.target.value;
    if (!search) {
      this.setFilteredSubMenus(this.getFilteredSubMenus().slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    const filteredSubMenus = this.getFilteredSubMenus().filter(
      (item) => item.name.toLowerCase().indexOf(search) > -1,
    );
    this.setFilteredSubMenus(filteredSubMenus);
  }

  private setFilteredSubMenus(filteredSubMenus: MenuPermission[]) {
    this.filteredSubMenus.set([
      {
        id: 0,
        name: 'Ninguno',
        menuId: 0,
        aplicacionId: 0,
        url: '',
        isActive: false,
      },
      ...filteredSubMenus,
    ]);
  }

  filterActions($event: any) {
    const search = $event.target?.value?.toLowerCase();
    const filteredActions = this.actions().filter((item) => {
      const existName = item.name.toLowerCase().indexOf(search) > -1;
      const existDescription =
        item.description &&
        item.description?.toLowerCase().indexOf(search) > -1;
      return existName || existDescription;
    });
    this.filteredActions.set(filteredActions.slice());
  }

  isUpdate() {
    return getValidId(this.params.id);
  }

  isAdd() {
    return !getValidId(this.params.id);
  }

  private commonResponse = (response: ApiResponse) => {
    if (response.code === '0') {
      this._tS.show({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this._tS.show({
        type: 'success',
        message: response.message,
      });
      this.dialogRef.close(response);
    }
  };

  public save() {
    if (!getValidId(this.dataForm.menuId)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione el Menú',
      });
    }

    if (!getValidId(this.dataForm.actionId)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione la Acción',
      });
    }

    const params = {
      ...this.dataForm,
      id: this.params.id,
    };
    if (this.isAdd()) {
      this.$createUserCustomPermissionUseCase
        .execute(params)
        .subscribe(this.commonResponse);
    }

    if (this.isUpdate()) {
      this.$updateUserCustomPermissionUseCase
        .execute(params)
        .subscribe(this.commonResponse);
    }
  }

  close() {
    this.dialogRef.close();
  }
}

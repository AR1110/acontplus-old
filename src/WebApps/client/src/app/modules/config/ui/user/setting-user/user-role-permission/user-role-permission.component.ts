import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { MatIcon } from '@angular/material/icon';
import { UserRole } from '@modules/config/data/models/user/user-role.model';
import { ListUserPermissionUseCase } from '@modules/config/application/use-cases/user-permission/list-user-permission.use-case';
import { UpdateUserPermissionUseCase } from '@modules/config/application/use-cases/user-permission/update-user-permission.use-case';
import { UserStore } from '@modules/config/application/store/user.store';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-role-permission',
  imports: [
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    Button,
    DynamicCard,
    MatIcon,
  ],
  templateUrl: './user-role-permission.component.html',
  styleUrl: 'user-role-permission.component.scss',
})
export class UserCustomerRolePermissionComponent implements OnInit {
  private $listUseCase = inject(ListUserPermissionUseCase);
  private $updateUseCase = inject(UpdateUserPermissionUseCase);
  private $userStore = inject(UserStore);

  usersCustomerAdmin: UserRole[] = [];
  userCustomerAdminSelected = new FormControl([]);

  allCompleteSaleComprobante = signal(false);
  allCompleteSaleDetail = false;
  allCompleteSaleAdditional = false;
  allCompleteProduct = false;
  allCompleteCashBox = false;

  mainPermission: any = {
    permissionsProduct: {},
    permissionsCashBox: {},
  };
  mainPermissionSale: any = {
    comprobante: {},
    detail: {},
    additional: {},
  };
  permissionProductKey: string[] = [];
  permissionCashBoxKey: string[] = [];

  permissionSaleComprobanteKey: string[] = [];
  permissionSaleDetailKey: string[] = [];
  permissionSaleAdditionalKey: string[] = [];

  getUserPermissions() {
    const params = {
      userRoleId: this.$userStore.userRoleId(),
    };
    this.$listUseCase.execute(params).subscribe((response: any) => {
      this.usersCustomerAdmin = response.usersCustomerAdmin;
      this.mainPermission = response;
      this.setDataPermissionSale();
      this.setDataPermissionArticulo();
      this.setDataPermissionCashBox();
    });
  }

  setDataPermissionSale() {
    const { permission } = this.mainPermission.permissionsSale;
    this.mainPermissionSale = permission || this.mainPermissionSale;

    this.permissionSaleComprobanteKey = Object.keys(this.mainPermissionSale?.comprobante || []);
    this.permissionSaleDetailKey = Object.keys(this.mainPermissionSale?.detail || []);
    this.permissionSaleAdditionalKey = Object.keys(this.mainPermissionSale?.additional || []);
    this.userCustomerAdminSelected.setValue(
      this.mainPermissionSale?.additional?.keyRequest?.usersAdmin || [],
    );

    this.updateAllCompleteSaleComprobante();
    this.updateAllCompleteSaleDetail();
    this.updateAllCompleteSaleAdditional();
  }

  setDataPermissionArticulo() {
    const { permission } = this.mainPermission.permissionsProduct;
    this.permissionProductKey = Object.keys(permission || []);
    this.updateAllCompleteProduct();
  }

  setDataPermissionCashBox() {
    const { permission } = this.mainPermission.permissionsCashBox;
    this.permissionCashBoxKey = Object.keys(permission || []);
    this.updateAllCompleteCashBox();
  }

  ngOnInit() {
    this.getUserPermissions();
  }

  /**
   * Permiso venta comprobante
   *
   */
  someCompleteSaleComprobante() {
    const comprobantePermisos =
      this.permissionSaleComprobanteKey.filter(
        (permiso) => this.mainPermissionSale.comprobante[permiso].enabled,
      ).length > 0 && !this.allCompleteSaleComprobante();
    return comprobantePermisos;
  }

  setAllSaleComprobante(completed: boolean) {
    this.allCompleteSaleComprobante.set(completed);

    this.permissionSaleComprobanteKey.forEach((permiso) => {
      this.mainPermissionSale.comprobante[permiso].enabled = completed;
    });
  }

  updateAllCompleteSaleComprobante() {
    this.allCompleteSaleComprobante.set(
      this.permissionSaleComprobanteKey.every(
        (permiso) => this.mainPermissionSale.comprobante[permiso].enabled,
      ),
    );
  }

  /**
   * Pemirso detalle Venta
   *
   */
  someCompleteSaleDetail() {
    const isSome =
      this.permissionSaleDetailKey.filter(
        (permiso) => this.mainPermissionSale.detail[permiso].enabled,
      ).length > 0 && !this.allCompleteSaleDetail;
    return isSome;
  }

  setAllSaleDetail(completed: boolean) {
    this.allCompleteSaleDetail = completed;

    this.permissionSaleDetailKey.forEach((permiso) => {
      this.mainPermissionSale.detail[permiso].enabled = completed;
    });
  }
  updateAllCompleteSaleDetail() {
    this.allCompleteSaleDetail = this.permissionSaleDetailKey.every(
      (permiso) => this.mainPermissionSale.detail[permiso].enabled,
    );
  }
  //=======================================

  /**
   * Permisos adicionales en venta
   */

  someCompleteSaleAdditional() {
    const isSome =
      this.permissionSaleAdditionalKey.filter(
        (permiso) => this.mainPermissionSale.additional[permiso].enabled,
      ).length > 0 && !this.allCompleteSaleAdditional;
    return isSome;
  }

  setAllSaleAdditional(completed: boolean) {
    this.allCompleteSaleAdditional = completed;

    this.permissionSaleAdditionalKey.forEach((permiso) => {
      this.mainPermissionSale.additional[permiso].enabled = completed;
    });
  }

  updateAllCompleteSaleAdditional() {
    this.allCompleteSaleAdditional = this.permissionSaleAdditionalKey.every(
      (permiso) => this.mainPermissionSale.additional[permiso].enabled,
    );
  }

  /**
   * Permiso Producto
   *
   */
  someCompleteProduct() {
    const isSome =
      this.permissionProductKey.filter(
        (permiso) => this.mainPermission?.permissionsProduct?.permission[permiso].enabled,
      ).length > 0 && !this.allCompleteProduct;
    return isSome;
  }

  setAllProduct(completed: boolean) {
    this.allCompleteProduct = completed;

    this.permissionProductKey.forEach((permiso) => {
      this.mainPermission.permissionsProduct.permission[permiso].enabled = completed;
    });
  }

  updateAllCompleteProduct() {
    this.allCompleteProduct = this.permissionProductKey.every(
      (permiso) => this.mainPermission?.permissionsProduct?.permission[permiso].enabled,
    );
  }

  /**
   * Permisos caja-page
   *
   */
  someCompleteCashBox() {
    const isSome =
      this.permissionCashBoxKey.filter(
        (permiso) => this.mainPermission?.permissionsCashBox?.permission[permiso].enabled,
      ).length > 0 && !this.allCompleteCashBox;
    return isSome;
  }

  setAllCashBox(completed: boolean) {
    this.allCompleteCashBox = completed;

    this.permissionCashBoxKey.forEach((permiso) => {
      this.mainPermission.permissionsCashBox.permission[permiso].enabled = completed;
    });
  }

  updateAllCompleteCashBox() {
    this.allCompleteCashBox = this.permissionCashBoxKey.every(
      (permiso) => this.mainPermission?.permissionsCashBox?.permission[permiso].enabled,
    );
  }

  onSave() {
    try {
      if (this.mainPermission?.permissionsSale?.permission?.additional?.keyRequest.enabled) {
        if (
          !this.userCustomerAdminSelected.value ||
          this.userCustomerAdminSelected.value?.length === 0
        ) {
          Swal.fire({
            icon: 'warning',
            html: 'Seleccione al menos un usuario administrador, a quien se le enviará la solicitud correspondiente',
          });
          return;
        } else {
          this.mainPermission.permissionsSale.permission.additional.keyRequest.usersAdmin =
            this.userCustomerAdminSelected.value;
        }
      } else {
        this.mainPermission.permissionsSale.permission.additional.keyRequest.usersAdmin = [];
      }

      const { permissionsCashBox, permissionsProduct, permissionsSale } = structuredClone(
        this.mainPermission,
      );
      permissionsCashBox.permission = JSON.stringify(permissionsCashBox.permission);
      permissionsProduct.permission = JSON.stringify(permissionsProduct.permission);
      permissionsSale.permission = JSON.stringify(permissionsSale.permission);

      const dataPermissions = [permissionsSale, permissionsProduct, permissionsCashBox];
      const data = {
        dataPermissions,
      };

      this.$updateUseCase.execute(data).subscribe((response) => {
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
          this.getUserPermissions();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

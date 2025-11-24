import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { UserCustomerRole } from '@modules/config/domain/models/user-customer/user-customer-role.model';
import { UserCustomerStore } from '@modules/config/application/store/user-customer.store';
import { ListUserCustomerPermissionUseCase } from '@modules/config/application/use-cases/user-customer-permission/list-user-customer-permission.use-case';
import { UpdateUserCustomerPermissionUseCase } from '@modules/config/application/use-cases/user-customer-permission/update-user-customer-permission.use-case';
import Swal from 'sweetalert2';
import { Button } from '@acontplus/ng-components';
import { DynamicCard } from '@acontplus/ng-components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-customer-role-permission',
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
  templateUrl: './user-customer-role-permission.component.html',
  styleUrl: 'user-customer-role-permission.component.scss',
})
export class UserCustomerRolePermissionComponent implements OnInit {
  private $listUseCase = inject(ListUserCustomerPermissionUseCase);
  private $updateUseCase = inject(UpdateUserCustomerPermissionUseCase);
  private $userCustomerStore = inject(UserCustomerStore);

  usersCustomerAdmin: UserCustomerRole[] = [];
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
      userRoleId: this.$userCustomerStore.userRoleId(),
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
   * Permisos caja
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

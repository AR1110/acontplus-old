import { Component } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

export interface Task {
  name: string;
  completed: boolean;
  color: any
  subtasks?: Task[];
}

@Component({
  selector: 'app-user-customer-role-permission',
  standalone: true,
  imports: [
    FontAwesomeModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-customer-role-permission.component.html',
  styleUrl: 'user-customer-role-permission.component.scss'
})
export class UserCustomerRolePermissionComponent {

  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  allCompleteSaleComprobante = false;
  allCompleteSaleDetail = false;
  allCompleteSaleAdditional = false;

  permissionSale: any = {
    comprobante: {
      label: "Comprobante",
      permissions: {
        fechaEmision: {
          description: "Modificar Fecha de Emisión",
          enabled: true
        },
        tiempoCredito: {
          description: "Cambiar tiempo Credito",
          enabled: true
        },
        tarifa: {
          description: "Modifcar tarifa general",
          enabled: true
        },
        porcentajeDescuento: {
          description: "Cambiar Porcentaje Descuento",
          enabled: true
        },
        descuento: {
          description: "Cambiar Descuento",
          enabled: true
        }
      }
    },
    detail: {
      label: 'Detalle',
      permissions: {
        medida: {
          description: "Cambiar Medida",
          enabled: true
        },
        tipoIva: {
          description: "Cambiar Tipo IVA",
          enabled: true
        },
        tarifa: {
          description: "Cambiar tarifa",
          enabled: true
        },
        precioUnitario: {
          description: "Modificar Precio Unitario",
          enabled: true
        },
        precioConIva: {
          description: "Modificar Precio con IVA",
          enabled: true
        },
        porcentajeDescuento: {
          description: "Modificar Porcentaje Descuento",
          enabled: true
        },
        descuento: {
          description: "Modificar Descuento",
          enabled: true
        }
      }
    },
    additional: {
      label: 'Adicional',
      permissions: {
        keyRequest: { // Cambiado por un nombre legible y corto
          description: "Solicitar Autorización para Editar o Anular el Doc. Venta",
          enabled: false,
          usersAdmin: [],
          isKeyRequest: true
        },
        viewOthersDocs: {
          description: "Consultar documentos electronicos de otros usuarios",
          enabled: true
        },
        kardex: {
          description: "Ver Kardex",
          enabled: true
        },
        totalesVenta: {
          description: "Mostrar totales de ventas",
          enabled: true
        }
      }
    }
  };


  permissionSaleComprobante = Object.keys(this.permissionSale.comprobante.permissions);
  permissionSaleDetail = Object.keys(this.permissionSale.detail.permissions)
  permissionSaleAdditional = Object.keys(this.permissionSale.additional.permissions)

  ngOnInit(){
    this.updateAllCompleteSaleComprobante();
    this.updateAllCompleteSaleDetail();
  }
  /**
   * Permiso venta comprobante
   *
   */
  someCompleteSaleComprobante() {
    const comprobantePermisos = this.permissionSaleComprobante
      .filter(permiso => this.permissionSale.comprobante.permissions[permiso].enabled).length > 0 && !this.allCompleteSaleComprobante;
    return comprobantePermisos;
  }

  setAllSaleComprobante(completed: boolean) {
    this.allCompleteSaleComprobante = completed;

    this.permissionSaleComprobante.forEach(permiso => {
      this.permissionSale.comprobante.permissions[permiso].enabled = completed;
    });
  }

  updateAllCompleteSaleComprobante() {
    this.allCompleteSaleComprobante = this.permissionSaleComprobante.every(permiso => this.permissionSale.comprobante.permissions[permiso].enabled);
  }

  /**
   * Pemirso detalle Venta
   *
   */
  someCompleteSaleDetail(){
    const isSome = this.permissionSaleDetail
      .filter(permiso => this.permissionSale.detail.permissions[permiso].enabled).length > 0 && !this.allCompleteSaleDetail;
    return isSome;
  }

  setAllSaleDetail(completed: boolean) {
    this.allCompleteSaleDetail = completed;

    this.permissionSaleDetail.forEach(permiso => {
      this.permissionSale.detail.permissions[permiso].enabled = completed;
    });
  }
  updateAllCompleteSaleDetail() {
    this.allCompleteSaleDetail = this.permissionSaleDetail.every(permiso => this.permissionSale.detail.permissions[permiso].enabled);
  }
  //=======================================

  /**
   * Permisos adicionales en venta
   */

  someCompleteSaleAdditional(){
    const isSome = this.permissionSaleAdditional
      .filter(permiso => this.permissionSale.additional.permissions[permiso].enabled).length > 0 && !this.allCompleteSaleAdditional;
    return isSome;
  }

  setAllSaleAdditional(completed: boolean) {
    this.allCompleteSaleAdditional = completed;

    this.permissionSaleAdditional.forEach(permiso => {
      this.permissionSale.additional.permissions[permiso].enabled = completed;
    });
  }

  updateAllCompleteSaleAdditional() {
    this.allCompleteSaleAdditional = this.permissionSaleAdditional.every(permiso => this.permissionSale.additional.permissions[permiso].enabled);
  }


}

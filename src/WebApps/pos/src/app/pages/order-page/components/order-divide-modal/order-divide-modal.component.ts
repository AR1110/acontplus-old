import { Component, computed, inject, signal } from '@angular/core';
import { tap } from "rxjs";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { OrderService } from "@/services/order.service";
import { OrderData, OrderDivideItem } from '@/models/order.model';
import { CustomTableContainerComponent } from '@/core/components/custom-table-container/custom-table-container.component';
import { InputRemainingQtyComponent } from './components/input-remaining-qty/input-remaining-qty.component';
import { pricingCalculateUtil } from '@/core/utils/princing-calculate.util';
import { roundNumber } from '@/core/utils/round-number.util';
import { DialogService } from '@/services/dialog.service';
import {
  OrderCustomItemComponent
} from "@/pages/order-page/components/order-divide-modal/components/order-custom-item/order-custom-item.component";
import {
  CustomContainerDialogComponent
} from "@core/components/custom-container-dialog/custom-container-dialog.component";
import {
  CompanyCustomerSearchComponent
} from '@/pages/company-customer/components/company-customer-search/company-customer-search.component';
import { getValidId } from "@core/utils/utils";
import { ToasterService } from '@/services/toaster.service';
import Swal from 'sweetalert2';
import { DECIMALS, DOC_TYPE } from "@/enums/main.enum";
import { ConfigService } from "@/services/config.service";
import { AuthService } from "@/services/auth.service";
import { instanceDecimal, minus, mul, plus } from "@core/utils/decimal.util";
import { OrderAdapter } from '@/adapters/order.adapter';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-order-divide-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CustomTableContainerComponent,
    CustomContainerDialogComponent,
    InputRemainingQtyComponent,
    CompanyCustomerSearchComponent
  ],
  templateUrl: './order-divide-modal.component.html',
  styleUrl: './order-divide-modal.component.scss'
})
export class OrderDivideModalComponent {

  readonly dialogRef = inject(MatDialogRef<OrderDivideModalComponent>);
  readonly matDialogData = inject<{ orderId: 0 }>(MAT_DIALOG_DATA);

  private authSvc = inject(AuthService)
  private configSvc = inject(ConfigService);
  private orderSvc = inject(OrderService);
  private dialogSvc = inject(DialogService)
  private tS = inject(ToasterService);
  private orderAdapterSvc = inject(OrderAdapter)
  private codDoc: any;

  orderData: OrderData = {
    order: {
      uuid: '',
      orderId: 0,
      userId: 0,
      customerCompanyId: 0,
      customerName: '',
      createdAt: new Date(),
      subtotalSinImpuestos: 0,
      items: [],
      customDetail: undefined,
      itemsToPay: undefined,
      tableId: 0,
      obs: undefined,
      tableDesc: undefined,
      establecimientoId: 0,
      puntoEmisionId: 0,
      codDoc: undefined,
      tax: 0,
      discount: 0,
      tip: 0,
      total: 0,
      quickSale: undefined,
      bodegaId: undefined,
      saveDoc: undefined,
      updateOrder: undefined
    }
  };
  tempOrderData: OrderData = structuredClone(this.orderData);
  orderDivideItems: OrderDivideItem[] = [];
  cloneOrderDivideItems: OrderDivideItem[] = [];

  isLoadingResults = false;

  displayedColumns: string[] = [
    'checkbox',
    'index',
    'code',
    'descripcion',
    'quantity',
    'remainingQuantity',
    'precioConIVA',
    'total',
  ];

  private isReload = false;


  selectedRows = signal<OrderDivideItem[]>([]);

  dataSource = signal<OrderDivideItem[]>([]);

  dataForm = {} as any;


  totalImporteDivideFiltrado = computed(() => {
    let total = 0;
    if (this.dataSource()) {
      total = this.selectedRows().reduce((acc, prev) => {
        acc += this.getItemDivideTotal(prev).total;

        return acc;
      }, 0);
    }
    return roundNumber(total, 2);
  });

  labelRowCounText = computed(() => {
    return `${this.numSelected} ${this.numSelected === 1 ? 'Seleccionado' : 'Seleccionados'}`;
  })

  getDataById() {
    this.isLoadingResults = true;
    this.orderSvc.getId(this.matDialogData.orderId)
      .pipe(
        tap(() => {
          this.isLoadingResults = false;
        })
      )
      .subscribe(response => {
        const orderDivideItems = response.order.items.map(item => ({
          ...item,
          remainingQuantityReal: item.remainingQuantity || 0
        }))

        this.orderData = structuredClone(response);
        this.tempOrderData = structuredClone(response);
        this.orderDivideItems = orderDivideItems;
        this.cloneOrderDivideItems = structuredClone(orderDivideItems);

        // Asignar el nuevo MatTableDataSource a `dataSource`
        this.dataSource.set(this.orderDivideItems);

      })
  }

  getDataForm() {
    let dataEstab = this.authSvc.getDataEstab();
    if (!dataEstab) {
      console.log('no se encontró datos del establecimiento')
      return
    }
    let params = {
      codEstab: dataEstab.codEstab,
      idEstablecimiento: dataEstab.idEstablecimiento
    }
    this.configSvc.getDataForm(params).subscribe(response => {
      this.dataForm = response;
    })
  }
  ngOnInit() {
    try {
      this.getDataForm();
      this.getDataById()
    } catch (error) {
      console.log(error)
    }
  }


  onSelectCompanyCustomer($event: any) {
    this.orderData.order.customerCompanyId = $event.idCliente;
    this.orderData.order.customerName = $event.name;
  }

  refresh() {

    this.selectedRows.update(() => []);

    this.dataSource.update(() => []);

    this.getDataById()
  }

  openCustomOrderItemModal() {
    this.dialogSvc.open(OrderCustomItemComponent, {
      size: 'md',
      data: {
        dataForm: this.dataForm,
        orderData: this.orderData,
        selectedRows: this.selectedRows()
      }
    }).subscribe(result => {
      if (result && (result.isReload)) {
        this.dialogRef.close({
          isReload: true
        })
      }
    });
  }

  openConvertToDocModal() {

  }


  //===========================
  // Verifica si todos los elementos están pagados y no tienen cantidad restante
  isAllPaidAndNoRemainingQuantity() {
    let isAllPaid = this.dataSource().some(i => {
      return i.paid && i.remainingQuantityReal === 0;
    });
    return isAllPaid;
  }

  // Verifica si todas las cantidades son iguales a las cantidades restantes
  isQuantityUnchanged() {
    return this.dataSource().every(i => (i.remainingQuantity || 0) > 0 && i.quantity === (i.remainingQuantity || 0));
  }


  get numSelected() {
    return this.selectedRows().length;
  }

  get rowCount() {
    return this.dataSource().length;
  }

  isSelected(row: OrderDivideItem): boolean {
    return this.selectedRows().includes(row);
  }

  isAllSelected(): boolean {
    return this.selectedRows().length === this.dataSource().length;
  }

  isSomeSelected(): boolean {
    return this.selectedRows().length > 0 && !this.isAllSelected();
  }

  toggleRow(row: OrderDivideItem) {
    const index = this.selectedRows().findIndex(r => r.id === row.id); // Suponiendo que tienes una propiedad id para identificar filas únicas

    if (index === -1) {
      const newRows = [...this.selectedRows(), row];
      this.selectedRows.update(() => newRows);

    } else {

      const newRows = this.selectedRows().filter(r => r.id !== row.id);
      this.selectedRows.update(() => newRows);
    }
  }


  masterToggle() {
    if (this.isAllSelected()) {
      this.selectedRows.update(() => []);
    } else {
      this.selectedRows.update(() => this.dataSource().slice())
    }
  }


  changeInputQuantity($event: any) {
    let newRows = this.dataSource().map(item => {
      if (item.uuid === $event.uuid) {

        item.remainingQuantity = $event.value;

      }
      return item;
    })
    this.dataSource.set(newRows)
  }

  getItemDivideTotal(item: OrderDivideItem) {

    const remainingQuantity = item.remainingQuantity ?? 0;

    let calcularTotalAntesDescuento = pricingCalculateUtil.calcularTotalAntesDescuento(item.price, remainingQuantity);
    let discount = item.discount;
    if (discount > calcularTotalAntesDescuento) {
      discount = 0;
    }

    let precioTotalSinImpuesto = pricingCalculateUtil.calcularSubtotalSinImpuesto(item.price, remainingQuantity, discount);

    const valorImpuesto = pricingCalculateUtil.calculateTaxValue(precioTotalSinImpuesto, item.taxPercent);


    let total = pricingCalculateUtil.calcularTotalConImpuesto(precioTotalSinImpuesto, valorImpuesto);



    return {
      precioTotalSinImpuesto,
      valorImpuesto,
      discount,
      total,
    };
  }

  private getTotales(arr: OrderDivideItem[]) {
    const { subtotalSinImpuestos, orderDivideImporteTotal } = arr.reduce((acc, prev) => {
      const { precioTotalSinImpuesto, total, discount } = this.getItemDivideTotal(prev);
      acc.subtotalSinImpuestos = plus(acc.subtotalSinImpuestos, precioTotalSinImpuesto, DECIMALS.CINCO);
      acc.orderDivideImporteTotal = plus(acc.orderDivideImporteTotal, total, DECIMALS.CINCO);
      acc.totalDescuento = plus(acc.totalDescuento, discount, DECIMALS.CINCO)
      return acc;
    }, {
      subtotalSinImpuestos: 0,
      orderDivideImporteTotal: 0,
      totalDescuento: 0
    });

    return {
      subtotalSinImpuestos: roundNumber(subtotalSinImpuestos, DECIMALS.DOS),
      orderDivideImporteTotal: roundNumber(orderDivideImporteTotal, DECIMALS.DOS)
    }
  }





  isValidForm() {
    let { order } = this.orderData;
    if (!getValidId(order.customerCompanyId)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el cliente'
      })
      return
    }

    if (this.selectedRows().length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'El detalle es vacio'
      })
      return
    }

    return true;

  }


  saveInvoice() {
    this.codDoc = DOC_TYPE.FV;
    this.save()
  }

  saveNotaEntrega() {
    this.codDoc = DOC_TYPE.NE
    this.save();
  }


  async save() {
    let html = '';
    let cloneSelectedRows = structuredClone(this.selectedRows());
    let setValuesSelectedRows = cloneSelectedRows.map(item => {
      const { total, precioTotalSinImpuesto, valorImpuesto, discount } = this.getItemDivideTotal(item);
      return {
        ...item,
        precioTotalSinImpuesto,
        taxValue: valorImpuesto,
        discount,
        total
      }
    })

    let { subtotalSinImpuestos, orderDivideImporteTotal } = this.getTotales(setValuesSelectedRows);
    const { customerCompanyId, obs, discount } = this.orderData.order;
    const cloneOrder = {
      ...this.orderData.order,
      subtotalSinImpuestos,
      customerCompanyId,
      obs,
      discount,
      total: orderDivideImporteTotal,
      items: setValuesSelectedRows.map(item => {
        return {
          ...item,
          quantity: (item.remainingQuantity || 0)
        }
      })
    }

    if (DOC_TYPE.FV === this.codDoc) {
      html = '¿Esta seguro de guardar como Factura?'
    } else {
      html = '¿Esta seguro de guardar como Nota de Entrega?'
    }


    if (!(cloneOrder.subtotalSinImpuestos > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'subtotalSinImpuestos undefined'
      })
      return
    }

    const { isConfirmed } = await Swal.fire({
      title: `Convertir a un documento`,
      html,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'No, cancelar!'
    })

    if (!isConfirmed) return




    const orderResult = this.orderAdapterSvc.postTo(cloneOrder);


    const params = {
      ...orderResult,
      updateOrder: false,
      saveDoc: true,
      codDoc: this.codDoc,
      quickSale: true,
      items: orderResult.items,
      itemsToPay: orderResult.items,
      taxes: orderResult.taxes
    }

    this.orderSvc.put(cloneOrder.orderId, params).subscribe(response => {
      if (response.code === "0") {
        this.tS.toastr({
          type: 'warning',
          message: response.message
        })
      }
      if (response.code === "1") {
        this.tS.toastr({
          type: 'success',
          message: response.message
        })
        this.refresh()
        this.isReload = true;
      }
    })

  }


  closeDialog() {
    this.dialogRef.close({
      isReload: this.isReload
    })
  }

}

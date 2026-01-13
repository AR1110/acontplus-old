import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { Button, TabulatorTable } from '@acontplus/ng-components';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DialogService } from '@core/services/dialog.service';
import { WarehouseTransferFilterAdvanced } from '@inventory/ui/warehouse-transfer/warehouse-transfer-add-edit/warehouse-transfer-filter-advanced/warehouse-transfer-filter-advanced';
import { WAREHOUSE_TRANSFER_SERVICE, PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import {
  GroupedEstab,
  GroupedEstabBodega,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import Swal from 'sweetalert2';
import { SearchDialogService } from '@shared/services/search-dialog';
import { AddEditProductDirective } from '@inventory/ui/product/components/directives/add-edit-product.directive';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ProductSearchDialog } from '@inventory/ui/product/components/product-search-dialog/product-search-dialog';

import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { roundNumber } from '@core/utils/round-number.utils';
import DecimalUtil from '@core/utils/decimal.util';
import { mergeStockItems } from '@inventory/utils/stock.utils';
import { firstValueFrom, take } from 'rxjs';
import { ValidatorUtils } from '@core/utils/utils';
import { ajustarFechaEmisionModificada, dateIsAfterCurrentDate } from '@core/utils/date.util';
import { finalize } from 'rxjs/operators';
import { WarehouseTransferDataFormResult } from '@inventory/data/models/warehouse-transfer';

interface CommonType {
  id: number;
  code: string;
  name: string;
}

@Component({
  selector: 'app-warehouse-page-transfer-add-edit',
  imports: [
    MatSelectModule,
    MatInput,
    MatCustomDialogComponent,
    Button,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    ReactiveFormsModule,
    FormsModule,
    AddEditProductDirective,
    MatIcon,
    MatIconButton,
    TabulatorTable,
  ],
  templateUrl: './warehouse-transfer-add-edit.html',
  styleUrl: './warehouse-transfer-add-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class WarehouseTransferAddEdit implements OnInit {
  private dgSvc = inject(DialogService);
  private warehouseTransferService = inject(WAREHOUSE_TRANSFER_SERVICE);
  private notiSvc = inject(ToastrNotificationService);
  private searchService = inject(SearchDialogService);
  private productService = inject(PRODUCT_SERVICE);

  private dialogRef = inject(DialogRef<WarehouseTransferAddEdit>);
  private params = inject<{ id: number; operation: 'add' | 'edit' | 'duplicate'; data: any }>(
    MAT_DIALOG_DATA,
  );

  isSaving = signal(false);

  sourceEstablishments = signal<GroupedEstab[]>([]);
  destinationEstablishments = signal<GroupedEstab[]>([]);
  sourceWarehouses = signal<GroupedEstabBodega[]>([]);
  destinationWarehouses = signal<GroupedEstabBodega[]>([]);
  emissionPoints = signal<GroupedEstabPuntoEmision[]>([]);

  transactionTypes = signal<CommonType[]>([]);
  documentTypes = signal<CommonType[]>([]);
  categories = signal<CommonType[]>([]);

  dataForm = {
    id: 0,
    sourceEstablishmentId: 0,
    destinationEstablishmentId: 0,

    puntoEmisionId: 0,
    issueDate: new Date(),
    sourceWarehouseId: 0,
    destinationWarehouseId: 0,
    obs: null,
    issueDateCreated: null as Date | null,
  };

  cloneSourceEstablishmentId = signal(0);

  uuidRow = signal('');

  details = signal<any[]>([]);
  detailsDeleted = signal<any[]>([]);

  comboEditor = (cell: any, onRendered: any, success: any, _cancel: any, _editorParams: any) => {
    const column: any = cell.getColumn().getField();
    const data: any = cell.getData();
    // const oldValue = cell.getOldValue();
    // const value = cell.getValue();

    const editor: any = document.createElement('select');

    if (column === 'measureId') {
      for (const m of data.measures) {
        const opt = document.createElement('option');
        opt.value = m.idMedida.toString();
        opt.innerHTML = m.descripcion;
        editor.appendChild(opt);
      }
    }

    editor.style.padding = '3px';
    editor.style.width = '100%';
    editor.style.boxSizing = 'border-box';

    editor.value = Number(cell.getValue());

    onRendered(function () {
      editor.focus();
      editor.style.css = '100%';
    });

    function successFunc() {
      success(editor.value);
    }

    editor.addEventListener('change', successFunc);
    editor.addEventListener('blur', successFunc);

    return editor;
  };

  columns = signal([
    {
      formatter: 'rownum',
      headerSort: false,
      hozAlign: 'center',
    },
    {
      title: 'Op.',
      formatter: (cell: any) => {
        const rowData = cell.getRow().getData();

        // contenedor de botones
        const buttonHolder = document.createElement('div');
        buttonHolder.style.display = 'flex';
        buttonHolder.style.gap = '4px'; // espacio entre botones
        buttonHolder.style.justifyContent = 'center';
        buttonHolder.style.alignItems = 'center';

        // Botón Eliminar
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 6h18" stroke="currentColor" stroke-width="2"/>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" stroke-width="2"/>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
        delBtn.classList.add('small-button', 'btn-remove');
        delBtn.addEventListener('click', () => {
          this.deleteRow(rowData);
        });

        // Botón Editar
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" fill="currentColor"/>
      </svg>
    `;
        editBtn.classList.add('small-button', 'btn-edit');
        editBtn.addEventListener('click', () => {
          // Edit functionality
        });

        // Agregar botones al contenedor
        buttonHolder.appendChild(editBtn);
        buttonHolder.appendChild(delBtn);

        return buttonHolder;
      },
      width: 100,
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
    },
    {
      title: 'Código',
      field: 'code',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '8px',
    },
    {
      title: 'Producto',
      field: 'description',
      editor: false,
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '40px',
    },
    {
      title: 'Cant.',
      field: 'quantity',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      width: '7px',

      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
    },
    {
      title: 'Medida',
      field: 'measureId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: function (cell: any) {
        const data = cell.getData();
        for (const m of data.measures) {
          if (m.idMedida == cell.getValue()) {
            return m.descripcion;
          }
        }
      },
      validator: 'required',
      width: '9px',
    },

    {
      title: 'Precio Costo.',
      field: 'costPrice',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      formatterParams: { precision: false },
    },
    {
      title: 'Total',
      field: 'total',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
    },
  ]);

  total = computed(() => {
    const totalValue = this.details().reduce((acc, item) => {
      return DecimalUtil.addAsNumber(acc, item.total); // sumamos cada item
    }, 0); // valor inicial
    return roundNumber(totalValue);
  });

  title = computed(() => {
    if (this.isEdit()) {
      return 'Editar Transferencia';
    }
    if (this.isDuplicate()) {
      return 'Duplicar Transferencia';
    }
    return 'Nueva Transferencia';
  });
  btnText = computed(() => {
    if (this.isEdit()) {
      return 'Editar';
    }
    return 'Guardar';
  });
  btnIcon = computed(() => {
    if (this.isEdit()) {
      return 'edit';
    }
    return 'save';
  });
  isAdd() {
    return this.params.operation === 'add';
  }
  isEdit() {
    return this.params.operation === 'edit';
  }

  isDuplicate() {
    return this.params.operation === 'duplicate';
  }

  openFilterAdvanced() {
    this.dgSvc
      .open(WarehouseTransferFilterAdvanced, {
        size: 'xl',
        data: {
          sourceWarehouses: structuredClone(this.sourceWarehouses()),
          sourceWarehouseId: this.dataForm.sourceWarehouseId,
          categories: structuredClone(this.categories()),
        },
      })
      .subscribe((result) => {
        if (result && typeof result === 'object') {
          const merge = [...this.details(), ...result.rowSelected].reduce((acc, item) => {
            acc[item.productId] = item;
            return acc;
          }, {});
          const listaUnida = Object.values(merge);
          this.details.set(listaUnida);
        }
      });
  }

  loadDataForm() {
    this.warehouseTransferService.getDataForm().subscribe({
      next: (response) => {
        this.initializeBaseData(response);

        if (this.sourceEstablishments().length === 0) {
          this.warnAndThrow('No tienes asignado ningún Establecimiento');
        }

        if (this.isAdd()) {
          this.setDataAdd();
        } else if (this.isEdit() || this.isDuplicate()) {
          this.setDataEditOrDuplicate();
        }
      },
      error: (err: any) => {
        this.notiSvc.error({ message: 'Error al cargar datos del formulario' });
        console.error(err);
      },
    });
  }

  private initializeBaseData(response: WarehouseTransferDataFormResult) {
    this.sourceEstablishments.set(response.establishments);
    this.destinationEstablishments.set(response.establishments);
    this.transactionTypes.set(response.transactionTypes);
    this.documentTypes.set(response.documentTypes);
    this.categories.set(response.categories);
  }

  private setDataEditOrDuplicate() {
    const { details, header } = this.params.data;

    const dataEstabSource = this.findEstablishmentByEmissionPoint(header.puntoEmisionId);
    const dataEstabDestination = this.findEstablishmentByWarehouse(header.destinationWarehouseId);

    // Actualizar listas dependientes
    this.emissionPoints.set(dataEstabSource?.puntosEmision ?? []);
    this.sourceWarehouses.set(dataEstabSource?.bodegas ?? []);
    this.destinationWarehouses.set(dataEstabDestination?.bodegas ?? []);

    const isDuplicate = this.isDuplicate();

    // Configurar formulario
    this.dataForm = {
      ...header,
      id: isDuplicate ? 0 : header.id,
      sourceEstablishmentId: dataEstabSource?.id ?? 0,
      destinationEstablishmentId: dataEstabDestination?.id ?? 0,
    };

    // Detalles
    this.details.set(isDuplicate ? details.map((d: any) => ({ ...d, id: 0 })) : details);

    if (isDuplicate) {
      // Duplicating record
    }
  }

  private findEstablishmentByEmissionPoint(puntoEmisionId: number): GroupedEstab | undefined {
    return this.sourceEstablishments().find((es) =>
      es.puntosEmision.some((pp) => pp.idPuntoEmision === puntoEmisionId),
    );
  }

  private findEstablishmentByWarehouse(warehouseId: number): GroupedEstab | undefined {
    return this.destinationEstablishments().find((es) =>
      es.bodegas.some((bb) => bb.idBodega === warehouseId),
    );
  }

  setDataAdd() {
    const dataEstab = this.sourceEstablishments().find((estab) => estab.defaultEstab);

    if (!dataEstab) {
      this.warnAndThrow('No se encontró Establecimiento por defecto');
    }

    this.emissionPoints.set(dataEstab.puntosEmision);
    this.sourceWarehouses.set(dataEstab.bodegas);

    // Código Establecimiento
    const idEstab = dataEstab.id ?? 0;
    this.dataForm.sourceEstablishmentId = idEstab;
    this.cloneSourceEstablishmentId.set(idEstab);

    // Punto de Emisión
    if (this.emissionPoints().length > 0) {
      this.dataForm.puntoEmisionId =
        this.emissionPoints().find((pto) => pto.defaultPtoEmi)?.idPuntoEmision ?? 0;
    } else {
      this.notiSvc.warning({ message: 'No tienes asignado ningún Punto de Emisión' });
    }

    // Bodega Origen
    if (this.sourceWarehouses().length > 0) {
      this.dataForm.sourceWarehouseId =
        this.sourceWarehouses().find((bod) => bod.defaultBodega)?.idBodega ?? 0;
    } else {
      this.notiSvc.warning({ message: 'No tienes asignada ninguna Bodega' });
    }
  }

  private warnAndThrow(message: string): never {
    this.notiSvc.warning({ message });
    throw new Error(message);
  }

  constructor() {
    this.searchService.setDefaultComponent(ProductSearchDialog);
  }

  ngOnInit() {
    this.loadDataForm();

    this.searchService.onResult().subscribe((result) => {
      this.handleSearchResult(result);
    });
  }

  async changeEstabSource() {
    const { isConfirmed } = await Swal.fire({
      title: '<small>Cambiar Establecimiento?</small>',
      html: '<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!',
      reverseButtons: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!isConfirmed) {
      this.dataForm.sourceEstablishmentId = this.cloneSourceEstablishmentId();
      return;
    }

    const dataEstab = this.sourceEstablishments().find(
      (estab) => estab.id === this.dataForm.sourceEstablishmentId,
    );

    if (dataEstab) {
      this.cloneSourceEstablishmentId.set(dataEstab.id ?? 0);
      this.emissionPoints.set(dataEstab.puntosEmision);
      this.sourceWarehouses.set(dataEstab.bodegas);
    }

    if (this.emissionPoints().length > 0) {
      this.dataForm.puntoEmisionId =
        this.emissionPoints().find((ptoEmi) => ptoEmi.defaultPtoEmi)?.idPuntoEmision ?? 0;
    } else {
      this.notiSvc.warning({
        message: 'No tienes asignado ningún Punto de Emisión a este Establecimiento',
      });
    }
    if (this.sourceWarehouses().length > 0) {
      this.dataForm.sourceWarehouseId =
        this.sourceWarehouses().find((bodega) => bodega.defaultBodega)?.idBodega ?? 0;
    } else {
      this.notiSvc.warning({
        message: 'No tienes asignado ninguna Bodega a este Establecimiento',
      });
    }
    this.dataForm.destinationEstablishmentId = 0;
    this.dataForm.destinationWarehouseId = 0;
    this.details.set(this.details().map((item) => ({ ...item, cantidad: 0 })));
  }

  changeEstabDestination() {
    const dataEstab = this.destinationEstablishments().find(
      (item) => item.id === this.dataForm.destinationEstablishmentId,
    );
    if (dataEstab) {
      this.destinationWarehouses.set(
        structuredClone(dataEstab.bodegas).filter((item) => {
          return item.idBodega !== this.dataForm.sourceWarehouseId;
        }),
      );
    }
    this.dataForm.destinationWarehouseId = 0;
    if (this.destinationWarehouses().length === 0) {
      this.notiSvc.warning({
        message: 'No tienes bodega destino disponible para este Establecimiento',
      });
    }
  }

  openSearch(): void {
    this.searchService.open(ProductSearchDialog)?.subscribe((result) => {
      this.handleSearchResult(result);
    });
  }
  private handleSearchResult(result: any): void {
    if (!result || typeof result !== 'object') return;

    this.productService
      .getForPurchase(result.id)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          const { data, measures } = response;

          if (!data || !Array.isArray(measures)) {
            console.error('Invalid product or measures data');
            return;
          }

          const tempDetails = structuredClone(this.details());
          const existingIndex = tempDetails.findIndex((v: any) => v.productId === data.id);

          const measure =
            existingIndex !== -1
              ? measures.find((m) => m.idMedida === Number(tempDetails[existingIndex].measureId))
              : measures.find((m) => m.defaultMedida);

          if (!measure) {
            console.error('No corresponding measure found');
            return;
          }

          const entity =
            existingIndex !== -1
              ? tempDetails[existingIndex]
              : {
                  uuid: generateUuidv4(),
                  id: 0,
                  productId: data.id,
                  quantity: 1,
                  status: true,
                };

          Object.assign(entity, {
            code: data.code,
            description: data.description,
            stock: data.stock,
            hasInventory: data.hasInventory,
            measures,
            measureId: measure.idMedida,
            conversion: measure.conversion,
            costPrice: measure.precioCosto,
            unitPrice: measure.precioUnitario,
            fractionalCostPrice: measure.precioCostoFraccionado,
            warehouseId: this.dataForm.sourceWarehouseId,
          });

          entity.total = roundNumber(entity.quantity * entity.costPrice);

          if (existingIndex !== -1) {
            entity.quantity += 1;
            this.uuidRow.set(entity.uuid);
          } else {
            tempDetails.push(entity);
            this.uuidRow.set(entity.uuid);
          }

          this.details.set(tempDetails);
        },
        error: (err: any) => {
          console.error('Error getting product:', err);
        },
      });
  }

  private async validateStock(details: any[], fn: (cont: boolean) => void): Promise<void> {
    try {
      const dataMergeStock = mergeStockItems(details);

      const response = await firstValueFrom(
        this.productService.checkNotificationStock({
          cantidad: dataMergeStock.quantity,
          idArticulo: dataMergeStock.productId,
          idBodega: dataMergeStock.warehouseId,
          idMedida: dataMergeStock.measureId,
        }),
      );
      const { code, message, titleSms } = response;

      //  Caso aprobado directamente
      if (code === '1') {
        fn(true);
        return;
      }

      const { isConfirmed } = await Swal.fire({
        title: `<small>${titleSms}</small>`,
        icon: 'warning',
        html: `<small>${message}</small>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (isConfirmed) {
        // code === '0' → rechazar
        // code === '2' → aceptar bajo advertencia
        fn(code === '2');
      }
    } catch (error) {
      console.error('Error validating stock:', error);
      fn(false);
    }
  }

  async cellEdited(cell: any): Promise<void> {
    const column = cell.getColumn().getField();
    const oldValue = parseFloat(cell.getOldValue());
    const newValue = parseFloat(cell.getValue());
    const data = { ...cell.getData() }; // copia superficial
    const oldData = cell.getRow().getData();

    if (newValue === oldValue || isNaN(newValue) || cell.getValue() === '' || newValue < 0) {
      cell.setValue(oldValue);
      return;
    }

    switch (column) {
      case 'quantity': {
        const updatedDetails = this.updateDetailInList(data.uuid, data);
        const isValid = await this.validateStockAsync(updatedDetails);
        if (!isValid) {
          data[column] = oldValue;
        }
        break;
      }

      case 'measureId': {
        const selectedMeasure = data.measures.find((m: any) => m.idMedida === Number(newValue));

        if (!selectedMeasure) {
          console.error('No se encontró la medida seleccionada');
          data[column] = oldValue;
          break;
        }

        Object.assign(data, {
          unitPrice: selectedMeasure.precioUnitario ?? 0,
          costPrice: selectedMeasure.precioCosto ?? 0,
          fractionalCostPrice: selectedMeasure.precioCostoFraccionado ?? 0,
          conversion: selectedMeasure.conversion ?? 0,
        });

        const updatedDetails = this.updateDetailInList(data.uuid, data);
        const isValid = await this.validateStockAsync(updatedDetails);

        if (!isValid) {
          data.measureId = oldData.measureId;
        }

        break;
      }

      default:
        break;
    }

    data.total = DecimalUtil.multiplyAsNumber(data.quantity, data.costPrice);

    this.details.set(this.details().map((item) => (item.uuid === data.uuid ? data : item)));
  }
  private updateDetailInList(uuid: string, newData: any): any[] {
    return this.details().map((item) => (item.uuid === uuid ? { ...newData } : item));
  }
  private validateStockAsync(details: any[]): Promise<boolean> {
    return new Promise((resolve) => {
      void this.validateStock(details, (cont: boolean) => resolve(cont));
    });
  }

  async deleteRow(row: any) {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: 'Eliminar Articulo',
      html: `<small>Esta seguro de eliminar este articulo ${row.description}</small>`,
      showConfirmButton: true,
      showDenyButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    });
    if (!isConfirmed) return;

    const filteredResults = this.details().filter((item) => item.uuid !== row.uuid);
    if (row.id > 0) {
      this.detailsDeleted.update((res) => [
        ...res,
        {
          ...row,
          status: false,
        },
      ]);
    }
    this.details.set(filteredResults);
  }

  private isValidForm(): boolean {
    const {
      sourceEstablishmentId,
      sourceWarehouseId,
      destinationWarehouseId,
      puntoEmisionId,
      issueDate,
      issueDateCreated,
    } = this.dataForm;

    // Función auxiliar para mostrar advertencias
    const warn = (message: string) => {
      this.notiSvc.warning({ message });
    };

    // Validaciones de campos obligatorios
    if (!ValidatorUtils.isValidField(sourceEstablishmentId))
      return (warn('Seleccione Establecimiento Origen'), false);
    if (!ValidatorUtils.isValidField(sourceWarehouseId))
      return (warn('Seleccione la Bodega Origen'), false);
    if (!ValidatorUtils.isValidField(destinationWarehouseId))
      return (warn('Seleccione la Bodega Destino'), false);
    if (sourceWarehouseId === destinationWarehouseId)
      return (warn('No puedes transferir los productos a la misma bodega!'), false);
    if (!ValidatorUtils.isValidField(puntoEmisionId))
      return (warn('Seleccione el Punto de Emisión'), false);
    if (!ValidatorUtils.isValidField(issueDate))
      return (warn('Ingrese la Fecha de emisión'), false);

    // Validar fecha no futura
    if (dateIsAfterCurrentDate(issueDate)) {
      warn('La fecha de emisión del documento no puede ser posterior a la fecha actual.');
      return false;
    }

    // Ajustar fecha de emisión
    const fechaAjustada = ajustarFechaEmisionModificada({
      fechaEmision: issueDate,
      fechaEmisionDocCreado: issueDateCreated, // corregido nombre de parámetro
    });

    if (!fechaAjustada) {
      console.error('Error al ajustar la fecha de emisión.');
      return false;
    }

    this.dataForm.issueDate = fechaAjustada;

    // Validación del detalle
    const items = this.details();
    if (items.length === 0) return (warn('Ingrese al menos un artículo en el Detalle'), false);
    if (items.length > 200) return (warn('El límite máximo de ítems es 200'), false);

    return true;
  }

  async save(): Promise<void> {
    if (this.isSaving()) return;
    if (!this.isValidForm()) return;

    let serieComprobante: string | null = null;
    let titleSwal = '';
    let htmlSwal = '';
    let confirmButtonText = '';

    try {
      if (this.isAdd() || this.isDuplicate()) {
        // Obtener número secuencial
        serieComprobante = await firstValueFrom(
          this.warehouseTransferService.generateSerie({
            puntoEmisionId: this.dataForm.puntoEmisionId,
          }),
        );

        if (!serieComprobante) {
          this.notiSvc.error({ message: 'No se generó número secuencial correctamente.' });
          return;
        }

        titleSwal = '<small>Guardar Transferencia de Bodega</small>';
        confirmButtonText = 'Guardar';
        htmlSwal = `<small>¿Está seguro de guardar este Documento N°. <b>${serieComprobante}</b>?</small>`;
      } else {
        titleSwal = '<small>Actualizar Transferencia de Bodega</small>';
        confirmButtonText = 'Actualizar';
        htmlSwal = `<small>¿Está seguro de actualizar este Documento?</small>`;
      }

      // Configuración de Swal personalizada
      const swalConfig = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger m-l-2',
        },
        buttonsStyling: false,
      });

      const { isConfirmed } = await swalConfig.fire({
        title: titleSwal,
        html: htmlSwal,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'No',
        reverseButtons: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (!isConfirmed) return;

      this.isSaving.set(true);

      const saveObservable =
        this.isAdd() || this.isDuplicate()
          ? this.warehouseTransferService.post({
              id: this.dataForm.id,
              data: {
                ...this.dataForm,
                total: this.total(),
              },
              details: this.details(),
              transactionTypes: this.transactionTypes(),
              documentTypes: this.documentTypes(),
              detailsDeleted: this.detailsDeleted(),
            })
          : this.warehouseTransferService.put(this.dataForm.id, {
              id: this.dataForm.id,
              data: {
                ...this.dataForm,
                total: this.total(),
              },
              details: this.details(),
              transactionTypes: this.transactionTypes(),
              documentTypes: this.documentTypes(),
              detailsDeleted: this.detailsDeleted(),
            });

      saveObservable.pipe(finalize(() => this.isSaving.set(false))).subscribe(this.commonResponse);
    } catch (error) {
      console.error('Error al guardar la transferencia:', error);
      this.notiSvc.error({ message: 'Ocurrió un error inesperado al guardar la transferencia.' });
      this.isSaving.set(false);
    }
  }

  private commonResponse = (response: any) => {
    if (response.code === '0') {
      this.notiSvc.warning({ message: response.message });
      return;
    }
    if (response.code === '1') {
      this.notiSvc.success({ message: 'La transferencia se guardó correctamente.' });
    } else {
      this.notiSvc.error({ message: 'Ocurrió un error inesperado al guardar la transferencia.' });
    }
  };
  closeDg() {
    this.dialogRef.close();
  }
}

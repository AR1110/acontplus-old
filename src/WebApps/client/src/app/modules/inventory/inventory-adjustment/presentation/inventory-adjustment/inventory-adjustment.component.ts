import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { InventoryAdjustmentListUseCase } from '@inventory/inventory-adjustment/application/use-cases/inventory-adjustment-list.use-case';
import { InventoryAdjustmentFormDataUseCase } from '@inventory/inventory-adjustment/application/use-cases/inventory-adjustment-form-data.use-case';
import { PageEvent } from '@angular/material/paginator';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {GroupedEstab, GroupedEstabPuntoEmision} from "@core/models/estab.model";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {
  InventoryAdjustmentFormDataResponse,
  InventoryAdjustmentList
} from "@inventory/inventory-adjustment/domain/inventory-adjustment.entity";
import {DialogService} from "@core/services/dialog.service";
import {
  InventoryAdjustmentAddEditComponent
} from "@inventory/inventory-adjustment/presentation/inventory-adjustment-add-edit/inventory-adjustment-add-edit.component";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {
  InventoryAdjustmentDetailComponent
} from "@inventory/inventory-adjustment/presentation/inventory-adjustment-detail/inventory-adjustment-detail.component";
import {InventoryAdjustmentStore} from "@inventory/inventory-adjustment/application/store/inventory-adjustment.store";
import {
  ProductSearchBarComponent
} from "@inventory/product/presentation/components/product-search-bar/product-search-bar.component";

@Component({
  selector: 'app-inventory-adjustment',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatDynamicTableComponent,
    FormsModule,
    DateRangeSelectionComponent,
    ThemeButtonComponent,
    MatIconButton,
    MatIcon,
    MatMenuModule,
    ProductSearchBarComponent,
  ],
  templateUrl: './inventory-adjustment.component.html',
  styles: `

    /* Estilos para items en la lista */
    .product-item {
      display: flex;
      align-items: flex-start;
      width: 100%;
      gap: 12px;
      padding: 8px 0;
    }

    .product-image {
      flex-shrink: 0;
    }

    .product-thumb {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      object-fit: cover;
      border: 1px solid #e0e0e0;
    }

    .product-details {
      flex: 1;
      min-width: 0;
    }

    .product-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;
    }

    .product-name {
      font-weight: 500;
      color: #333;
      font-size: 14px;
      line-height: 1.3;
      flex: 1;
    }

    .product-category {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      color: white;
      font-weight: 500;
      white-space: nowrap;
      text-transform: uppercase;
    }

    .product-category mat-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
    }

    .product-description {
      font-size: 11px;
      color: #666;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-codes {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
    }

    .product-code, .product-barcode {
      font-size: 10px;
      color: #888;
      background: #f5f5f5;
      padding: 1px 4px;
      border-radius: 3px;
    }

    .product-prices {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .price-main {
      font-size: 13px;
      font-weight: 600;
      color: #1976d2;
    }

    .price-options {
      font-size: 10px;
      color: #999;
      font-style: italic;
    }

    .product-taxes {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .tax-badge {
      font-size: 9px;
      padding: 1px 4px;
      border-radius: 8px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .tax-iva { background: #e3f2fd; color: #1565c0; }
    .tax-ieps { background: #fff3e0; color: #ef6c00; }
    .tax-isr { background: #f3e5f5; color: #7b1fa2; }
    .tax-otro { background: #e8f5e8; color: #2e7d32; }

    .product-stock {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 10px;
      padding: 4px 6px;
      border-radius: 6px;
      background: #e8f5e8;
      color: #2e7d32;
      text-align: center;
      min-width: 60px;
    }

    .product-stock mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-bottom: 2px;
    }

    .product-stock.out-of-stock {
      background: #ffebee;
      color: #c62828;
    }

    .product-stock.low-stock {
      background: #fff3e0;
      color: #f57c00;
    }

    /* Card del producto seleccionado */
    .selected-product {
      margin-top: 30px;
      padding: 24px;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      background: #fafafa;
    }

    .product-card {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .product-card img {
      width: 120px;
      height: 120px;
      border-radius: 12px;
      object-fit: cover;
      border: 1px solid #e0e0e0;
    }

    .product-info {
      flex: 1;
    }

    .product-title-section {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 12px;
    }

    .product-info h4 {
      margin: 0;
      color: #333;
      font-size: 20px;
      line-height: 1.3;
      flex: 1;
    }

    .product-category-large {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 16px;
      color: white;
      font-weight: 500;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .product-category-large mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .product-info p {
      margin: 0 0 16px 0;
      color: #666;
      line-height: 1.5;
      font-size: 14px;
    }

    .product-codes-large {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #555;
    }

    /* Sección PVP */
    .pvp-section h5, .taxes-section h5 {
      margin: 16px 0 8px 0;
      color: #333;
      font-size: 14px;
      font-weight: 600;
    }

    .pvp-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .pvp-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      transition: all 0.2s ease;
    }

    .pvp-item.pvp-active {
      background: #e3f2fd;
      border-color: #1976d2;
    }

    .pvp-item.pvp-inactive {
      background: #f5f5f5;
      opacity: 0.7;
    }

    .pvp-name {
      font-weight: 500;
      color: #333;
    }

    .pvp-price {
      font-weight: 600;
      color: #1976d2;
      font-size: 16px;
    }

    .pvp-check {
      color: #4caf50;
      font-size: 18px;
    }

    /* Sección impuestos */
    .taxes-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tax-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid transparent;
    }

    .tax-item.tax-iva {
      background: #e3f2fd;
      border-color: #1976d2;
    }

    .tax-item.tax-ieps {
      background: #fff3e0;
      border-color: #f57c00;
    }

    .tax-item.tax-isr {
      background: #f3e5f5;
      border-color: #7b1fa2;
    }

    .tax-item.tax-otro {
      background: #e8f5e8;
      border-color: #4caf50;
    }

    .tax-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tax-name {
      font-weight: 500;
    }

    .tax-type {
      font-size: 11px;
      opacity: 0.8;
      text-transform: uppercase;
    }

    .tax-percentage {
      font-weight: 600;
      font-size: 14px;
    }

    .product-stock-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      color: #666;
      font-size: 14px;
    }

    .no-results-message {
      text-align: center;
      color: #666;
    }

    .no-results-message p {
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .no-results-message small {
      color: #999;
    }

    /* Estilos para el highlight */
    :global(.highlight) {
      background-color: #fff3cd;
      color: #856404;
      padding: 1px 2px;
      border-radius: 2px;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .product-item {
        gap: 8px;
      }

      .product-thumb {
        width: 40px;
        height: 40px;
      }

      .product-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .product-category {
        align-self: flex-start;
      }

      .product-card {
        flex-direction: column;
      }

      .product-card img {
        width: 100px;
        height: 100px;
        align-self: center;
      }

      .product-title-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .pvp-list, .taxes-list {
        gap: 6px;
      }

      .pvp-item, .tax-item {
        padding: 6px 8px;
      }
    }

    @media (max-width: 480px) {
      .product-codes {
        flex-direction: column;
        gap: 2px;
      }

      .product-prices {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }

      .product-stock {
        min-width: 50px;
        padding: 3px 4px;
      }
    }
  `,
})
export class InventoryAdjustmentComponent   {
  private $listUseCase = inject(InventoryAdjustmentListUseCase);
  private $formDataUseCase = inject(InventoryAdjustmentFormDataUseCase);
  private _tS = inject(ToastrNotificationService);
  private _dialogSvc = inject(DialogService);
  private $inventoryAdjustmentStore  = inject(InventoryAdjustmentStore)
  dataSource = signal<InventoryAdjustmentList[]>([]);
  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'tipoDocNombre', label: 'Tipo Documento', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'nroDoc', label: 'Nro. Documento', type: 'string' },
    { key: 'estadoNombre', label: 'Estado', type: 'string' },
    { key: 'observacion', label: 'Observación', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'usuarioNombre', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

  tiposDoc = signal<any[]>([])
  estabs = signal<GroupedEstab[]>([])
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([])

  dataFilter = {
    text: '',
    useFilterDate: true,
    estabId: 0,
    tipoDocId: 0,
    serie: '',
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
  };

  private mainFormData = signal({} as InventoryAdjustmentFormDataResponse)

  refresh() {
    this.getList()
  }

  private getDataParams() {
    let useFilterDate = this.dataFilter.useFilterDate;
    let serie = null;
    if (isValidField(this.dataFilter.serie)) {
      serie = ValidatorUtils.validAndFormatedRangeSequential(
        this.dataFilter.serie
      );
      if (!serie) {
        this._tS.warning({
          message:
            'Define correctamente el número de secuencial o el rango de número secuencial!',
        });
        return;
      }
      useFilterDate = false;
      this._tS.info({
        message: 'Buscando por número secuencial',
      });
    }
    return {
      pageIndex: this.pagination().pageIndex+1,
      pageSize: this.pagination().pageSize,
      useFilterDate,
      startDate: this.dataFilter.startDate,
      endDate: this.dataFilter.endDate,
      serie,
      tipoDocId: getValidId(this.dataFilter.tipoDocId),
      textSearch: isValidField(this.dataFilter.text),
    };
  }

  private getList() {
    const params = this.getDataParams();
    if (!params) return;
    this.$listUseCase.execute(params).subscribe(response => {
      this.dataSource.set(response.data);
      this.pagination.update(pag=>({
        ...pag,
        totalRecords: response.totalRecords,
      }))
    })
  }

  // ngOnInit() {
  //   this.$formDataUseCase.execute().subscribe((response) => {
  //     this.$inventoryAdjustmentStore.setMainFormData(response)
  //     this.tiposDoc.set(response.tiposDoc);
  //     this.estabs.set(response.estabs);
  //     const dataEstab = this.estabs().find(e=>e.defaultEstab);
  //     if(dataEstab) {
  //       this.dataFilter.estabId = dataEstab.idEstablecimiento;
  //     }
  //      this.refresh()
  //   });
  // }

  addEdit(item?: InventoryAdjustmentList){
    const ref = this._dialogSvc.open(InventoryAdjustmentAddEditComponent, {
      size: 'xxl',
      data: {

      }
    })
    ref.subscribe(res => {
      if(res && typeof res  == 'object'){
        this.refresh()
      }
    })
  }

  openDetail(item: InventoryAdjustmentList){
    this._dialogSvc.open(InventoryAdjustmentDetailComponent, {
      size: 'xxl',
      data: {
        id: item.id
      }
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }





  itemsPerPage = 3;
  selectedProduct: any | null = null;

  // Datos de ejemplo
  products: any[] = [
    { id: 1, name: 'iPhone 14 Pro', description: 'Smartphone Apple con chip A16 Bionic', category: 'Electrónicos', price: 999 },
    { id: 2, name: 'Samsung Galaxy S23', description: 'Flagship Android con cámara de 200MP', category: 'Electrónicos', price: 799 },
    { id: 3, name: 'MacBook Air M2', description: 'Laptop ultradelgada con chip M2', category: 'Computadoras', price: 1199 },
    { id: 4, name: 'Dell XPS 13', description: 'Laptop Windows premium con pantalla InfinityEdge', category: 'Computadoras', price: 899 },
    { id: 5, name: 'AirPods Pro', description: 'Auriculares inalámbricos con cancelación de ruido', category: 'Audio', price: 249 },
    { id: 6, name: 'Sony WH-1000XM4', description: 'Auriculares over-ear con cancelación de ruido', category: 'Audio', price: 299 },
    { id: 7, name: 'iPad Air', description: 'Tablet con chip M1 y pantalla Liquid Retina', category: 'Tablets', price: 599 },
    { id: 8, name: 'Surface Pro 9', description: 'Tablet 2 en 1 con Windows 11', category: 'Tablets', price: 999 },
    { id: 9, name: 'Nintendo Switch', description: 'Consola híbrida de Nintendo', category: 'Gaming', price: 299 },
    { id: 10, name: 'PlayStation 5', description: 'Consola de Sony con gráficos 4K', category: 'Gaming', price: 499 },
    { id: 11, name: 'Xbox Series X', description: 'Consola de Microsoft con 12 teraflops', category: 'Gaming', price: 499 },
    { id: 12, name: 'Apple Watch Series 8', description: 'Smartwatch con monitoreo de salud', category: 'Wearables', price: 399 },
    { id: 13, name: 'Fitbit Charge 5', description: 'Pulsera fitness con GPS integrado', category: 'Wearables', price: 179 },
    { id: 14, name: 'Google Pixel 7', description: 'Smartphone Android con cámara computacional', category: 'Electrónicos', price: 599 },
    { id: 15, name: 'OnePlus 11', description: 'Flagship killer con carga rápida 100W', category: 'Electrónicos', price: 699 },
    // Agregar más productos para probar la paginación...
    ...Array.from({ length: 35 }, (_, i) => ({
      id: 16 + i,
      name: `Producto ${16 + i}`,
      description: `Descripción del producto ${16 + i}`,
      category: ['Electrónicos', 'Computadoras', 'Audio', 'Gaming'][i % 4],
      price: Math.floor(Math.random() * 1000) + 100
    }))
  ];

  onItemSelected(item: any) {
    this.selectedProduct = item;
    console.log('Producto seleccionado:', item);
  }

  onSearchChanged(query: string) {
    console.log('Búsqueda cambió:', query);
  }

  onPageChanged(page: number) {
    console.log('Página cambió:', page);
  }

  onAdvancedSearch() {
    console.log('Abrir búsqueda avanzada');
    // Implementar lógica de búsqueda avanzada
  }

  onAllResults(query: string) {
    console.log('Mostrar todos los resultados para:', query);
    // Implementar lógica para mostrar todos los resultados
  }

  updateItemsPerPage() {
    // El componente se actualizará automáticamente debido al binding
    console.log('Items por página cambiado a:', this.itemsPerPage);
  }

  getInitials(item: any): string {
    if (typeof item === 'string') {
      return item.substring(0, 2).toUpperCase();
    }
    const name = item.name || item.value || '';
    return name.substring(0, 2).toUpperCase();
  }
}

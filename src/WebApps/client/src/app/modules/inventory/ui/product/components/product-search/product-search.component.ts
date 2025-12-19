import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
  signal,
  SimpleChanges,
  OnInit,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap, finalize } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { ProductSearch } from '@inventory/domain/models/product.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PRODUCT_SERVICE } from '@inventory/tokens/inventory-token';

interface ProductSearchProps {
  isSimpleMode?: boolean;
  isSearchAdvanced?: boolean;
  nameProduct?: string;
  clearSearch?: boolean;
}

/**
 * @title Plain input autocomplete
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  imports: [
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    MatProgressSpinnerModule,
  ],
  styleUrl: './product-search.component.css',
})
export class ProductSearchComponent implements OnInit, OnChanges {
  @Input() props: ProductSearchProps = {
    isSimpleMode: false,
    isSearchAdvanced: false,
    nameProduct: '',
    clearSearch: false,
  };
  @Input() isSimpleMode = true;
  @Input() textSearch = '';
  isInputMat = input(false);

  @Output() onProductSelected = new EventEmitter<{ data: any }>();
  @Output() emptyInput = new EventEmitter();

  private _productService = inject(PRODUCT_SERVICE);

  control = new FormControl('');
  filteredProducts!: Observable<any[]>;
  isLoading = signal(false);

  // products = [
  //   {
  //     showHeader: true,
  //     idArticulo: 224602,
  //     codigo: '*CASALT4200CBBK',
  //     descripcion: 'CASE ALTEK MID-TOWER 4200 TEC-MOU-PAR USB3.0 NEGRO',
  //     iva: '12%',
  //     stock: 0,
  //     subFamilia: 'REPUESTOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: 'badge badge-danger',
  //     priceSale: '[{"tarifa":"CONT","precio":42.00000},{"tarifa":"DSTO","precio":38.00000},{"tarifa":"TAR","precio":48.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: null,
  //     s3ObjectKey: null,
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 235252,
  //     codigo: '*CASGAZCMB3405BK',
  //     descripcion: 'CASE GAZAL COMBO 3405-1 TECL. PARL. MOUSE. NEGRO',
  //     iva: '12%',
  //     stock: 1,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: '',
  //     priceSale: '[{"tarifa":"CONT","precio":45.00000},{"tarifa":"DSTO","precio":42.00000},{"tarifa":"TAR","precio":48.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: null,
  //     s3ObjectKey: null,
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 224607,
  //     codigo: '*ID225XTK20',
  //     descripcion: 'COMBO TECLADO MOUSE XTECH MULTIMEDIA WIRLESS SPANISH XTK-309S',
  //     iva: '12%',
  //     stock: 0,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: 'badge badge-danger',
  //     priceSale: '[{"tarifa":"CONT","precio":19.50000},{"tarifa":"DSTO","precio":18.00000},{"tarifa":"TAR","precio":22.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: null,
  //     s3ObjectKey: null,
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 249447,
  //     codigo: '*GENCOMUSB31330003401',
  //     descripcion: 'COMBO TECLADO Y MOUSE GENIUS KM-200 USB NEGRO',
  //     iva: '12%',
  //     stock: 1,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: '',
  //     priceSale: '[{"tarifa":"CONT","precio":15.00000},{"tarifa":"DSTO","precio":14.00000},{"tarifa":"TAR","precio":16.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/10873054-6645-416c-b4de-1bc48925a833.webp',
  //     s3ObjectKey: '2293530915001/articulos/10873054-6645-416c-b4de-1bc48925a833.webp',
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 249449,
  //     codigo: '*GENMOUWIR31340014401',
  //     descripcion: 'COMBO TECLADO Y MOUSE GENIUS KM-8101 WIRELESS NEGRO/RF 2.4GHZ',
  //     iva: '12%',
  //     stock: 1,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: '',
  //     priceSale: '[{"tarifa":"CONT","precio":22.00000},{"tarifa":"DSTO","precio":20.00000},{"tarifa":"TAR","precio":24.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/2db6d504-1468-4aa3-a060-879acaf70226.jpg',
  //     s3ObjectKey: '2293530915001/articulos/2db6d504-1468-4aa3-a060-879acaf70226.jpg',
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 249448,
  //     codigo: '*GENCOMUSB31330007401',
  //     descripcion: 'COMBO TECLADO Y MOUSE GENIUS SLIMSTAR C126 USB NEGRO / SMART KEY',
  //     iva: '12%',
  //     stock: 1,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: '',
  //     priceSale: '[{"tarifa":"CONT","precio":16.00000},{"tarifa":"DSTO","precio":15.00000},{"tarifa":"TAR","precio":17.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/37b9557b-bde7-4cf2-9472-360c9dcbb0c2.webp',
  //     s3ObjectKey: '2293530915001/articulos/37b9557b-bde7-4cf2-9472-360c9dcbb0c2.webp',
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 224611,
  //     codigo: '*KEYQUAQC4400UBK',
  //     descripcion: 'COMBO TECLADO-MOUSE QUASAD Wired 1.5mts QC-4400U Negro',
  //     iva: '12%',
  //     stock: 0,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: 'badge badge-danger',
  //     priceSale: '[{"tarifa":"CONT","precio":12.00000},{"tarifa":"DSTO","precio":10.00000},{"tarifa":"TAR","precio":14.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: null,
  //     s3ObjectKey: null,
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 256984,
  //     codigo: '*ASUCOMPORX1504ZA-NJ726',
  //     descripcion: 'COMPUTADOR ASUS X1504ZA-NJ726 CORE I7-1255U/16GB/512GB/15.6FHD/NO OS/MOUSE/BLUE',
  //     iva: '12%',
  //     stock: 1,
  //     subFamilia: 'EQUIPOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: '',
  //     priceSale: '[{"tarifa":"CONT","precio":855.00000},{"tarifa":"DSTO","precio":0.00000},{"tarifa":"TAR","precio":0.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: null,
  //     s3ObjectKey: null,
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 199513,
  //     codigo: '*ACC3',
  //     descripcion: 'GEL MOUSE PAD XTA526 XTECH',
  //     iva: '12%',
  //     stock: 0,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: 'badge badge-danger',
  //     priceSale: '[{"tarifa":"CONT","precio":7.00000},{"tarifa":"DSTO","precio":0.00000},{"tarifa":"TAR","precio":0.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: null,
  //     s3ObjectKey: null,
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 199485,
  //     codigo: '*MOUGENDX110UBG5',
  //     descripcion: 'MOUSE GENIUS DX-110 USB Negro G5',
  //     iva: '12%',
  //     stock: 1,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: '',
  //     priceSale: '[{"tarifa":"CONT","precio":5.00000},{"tarifa":"DSTO","precio":4.00000},{"tarifa":"TAR","precio":6.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: null,
  //     s3ObjectKey: null,
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 249414,
  //     codigo: '*MOUGENERG8200SI',
  //     descripcion: 'MOUSE GENIUS ERGO-8200S Wireless Silent Iron Gray',
  //     iva: '12%',
  //     stock: 1,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: '',
  //     priceSale: '[{"tarifa":"CONT","precio":15.00000},{"tarifa":"DSTO","precio":13.00000},{"tarifa":"TAR","precio":17.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/4607f08d-a4b3-4716-815b-801d66be42b4.png',
  //     s3ObjectKey: '2293530915001/articulos/4607f08d-a4b3-4716-815b-801d66be42b4.png',
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 228496,
  //     codigo: '*MOUGENMT900SBKN',
  //     descripcion: 'MOUSE GENIUS MICRO TRAVELER 900S WIRELESS USB Negro NP',
  //     iva: '12%',
  //     stock: 0,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: 'badge badge-danger',
  //     priceSale: '[{"tarifa":"CONT","precio":18.00000},{"tarifa":"DSTO","precio":16.00000},{"tarifa":"TAR","precio":20.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: null,
  //     s3ObjectKey: null,
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 199488,
  //     codigo: '*MOUGENNX7005BLK',
  //     descripcion: 'MOUSE GENIUS NX-7005 Wireless Negro',
  //     iva: '12%',
  //     stock: 0,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: 'badge badge-danger',
  //     priceSale: '[{"tarifa":"CONT","precio":9.00000},{"tarifa":"DSTO","precio":8.00000},{"tarifa":"TAR","precio":10.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: null,
  //     s3ObjectKey: null,
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 246274,
  //     codigo: '*MOUGENNX7015CHO',
  //     descripcion: 'MOUSE GENIUS NX-7015 CHOCOLATE Wireless New Package',
  //     iva: '12%',
  //     stock: 0,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: 'badge badge-danger',
  //     priceSale: '[{"tarifa":"CONT","precio":12.00000},{"tarifa":"DSTO","precio":10.00000},{"tarifa":"TAR","precio":14.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/da404feb-1c8b-424e-ba01-356e62014324.jpg',
  //     s3ObjectKey: '2293530915001/articulos/da404feb-1c8b-424e-ba01-356e62014324.jpg',
  //     totalRecords: 24
  //   },
  //   {
  //     idArticulo: 246273,
  //     codigo: '*MOUGENNX7015UIG',
  //     descripcion: 'MOUSE GENIUS NX-7015 Wireless IRON-GGRAY BLISTER',
  //     iva: '12%',
  //     stock: 1,
  //     subFamilia: 'ACCESORIOS',
  //     marca: null,
  //     medida: 'UNI',
  //     fraccionado: '',
  //     style: '',
  //     priceSale: '[{"tarifa":"CONT","precio":10.00000},{"tarifa":"DSTO","precio":10.00000},{"tarifa":"TAR","precio":14.00000},{"tarifa":"PVP4","precio":0.00000},{"tarifa":"PVP5","precio":0.00000}]',
  //     warehouses: '[{"ubicacion":"SN"}]',
  //     precioSinSubsidio: 0,
  //     s3ObjectUrl: 'https://acontplusprd.s3.us-east-1.amazonaws.com/2293530915001/articulos/8bbb9144-91ec-4d42-a06b-ab220dccdd70.webp',
  //     s3ObjectKey: '2293530915001/articulos/8bbb9144-91ec-4d42-a06b-ab220dccdd70.webp',
  //     totalRecords: 24
  //   }
  // ]

  ngOnInit() {
    this.filteredProducts = this.control.valueChanges.pipe(
      switchMap((val) => {
        if (val && val.length > 2) {
          return this._filter(val);
          // return this.products as any[]
        }
        this.emptyInput.emit({ data: {} });
        return [];
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textSearch']) {
      this.control.setValue(this.textSearch);
    }
  }

  private _filter(value: string) {
    const filterValue = this._normalizeValue(value);
    this.isLoading.set(true);
    return this._productService.search({ textSearch: value }).pipe(
      finalize(() => this.isLoading.set(false)),
      map((response) => {
        return response;
      }),
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  onSelectionChange(product: ProductSearch) {
    if (this.props.clearSearch) {
      this.control.patchValue('');
    }
    this.onProductSelected.emit({ data: product });
  }
}

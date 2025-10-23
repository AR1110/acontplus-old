import {
  Component,
  HostListener,
  ViewChild,  input, signal, output, inject, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule,  } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, finalize, switchMap} from "rxjs/operators";
import {distinctUntilChanged} from "rxjs";
import {DataGridColumn} from "@shared/components/data-grid/types";
import {KeyboardNavigationService} from "@shared/components/data-grid/keyboard-navigation";
import {DataGrid} from "@shared/components/data-grid/data-grid";
import {ProductUseCase} from "@inventory/product/application/use-cases/product.use-case";

export const EXAMPLE_DATA: any[] = [
  {
    "index": 1,
    "id": 348882,
    "code": "*COL9",
    "description": "BATIDOS",
    "vat": "15%",
    "stock": 0,
    "subFamily": "BEBIDAS",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 2.6087,
        "price": 2.6087
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "/assets/images/img-default.png"
  },
  {
    "index": 2,
    "id": 342288,
    "code": "*PLA37",
    "description": "BOLÓN DE CHICHARRON O QUESO",
    "vat": "15%",
    "stock": 0,
    "subFamily": "PLATOS DE SAL",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 2.82609,
        "price": 2.82609
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "/assets/images/img-default.png"
  },
  {
    "index": 3,
    "id": 247874,
    "code": "*SER14",
    "description": "BOLON SALPRIETA",
    "vat": "15%",
    "stock": 0,
    "subFamily": "SERVICIOS",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 4.91071,
        "price": 4.91071
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "/assets/images/img-default.png"
  },
  {
    "index": 4,
    "id": 347154,
    "code": "*DES15",
    "description": "BOWL DE FRUTAS",
    "vat": "15%",
    "stock": 0,
    "subFamily": "DESAYUNOS",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 4.21739,
        "price": 4.21739
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "/assets/images/img-default.png"
  },
  {
    "index": 5,
    "id": 248185,
    "code": "*BEB4",
    "description": "CHOCOLATE CALIENTE",
    "vat": "15%",
    "stock": 0,
    "subFamily": "BEBIDAS CALIENTES",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 2.6087,
        "price": 2.6087
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "https://acontplusprd.s3.us-east-1.amazonaws.com/0601568041001/articulos/c1e016ac-d13b-4e64-ae90-adaae329e39b.jpeg"
  },
  {
    "index": 6,
    "id": 247873,
    "code": "*DES5",
    "description": "DESAYUNO AMERICANO",
    "vat": "15%",
    "stock": 0,
    "subFamily": "DESAYUNOS",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 4.78261,
        "price": 4.78261
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "https://acontplusprd.s3.us-east-1.amazonaws.com/0601568041001/articulos/bc41560f-b4d0-406e-864e-c17f623be901.JPG"
  },
  {
    "index": 7,
    "id": 247903,
    "code": "*DES6",
    "description": "DESAYUNO SALUDABLE",
    "vat": "15%",
    "stock": 0,
    "subFamily": "DESAYUNOS",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 4.34783,
        "price": 4.34783
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "https://acontplusprd.s3.us-east-1.amazonaws.com/0601568041001/articulos/d98b241b-90eb-4dd7-8b6d-c02b6153b437.JPG"
  },
  {
    "index": 8,
    "id": 247571,
    "code": "*ENSA2",
    "description": "ENSALADA MIKUNA",
    "vat": "15%",
    "stock": 0,
    "subFamily": "PLATOS DE SAL",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 3.69565,
        "price": 3.69565
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "https://acontplusprd.s3.us-east-1.amazonaws.com/0601568041001/articulos/4a532782-fdb3-4409-a194-e9452021f60e.JPG"
  },
  {
    "index": 9,
    "id": 368680,
    "code": "*EXTLECHE47",
    "description": "ESTOFADO DE CARNE",
    "vat": "15%",
    "stock": 0,
    "subFamily": "EXTRAS",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 1.73913,
        "price": 1.73913
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "/assets/images/img-default.png"
  },
  {
    "index": 10,
    "id": 348251,
    "code": "*EXTLECHE39",
    "description": "EXTRA",
    "vat": "15%",
    "stock": 0,
    "subFamily": "EXTRAS",
    "brand": null,
    "measure": "UNI",
    "fractional": "",
    "style": "badge badge-danger",
    "prices": [
      {
        "name": "PVP1",
        "salePrice": 0.217,
        "price": 0.217
      },
      {
        "name": "PVP2",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP3",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP4",
        "salePrice": 0,
        "price": 0
      },
      {
        "name": "PVP5",
        "salePrice": 0,
        "price": 0
      }
    ],
    "warehouses": [
      {
        "ubicacion": "SN"
      }
    ],
    "priceWithoutSubsidy": 0,
    "imageUrl": "/assets/images/img-default.png"
  }
]

@Component({
  selector: 'app-product-search-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDividerModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule,
    DataGrid
  ],
  templateUrl: './product-search-data-grid.html',
  styleUrls: ['./product-search-data-grid.scss']
})
export class ProductSearchDataGrid  {
  private keyboardNavigationService = inject(KeyboardNavigationService);
  private prodUseCase = inject(ProductUseCase);
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  close = output<void>();
  selectItem = output<any>();

  searchControl = new FormControl('');
  loading = signal(false);
  currentPage = signal(1);
  pageSize = signal(10);
  placeholder = input('Buscar');

  searchTerm = '';
  selectedIndex = 0;

  // Table data source + paginator
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['title', 'description'];

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  list = signal<any>(EXAMPLE_DATA)
  total = signal(0)

  columns = signal<DataGridColumn[]>([
    { header: 'Nro.', field: 'index', type: 'number' },
    { header: 'Imagen', field: 'imageUrl', type: 'image' },
    {
      header: 'Descripción',
      field: 'dataDescription',
      // formatter: (data: any) => `
      //   <div class="d-flex flex-column gap-1">
      //       <span class="font-medium fw-semibold">${data.code}</span>
      //       <span>${data.description}</span>
      //   </div>
      // `
    },
    { header: 'Stock', field: 'stock' },
    { header: 'Iva', field: 'vat' },
    { header: 'SubFamilia', field: 'subFamily' },
    { header: 'Medida', field: 'measure',  }
  ]);
  //
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.searchApi(query || '')),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe((res: any) => {
        this.list.set(res.items || res);
        console.log(this.list())
        this.total.set(res.total)
      });
    const columns = JSON.parse(JSON.stringify(this.columns()));
    const prices = EXAMPLE_DATA[0].prices;
    for (const item of prices) {
      columns.push({
        header: item.name,
        field: item.name,
        type: 'currency',
        typeParameter: {
          currencyCode: '$'
        }
      });
    }

    const mapped = EXAMPLE_DATA.map((item: any) => {
      const { prices, ...restItem } = item;
      const tarifasObj = prices.reduce((obj: any, item: any) => {
        obj[item.name] = item.price;
        return obj;
      }, {});
      return {
        ...restItem,
        ...tarifasObj,
      };
    });

    this.columns.set(columns);
    this.list.set(mapped);

  }

  searchApi(query: string) {
    this.loading.set(true);
    return this.prodUseCase.search({
      q: query,
      page: this.currentPage(),
      pageSize: this.pageSize(),
    }).pipe(
      switchMap((response: any) => {
        this.loading.set(false);
        return [response];
      })
    );
  }


  ngAfterViewInit() {
    this.keyboardNavigationService.registerElement({
      element: this.searchInput,
      name: 'searchInput'
    });

    // Manejar eventos de teclado en el searchInput
    // fromEvent<KeyboardEvent>(this.searchInput.nativeElement, 'keydown')
    //   .pipe(
    //     filter(event => event.key === 'ArrowDown'),
    //     //takeUntil(this.destroy$)
    //   )
    //   .subscribe(event => {
    //     event.preventDefault();
    //     this.keyboardNavigationService.focusElement('dataGrid', 0);
    //   });
  }
  clearSearch() {
    this.searchControl.setValue('');
    this.list.set([]);
  }

  // keyboard handling scoped to component
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close.emit();
    }
  }


  onFocusedRowChange($event: any) {
    console.log($event)
  }


  ngOnDestroy() {
    this.keyboardNavigationService.unregisterElement(this.searchInput);
  }
}

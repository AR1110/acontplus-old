
import {
  Component,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIcon} from "@angular/material/icon";
import {OverlayModule} from "@angular/cdk/overlay";
import {FormsModule , ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ProductUseCase} from "@inventory/product/application/use-cases/product.use-case";
import {AutocompleteService} from "@shared/services/autocomplete.service";
import {AutocompleteConfig, PRODUCT_AUTOCOMPLETE_CONFIG} from "@shared/models/autocomplete.interfaces";
import {ReusableAutocompleteComponent} from "@shared/components/reusable-autocomplete/reusable-autocomplete.component";

/**
 * Keyboard events
 */
const isArrowUp = (keyCode:any) => keyCode === 38;
const isArrowDown = (keyCode:any) => keyCode === 40;
const isArrowUpDown = (keyCode:any) => isArrowUp(keyCode) || isArrowDown(keyCode);
const isEnter = (keyCode:any) => keyCode === 13;
const isBackspace =(keyCode:any) => keyCode === 8;
const isDelete = (keyCode:any) => keyCode === 46;
const isESC = (keyCode:any) => keyCode === 27;
const isTab = (keyCode:any) => keyCode === 9;

export interface AutocompleteItem {
  id?: string | number;
  name?: string;
  value?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-product-search-bar',
  imports: [
    MatIcon,
    MatButtonModule,
    OverlayModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    ReusableAutocompleteComponent,
  ],
  templateUrl: './product-search-bar.component.html',
  styleUrl: './product-search-bar.component.scss',
})
export class ProductSearchBarComponent {
  private autocompleteService = inject(AutocompleteService);

  public $productUseCase = inject(ProductUseCase);

  productSearchFunction = this.autocompleteService.createGenericSearchFunction({
    search: this.$productUseCase.search
  })


  selectedProduct: any = null;

  productos: any[] = [
    {
      id: 1,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 2,
      nombre: 'Samsung Galaxy S23 Ultra',
      descripcion: 'Smartphone Android de alta gama con S Pen integrado',
      codigo: 'SGS23U',
      codigoBarras: '887276652345',
      stock: 8,
      imagen: '/assets/galaxy-s23.jpg',
      marca: 'Samsung',
      modelo: 'Galaxy S23 Ultra',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 999.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 899.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 849.99, activo: false },
        { nombre: 'Precio VIP', precio: 949.99, activo: false },
        { nombre: 'Precio Black Friday', precio: 799.99, activo: false }
      ]
    },
    {
      id: 3,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 4,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 5,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 1,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 1,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 1,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 1,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 1,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 1,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
    {
      id: 1,
      nombre: 'iPhone 14 Pro Max',
      descripcion: 'Smartphone Apple con cámara profesional y pantalla Super Retina',
      codigo: 'IPH14PM',
      codigoBarras: '194253001737',
      stock: 15,
      imagen: '/assets/iphone14.jpg',
      marca: 'Apple',
      modelo: '14 Pro Max',
      activo: true,
      categoria: {
        id: 1,
        nombre: 'Smartphones',
        color: '#2196F3',
        icono: 'smartphone'
      },
      impuestos: [
        { nombre: 'IVA', porcentaje: 16, tipo: 'IVA' },
        { nombre: 'IEPS Telefonía', porcentaje: 3, tipo: 'IEPS' }
      ],
      pvps: [
        { nombre: 'Precio Público', precio: 1199.99, activo: true },
        { nombre: 'Precio Mayorista', precio: 1099.99, activo: false },
        { nombre: 'Precio Distribuidor', precio: 999.99, activo: false },
        { nombre: 'Precio Empleados', precio: 949.99, activo: false },
        { nombre: 'Precio Promocional', precio: 1149.99, activo: false }
      ]
    },
  ];

  onItemSelected(item: any) {
    this.selectedProduct = item;
    console.log('Producto seleccionado:', item);
  }

  onSearchChanged(query: string) {
    console.log('Búsqueda cambió:', query);
  }

  onAdvancedSearch() {
    console.log('Abrir búsqueda avanzada');
    // Aquí podrías abrir un modal o navegar a una página de búsqueda avanzada
  }

  onAllResults(query: string) {
    console.log('Mostrar todos los resultados para:', query);
    // Aquí podrías navegar a una página de resultados completos
  }
  onPageChanged(page: number) {
    console.log('Página cambió:', page);
  }


  productConfig: AutocompleteConfig = {
    ...PRODUCT_AUTOCOMPLETE_CONFIG,
    placeholder: 'Buscar productos por nombre, SKU o código de barras...',
    itemsPerPage: 8,
    enablePagination: true,
    searchFields: [
      { value: 'name', label: 'Nombre', property: 'name' },
      { value: 'sku', label: 'SKU', property: 'sku' },
      { value: 'barcode', label: 'Código de Barras', property: 'barcode' },
      { value: 'description', label: 'Descripción', property: 'description' }
    ]
  };






  onProductSelected(product: any) {

    console.log('Producto seleccionado:', product);

    // Emitir evento o actualizar servicio
    //  this.productService.setSelectedProduct(product);
  }


  onCreateProduct(query: string) {
    console.log('Crear producto:', query);
    // Navegar a formulario de creación
    // this.router.navigate(['/products/create'], { queryParams: { name: query } });
  }


  onFilterChanged(filters: any) {
    console.log('Filtros cambiados:', filters);
    // Aplicar filtros adicionales si es necesario
  }

  private async searchProductsInServer(query: string) {

  }
}

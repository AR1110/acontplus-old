import { Component, inject } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { ProductSearchComponent } from '@inventory/shared/components/product/product-search/product-search.component';
import { TabulatorComponent } from "@core/components/tabulator/tabulator.component";
import { hideLoader, showLoader } from "@core/utils/loader";
import { LotPriceService } from "@modules/inventory/services/lot-price.service";
import { SubCategorySelectMultipleComponent } from "@modules/inventory/shared/components/sub-category/sub-category-select-multiple/sub-category-select-multiple.component";
import { SupplierSearchComponent } from "@modules/purchase/components/supplier-search/supplier-search.component";
import { TarifaSelectHtmlOnly } from "@modules/inventory/models/tarifa.model";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { isValidField } from "@core/utils/utils";
import { ToasterService } from "@core/services/toaster.service";


@Component({
  selector: 'app-lot-price-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    TabulatorComponent,
    SubCategorySelectMultipleComponent,
    ProductSearchComponent,
    SupplierSearchComponent
  ],
  templateUrl: './lot-price-page.component.html'
})
export class LotPricePageComponent {
  private readonly lotPriceSvc = inject(LotPriceService);
  private readonly tS = inject(ToasterService)

  readonly catalogs = [
    { code: 3, description: 'Subfamilias' },
    { code: 1, description: 'Articulo' },
    { code: 4, description: 'Proveedor' },
    { code: 5, description: 'N° Documento' }
  ]
  readonly optionsCalculate = [
    { code: "A", description: 'Sumar un valor a la tarifa PRECIO VENTA INC IVA' },
    { code: "B", description: 'Calcular un porcentaje que se aplique a la tarifa PRECIO VENTA INC IVA' },
    { code: "C", description: 'Reemplazar un valor en la tarifa PRECIO VENTA INC IVA' },
    { code: "D", description: 'Desglozar el IVA al PRECIO VENTA INC IVA por tarifas' },
    { code: "E", description: 'Sumar el IVA al PRECIO DE VENTA SIN IVA' },
  ]

  readonly columns = [
    { align: "center", headerSort: false },
    { title: "Nro.", field: "index", width: "6px", headerSort: false, responsive: 0 },
    { title: "Código", field: "codigo", width: "10px", responsive: 0, headerSort: false, },
    { title: "Descripción", field: "descripcion", width: "30px", headerSort: false, },
    { title: "P. Costo", field: "precioCosto", width: "9px", responsive: 2, headerSort: false, },
    { title: "Iva", field: "iva", width: "7px", headerSort: false, },
    { title: "Tarifa", field: "tarifaDesc", width: 100, headerSort: false, },
    { title: "P. Venta", field: "precioVenta", width: "9px", headerSort: false, },
    { title: "P. IVA", field: "precioConIva", width: "8px", headerSort: false, },
    { title: "% Utilidad", field: "porcentajeUtilidad", width: 100, headerSort: false, },
    { title: "Utilidad", field: "utilidad", width: 100, headerSort: false, },
  ]

  nestedProducts: Array<any> = [];
  cloneNestedProducts: Array<any> = [];

  tarifasSelected = new FormControl([]);
  tarifas: Array<TarifaSelectHtmlOnly> = [];

  mainForm = {
    opcion: 3,
    idArticulo: 0,
    rucProveedor: null,
    valueToCalculate: 0,
    optionToCalculate: 'A'
  }

  productSearchProps = {
    isSearchSimple: true
  }

  //Suppier
  isSearchSupplierSimple = true;

  protected getDataFilter() {
    showLoader();
    this.lotPriceSvc.getDataFilter().subscribe({
      next: (response) => {
        hideLoader();
        this.tarifas = response.tarifas;
      },
      error(err) {
        console.log(err)
        hideLoader()
      },
    })

  }
  getProducts() {
    showLoader();
    this.lotPriceSvc.getAll().subscribe({
      next: (response) => {
        hideLoader();
        let results = response.map((item: any, index: number) => {
          return {
            ...item,
            index: index + 1,
            _children: item.tarifas
          }
        })
        this.nestedProducts = structuredClone(results);
        this.cloneNestedProducts = structuredClone(results)

      }, error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }

  ngOnInit() {
    this.getDataFilter();
    this.getProducts();
  }

  //Filters
  onProductSelected(event: any) {
    let data = event.data;
    this.mainForm.idArticulo = data.idArticulo;
  }
  productResultEmptyInput(data: any) {
    this.mainForm.idArticulo = 0;
  }

  onSupplierSelected<T extends { data: any }>({ data }: T) {
    console.log(data)
    this.mainForm.rucProveedor = data.identificacionComprador;
  }

  supplierResultEmptyInput($event: any) {
    this.mainForm.rucProveedor = null
  }

  //Opciones calculo tarifas
  valueChangeTarifa(event: any) {

  }

  calculate(){
    try {

      let tarifasSelected = this.tarifasSelected.value;
      if(!isValidField(this.mainForm.optionToCalculate)){
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione opcion a calcular'
        })
        return
      }
      console.log(tarifasSelected)

      if (tarifasSelected && Array.isArray(tarifasSelected) && tarifasSelected.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione al menos una tarifa'
        })
        return
      }

      if(isNaN(this.mainForm.valueToCalculate)){
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese un valor numérico válido en el campo Valor'
        })
        return
      }
      if (!(this.mainForm.valueToCalculate>0)){
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese un valor diferente de cero en el campo Valor'
        })
        return
      }

      console.log(this.mainForm)
    } catch (error) {
      console.log(error)
    }
  }
}

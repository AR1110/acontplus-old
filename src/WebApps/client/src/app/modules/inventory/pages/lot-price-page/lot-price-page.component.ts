import { Component, inject, ViewChild } from "@angular/core";
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
import { LotPrice, LotPriceTarifa } from "@modules/inventory/models/lot-price.model";
import { TarifaImpuesto } from "@shared/models/tarifa-impuesto.model";
import { roundNumber } from "@core/utils/round-number.utils";
import { pricingCalculateUtil } from "@core/utils/pricing-calculate.util";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GroupedSubFamilia } from "@modules/inventory/models/sub-category.model";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { isApiResponse } from "@core/models/api-response";


enum OptionsCalculateEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

type OptionPvpEnum = "precioVenta" | "precioConIva"

@Component({
  selector: 'app-lot-price-page',
  standalone: true,
  imports: [
    FontAwesomeModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
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
  private readonly tS = inject(ToasterService);

  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

  readonly catalogs = [
    { code: 0, description: 'Ninguno' },
    { code: 3, description: 'Subfamilias' },
    { code: 1, description: 'Articulo' },
    { code: 4, description: 'Proveedor' },
    { code: 5, description: 'N° Documento' }
  ]
  readonly optionsCalculate = [
    { code: OptionsCalculateEnum.A, description: 'Sumar un valor a la tarifa' },
    { code: OptionsCalculateEnum.B, description: 'Calcular un porcentaje a los precios' },
    { code: OptionsCalculateEnum.C, description: 'Reemplazar un valor en la tarifa' },
    { code: OptionsCalculateEnum.D, description: 'Desglozar el porcentaje al precio ' },
    //{ code: "E", description: 'Sumar el IVA al PRECIO DE VENTA SIN IVA' },
  ]


  readonly optionsPvps = [
    { code: 'precioVenta', description: 'Precio Venta' },
    { code: 'precioConIva', description: 'Precio incluido IVA' },
  ]

  readonly columns = [
    { align: "center", headerSort: false },
    { title: "Nro.", field: "index", width: "6px", headerSort: false, responsive: 0 },
    { title: "Código", field: "codigo", width: "10px", responsive: 0, headerSort: false, },
    { title: "Descripción", field: "descripcion", width: "23px", headerSort: false, },
    { title: "P. Costo", field: "precioCosto", width: "9px", responsive: 2, headerSort: false, },
    { title: "Iva", field: "iva", width: "7px", headerSort: false, },
    { title: "Tarifa", field: "tarifaDesc", width: 100, headerSort: false, },
    { title: "P. Venta", field: "precioVenta", width: "9px", headerSort: false, },
    { title: "P. IVA", field: "precioConIva", width: "8px", headerSort: false, },
    { title: "% Utilidad", field: "porcentajeUtilidad", width: 100, headerSort: false, },
    { title: "Utilidad", field: "utilidad", width: 100, headerSort: false, },
  ]

  checkedSubCategorias = new FormControl([]);
  subCategorias: Array<GroupedSubFamilia> = [];

  productsModified: Array<any> = [];

  nestedProducts: Array<LotPrice> = [];
  cloneNestedProducts: Array<LotPrice> = [];
  taxRates: Array<TarifaImpuesto> = [];

  tarifasSelected = new FormControl<number[]>([]);
  tarifas: Array<TarifaSelectHtmlOnly> = [];
  decimal = {
    nroPrecio: 2
  }

  mainForm = {
    opcion: 3,
    idArticulo: 0,
    rucProveedor: null,
    nroDocumento: null,
    valueToCalculate: 0,
    optionToCalculate: OptionsCalculateEnum.A,
  }

  optionPvp: OptionPvpEnum = "precioVenta"

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
        this.taxRates = response.tarifasImpuesto;
        this.decimal = response.decimal;
        this.subCategorias = response.subFamilias;


        let dataTarifa = this.tarifas.find(i => i.predeterminada);
        if (dataTarifa) {
          this.addTarifaDefault(dataTarifa.idTarifa)
        }
      },
      error(err) {
        console.log(err)
        hideLoader()
      },
    })

  }


  getProducts() {
    showLoader();
    let subCategoriasChecked = Array.isArray(this.checkedSubCategorias.value) && this.checkedSubCategorias.value.join(',');
    let dataSearch = {
      opcion: this.mainForm.opcion,
      rucProveedor: isValidField(this.mainForm.rucProveedor),
      nroDocumento: isValidField(this.mainForm.nroDocumento),
      subFamiliasChecked: this.mainForm.opcion === 3 && subCategoriasChecked || null,
      //  checkedSubFamilias: this.
      // idSubFamilia: $scope.mainForm.idSubFamilia
    }
    this.cloneNestedProducts = [];
    this.nestedProducts = [];
    this.productsModified = [];

    this.lotPriceSvc.getAll(dataSearch).subscribe({
      next: (response) => {
        hideLoader();
        let results = response;
        this.nestedProducts = structuredClone(results);
        this.cloneNestedProducts = structuredClone(results);


        console.log(this.nestedProducts)
      }, error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }

  ngOnInit() {
    this.getDataFilter();
    //   this.getProducts();
  }


  addTarifaDefault(numero: number) {
    // Utilizamos el método push para agregar el número al array
    this.tarifasSelected.value?.push(numero);
    // Actualizamos el valor del FormControl para que se reflejen los cambios
    this.tarifasSelected.setValue(this.tarifasSelected.value);
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

  isValidFilter() {
    let checkedSubCategorias = this.checkedSubCategorias.value;
    if (this.mainForm.opcion === 3) {
      if (checkedSubCategorias && Array.isArray(checkedSubCategorias) && checkedSubCategorias.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione al menos una SubFamilia'
        })
        return
      }
    }

    if (this.mainForm.opcion === 1 && !(this.mainForm.idArticulo > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el arículo'
      })
      return
    }

    if (this.mainForm.opcion === 4 && !isValidField(this.mainForm.rucProveedor)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el proveedor'
      })
      return
    }

    if (this.mainForm.opcion === 5 && !isValidField(this.mainForm.nroDocumento)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese el número de documento'
      })
      return
    }

    return true;

  }


  toSearch() {
    if (!this.isValidFilter()) return

    this.getProducts();
  }

  //Opciones calculo tarifas
  valueChangeTarifa(event: any) {

  }

  calculate() {
    try {

      let tarifasSelected = this.tarifasSelected.value;

      if (this.nestedProducts.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'No se encontrarón productos!'
        })
        return
      }

      if (!isValidField(this.mainForm.optionToCalculate)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione opcion a calcular'
        })
        return
      }

      if (!isValidField(this.optionPvp)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione una opción de PVP.'
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

      if (isNaN(this.mainForm.valueToCalculate)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese un valor numérico válido en el campo Valor'
        })
        return
      }
      if (!(this.mainForm.valueToCalculate > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese un valor diferente de cero en el campo Valor'
        })
        return
      }

      if (this.mainForm.optionToCalculate === OptionsCalculateEnum.B && this.mainForm.valueToCalculate > 100) {
        this.tS.toastr({
          type: 'warning',
          message: 'Cuando la opción a calcular es: "Calcular un porcentaje que se aplique a la tarifa", el valor no puede ser mayor a 100.'
        })
        return
      }

      this.applyValueToProducts();
    } catch (error) {
      console.log(error)
    }
  }

  applyValueToProducts() {
    this.productsModified = [];
    let tarifasSelected = this.tarifasSelected.value || [];

    let nestedProducts = structuredClone(this.cloneNestedProducts);

    for (let item of nestedProducts) {
      let dataTarifaImpuesto = this.taxRates.find(tr => tr.idTarifaImpuesto === item.idTipoIva);

      //si no se encontró el impuesto o si la tarifa es vacia continuar con el siguiente items;
      if (!dataTarifaImpuesto || item._children.length === 0) continue;

      let porcentajeImpuesto = dataTarifaImpuesto.porcentaje;

      for (let t of item._children) {
        let precioVenta = t.precioVenta;
        let precioConIva = t.precioConIva;
        let porcentajeUtilidad = t.porcentajeUtilidad;
        let utilidad = t.utilidad;
        let setDataToProductsModified = false;

        if (tarifasSelected.includes(t.idTarifa)) {

          // Sart Sumar un valor a la tarifa ya sea PRECIO VENTA O PRECIO CON IVA
          if (this.mainForm.optionToCalculate === OptionsCalculateEnum.A) {

            if (this.optionPvp === "precioVenta") {
              let precioVentaSumado = precioVenta + this.mainForm.valueToCalculate;
              if (precioVentaSumado >= item.precioCosto) {
                precioVenta = precioVentaSumado;
                precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, porcentajeImpuesto);
                porcentajeUtilidad = pricingCalculateUtil.getValuePercentageUtility(precioVenta, item.precioCosto);
                setDataToProductsModified = true;
              }
            }

            if (this.optionPvp === "precioConIva") {
              let precioConIvaSumado = precioConIva + this.mainForm.valueToCalculate;
              let precioVentaCalculado = pricingCalculateUtil.calculatePriceSale(precioConIvaSumado, porcentajeImpuesto);
              if (precioVentaCalculado >= item.precioCosto) {
                precioConIva = precioConIvaSumado;
                precioVenta = precioVentaCalculado;
                porcentajeUtilidad = pricingCalculateUtil.getValuePercentageUtility(precioVenta, item.precioCosto);
                setDataToProductsModified = true;
              }
            }
          }
          //============================================END =====================================


          //Start Calcular un porcentaje que se aplique a la tarifa ya sea PRECIO VENTA O PRECIO CON IVA
          if (this.mainForm.optionToCalculate === OptionsCalculateEnum.B) {
            if (this.optionPvp === "precioVenta") {
              let valorImpuesto = pricingCalculateUtil.calculateTaxValue(t.precioVenta, this.mainForm.valueToCalculate);
              let precioVentaConImpuestos = t.precioVenta + valorImpuesto;
              if (precioVentaConImpuestos >= item.precioCosto) {
                precioVenta = precioVentaConImpuestos;
                precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, porcentajeImpuesto);
                porcentajeUtilidad = pricingCalculateUtil.getValuePercentageUtility(precioVenta, item.precioCosto);
                setDataToProductsModified = true;
              }
            }
            if (this.optionPvp === "precioConIva") {
              let valorPrecioConIva = pricingCalculateUtil.calculatePriceWithVat(t.precioConIva, this.mainForm.valueToCalculate);
              let precioVentaCalculado = pricingCalculateUtil.calculatePriceSale(valorPrecioConIva, porcentajeImpuesto);
              if (precioVentaCalculado >= item.precioCosto) {
                precioConIva = valorPrecioConIva;
                precioVenta = precioVentaCalculado;
                porcentajeUtilidad = pricingCalculateUtil.getValuePercentageUtility(precioVenta, item.precioCosto);
                setDataToProductsModified = true;
              }
            }
          }
          //===========================================END========================================


          //Start Reemplazar un valor en la tarifa ya sea PRECIO VENTA O PRECIO CON IVA
          if (this.mainForm.optionToCalculate === OptionsCalculateEnum.C) {
            if (this.optionPvp === "precioVenta" && this.mainForm.valueToCalculate >= item.precioCosto) {
              precioVenta = this.mainForm.valueToCalculate;
              precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, porcentajeImpuesto);
              porcentajeUtilidad = pricingCalculateUtil.getValuePercentageUtility(precioVenta, item.precioCosto);
              setDataToProductsModified = true;
            }

            if (this.optionPvp === "precioConIva") {
              precioConIva = this.mainForm.valueToCalculate;
              precioVenta = pricingCalculateUtil.calculatePriceSale(precioConIva, porcentajeImpuesto);
              if (precioVenta >= item.precioCosto) {
                porcentajeUtilidad = pricingCalculateUtil.getValuePercentageUtility(precioVenta, item.precioCosto);
                setDataToProductsModified = true;
              } else {
                precioConIva = t.precioConIva;
                precioVenta = t.precioVenta;
              }
            }
          }
          //===========================================END========================================

          //Start Desglozar el IVA al PRECIO VENTA INC IVA por tarifas
          if (this.mainForm.optionToCalculate === OptionsCalculateEnum.D) {
            if (this.optionPvp === "precioVenta") {
              precioConIva = pricingCalculateUtil.calculatePriceWithVat(t.precioVenta, this.mainForm.valueToCalculate);
              porcentajeUtilidad = pricingCalculateUtil.getValuePercentageUtility(precioVenta, t.precioVenta);
              setDataToProductsModified = true;
            }

            if (this.optionPvp === "precioConIva") {
              let precioVentaCalculado = pricingCalculateUtil.calculatePriceSale(precioConIva, this.mainForm.valueToCalculate);
              precioVenta = precioVentaCalculado;
              porcentajeUtilidad = pricingCalculateUtil.getValuePercentageUtility(precioVenta, precioConIva);
              setDataToProductsModified = true;
            }
          }

        }


        utilidad = pricingCalculateUtil.getValueUtility(precioVenta, item.precioCosto)

        t.precioVenta = roundNumber(precioVenta, this.decimal.nroPrecio);
        t.precioConIva = roundNumber(precioConIva, this.decimal.nroPrecio);
        t.porcentajeUtilidad = roundNumber(porcentajeUtilidad, 5);
        t.utilidad = roundNumber(utilidad, 5);

        if (setDataToProductsModified) {
          this.setProductsModified({ ...t, idTipoIva: item.idTipoIva })
        }
      }
    }


    this.nestedProducts = structuredClone(nestedProducts);
    console.log(nestedProducts)
    //Update list in tabulator
    this.tabulatorComponent.updateData();
    this.tS.toastr({
      type: 'info',
      message: `${this.productsModified.length} Tarifas modificados!`
    })
  }


  setProductsModified<T extends LotPriceTarifa & { idTipoIva: number }>(data: T) {
    this.productsModified.push(data)

  }

  refreshToNestedProducts() {
    this.productsModified = [];
    this.nestedProducts = structuredClone(this.cloneNestedProducts);
    this.tabulatorComponent.updateData();
  }

  askToSave() {
    if (this.productsModified.length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'No ha modificado ninguna tarifa del artículo!'
      })
      return
    }

    Swal.fire({
      title: "Actualizar precios masivamente",
      text: "¿Estas seguro de actualizar los precios masivamente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí!",
      cancelButtonText: 'No!'
    }).then((result) => {
      if (result.isConfirmed) {
        let results = this.productsModified.map(item => {

          return {
            idTipoIva: item.idTipoIva,
            idArticuloPvP: item.idArticuloPvp,
            idArticulo: item.idArticulo,
            idTarifa: item.idTarifa,
            precioVenta: item.precioVenta,
            precioConIva: item.precioConIva,
            porcentajeUtilidad: item.porcentajeUtilidad,
          }
        })

        let data = {
          tipo: 2,
          articles: results
        }
        showLoader();
        this.lotPriceSvc.put(data).subscribe({
          next: (response) => {
            hideLoader();
            if (isApiResponse(response)) {
              if (response.code === "0") {
                Swal.fire({
                  icon: 'warning',
                  text: response.message
                })
              }
              if (response.code === "1") {
                Swal.fire({
                  icon: 'success',
                  text: response.message,
                  timer: 1000
                })
                this.cloneNestedProducts = [];
                this.nestedProducts = [];
                this.productsModified = [];
              }
            }
          },
          error(err) {
            Swal.fire({
              icon: 'error',
              text: err
            })
            hideLoader();
          },
        })
      }
    });
  }
}

import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';

import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';

import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { ProductSearchComponent } from '@inventory/ui/product/components/product-search/product-search.component';
import { SubCategorySelectMultipleComponent } from '@inventory/ui/sub-category/components/sub-category-select-multiple/sub-category-select-multiple.component';
import {
  LotPrice,
  LotPriceTarifa,
} from '@inventory/domain/models/lot-price.model';
import { GroupedSubFamilia } from '@inventory/domain/models/sub-category.model';
import { TarifaSelectHtmlOnly } from '@inventory/domain/models/tarifa.model';
import { LotPriceService } from '@inventory/services/lot-price.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import Swal from 'sweetalert2';
import { SupplierSearch } from '@customer/core/domain/supplier.interface';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

enum OptionsCalculateEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

type OptionPvpEnum = 'precioVenta' | 'precioConIva' | 'precioCosto';

@Component({
  selector: 'app-lot-price-page',
  imports: [
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    BreadcrumbComponent,
    TabulatorComponent,
    SubCategorySelectMultipleComponent,
    ProductSearchComponent,
    SupplierSearchComponent,
    MatCardContent,
    MatCard,
    MatButton,
    ThemeButtonComponent,
    MatIconButton,
  ],
  templateUrl: './lot-price-page.component.html',
})
export class LotPricePageComponent {
  private readonly lotPriceSvc = inject(LotPriceService);
  private readonly tS = inject(ToasterService);

  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

  readonly catalogs = [
    // { code: 0, description: 'Ninguno' },
    { code: 3, description: 'Subfamilias' },
    { code: 1, description: 'Articulo' },
    { code: 4, description: 'Proveedor' },
    { code: 5, description: 'N° Documento' },
  ];
  readonly optionsCalculate = [
    {
      code: OptionsCalculateEnum.D,
      description: 'Sumar un % de rentabilidad a la tarifa',
    },
    { code: OptionsCalculateEnum.A, description: 'Sumar un valor a la tarifa' },
    {
      code: OptionsCalculateEnum.B,
      description: 'Sumar un porcentaje a la tarifa ',
    },
    {
      code: OptionsCalculateEnum.C,
      description: 'Reemplazar un valor a la tarifa ',
    },
    //{ code: "E", description: 'Sumar el IVA al PRECIO DE VENTA SIN IVA' },
  ];

  readonly tempOptionsPvps = [
    { code: 'precioVenta', description: 'Precio Venta' },
    { code: 'precioConIva', description: 'Precio incluido IVA' },
  ];

  readonly optionsPorcentaje = [
    { code: 'precioVenta', description: 'Precio Venta' },
    { code: 'precioCosto', description: 'Precio Costo' },
  ];

  tiposArticulo = [
    { code: 2, description: 'Articulo' },
    { code: 3, description: 'Articulo Fraccionado' },
  ];

  optionsPvps = structuredClone(this.tempOptionsPvps);

  isProductModified = (data: any, dataProductModified: any): boolean => {
    const isSamePvPProduct =
      data.idArticuloPvP === dataProductModified.idArticuloPvP ||
      data.idArticuloFraccionadoPvP ===
        dataProductModified.idArticuloFraccionadoPvP;

    const isSameProduct =
      (data.idArticulo > 0 &&
        data.idArticulo === dataProductModified.idArticulo) ||
      (data.idArticuloFraccionado > 0 &&
        dataProductModified.idArticuloFraccionado ===
          data.idArticuloFraccionado);

    const isSamePvP = data.idTarifa === dataProductModified.idTarifa;

    return isSamePvPProduct && isSameProduct && isSamePvP;
  };

  answerCellColorFormatter() {
    return (cell: any, formatterParams: any, onRendered: any) => {
      if (cell.getValue() != null) {
        let dataRow = cell.getData();
        let dataAdded = this.productsModified.find(
          (d) =>
            dataRow.idTarifa === d.idTarifa &&
            d.idArticuloPvP === dataRow.idArticuloPvP,
        );

        if (dataAdded) {
          cell.getElement().style.backgroundColor = '#fad';
        }
        //var data = parseInt(cell.getValue());
      }
      return cell.getValue();
    };
  }

  editCheck = (cell: any) => {
    let data = cell.getRow().getData();
    return this.productsModified.some((d) => {
      return this.isProductModified(data, d);
    });
  };

  readonly columns = [
    {
      title: `<input type="checkbox" id="allSelectedRow">`,
      headerHozAlign: 'center',
      headerSort: false, // Disable sorting on this column
      headerClick: (e: any) => {
        const targetElement = e.target;
        if (
          targetElement.tagName === 'INPUT' &&
          targetElement.type === 'checkbox'
        ) {
          if (!targetElement.checked) {
            this.tabulatorComponent.refTabulator.deselectRow();
            return;
          }
          const rows = this.tabulatorComponent.refTabulator.getRows();

          for (let i = 0; i < rows.length; i++) {
            const childRows = rows[i].getTreeChildren();
            if (childRows.length > 0) {
              for (let j = 0; j < childRows.length; j++) {
                const data = childRows[j].getData();

                if (!childRows[j].isSelected()) {
                  if (
                    this.productsModified.some((d) =>
                      this.isProductModified(data, d),
                    )
                  ) {
                    childRows[j].toggleSelect();
                  }
                }
              }
            }
          }
        }
      },
    },
    // {
    //   formatter: "rowSelection",
    //   field: 'IsSelected',
    //   titleFormatter: "rowSelection",
    //   hozAlign: "center",
    //   headerSort: false,
    // },
    { headerSort: false },
    {
      title: 'Nro.',
      field: 'index',
      width: '6px',
      headerSort: false,
      responsive: 0,
    },
    {
      title: 'Código',
      field: 'codigo',
      width: '10px',
      responsive: 0,
      headerSort: false,
    },
    {
      title: 'Descripción',
      field: 'descripcion',
      width: '23px',
      headerSort: false,
    },
    {
      title: 'P. Costo',
      field: 'precioCosto',
      width: '9px',
      responsive: 2,
      headerSort: false,
    },
    { title: 'Iva', field: 'iva', width: '7px', headerSort: false },
    {
      title: 'Tarifa',
      field: 'tarifaDesc',
      width: 100,
      headerSort: false,
      formatter: this.answerCellColorFormatter(),
    },
    {
      title: 'P. Venta',
      field: 'precioVenta',
      width: '9px',
      headerSort: false,
      editor: 'input',
      editable: this.editCheck,
      formatter: this.answerCellColorFormatter(),
    },
    {
      title: 'P. IVA',
      field: 'precioConIva',
      width: '8px',
      headerSort: false,
      editor: 'input',
      editable: this.editCheck,
      formatter: this.answerCellColorFormatter(),
    },
    {
      title: '% Utilidad',
      field: 'porcentajeUtilidad',
      width: 100,
      headerSort: false,
      editor: 'input',
      editable: this.editCheck,
      formatter: this.answerCellColorFormatter(),
    },
    {
      title: 'Utilidad',
      field: 'utilidad',
      width: 100,

      headerSort: false,
      formatter: this.answerCellColorFormatter(),
    },
  ];

  checkedSubCategorias = new FormControl([]);
  subCategorias: Array<GroupedSubFamilia> = [];

  productsModified: Array<any> = [];

  nestedProducts: Array<LotPrice> = [];
  cloneNestedProducts: Array<LotPrice> = [];
  taxRates: Array<TarifaImpuesto> = [];

  tarifasSelected = new FormControl<number[]>([]);
  tarifas: Array<TarifaSelectHtmlOnly> = [];
  decimal = {
    nroPrecio: 2,
  };

  mainForm = {
    tipo: 2,
    opcion: 3,
    idArticulo: 0,
    rucProveedor: '',
    nroDocumento: '',
    valueToCalculate: 0,
    optionToCalculate: OptionsCalculateEnum.A,
  };

  optionPvp: OptionPvpEnum = 'precioVenta';

  productSearchProps = {
    isSearchSimple: true,
  };

  //Suppier
  isSearchSupplierSimple = true;

  isCalculateManual = false;

  protected getDataFilter() {
    this.lotPriceSvc.getDataFilter().subscribe({
      next: (response) => {
        this.tarifas = response.tarifas;
        this.taxRates = response.tarifasImpuesto;
        this.decimal = response.decimal;
        this.subCategorias = response.subFamilias;

        let dataTarifa = this.tarifas.find((i) => i.predeterminada);
        if (dataTarifa) {
          this.addTarifaDefault(dataTarifa.idTarifa);
        }
      },
      error(err) {
        console.log(err);
      },
    });
  }

  getProducts() {
    try {
      let subCategoriasChecked =
        Array.isArray(this.checkedSubCategorias.value) &&
        this.checkedSubCategorias.value.join(',');
      let dataSearch = {
        tipo: this.mainForm.tipo,
        opcion: this.mainForm.opcion,
        idArticulo:
          this.mainForm.opcion === 1
            ? isValidField(this.mainForm.idArticulo)
            : null,
        rucProveedor:
          this.mainForm.opcion === 4
            ? isValidField(this.mainForm.rucProveedor)
            : null,
        nroDocumento:
          this.mainForm.opcion === 5
            ? isValidField(this.mainForm.nroDocumento)
            : null,
        subFamiliasChecked:
          (this.mainForm.opcion === 3 && subCategoriasChecked) || null,
        //  checkedSubFamilias: this.
        // idSubFamilia: $scope.mainForm.idSubFamilia
      };
      this.cloneNestedProducts = [];
      this.nestedProducts = [];
      this.productsModified = [];

      this.lotPriceSvc.getAll(dataSearch).subscribe({
        next: (response) => {
          let results = response;
          this.nestedProducts = structuredClone(results);
          this.cloneNestedProducts = structuredClone(results);
        },
        error(err) {
          console.log(err);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {
    this.getDataFilter();
  }

  onChangeOptionCalculate() {
    if (this.mainForm.optionToCalculate === OptionsCalculateEnum.D) {
      this.optionsPvps = structuredClone(this.optionsPorcentaje);
    } else {
      this.optionsPvps = structuredClone(this.tempOptionsPvps);
    }
  }

  cellEdited(cell: any) {
    let row = cell.getRow();
    let column = cell.getColumn().getField();
    let oldValue = cell.getOldValue();
    let value = parseFloat(cell.getValue());

    let parentData = row.getTreeParent().getData();
    let precioCosto = parentData.precioCosto;
    let data = cell.getData();
    let precioVenta = parseFloat(data.precioVenta);
    let precioConIva = parseFloat(data.precioConIva);
    let porcentajeUtilidad = parseFloat(data.porcentajeUtilidad);

    let dataTarifaImpuesto = this.taxRates.find(
      (tr) => tr.idTarifaImpuesto === parentData.idTipoIva,
    );
    let porcentajeImpuesto = dataTarifaImpuesto?.porcentaje || 0;

    if (!dataTarifaImpuesto) {
      cell.setValue(oldValue);
      return;
    }

    if (isNaN(cell.getValue()) || cell.getValue() === '') {
      cell.setValue(oldValue);
      return;
    }

    if (column === 'precioVenta') {
      if (value >= precioCosto) {
        precioConIva = pricingCalculateUtil.calculatePriceWithVat(
          value,
          porcentajeImpuesto,
        );
        porcentajeUtilidad =
          pricingCalculateUtil.calculateProfitMarginPercentage(
            precioVenta,
            precioCosto,
          );
      } else {
        precioVenta = oldValue;
      }
    }

    if (column === 'precioConIva') {
      let precioVentaValidar = pricingCalculateUtil.calculatePriceSale(
        value,
        porcentajeImpuesto,
      );
      if (precioVentaValidar >= precioCosto) {
        precioVenta = precioVentaValidar;
        porcentajeUtilidad =
          pricingCalculateUtil.calculateProfitMarginPercentage(
            precioVenta,
            precioCosto,
          );
      } else {
        precioConIva = oldValue;
      }
    }

    if (column === 'porcentajeUtilidad') {
      if (value <= 100) {
        let precioVentaValidar =
          pricingCalculateUtil.calculatePriceSaleOfValuePercentageUtility(
            precioCosto,
            value,
          );
        if (precioVentaValidar >= precioCosto) {
          precioVenta = precioVentaValidar;
          precioConIva = pricingCalculateUtil.calculatePriceWithVat(
            precioVenta,
            porcentajeImpuesto,
          );
        } else {
          porcentajeUtilidad = oldValue;
        }
      } else {
        porcentajeUtilidad = oldValue;
      }
    }

    let utilidad = pricingCalculateUtil.getValueUtility(
      precioVenta,
      precioCosto,
    );

    precioVenta = roundNumber(precioVenta, this.decimal.nroPrecio);
    precioConIva = roundNumber(precioConIva, this.decimal.nroPrecio);
    porcentajeUtilidad = roundNumber(porcentajeUtilidad, 5);
    utilidad = roundNumber(utilidad, 5);

    let obj = {
      precioVenta,
      precioConIva,
      porcentajeUtilidad,
      utilidad,
    };
    row.update({
      ...row,
      ...obj,
    });
    let dataProductModified = this.productsModified.find((pm) =>
      this.isProductModified(data, pm),
    );
    if (dataProductModified) {
      dataProductModified = {
        ...dataProductModified,
        ...obj,
      };
    }
  }

  cellClick(cell: any) {
    let data = cell.getData();
    let isRowAdded = this.productsModified.some((d) => {
      return this.isProductModified(data, d);
    });
    if (isRowAdded) {
      cell.toggleSelect();
    }
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

  onSupplierSelected(data: SupplierSearch) {
    this.mainForm.rucProveedor = data.identificacionComprador;
  }

  supplierResultEmptyInput($event: any) {
    this.mainForm.rucProveedor = '';
  }

  isValidFilter() {
    let checkedSubCategorias = this.checkedSubCategorias.value;
    if (this.mainForm.opcion === 3) {
      if (
        checkedSubCategorias &&
        Array.isArray(checkedSubCategorias) &&
        checkedSubCategorias.length === 0
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione al menos una SubFamilia',
        });
        return;
      }

      if (
        checkedSubCategorias &&
        Array.isArray(checkedSubCategorias) &&
        checkedSubCategorias.length > 4
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Máximo de SubFamilias permitidos es 3',
        });
        return;
      }
    }

    if (this.mainForm.opcion === 1 && !(this.mainForm.idArticulo > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el arículo',
      });
      return;
    }

    if (
      this.mainForm.opcion === 4 &&
      !isValidField(this.mainForm.rucProveedor)
    ) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el proveedor',
      });
      return;
    }

    if (
      this.mainForm.opcion === 5 &&
      !isValidField(this.mainForm.nroDocumento)
    ) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese el número de documento',
      });
      return;
    }

    return true;
  }

  toSearch() {
    if (!this.isValidFilter()) return;

    this.getProducts();
  }

  calculate() {
    try {
      this.isCalculateManual = false;
      let tarifasSelected = this.tarifasSelected.value;

      if (this.nestedProducts.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'No se encontrarón productos!',
        });
        return;
      }

      if (!isValidField(this.mainForm.optionToCalculate)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione opcion a calcular',
        });
        return;
      }

      if (!isValidField(this.optionPvp)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione una opción de PVP.',
        });
        return;
      }

      if (
        tarifasSelected &&
        Array.isArray(tarifasSelected) &&
        tarifasSelected.length === 0
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione al menos una tarifa',
        });
        return;
      }

      if (isNaN(this.mainForm.valueToCalculate)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese un valor numérico válido en el campo Valor',
        });
        return;
      }
      if (!(this.mainForm.valueToCalculate > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese un valor diferente de cero en el campo Valor',
        });
        return;
      }

      if (
        this.mainForm.optionToCalculate === OptionsCalculateEnum.D &&
        this.mainForm.valueToCalculate > 100
      ) {
        this.tS.toastr({
          type: 'warning',
          message:
            'Cuando la opción a calcular es: "Calcular un porcentaje que se aplique a la tarifa", el valor no puede ser mayor a 100.',
        });
        return;
      }

      this.applyValueToProducts();
    } catch (error) {
      console.log(error);
    }
  }

  calculateManual() {
    let tarifasSelected = this.tarifasSelected.value;
    if (this.nestedProducts.length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'No se encontrarón productos!',
      });
      return;
    }
    if (!isValidField(this.mainForm.optionToCalculate)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione opcion a calcular',
      });
      return;
    }

    if (!isValidField(this.optionPvp)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione una opción de PVP.',
      });
      return;
    }

    if (
      tarifasSelected &&
      Array.isArray(tarifasSelected) &&
      tarifasSelected.length === 0
    ) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione al menos una tarifa',
      });
      return;
    }
    this.isCalculateManual = true;
    this.applyValueToProducts();
  }

  applyValueToProducts() {
    this.productsModified = [];
    let tarifasSelected = this.tarifasSelected.value || [];

    let nestedProducts = structuredClone(this.cloneNestedProducts);

    for (let item of nestedProducts) {
      let dataTarifaImpuesto = this.taxRates.find(
        (tr) => tr.idTarifaImpuesto === item.idTipoIva,
      );

      //si no se encontró el impuesto o si la tarifa es vacia continuar con el siguiente items;
      if (!dataTarifaImpuesto || item._children.length === 0) continue;

      let porcentajeImpuesto = dataTarifaImpuesto.porcentaje;

      for (let t of item._children) {
        let precioVenta = t.precioVenta;
        let precioConIva = t.precioConIva;
        let porcentajeUtilidad = t.porcentajeUtilidad;
        let utilidad = t.utilidad;
        let setDataToProductsModified = false;

        if (this.isCalculateManual) {
          if (tarifasSelected.includes(t.idTarifa)) {
            console.log('testts');
            setDataToProductsModified = true;
          }
        } else {
          if (tarifasSelected.includes(t.idTarifa)) {
            // Sart Sumar un valor a la tarifa ya sea PRECIO VENTA O PRECIO CON IVA
            if (this.mainForm.optionToCalculate === OptionsCalculateEnum.A) {
              if (this.optionPvp === 'precioVenta') {
                let precioVentaSumado =
                  precioVenta + this.mainForm.valueToCalculate;
                if (precioVentaSumado >= item.precioCosto) {
                  precioVenta = precioVentaSumado;
                  precioConIva = pricingCalculateUtil.calculatePriceWithVat(
                    precioVenta,
                    porcentajeImpuesto,
                  );
                  porcentajeUtilidad =
                    pricingCalculateUtil.calculateProfitMarginPercentage(
                      precioVenta,
                      item.precioCosto,
                    );
                  setDataToProductsModified = true;
                }
              }

              if (this.optionPvp === 'precioConIva') {
                let precioConIvaSumado =
                  precioConIva + this.mainForm.valueToCalculate;
                let precioVentaCalculado =
                  pricingCalculateUtil.calculatePriceSale(
                    precioConIvaSumado,
                    porcentajeImpuesto,
                  );
                if (precioVentaCalculado >= item.precioCosto) {
                  precioConIva = precioConIvaSumado;
                  precioVenta = precioVentaCalculado;
                  porcentajeUtilidad =
                    pricingCalculateUtil.calculateProfitMarginPercentage(
                      precioVenta,
                      item.precioCosto,
                    );
                  setDataToProductsModified = true;
                }
              }
            }
            //============================================END =====================================

            //Start Calcular un porcentaje que se aplique a la tarifa ya sea PRECIO VENTA O PRECIO CON IVA
            if (this.mainForm.optionToCalculate === OptionsCalculateEnum.B) {
              if (this.optionPvp === 'precioVenta') {
                let valorImpuesto = pricingCalculateUtil.calculateTaxValue(
                  t.precioVenta,
                  this.mainForm.valueToCalculate,
                );
                let precioVentaConImpuestos = t.precioVenta + valorImpuesto;
                if (precioVentaConImpuestos >= item.precioCosto) {
                  precioVenta = precioVentaConImpuestos;
                  precioConIva = pricingCalculateUtil.calculatePriceWithVat(
                    precioVenta,
                    porcentajeImpuesto,
                  );
                  porcentajeUtilidad =
                    pricingCalculateUtil.calculateProfitMarginPercentage(
                      precioVenta,
                      item.precioCosto,
                    );
                  setDataToProductsModified = true;
                }
              }
              if (this.optionPvp === 'precioConIva') {
                let valorPrecioConIva =
                  pricingCalculateUtil.calculatePriceWithVat(
                    t.precioConIva,
                    this.mainForm.valueToCalculate,
                  );
                let precioVentaCalculado =
                  pricingCalculateUtil.calculatePriceSale(
                    valorPrecioConIva,
                    porcentajeImpuesto,
                  );
                if (precioVentaCalculado >= item.precioCosto) {
                  precioConIva = valorPrecioConIva;
                  precioVenta = precioVentaCalculado;
                  porcentajeUtilidad =
                    pricingCalculateUtil.calculateProfitMarginPercentage(
                      precioVenta,
                      item.precioCosto,
                    );
                  setDataToProductsModified = true;
                }
              }
            }
            //===========================================END========================================

            //Start Reemplazar un valor en la tarifa ya sea PRECIO VENTA O PRECIO CON IVA
            if (this.mainForm.optionToCalculate === OptionsCalculateEnum.C) {
              if (
                this.optionPvp === 'precioVenta' &&
                this.mainForm.valueToCalculate >= item.precioCosto
              ) {
                precioVenta = this.mainForm.valueToCalculate;
                precioConIva = pricingCalculateUtil.calculatePriceWithVat(
                  precioVenta,
                  porcentajeImpuesto,
                );
                porcentajeUtilidad =
                  pricingCalculateUtil.calculateProfitMarginPercentage(
                    precioVenta,
                    item.precioCosto,
                  );
                setDataToProductsModified = true;
              }

              if (this.optionPvp === 'precioConIva') {
                precioConIva = this.mainForm.valueToCalculate;
                precioVenta = pricingCalculateUtil.calculatePriceSale(
                  precioConIva,
                  porcentajeImpuesto,
                );
                if (precioVenta >= item.precioCosto) {
                  porcentajeUtilidad =
                    pricingCalculateUtil.calculateProfitMarginPercentage(
                      precioVenta,
                      item.precioCosto,
                    );
                  setDataToProductsModified = true;
                } else {
                  precioConIva = t.precioConIva;
                  precioVenta = t.precioVenta;
                }
              }
            }
            //===========================================END========================================

            //Start Sumar un % de rentabilidad al PVP
            if (this.mainForm.optionToCalculate === OptionsCalculateEnum.D) {
              if (this.optionPvp === 'precioCosto') {
                let valorImpuesto = pricingCalculateUtil.calculateTaxValue(
                  item.precioCosto,
                  this.mainForm.valueToCalculate,
                );
                let precioVentaValidar = item.precioCosto + valorImpuesto;
                // let precioVentaValidar = pricingCalculateUtil.calculatePriceSale(precioConImpuestos, porcentajeImpuesto);

                if (precioVentaValidar >= item.precioCosto) {
                  precioVenta = precioVentaValidar;
                  precioConIva = pricingCalculateUtil.calculatePriceWithVat(
                    precioVenta,
                    porcentajeImpuesto,
                  );
                  porcentajeUtilidad =
                    pricingCalculateUtil.calculateProfitMarginPercentage(
                      precioVenta,
                      item.precioCosto,
                    );
                  setDataToProductsModified = true;
                }
              }
              if (this.optionPvp === 'precioVenta') {
                let valorImpuesto = pricingCalculateUtil.calculateTaxValue(
                  precioVenta,
                  this.mainForm.valueToCalculate,
                );
                let precioConImpuestos = precioVenta + valorImpuesto;
                let precioVentaValidar =
                  pricingCalculateUtil.calculatePriceSale(
                    precioConImpuestos,
                    porcentajeImpuesto,
                  );

                if (precioVentaValidar >= item.precioCosto) {
                  precioVenta = precioVentaValidar;
                  precioConIva = precioConImpuestos;
                  porcentajeUtilidad =
                    pricingCalculateUtil.calculateProfitMarginPercentage(
                      precioVenta,
                      item.precioCosto,
                    );
                  setDataToProductsModified = true;
                }
              }
            }
          }
        }

        utilidad = pricingCalculateUtil.getValueUtility(
          precioVenta,
          item.precioCosto,
        );

        t.precioVenta = roundNumber(precioVenta, this.decimal.nroPrecio);
        t.precioConIva = roundNumber(precioConIva, this.decimal.nroPrecio);
        t.porcentajeUtilidad = roundNumber(porcentajeUtilidad, 5);
        t.utilidad = roundNumber(utilidad, 5);

        if (setDataToProductsModified) {
          this.setProductsModified({ ...t, idTipoIva: item.idTipoIva });
        }
      }
    }

    this.nestedProducts = structuredClone(nestedProducts);

    if (this.productsModified.length > 0) {
      Swal.fire({
        icon: 'success',
        text: `${this.productsModified.length} Tarifas modificadas! Antes de guardar, revise que los precios modificados estén correctamente.`,
      });
    } else {
      this.tS.toastr({
        type: 'info',
        message: `${this.productsModified.length} Tarifas modificados!`,
      });
    }
  }

  setProductsModified<T extends LotPriceTarifa & { idTipoIva: number }>(
    data: T,
  ) {
    this.productsModified.push(data);
  }

  refreshToNestedProducts() {
    this.productsModified = [];
    this.nestedProducts = structuredClone(this.cloneNestedProducts);
  }

  getSelectedData() {
    const selectedData = this.tabulatorComponent.refTabulator.getSelectedData();
    return this.productsModified.filter((data) => {
      return selectedData.some((rowSelect) => {
        return this.isProductModified(data, rowSelect);
      });
    });
  }

  askToSave() {
    const selectedData = this.getSelectedData();
    if (selectedData.length === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione al menos un artículo!',
      });
      return;
    }

    // if (this.productsModified.length === 0) {
    //   this.tS.toastr({
    //     type: 'warning',
    //     message: 'No ha modificado ninguna tarifa del artículo!'
    //   })
    //   return
    // }

    Swal.fire({
      title: 'Actualizar precios masivamente',
      text: '¿Estas seguro de actualizar los precios masivamente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!',
      cancelButtonText: 'No!',
    }).then((result) => {
      if (result.isConfirmed) {
        let results = selectedData.map((item) => {
          return {
            idTipoIva: item.idTipoIva,
            idArticuloPvP: item.idArticuloPvP,
            idArticuloFraccionadoPvP: item.idArticuloFraccionadoPvP,
            idArticuloFraccionado: item.idArticuloFraccionado,
            idArticulo: item.idArticulo,
            idTarifa: item.idTarifa,
            precioVenta: item.precioVenta,
            precioConIva: item.precioConIva,
            porcentajeUtilidad: item.porcentajeUtilidad,
          };
        });

        let data = {
          tipo: this.mainForm.tipo,
          articles: results,
        };

        this.lotPriceSvc.put(data).subscribe({
          next: (response) => {
            if (isApiResponse(response)) {
              if (response.code === '0') {
                Swal.fire({
                  icon: 'warning',
                  text: response.message,
                });
              }
              if (response.code === '1') {
                Swal.fire({
                  icon: 'success',
                  text: response.message,
                  timer: 1000,
                });
                this.cloneNestedProducts = [];
                this.nestedProducts = [];
                this.productsModified = [];
              }
            }
          },
          error(err) {
            Swal.fire({
              icon: 'error',
              text: typeof err == 'object' ? err.error : err,
            });
          },
        });
      }
    });
  }
}


import { Component,  inject, Input, signal } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { TAX_RATE_CODE } from '@core/constants/global.constants';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { ToasterService } from '@core/services/toaster.service';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { getValidId, isValidField } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SubCategoryModalDirective } from '@inventory/ui/directives/sub-category.directive'
import { MeasureAddEditDirective } from '@inventory/ui/directives/measure-add-edit.directive';
import { TagsAddEditModalDirective } from '@inventory/ui/directives/tags-add-edit-modal.directive';
import { TarifaSelectHtmlOnly } from '@inventory/domain/models/tarifa.model';
import { TipoIvaSelectHtmlOnly } from '@inventory/domain/models/tipo-iva.model';
import { NgbActiveModal,  NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { UserRoleStateService } from '@shared/store/user-role-state.service';
import Swal from 'sweetalert2';

import { FraccProductListComponent } from '@inventory/ui/product/components/fracc-product-list/fracc-product-list.component';
import {ProductUseCase} from "@inventory/domain/usecases/product.use-case";

interface ProductTarifa {
  tipoIva: string
  tarifa: string
  precioVenta: number
  precioConIva: number
  porcentajeUtilidad: number
  porcentajeIva: number
  utilidad: number
}
@Component({
    selector: 'app-product-add-edit-modal',
    imports: [
        //Modules
        FormsModule,
        ReactiveFormsModule,
        NgbNavModule,
        FontAwesomeModule,
        MatAutocompleteModule,
        ToUpperCaseDirective,
        //Components
        TabulatorComponent,
        FraccProductListComponent,
        //Directivas
        SubCategoryModalDirective,
        MeasureAddEditDirective,
        TagsAddEditModalDirective
    ],
    templateUrl: './product-add-edit-modal.component.html'
})

export class ProductAddEditModalComponent {
  @Input() params: any = {}

  //Inject Services
  private activeModal = inject(NgbActiveModal);

  private _productUseCase = inject(ProductUseCase)

  private tS = inject(ToasterService)
  private userRoleStateSvc = inject(UserRoleStateService)



  selectedTab = signal(0);

  activeTab = 1;

  titleModal = 'Nuevo Producto';
  btnText = 'Guardar';


  categorias = [];
  decimal = {
    nroPrecio: 6
  };
  estabs = signal<GroupedEstab[]>([]);
  etiquetas = signal<any[]>([]);
  marcas = [];
  medidas = signal<any[]>([]);
  modelos = [];
  tarifas: TarifaSelectHtmlOnly[] = [];
  tiposArticulo = signal<any[]>([]);
  tiposIce = [];
  tiposIva = signal<TipoIvaSelectHtmlOnly[]>([]);

  bodegas: GroupedEstabBodega[] = []

  data = {
    idArticulo: 0,
    idEtiqueta: 0,
    descripcion: '',
    idSubFamilia: 0,
    subCategoriaName: null,
    codigo: '',
    codigoBarra: '',
    codigoAuxiliar: '',
    idMedida: 0,
    idTipoArticulo: 0,
    idTipoIva: 0,
    precioCosto: 0.1,
    precioSinSubsidio: 0,
    llevaInventario: false,
    datosAdicionales: false,
    productoFraccionable: false,
    fraccionable: false,
    caducidad: false,
    fechaCaducidad: null,

    datosLote: false,
    lote: null,
    fechaCreacion: null,
    fechaCaducidadLote: null
  }


  subCategories = signal<any[]>([])
  subCategoriesGroup = signal<any[]>([])

  columnNames = [
    {
      title: "Tarifa",
      field: "tarifa",
      headerSort: false,
      resizable: true
    },
    {
      title: "Tipo Iva",
      field: "tipoIva",
      headerSort: false,
      resizable: true
    },
    {
      title: "P. Venta",
      field: "precioVenta",
      headerSort: false,
      resizable: true,
      editor: "input",
      validator: ["required", "min:0", "numeric"]
    },
    {
      title: "P. IVA",
      field: "precioConIva",
      headerSort: false,
      resizable: true,
      editor: true,
      validator: ["required", "min:0", "numeric"]

    },
    {
      title: "% Utilidad",
      field: "porcentajeUtilidad",
      headerSort: false,
      resizable: true,
      editor: true,
      validator: ["required", "min:0", "numeric"]
    },
    {
      title: "Utilidad",
      field: "utilidad",
      headerSort: false,
      resizable: true

    },
    {
      title: "Estado",
      field: "estado",
      headerSort: false,
      resizable: true

    },
  ]

  tabulatorOptions = {
    columns: this.columnNames,
    layout: "fitColumns",
    resizableColumnFit: true,
    reactiveData: true,
    height: null // Elimina la altura fija para que sea auto
  }

  productTarifa: ProductTarifa[] = []


  isChangePrecio = false;

  private timeoutIdNav: any; // Para almacenar el ID del setTimeout

  isUpdate() {
    return this.params.idArticulo > 0
  }

  isAdd() {
    return !(this.params.idArticulo > 0)

  }

  // ngOnInit() {

  //   this.userRoleStateSvc.select("permission").subscribe(p => {
  //     this.isChangePrecio = p?.product?.precio
  //   })

  //   this.productSvc.getDataForm().subscribe({
  //     next: (response) => {
  //       const {
  //         categorias,
  //         decimal,
  //         estabs,
  //         etiquetas,
  //         marcas,
  //         medidas,
  //         modelos,
  //         subCategorias,
  //         tarifas,
  //         tiposArticulo,
  //         tiposIce,
  //         tiposIva,
  //       } = response;

  //       this.estabs.set(estabs)
  //       this.subCategories.set(subCategorias)
  //       this.subCategoriesGroup.set(response.subCategoriasGroup)
  //       this.tiposArticulo.set(tiposArticulo)
  //       this.medidas.set(medidas);
  //       this.tiposIva.set(tiposIva);
  //       this.tarifas = tarifas;
  //       this.etiquetas.set(etiquetas)

  //       if (!(this.params.idArticulo > 0)) {

  //         //default data
  //         if (this.tiposArticulo().length > 0) {
  //           this.data.idTipoArticulo = this.tiposArticulo()[0].idTipoArticulo;
  //         }

  //         if (this.medidas().length > 0) {
  //           this.data.idMedida = this.medidas()[0].idMedida;
  //         }

  //         if (this.tiposIva().length > 0) {
  //           let dataTipoIva = this.tiposIva().find((ti: any) => ti.codigoPorcentaje.toString() === TAX_RATE_CODE.FIVE_PERCENT)
  //           this.data.idTipoIva = dataTipoIva?.idTipoIva ?? 0;

  //         }
  //         console.log(this.data)

  //         this.setDataSubCategoria()
  //         this.setProductPvpAdd();

  //         //Registro de artículo desde Importación
  //         if (this.params && this.params.isImport) {
  //           this.setDataRecepcion()
  //         }
  //       }


  //       //editar
  //       if (this.params.idArticulo > 0) {



  //       }



  //     },
  //   })
  // }

  selectTab(index: number) {
    if (this.timeoutIdNav) {
      clearTimeout(this.timeoutIdNav);
    }
    this.tabulatorOptions.reactiveData = false;

    if (index === 0) {
      this.timeoutIdNav = setTimeout(() => {
        this.tabulatorOptions.reactiveData = true;
      }, 100);
    }
    this.selectedTab.set(index)

  }

  setDataSubCategoria() {
    if (this.subCategoriesGroup().length === 0 || (this.params && this.params.isImport)) return;

    const { codigo, idSubFamilia } = this.subCategories()[0]

    this.data.idSubFamilia = idSubFamilia;
    this.setCodigo(codigo);
  }

  setCodigo(codigo: string) {
    this.data.codigo = codigo;
    this.data.codigoAuxiliar = "AUX-" + codigo;
    this.data.codigoBarra = codigo;
  }

  setDataRecepcion() {
    this.data.codigo = this.params.codigo;
    this.data.codigoAuxiliar = this.params.codigoAuxiliar;
    this.data.codigoBarra = this.params.codigo;
    this.data.descripcion = this.params.descripcion;
    this.data.precioCosto = roundNumber(this.params.precioCosto, this.decimal.nroPrecio);
    if (this.data.codigoAuxiliar) {
      this.data.codigoAuxiliar = this.params.codigoAuxiliar;
    } else {
      this.data.codigoAuxiliar = this.params.codigo;
    }
  }


  setProductPvpAdd() {
    let dataTipoIva = this.tiposIva().find((ti: any) => ti.codigoPorcentaje.toString() === TAX_RATE_CODE.FIFTEEN_PERCENT)
    let dataTemp: any = [];
    if (dataTipoIva) {
      this.data.idTipoIva = dataTipoIva.idTipoIva;
      for (let tarifa of this.tarifas) {
        dataTemp.push({
          tipoIva: dataTipoIva.descripcion,
          tarifa: tarifa.descripcion,
          porcentajeIva: dataTipoIva.porcentaje,
          precioVenta: 0,
          precioConIva: 0,
          porcentajeUtilidad: 0,
          utilidad: 0,
          estado: tarifa.predeterminada ? "Predeterminada" : ""
        })
      }
    }
    this.productTarifa = dataTemp;
  }


  onChangeSubCategoria() {
    if (this.data.idArticulo > 0 || (this.params.isImport && this.data.codigo && this.data.codigoAuxiliar && this.data.codigoBarra)) {
      Swal.fire({
        //title: "Are you sure?",
        html: "¿Está de acuerdo en reemplazar automáticamente el <b>Código</b>, <b>Código Auxiliar</b> y <b>Código de Barra</b> con los datos generados por el sistema?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!",
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.subCategories().length > 0) {

            let { codigo } = this.subCategories().find((val) => val.idSubFamilia === this.data.idSubFamilia);
            this.setCodigo(codigo);
          }
        }
      });
      return
    }

    if (!(this.data.idArticulo > 0) && this.subCategories().length > 0) {
      let { codigo } = this.subCategories().find((val) => val.idSubFamilia === this.data.idSubFamilia);
      this.setCodigo(codigo);
    }
  }

  resultModalSubFamilia(result: any) {
    try {
      if (result && typeof result !== "object") return;

      this._productUseCase.getDataForm().subscribe(response => {
        this.subCategories.set(response.subCategorias);
        this.subCategoriesGroup.set(response.subCategoriasGroup);

        const { idSubFamilia } = this.subCategories().at(this.subCategories.length - 1);
        this.data.idSubFamilia = idSubFamilia;

        this.onChangeSubCategoria()

      })
    } catch (error) {
      console.log(error);
    }
  }

  refreshSubFamilia() {
    try {
      this._productUseCase.getDataForm().subscribe(response => {
        this.subCategories.set(response.subCategorias);
        this.subCategoriesGroup.set(response.subCategoriasGroup);

      })
    } catch (error) {
      console.log(error)
    }
  }


  resultModalMedida(result: any) {
    try {
      if (result && typeof result !== "object") return;

      this._productUseCase.getDataForm().subscribe(response => {
        this.medidas.set(response.medidas);
        this.data.idMedida = this.medidas().at(this.medidas().length - 1).idMedida;
      })
    } catch (error) {
      console.log(error);
    }
  }

  refreshMedida() {
    try {
      this._productUseCase.getDataForm().subscribe(response => {
        this.medidas.set(response.medidas);
      })
    } catch (error) {
      console.log(error);
    }
  }

  resultModalTag(result: any) {
    try {
      if (result && typeof result !== "object") return;

      this.refreshTag()
    } catch (error) {
      console.log(error);
    }
  }

  refreshTag() {
    try {
      this._productUseCase.getDataForm().subscribe(response => {
        this.etiquetas.set(response.etiquetas);
      })
    } catch (error) {
      console.log(error);
    }
  }

  private validateCalculateTarifa() {
    if (this.isUpdate() && !this.isChangePrecio) {
      this.tS.toastr({
        type: 'warning',
        message: "No tienes permiso para realizar esta acción"
      })
      return
    }
    if (!(this.data.precioCosto > 0) || isNaN(this.data.precioCosto)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese un número válido'
      })
      return
    }

    if (this.data.precioCosto === 0) {
      this.tS.toastr({
        type: 'warning',
        message: "El valor mínimo en el precio de costo es 0.01"
      })
      return;
    }

    this.data.precioCosto = roundNumber(this.data.precioCosto, this.decimal.nroPrecio);
    return true;
  }

  onChangeTipoIva() {
    if (!this.validateCalculateTarifa()) return




    this.recalculateTarifaAdd()

  }

  private recalculateTarifaAdd() {

    let dataTipoIva = this.tiposIva().find((item) => item.idTipoIva === this.data.idTipoIva);
    if (!dataTipoIva) {
      this.tS.toastr({
        type: 'warning',
        message: "No se pudo recuperar la data de tipo iva"
      })
      return
    }
    try {
      for (let item of this.productTarifa) {

        item.tipoIva = dataTipoIva.descripcion;
        item.porcentajeIva = dataTipoIva.porcentaje;

        let precioVenta = pricingCalculateUtil.calculatePriceSale(item.precioConIva, item.porcentajeIva);
        let precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, item.porcentajeIva);

        let porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(precioVenta, this.data.precioCosto)
        let utilidad = pricingCalculateUtil.getValueUtility(precioVenta, this.data.precioCosto)

        item.precioVenta = roundNumber(precioVenta, this.decimal.nroPrecio);


        item.precioConIva = roundNumber(precioConIva, this.decimal.nroPrecio);


        item.porcentajeUtilidad = porcentajeUtilidad;
        item.utilidad = utilidad
      }
    } catch (error) {
      this.tS.toastr({
        type: 'warning',
        message: error as string
      })
    }
  }

  onChangePrecioCosto() {
    if (!this.validateCalculateTarifa()) return
    this.recalculateTarifaAdd()
  }



  cellEdited(cell: any) {
    let row = cell.getRow();
    let column = cell.getColumn().getField();
    let oldValue = parseFloat(cell.getOldValue());
    let value = parseFloat(cell.getValue());

    let data = cell.getData();
    let precioVenta = parseFloat(data.precioVenta);
    let porcentajeIva = parseFloat(data.porcentajeIva);
    let precioConIva = parseFloat(data.precioConIva);
    let porcentajeUtilidad = parseFloat(data.porcentajeUtilidad);

    console.log(row)
    console.log(column)
    console.log(oldValue)
    console.log(value)
    if (oldValue === value) {
      return
    }

    //Validacion de Campos
    if ([null, undefined, "", 0].includes(this.data.precioCosto) || isNaN(this.data.precioCosto)) {
      cell.setValue(oldValue);
      this.tS.toastr({
        type: 'warning',
        message: "Ingrese el Precio de Costo"
      })
      return;
    }

    if (column === "precioVenta" && value > 0) {
      if (value < this.data.precioCosto) {
        cell.setValue(oldValue);
      }
    }

    if (column === "precioConIva" && value > 0) {
      if (value < this.data.precioCosto) {
        cell.setValue(oldValue);
      }
    }
    //Calculos
    switch (column) {
      case "precioVenta":
        precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, porcentajeIva)

        porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(precioVenta, this.data.precioCosto);

        break;

      case "precioConIva":
        precioVenta = pricingCalculateUtil.calculatePriceSale(precioConIva, porcentajeIva);
        porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(precioVenta, this.data.precioCosto);

        break;
      case "porcentajeUtilidad":
        precioVenta = pricingCalculateUtil.calculatePriceSaleOfValuePercentageUtility(this.data.precioCosto, porcentajeUtilidad)
        precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, porcentajeIva);
        break;
    }



    let utilidad = pricingCalculateUtil.getValueUtility(
      precioVenta,
      this.data.precioCosto,
    );
    console.log(utilidad)

    precioVenta = roundNumber(precioVenta, this.decimal.nroPrecio);
    precioConIva = roundNumber(precioConIva, this.decimal.nroPrecio);

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

  }


  private isValidForm() {
    const showWarning = (message: string) => {
      this.tS.toastr({
        type: 'warning',
        message
      });
    };

    const isFieldInvalid = (field: any, message: string) => {
      if (!isValidField(field)) {
        showWarning(message);
        return true;
      }
      return false;
    };

    const isIdInvalid = (id: any, message: string) => {
      if (!getValidId(id)) {
        showWarning(message);
        return true;
      }
      return false;
    };

    // Validaciones para agregar un artículo
    if (this.isAdd()) {
      if (isFieldInvalid(this.data.descripcion, "Ingrese la Descripción del Articulo")) return;
      if (isFieldInvalid(this.data.codigoBarra, "Ingrese el Código de Barra del Articulo")) return;
      if (isIdInvalid(this.data.idTipoArticulo, "Seleccione el Tipo Articulo")) return;
      if (isIdInvalid(this.data.idMedida, "Seleccione la Medida")) return;

      if (isFieldInvalid(this.data.precioCosto, "Ingrese el precio costo") || isNaN(this.data.precioCosto)) {
        showWarning("El precio costo tiene que ser un número");
        return;
      }

      if (this.data.datosAdicionales && isIdInvalid(this.data.idEtiqueta, "Seleccione la Etiqueta")) return;
    }

    // Validaciones comunes para agregar o actualizar un artículo
    if (this.isAdd() || this.isUpdate()) {
      if (isFieldInvalid(this.data.descripcion, "Ingrese la Descripción del Articulo")) return;
      if (isIdInvalid(this.data.idSubFamilia, "Seleccione la Sub Familia del Articulo")) return;
      if (isFieldInvalid(this.data.codigo, "Ingrese el Código del Articulo")) return;
      if (isIdInvalid(this.data.idTipoArticulo, "Seleccione el Tipo Articulo")) return;
      if (isIdInvalid(this.data.idMedida, "Seleccione la Medida")) return;

      if (this.data.caducidad && isFieldInvalid(this.data.fechaCaducidad, "Ingrese la fecha de Caducidad del Articulo")) return;

      if (this.data.datosLote) {
        if (isFieldInvalid(this.data.lote, "Ingrese el Lote")) return;
        if (isFieldInvalid(this.data.fechaCreacion, "Ingrese la fecha de Creación")) return;
        if (isFieldInvalid(this.data.fechaCaducidadLote, "Ingrese la fecha de Caducidad del Lote")) return;
      }
    }

    // Validaciones finales para el precio
    if (isNaN(this.data.precioCosto)) {
      showWarning("Ingrese el Precio de Costo del Articulo");
      return;
    }

    if (this.data.precioCosto < 0.01) {
      showWarning("El valor mínimo en el precio de costo es 0.01");
      return;
    }
    return true;
  }

  save() {

    if (!this.isValidForm()) return





  }



  closeModal() {
    this.activeModal.close();
  }
}

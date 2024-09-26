
import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TabulatorTableComponent } from '@core/components/tabulator-table/tabulator-table.component';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { TAX_RATE_CODE } from '@core/constants/global.constants';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SubCategoryModalDirective } from '@inventory/directives/sub-category.directive'
import { MeasureAddEditDirective } from '@modules/inventory/directives/measure-add-edit.directive';
import { TarifaSelectHtmlOnly } from '@modules/inventory/models/tarifa.model';
import { TipoIvaSelectHtmlOnly } from '@modules/inventory/models/tipo-iva.model';
import { ProductService } from '@modules/inventory/services/product.service';
import { NgbActiveModal, NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { SubCategoryGroupComponent } from '../../sub-category/sub-category-group/sub-category-group.component';
import { roundNumber } from '@core/utils/round-number.utils';
import Swal from 'sweetalert2';
import { TagsAddEditModalDirective } from '@modules/inventory/directives/tags-add-edit-modal.directive';
import { getValidId } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';

interface ProductTarifa {
  tipoIva: string
  tarifa: string
  precioVenta: number
  precioConIva: number
  porcentajeUtilidad: number
  porcentajeIva: number

}
@Component({
  selector: 'app-product-add-edit-modal',
  standalone: true,
  imports: [

    //Modules
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    ToUpperCaseDirective,
    AsyncPipe,

    //Components
    TabulatorComponent,
    TabulatorTableComponent,
    SubCategoryGroupComponent,

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

  private productSvc = inject(ProductService)
  private tS = inject(ToasterService)



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
    precioCosto: 0,
    precioSinSubsidio: 0,
    llevaInventario: false,
    datosAdicionales: false,
    productoFraccionable: false,
    fraccionable: false
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
      resizable: true
    },
    {
      title: "P. IVA",
      field: "precioConIva",
      headerSort: false,
      resizable: true

    },
    {
      title: "% Utilidad",
      field: "porcentajeUtilidad",
      headerSort: false,
      resizable: true

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
    height: null // Elimina la altura fija para que sea auto
  }

  productTarifa: ProductTarifa[] = []

  // constructor(private tabulatorTable: TabulatorTableComponent) { }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    console.log(changeEvent)
    if (changeEvent.nextId === 1) {
      //changeEvent.preventDefault();
      setTimeout(() => {
        // this.drawTable();
      })
    }
  }

  ngOnInit() {
    this.productSvc.getDataForm().subscribe({
      next: (response) => {
        const {
          categorias,
          decimal,
          estabs,
          etiquetas,
          marcas,
          medidas,
          modelos,
          subCategorias,
          tarifas,
          tiposArticulo,
          tiposIce,
          tiposIva,
        } = response;

        this.estabs.set(estabs)
        this.subCategories.set(subCategorias)
        this.subCategoriesGroup.set(response.subCategoriasGroup)
        this.tiposArticulo.set(tiposArticulo)
        this.medidas.set(medidas);
        this.tiposIva.set(tiposIva);
        this.tarifas = tarifas;
        this.etiquetas.set(etiquetas)

        if (!(this.params.idArticulo > 0)) {

          //default data
          if (this.tiposArticulo().length > 0) {
            this.data.idTipoArticulo = this.tiposArticulo()[0].idTipoArticulo;
          }

          if (this.medidas().length > 0) {
            this.data.idMedida = this.medidas()[0].idMedida;
          }

          if (this.tiposIva().length > 0) {
            let dataTipoIva = this.tiposIva().find((ti: any) => ti.codigoPorcentaje.toString() === TAX_RATE_CODE.FIVE_PERCENT)
            this.data.idTipoIva = dataTipoIva?.idTipoIva ?? 0;

          }
          console.log(this.data)

          this.setDataSubCategoria()
          this.setProductPvpAdd();

          //Registro de artículo desde Importación
          if (this.params && this.params.isImport) {
            this.setDataRecepcion()
          }
        }


        //editar
        if (this.params.idArticulo > 0) {



        }



      },
    })
  }

  selectTab(index: number) {
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

      this.productSvc.getDataForm().subscribe(response => {
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
      this.productSvc.getDataForm().subscribe(response => {
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

      this.productSvc.getDataForm().subscribe(response => {
        this.medidas.set(response.medidas);
        this.data.idMedida = this.medidas().at(this.medidas().length - 1).idMedida;
      })
    } catch (error) {
      console.log(error);
    }
  }

  refreshMedida() {
    try {
      this.productSvc.getDataForm().subscribe(response => {
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
      this.productSvc.getDataForm().subscribe(response => {
        this.etiquetas.set(response.etiquetas);
      })
    } catch (error) {
      console.log(error);
    }
  }


  recalculateTarifaAdd() {
    // if (!getValidId(this.data.precioCosto) || isNaN(this.data.precioCosto)) {
    //   this.tS.toastr({
    //     type: 'warning',
    //     message: "Ingrese un número válido"
    //   })
    //   return;
    // }
    // if (this.data.precioCosto === 0) {
    //   this.tS.toastr({
    //     type: 'warning',
    //     message: "El valor mínimo en el precio de costo es 0.01"
    //   })
    //   return;
    // }

    // let dataTipoIva =this.tiposIva().find( (item) => item.idTipoIva ===this.data.idTipoIva );
    // if(!dataTipoIva){
    //   this.tS.toastr({
    //     type: 'warning',
    //     message: "No se pudo recuperar la data de tipo iva"
    //   })
    //   return
    // }
    // try {
    //   let index = 0;
    //   for (let item of this.productTarifa) {
    //     item.porcentajeIva = dataTipoIva.porcentaje;

    //     let precioVenta = pricingCalculateUtil.calculatePriceSale(item.precioConIva, item.porcentajeIva);
    //     let precioConIva = pricingCalculateUtil.calculatePriceWithVat(item.precioVenta, item.porcentajeIva) ;

    //     let porcentajeUtilidad = pricingCalculateUtil.calculatePriceSaleOfValuePercentageUtility .campoPorcentajeUtilidad(
    //       $scope.data.precioCosto,
    //       precioVenta
    //     );

    //     item.precioVenta = roundNumber( precioVenta, this.decimal.nroPrecio );


    //     item.precioConIva = fS.roundNumber(
    //       precioConIva,
    //       $scope.decimal.nroPrecio
    //     );


    //     item.porcentajeUtilidad = fS.roundNumber(
    //       porcentajeUtilidad,
    //       pricingUtils.precisionMaxima
    //     );

    //     let ganancia = getTarifaGanacia(
    //       val.precioVenta,
    //       $scope.data.precioCosto
    //     );
    //     item.ganancia = fS.roundNumber(ganancia, 5);
    //     index++;
    //   }
    // } catch (error) {
    //   toastr.error(error);
    // }
  }


  onChangeTipoIva() {
    // if ($scope.tipoRegistro === 2 && !$scope.articlePermission.isUpdatePrice) {
    //   tS.toastr("warning", "No tienes permiso para realizar esta acción");
    //   return;
    // }

    // if (
    //   [null, undefined, "", 0].includes($scope.data.precioCosto) ||
    //   isNaN($scope.data.precioCosto)
    // )
    //   return;

    // $scope.data.precioCosto = fS.roundNumber(
    //   $scope.data.precioCosto,
    //   $scope.decimal.nroPrecio
    // );

    // recalculateTarifaRegister();


  }

  closeModal() {
    this.activeModal.close();
  }
}

import {Component, inject, signal, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { SubCategoryModalDirective } from '@inventory/ui/directives/sub-category.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoIvaSelectHtmlOnly } from '@inventory/domain/models/tipo-iva.model';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { ToasterService } from '@core/services/toaster.service';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { ProductUseCase } from '@modules/inventory/domain/usecases/product.use-case';
import { UserRoleStateService } from '@shared/store/user-role-state.service';
import {GroupedEstab, GroupedEstabBodega} from '@core/models/estab.model';
import { TarifaSelectHtmlOnly } from '@inventory/domain/models/tarifa.model';
import { TAX_RATE_CODE } from '@core/constants/global.constants';
import Swal from 'sweetalert2';
import { getValidId, isValidField } from '@core/utils/utils';
import { MeasureAddEditDirective } from '@inventory/ui/directives/measure-add-edit.directive';
import { TagsAddEditModalDirective } from '@inventory/ui/directives/tags-add-edit-modal.directive';
import {ToUpperCaseDirective} from "@shared/directives/ui/to-upper-case.directive";
import {BrandAddEditDirective} from "@inventory/ui/directives/brand-add-edit.directive";
import {ModelAddEditDirective} from "@inventory/ui/directives/model-add-edit.directive";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
interface ProductTarifa {
  tipoIva: string;
  tarifa: string;
  precioVenta: number;
  precioConIva: number;
  porcentajeUtilidad: number;
  porcentajeIva: number;
  utilidad: number;
}
@Component({
  selector: 'app-add-edit-product-dialog',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    FormsModule,

    //Components
    TabulatorComponent,
    MatCustomDialogComponent,

    //Directives
    SubCategoryModalDirective,
    ReactiveFormsModule,
    MeasureAddEditDirective,
    TagsAddEditModalDirective,
    BrandAddEditDirective,
    ToUpperCaseDirective,
    ModelAddEditDirective
  ],
  templateUrl: './add-edit-product-dialog.component.html',
  styles: ``,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditProductDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddEditProductDialogComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);

  private tS = inject(ToasterService);
  private _productUseCase = inject(ProductUseCase);
  private userRoleStateSvc = inject(UserRoleStateService);

  title = 'Nuevo Artículo'

  subCategories = signal<any[]>([]);
  subCategoriesGroup = signal<any[]>([]);
  medidas = signal<any[]>([]);
  tiposArticulo = signal<any[]>([]);

  tiposIva = signal<TipoIvaSelectHtmlOnly[]>([]);
  estabs = signal<GroupedEstab[]>([]);
  bodegas: GroupedEstabBodega[] = []

  etiquetas = signal<any[]>([]);
  tarifas: TarifaSelectHtmlOnly[] = [];

  marcas:any[] = [];
  modelos:any[] = [];
  tiposIce:any[] = [];

  decimal = {
    nroPrecio: 6,
  };

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
    idMarca: 0,
    idModelo: 0,
    idTipoArticulo: 0,
    idTipoIva: 0,
    idTipoIce: 0,
    precioCosto: 0.1,
    precioSinSubsidio: 0,
    llevaInventario: false,
    datosAdicionales: false,
    productoFraccionable: false,
    fraccionable: false,

    stockMinimo: 0,
    stockMaximo: 0,
    cantMinimaVentaPorMayor: 0,
    observaciones: null,

    caducidad: false,
    fechaCaducidad: null,

    datosLote: false,
    lote: null,
    fechaCreacion: null,
    fechaCaducidadLote: null,
  };

  dataUbicacion = {
    idEstablecimiento: 0,
    idBodega: 0,
    ubicacion: null
  }
  columnNames = [
    {
      title: 'Tarifa',
      field: 'tarifa',
      headerSort: false,
      resizable: true,
    },
    {
      title: 'Tipo Iva',
      field: 'tipoIva',
      headerSort: false,
      resizable: true,
    },
    {
      title: 'P. Venta',
      field: 'precioVenta',
      headerSort: false,
      resizable: true,
      editor: 'input',
      validator: ['required', 'min:0', 'numeric'],
    },
    {
      title: 'P. IVA',
      field: 'precioConIva',
      headerSort: false,
      resizable: true,
      editor: true,
      validator: ['required', 'min:0', 'numeric'],
    },
    {
      title: '% Utilidad',
      field: 'porcentajeUtilidad',
      headerSort: false,
      resizable: true,
      editor: true,
      validator: ['required', 'min:0', 'numeric'],
    },
    {
      title: 'Utilidad',
      field: 'utilidad',
      headerSort: false,
      resizable: true,
    },
    {
      title: 'Estado',
      field: 'estado',
      headerSort: false,
      resizable: true,
    },
  ];

  tabulatorOptions = {
    columns: this.columnNames,
    layout: 'fitColumns',
    resizableColumnFit: true,
    reactiveData: true,
    height: null, // Elimina la altura fija para que sea auto
  };

  productTarifa: ProductTarifa[] = [];
  isChangePrecio = false;

  selectedTab = signal(0);
  private timeoutIdNav: any; // Para almacenar el ID del setTimeout

  isUpdate() {
    return this.params.idArticulo > 0;
  }

  isAdd() {
    return !(this.params.idArticulo > 0);
  }
  ngOnInit() {
    this.userRoleStateSvc.select('permission').subscribe((p) => {
      this.isChangePrecio = p?.product?.precio;
    });

    this._productUseCase.getDataForm().subscribe({
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

        this.estabs.set(estabs);
        this.subCategories.set(subCategorias);
        this.subCategoriesGroup.set(response.subCategoriasGroup);
        this.tiposArticulo.set(tiposArticulo);
        this.medidas.set(medidas);
        this.tiposIva.set(tiposIva);
        this.tarifas = tarifas;
        this.etiquetas.set(etiquetas);
        this.marcas = marcas;
        this.modelos = modelos;
        this.tiposIce = tiposIce;


        if (this.estabs().length > 0) {
          let dataEstab = this.estabs().find(
            (estab) => estab.defaultEstab
          );
          if(dataEstab){
          this.bodegas = dataEstab.bodegas;
          this.dataUbicacion.idEstablecimiento = dataEstab.idEstablecimiento;

          }
          if (this.bodegas.length > 0) {
            let dataBodega = this.bodegas.find(
              (bodega) => bodega.defaultBodega
            );
            if(dataBodega){
            this.dataUbicacion.idBodega = dataBodega.idBodega;

            }
          }
        }

        if (!(this.params.idArticulo > 0)) {
          //default data
          if (this.tiposArticulo().length > 0) {
            this.data.idTipoArticulo = this.tiposArticulo()[0].idTipoArticulo;
          }

          if (this.medidas().length > 0) {
            this.data.idMedida = this.medidas()[0].idMedida;
          }

          if (this.tiposIva().length > 0) {
            const dataTipoIva = this.tiposIva().find(
              (ti: any) =>
                ti.codigoPorcentaje.toString() === TAX_RATE_CODE.FIVE_PERCENT
            );
            this.data.idTipoIva = dataTipoIva?.idTipoIva ?? 0;
          }
          console.log(this.data);

          this.setDataSubCategoria();
          this.setProductPvpAdd();

          //Registro de artículo desde Importación
          if (this.params && this.params.isImport) {
            this.setDataRecepcion();
          }
        }

        //editar
        if (this.params.idArticulo > 0) {
        }
      },
    });
  }

  selectOnChangeTab(index: number) {
    if (this.timeoutIdNav) {
      clearTimeout(this.timeoutIdNav);
    }
    this.tabulatorOptions.reactiveData = false;

    if (index === 0) {
      this.timeoutIdNav = setTimeout(() => {
        this.tabulatorOptions.reactiveData = true;
      }, 100);
    }
    this.selectedTab.set(index);
  }

  setDataSubCategoria() {
    if (
      this.subCategoriesGroup().length === 0 ||
      (this.params && this.params.isImport)
    )
      return;

    const { codigo, idSubFamilia } = this.subCategories()[0];

    this.data.idSubFamilia = idSubFamilia;
    this.setCodigo(codigo);
  }

  setCodigo(codigo: string) {
    this.data.codigo = codigo;
    this.data.codigoAuxiliar = 'AUX-' + codigo;
    this.data.codigoBarra = codigo;
  }

  setDataRecepcion() {
    this.data.codigo = this.params.codigo;
    this.data.codigoAuxiliar = this.params.codigoAuxiliar;
    this.data.codigoBarra = this.params.codigo;
    this.data.descripcion = this.params.descripcion;
    this.data.precioCosto = roundNumber(
      this.params.precioCosto,
      this.decimal.nroPrecio
    );
    if (this.data.codigoAuxiliar) {
      this.data.codigoAuxiliar = this.params.codigoAuxiliar;
    } else {
      this.data.codigoAuxiliar = this.params.codigo;
    }
  }

  setProductPvpAdd() {
    const dataTipoIva = this.tiposIva().find(
      (ti: any) =>
        ti.codigoPorcentaje.toString() === TAX_RATE_CODE.FIFTEEN_PERCENT
    );
    const dataTemp: any = [];
    if (dataTipoIva) {
      this.data.idTipoIva = dataTipoIva.idTipoIva;
      for (const tarifa of this.tarifas) {
        dataTemp.push({
          tipoIva: dataTipoIva.descripcion,
          tarifa: tarifa.descripcion,
          porcentajeIva: dataTipoIva.porcentaje,
          precioVenta: 0,
          precioConIva: 0,
          porcentajeUtilidad: 0,
          utilidad: 0,
          estado: tarifa.predeterminada ? 'Predeterminada' : '',
        });
      }
    }
    this.productTarifa = dataTemp;
  }

  onChangeSubCategoria() {
    if (
      this.data.idArticulo > 0 ||
      (this.params.isImport &&
        this.data.codigo &&
        this.data.codigoAuxiliar &&
        this.data.codigoBarra)
    ) {
      Swal.fire({
        //title: "Are you sure?",
        html: '¿Está de acuerdo en reemplazar automáticamente el <b>Código</b>, <b>Código Auxiliar</b> y <b>Código de Barra</b> con los datos generados por el sistema?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.subCategories().length > 0) {
            const { codigo } = this.subCategories().find(
              (val) => val.idSubFamilia === this.data.idSubFamilia
            );
            this.setCodigo(codigo);
          }
        }
      });
      return;
    }

    if (!(this.data.idArticulo > 0) && this.subCategories().length > 0) {
      const { codigo } = this.subCategories().find(
        (val) => val.idSubFamilia === this.data.idSubFamilia
      );
      this.setCodigo(codigo);
    }
  }

  resultModalSubFamilia(result: any) {
    try {
      if (result && typeof result !== 'object') return;

      this._productUseCase.getDataForm().subscribe((response) => {
        this.subCategories.set(response.subCategorias);
        this.subCategoriesGroup.set(response.subCategoriasGroup);

        const { idSubFamilia } = this.subCategories().at(
          this.subCategories.length - 1
        );
        this.data.idSubFamilia = idSubFamilia;

        this.onChangeSubCategoria();
      });
    } catch (error) {
      console.log(error);
    }
  }

  refreshSubFamilia($event: MouseEvent) {
    try {
      $event.stopPropagation();
      this._productUseCase.getDataForm().subscribe((response) => {
        this.subCategories.set(response.subCategorias);
        this.subCategoriesGroup.set(response.subCategoriasGroup);
      });
    } catch (error) {
      console.log(error);
    }
  }

  resultModalMedida(result: any) {
    try {
      if (result && typeof result !== 'object') return;

      this._productUseCase.getDataForm().subscribe((response) => {
        this.medidas.set(response.medidas);
        this.data.idMedida = this.medidas().at(
          this.medidas().length - 1
        ).idMedida;
      });
    } catch (error) {
      console.log(error);
    }
  }

  refreshMedida($event: MouseEvent) {
    try {
      $event.stopPropagation();
      this._productUseCase.getDataForm().subscribe((response) => {
        this.medidas.set(response.medidas);
      });
    } catch (error) {
      console.log(error);
    }
  }

  resultModalTag(result: any) {
    try {
      if (result && typeof result !== 'object') return;

      this.refreshTag();
    } catch (error) {
      console.log(error);
    }
  }

  refreshTag() {
    try {
      this._productUseCase.getDataForm().subscribe((response) => {
        this.etiquetas.set(response.etiquetas);
      });
    } catch (error) {
      console.log(error);
    }
  }


  resultBrand($event: MouseEvent){
    $event.stopPropagation()
    try {
      this._productUseCase.getDataForm().subscribe((response) => {
        this.marcas = response.marcas;
      });
    } catch (error) {
      console.log(error);
    }
  }

  resultModel($event:MouseEvent){
    $event.stopPropagation()
    try {
      this._productUseCase.getDataForm().subscribe((response) => {
        this.modelos = response.modelos;
      });
    } catch (error) {
      console.log(error);
    }
  }


  private validateCalculateTarifa() {
    if (this.isUpdate() && !this.isChangePrecio) {
      this.tS.toastr({
        type: 'warning',
        message: 'No tienes permiso para realizar esta acción',
      });
      return;
    }
    if (!(this.data.precioCosto > 0) || isNaN(this.data.precioCosto)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese un número válido',
      });
      return;
    }

    if (this.data.precioCosto === 0) {
      this.tS.toastr({
        type: 'warning',
        message: 'El valor mínimo en el precio de costo es 0.01',
      });
      return;
    }

    this.data.precioCosto = roundNumber(
      this.data.precioCosto,
      this.decimal.nroPrecio
    );
    return true;
  }

  onChangeTipoIva() {
    if (!this.validateCalculateTarifa()) return;

    this.recalculateTarifaAdd();
  }

  private recalculateTarifaAdd() {
    const dataTipoIva = this.tiposIva().find(
      (item) => item.idTipoIva === this.data.idTipoIva
    );
    if (!dataTipoIva) {
      this.tS.toastr({
        type: 'warning',
        message: 'No se pudo recuperar la data de tipo iva',
      });
      return;
    }
    try {
      for (const item of this.productTarifa) {
        item.tipoIva = dataTipoIva.descripcion;
        item.porcentajeIva = dataTipoIva.porcentaje;

        const precioVenta = pricingCalculateUtil.calculatePriceSale(
          item.precioConIva,
          item.porcentajeIva
        );
        const precioConIva = pricingCalculateUtil.calculatePriceWithVat(
          precioVenta,
          item.porcentajeIva
        );

        const porcentajeUtilidad =
          pricingCalculateUtil.calculateProfitMarginPercentage(
            precioVenta,
            this.data.precioCosto
          );
        const utilidad = pricingCalculateUtil.getValueUtility(
          precioVenta,
          this.data.precioCosto
        );

        item.precioVenta = roundNumber(precioVenta, this.decimal.nroPrecio);

        item.precioConIva = roundNumber(precioConIva, this.decimal.nroPrecio);

        item.porcentajeUtilidad = porcentajeUtilidad;
        item.utilidad = utilidad;
      }
    } catch (error) {
      this.tS.toastr({
        type: 'warning',
        message: error as string,
      });
    }
  }

  onChangePrecioCosto() {
    if (!this.validateCalculateTarifa()) return;
    this.recalculateTarifaAdd();
  }

  cellEdited(cell: any) {
    const row = cell.getRow();
    const column = cell.getColumn().getField();
    const oldValue = parseFloat(cell.getOldValue());
    const value = parseFloat(cell.getValue());

    const data = cell.getData();
    let precioVenta = parseFloat(data.precioVenta);
    const porcentajeIva = parseFloat(data.porcentajeIva);
    let precioConIva = parseFloat(data.precioConIva);
    let porcentajeUtilidad = parseFloat(data.porcentajeUtilidad);

    console.log(row);
    console.log(column);
    console.log(oldValue);
    console.log(value);
    if (oldValue === value) {
      return;
    }

    //Validacion de Campos
    if (
      [null, undefined, '', 0].includes(this.data.precioCosto) ||
      isNaN(this.data.precioCosto)
    ) {
      cell.setValue(oldValue);
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese el Precio de Costo',
      });
      return;
    }

    if (column === 'precioVenta' && value > 0) {
      if (value < this.data.precioCosto) {
        cell.setValue(oldValue);
      }
    }

    if (column === 'precioConIva' && value > 0) {
      if (value < this.data.precioCosto) {
        cell.setValue(oldValue);
      }
    }
    //Calculos
    switch (column) {
      case 'precioVenta':
        precioConIva = pricingCalculateUtil.calculatePriceWithVat(
          precioVenta,
          porcentajeIva
        );

        porcentajeUtilidad =
          pricingCalculateUtil.calculateProfitMarginPercentage(
            precioVenta,
            this.data.precioCosto
          );

        break;

      case 'precioConIva':
        precioVenta = pricingCalculateUtil.calculatePriceSale(
          precioConIva,
          porcentajeIva
        );
        porcentajeUtilidad =
          pricingCalculateUtil.calculateProfitMarginPercentage(
            precioVenta,
            this.data.precioCosto
          );

        break;
      case 'porcentajeUtilidad':
        precioVenta =
          pricingCalculateUtil.calculatePriceSaleOfValuePercentageUtility(
            this.data.precioCosto,
            porcentajeUtilidad
          );
        precioConIva = pricingCalculateUtil.calculatePriceWithVat(
          precioVenta,
          porcentajeIva
        );
        break;
    }

    const utilidad = pricingCalculateUtil.getValueUtility(
      precioVenta,
      this.data.precioCosto
    );
    console.log(utilidad);

    precioVenta = roundNumber(precioVenta, this.decimal.nroPrecio);
    precioConIva = roundNumber(precioConIva, this.decimal.nroPrecio);

    const obj = {
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
        message,
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
      if (
        isFieldInvalid(
          this.data.descripcion,
          'Ingrese la Descripción del Articulo'
        )
      )
        return;
      if (
        isFieldInvalid(
          this.data.codigoBarra,
          'Ingrese el Código de Barra del Articulo'
        )
      )
        return;
      if (isIdInvalid(this.data.idTipoArticulo, 'Seleccione el Tipo Articulo'))
        return;
      if (isIdInvalid(this.data.idMedida, 'Seleccione la Medida')) return;

      if (
        isFieldInvalid(this.data.precioCosto, 'Ingrese el precio costo') ||
        isNaN(this.data.precioCosto)
      ) {
        showWarning('El precio costo tiene que ser un número');
        return;
      }

      if (
        this.data.datosAdicionales &&
        isIdInvalid(this.data.idEtiqueta, 'Seleccione la Etiqueta')
      )
        return;
    }

    // Validaciones comunes para agregar o actualizar un artículo
    if (this.isAdd() || this.isUpdate()) {
      if (
        isFieldInvalid(
          this.data.descripcion,
          'Ingrese la Descripción del Articulo'
        )
      )
        return;
      if (
        isIdInvalid(
          this.data.idSubFamilia,
          'Seleccione la Sub Familia del Articulo'
        )
      )
        return;
      if (isFieldInvalid(this.data.codigo, 'Ingrese el Código del Articulo'))
        return;
      if (isIdInvalid(this.data.idTipoArticulo, 'Seleccione el Tipo Articulo'))
        return;
      if (isIdInvalid(this.data.idMedida, 'Seleccione la Medida')) return;

      if (
        this.data.caducidad &&
        isFieldInvalid(
          this.data.fechaCaducidad,
          'Ingrese la fecha de Caducidad del Articulo'
        )
      )
        return;

      if (this.data.datosLote) {
        if (isFieldInvalid(this.data.lote, 'Ingrese el Lote')) return;
        if (
          isFieldInvalid(
            this.data.fechaCreacion,
            'Ingrese la fecha de Creación'
          )
        )
          return;
        if (
          isFieldInvalid(
            this.data.fechaCaducidadLote,
            'Ingrese la fecha de Caducidad del Lote'
          )
        )
          return;
      }
    }

    // Validaciones finales para el precio
    if (isNaN(this.data.precioCosto)) {
      showWarning('Ingrese el Precio de Costo del Articulo');
      return;
    }

    if (this.data.precioCosto < 0.01) {
      showWarning('El valor mínimo en el precio de costo es 0.01');
      return;
    }
    return true;
  }

  save() {
    if (!this.isValidForm()) return;
  }


  //=============================================ARTICULO UBICACION=========================
   articuloUbicaciones = [];
   private getUbicacionArticulo() {
    if (!this.params) return;

    // articuloSvc.findById(params.idArticulo).then((response) => {
    //   const { articuloUbicaciones } = response;
    //   $scope.articuloUbicaciones = articuloUbicaciones;
    // })
    //   .catch((error) => {
    //     console.error(error);
    //   }).finally(() => hideLoader())
  }

   onChangeEstab   () {
    let dataEstab = this.estabs().find(estab => estab.idEstablecimiento === this.dataUbicacion.idEstablecimiento);
    if(dataEstab){

    this.bodegas = dataEstab.bodegas;
    let dataBodega = this.bodegas.find(b=>b.defaultBodega);
    if(dataBodega){
    this.dataUbicacion.idBodega = dataBodega.idBodega;
    }
    }
  }

  //  saveUbicacion = function () {
  //   if (!($scope.dataUbicacion.idBodega > 0)) {
  //     tS.toastr('warning', "Seleccione la Bodega");
  //     return;
  //   }
  //   if (!($scope.dataUbicacion.ubicacion)) {
  //     tS.toastr('warning', "Ingrese la Descripción");
  //     return;
  //   }
  //
  //   $scope.dataUbicacion.idArticulo = params.idArticulo;
  //
  //   if ($scope.dataUbicacion.idArticuloUbicacion > 0) {
  //     showLoader();
  //     articuloUbicacionSvc.update($scope.dataUbicacion.idArticuloUbicacion, $scope.dataUbicacion)
  //       .then((response) => {
  //         if (response.code == "0") {
  //           tS.toastr('warning', response.message)
  //         }
  //         if (response.code == "1") {
  //           tS.toastr('success', response.message)
  //           getUbicacionArticulo();
  //           $scope.dataUbicacion = {};
  //         }
  //       }).finally(() => hideLoader())
  //   }
  //
  //   if ((!$scope.dataUbicacion.idArticuloUbicacion > 0)) {
  //     showLoader();
  //     articuloUbicacionSvc.save($scope.dataUbicacion)
  //       .then((response) => {
  //         if (response.code == "0") {
  //           tS.toastr('warning', response.message)
  //           return;
  //         }
  //         if (response.code == "1") {
  //           tS.toastr('success', response.message)
  //           getUbicacionArticulo();
  //           $scope.dataUbicacion = {};
  //         }
  //       }).finally(() => hideLoader())
  //   }
  // }
  //
  // $scope.editarUbicacion = function (item) {
  //   let dataBodega = $scope.bodegas.find(bodega => bodega.idBodega === item.idBodega);
  //   $scope.dataUbicacion = Object.assign({}, item);
  //   if (dataBodega) {
  //     let dataEstab = $scope.establecimientos.find(estab => estab.idEstablecimiento === dataBodega.idEstablecimiento);
  //     $scope.dataUbicacion.idEstablecimiento = dataEstab.idEstablecimiento;
  //   }
  // }
  //
  // $scope.resetDataUbicacion = function () {
  //   $scope.dataUbicacion = {};
  // }
  //
  // $scope.askToDeleteUbicacion = async function (item) {
  //   const { isConfirmed } = await Swal.fire({
  //     icon: "warning",
  //     html: `<small>Esta seguro/a de eliminar este Ubicación del Articulo ahora?</small>`,
  //     showConfirmButton: true,
  //     confirmButtonText: "Si, eliminar",
  //     showCancelButton: true,
  //     cancelButtonText: "No, cancelar",
  //     allowOutsideClick: false,
  //   });
  //
  //   if (isConfirmed) {
  //     showLoader();
  //     articuloUbicacionSvc.delete(item.idArticuloUbicacion)
  //       .then((response) => {
  //         if (response.code == "0") {
  //           tS.toastr('warning', response.message)
  //         }
  //         if (response.code == "1") {
  //           tS.toastr('success', response.message)
  //           getUbicacionArticulo();
  //           $scope.dataUbicacion = {};
  //         }
  //       }).finally(() => hideLoader())
  //   }
  // }
  //====================================UBICACION END==========================




  close() {
    this.dialogRef.close();
  }
}

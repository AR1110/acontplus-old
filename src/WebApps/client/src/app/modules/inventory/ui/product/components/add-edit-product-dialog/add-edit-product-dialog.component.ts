import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { TabulatorTable } from '@acontplus/ng-components';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { UserRoleStateService } from '@shared/store/user-role-state.service';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { TarifaSelectHtmlOnly } from '@inventory/domain/models/tarifa.model';
import { TAX_RATE_CODE } from '@core/constants/global.constants';
import Swal from 'sweetalert2';
import { getValidId, imgDefault, isValidField } from '@core/utils/utils';
import { MeasureAddEditDirective } from '@inventory/ui/directives/measure-add-edit.directive';
import { TagsAddEditModalDirective } from '@inventory/ui/directives/tags-add-edit-modal.directive';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { BrandAddEditDirective } from '@inventory/ui/directives/brand-add-edit.directive';
import { ModelAddEditDirective } from '@inventory/ui/directives/model-add-edit.directive';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { forkJoin } from 'rxjs';
import { ProductUbicationComponent } from '@inventory/ui/product/components/product-ubication/product-ubication.component';
import { Button } from '@acontplus/ng-components';
import { ProductBarcodeComponent } from '@inventory/ui/product/components/product-barcode/product-barcode.component';
import { FraccProductListComponent } from '@inventory/ui/fractional-product/components/fracc-product-list/fracc-product-list.component';
import { UploadImageComponent } from '@shared/components/upload-image/upload-image.component';
import { PRODUCT_SERVICE, PRODUCT_PHOTO_SERVICE } from '@inventory/tokens/inventory-token';
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
    TabulatorTable,
    MatCustomDialogComponent,
    ProductUbicationComponent,
    Button,
    ProductBarcodeComponent,
    FraccProductListComponent,
    UploadImageComponent,
    //Directives
    SubCategoryModalDirective,
    ReactiveFormsModule,
    MeasureAddEditDirective,
    TagsAddEditModalDirective,
    BrandAddEditDirective,
    ToUpperCaseDirective,
    ModelAddEditDirective,
  ],
  templateUrl: './add-edit-product-dialog.component.html',
  styles: ``,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditProductDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddEditProductDialogComponent>);
  readonly params = inject<{
    id: number;
    isImport?: number;
    codigo?: string;
    codigoAuxiliar?: string;
    descripcion?: string;
    precioCosto?: number;
  }>(MAT_DIALOG_DATA);

  private tS = inject(ToastrNotificationService);
  private $productService = inject(PRODUCT_SERVICE);
  private $productPhotoService = inject(PRODUCT_PHOTO_SERVICE);

  private userRoleStateSvc = inject(UserRoleStateService);

  title = 'Nuevo Artículo';
  btnText = 'Guardar';

  subCategories = signal<any[]>([]);
  subCategoriesGroup = signal<any[]>([]);
  medidas = signal<any[]>([]);
  tiposArticulo = signal<any[]>([]);

  tiposIva = signal<TipoIvaSelectHtmlOnly[]>([]);
  estabs = signal<GroupedEstab[]>([]);
  bodegas: GroupedEstabBodega[] = [];

  etiquetas = signal<any[]>([]);
  tarifas: TarifaSelectHtmlOnly[] = [];

  marcas: any[] = [];
  modelos: any[] = [];
  tiposIce: any[] = [];

  productBarcodes = [] as any[];

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
    precioCostoConIva: 0,
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
    estado: true,
    productPhotoId: 0,
  };

  private dataClone = {
    idSubFamilia: 0,
  };
  showStatus = false;

  dataUbicacion = {
    idEstablecimiento: 0,
    idBodega: 0,
    ubicacion: null,
  };

  selectedFile = signal<any>('');
  imageUrl = signal(imgDefault());

  columnNames = [
    {
      title: 'Tarifa',
      field: 'nomTarifa',
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
      field: 'nomEstado',
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
    return this.params.id > 0;
  }

  isAdd() {
    return !(this.params.id > 0);
  }

  private onLoadForm() {
    const requests: any = [this.$productService.getDataForm()];

    if (this.isUpdate()) {
      requests.push(this.$productService.getId(this.params.id));
    }
    return forkJoin(requests);
  }

  private loadDataAdd() {
    //default infrastructure
    if (this.tiposArticulo().length > 0) {
      this.data.idTipoArticulo = this.tiposArticulo()[0].idTipoArticulo;
    }

    if (this.medidas().length > 0) {
      this.data.idMedida = this.medidas()[0].idMedida;
    }

    if (this.tiposIva().length > 0) {
      const dataTipoIva = this.tiposIva().find(
        (ti: any) => ti.codigoPorcentaje.toString() === TAX_RATE_CODE.FIVE_PERCENT,
      );
      this.data.idTipoIva = dataTipoIva?.idTipoIva ?? 0;
    }
    console.log(this.data);

    this.setDataSubCategoria();
    this.setProductPvpAdd();

    //Registro de artículo desde Importación
    if (this.params?.isImport) {
      this.setDataRecepcion();
    }
  }

  private loadDataForm() {
    this.userRoleStateSvc.select('permission').subscribe((p) => {
      this.isChangePrecio = p?.product?.precio;
    });

    this.onLoadForm().subscribe((response) => {
      const [dataForm, dataId] = response as any;
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
      } = dataForm;

      this.estabs.set(estabs);
      this.subCategories.set(subCategorias);
      this.subCategoriesGroup.set(dataForm.subCategoriasGroup);
      this.tiposArticulo.set(tiposArticulo);
      this.medidas.set(medidas);
      this.tiposIva.set(tiposIva);
      this.tarifas = tarifas;
      this.etiquetas.set(etiquetas);
      this.marcas = marcas;
      this.modelos = modelos;
      this.tiposIce = tiposIce;

      if (this.estabs().length > 0) {
        const dataEstab = this.estabs().find((estab) => estab.defaultEstab);
        if (dataEstab) {
          this.bodegas = dataEstab.bodegas;
          this.dataUbicacion.idEstablecimiento = dataEstab.idEstablecimiento;
        }
        if (this.bodegas.length > 0) {
          const dataBodega = this.bodegas.find((bodega) => bodega.defaultBodega);
          if (dataBodega) {
            this.dataUbicacion.idBodega = dataBodega.idBodega;
          }
        }
      }

      if (this.isAdd()) {
        this.loadDataAdd();
      }

      //editar
      if (this.isUpdate()) {
        const { data, productPvps } = dataId;
        this.btnText = 'Actualizar';
        this.title = 'Editar Artículo';

        this.data = data;

        this.productTarifa = productPvps;

        this.dataClone.idSubFamilia = this.data.idSubFamilia;
        this.showStatus = this.data.estado;

        if (data.imgUrl) {
          this.imageUrl.set(data.imageUrl);
        }
      }
    });
  }

  ngOnInit() {
    this.loadDataForm();
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
    if (this.subCategoriesGroup().length === 0 || this.params?.isImport) return;

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
    this.data.codigo = this.params.codigo || '';
    this.data.codigoAuxiliar = this.params.codigoAuxiliar || '';
    this.data.codigoBarra = this.params.codigo || '';
    this.data.descripcion = this.params.descripcion || '';
    this.data.precioCosto = roundNumber(this.params.precioCosto || 0.1, this.decimal.nroPrecio);
    if (this.data.codigoAuxiliar) {
      this.data.codigoAuxiliar = this.params.codigoAuxiliar || '';
    } else {
      this.data.codigoAuxiliar = this.params.codigo || '';
    }
  }

  setProductPvpAdd() {
    const dataTipoIva = this.tiposIva().find(
      (ti: any) => ti.codigoPorcentaje.toString() === TAX_RATE_CODE.FIFTEEN_PERCENT,
    );
    const dataTemp: any = [];
    if (dataTipoIva) {
      this.data.idTipoIva = dataTipoIva.idTipoIva;
      for (const tarifa of this.tarifas) {
        dataTemp.push({
          tipoIva: dataTipoIva.descripcion,
          idTarifa: tarifa.idTarifa,
          nomTarifa: tarifa.descripcion,
          porcentajeIva: dataTipoIva.porcentaje,
          precioVenta: 0,
          precioConIva: 0,
          porcentajeUtilidad: 0,
          utilidad: 0,
          nomEstado: tarifa.predeterminada ? 'Predeterminada' : '',
          precioPredeterminado: tarifa.predeterminada,
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
              (val) => val.idSubFamilia === this.data.idSubFamilia,
            );
            this.setCodigo(codigo);
          }
        }
      });
      return;
    }

    if (!(this.data.idArticulo > 0) && this.subCategories().length > 0) {
      const { codigo } = this.subCategories().find(
        (val) => val.idSubFamilia === this.data.idSubFamilia,
      );
      this.setCodigo(codigo);
    }
  }

  resultModalSubFamilia(result: unknown) {
    try {
      if (result && typeof result !== 'object') return;

      this.$productService.getDataForm().subscribe((response) => {
        this.subCategories.set(response.subCategorias);
        this.subCategoriesGroup.set(response.subCategoriasGroup);

        const { idSubFamilia } = this.subCategories().at(this.subCategories.length - 1);
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
      this.$productService.getDataForm().subscribe((response) => {
        this.subCategories.set(response.subCategorias);
        this.subCategoriesGroup.set(response.subCategoriasGroup);
      });
    } catch (error) {
      console.log(error);
    }
  }

  resultModalMedida(result: unknown) {
    try {
      if (result && typeof result !== 'object') return;

      this.$productService.getDataForm().subscribe((response) => {
        this.medidas.set(response.medidas);
        this.data.idMedida = this.medidas().at(this.medidas().length - 1).idMedida;
      });
    } catch (error) {
      console.log(error);
    }
  }

  refreshMedida($event: MouseEvent) {
    try {
      $event.stopPropagation();
      this.$productService.getDataForm().subscribe((response) => {
        this.medidas.set(response.medidas);
      });
    } catch (error) {
      console.log(error);
    }
  }

  resultModalTag(result: unknown) {
    try {
      if (result && typeof result !== 'object') return;

      this.refreshTag();
    } catch (error) {
      console.log(error);
    }
  }

  refreshTag($event?: MouseEvent) {
    try {
      if ($event) {
        $event.stopPropagation();
      }
      this.$productService.getDataForm().subscribe((response) => {
        this.etiquetas.set(response.etiquetas);
      });
    } catch (error) {
      console.log(error);
    }
  }

  resultBrand($event: MouseEvent) {
    $event.stopPropagation();
    try {
      this.$productService.getDataForm().subscribe((response) => {
        this.marcas = response.marcas;
      });
    } catch (error) {
      console.log(error);
    }
  }

  resultModel($event: MouseEvent) {
    $event.stopPropagation();
    try {
      this.$productService.getDataForm().subscribe((response) => {
        this.modelos = response.modelos;
      });
    } catch (error) {
      console.log(error);
    }
  }

  private validateCalculateTarifa() {
    if (this.isUpdate() && !this.isChangePrecio) {
      this.tS.show({
        type: 'warning',
        message: 'No tienes permiso para realizar esta acción',
      });
      return;
    }
    if (!(this.data.precioCosto > 0) || isNaN(this.data.precioCosto)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese un número válido',
      });
      return;
    }

    if (this.data.precioCosto === 0) {
      this.tS.show({
        type: 'warning',
        message: 'El valor mínimo en el precio de costo es 0.01',
      });
      return;
    }

    this.data.precioCosto = roundNumber(this.data.precioCosto, this.decimal.nroPrecio);
    return true;
  }

  onChangeTipoIva() {
    if (!this.validateCalculateTarifa()) return;

    this.recalculateTarifaAdd();
  }

  private recalculateTarifaAdd() {
    const dataTipoIva = this.tiposIva().find((item) => item.idTipoIva === this.data.idTipoIva);
    if (!dataTipoIva) {
      this.tS.show({
        type: 'warning',
        message: 'No se pudo recuperar la infrastructure de tipo iva',
      });
      return;
    }
    try {
      for (const item of this.productTarifa) {
        item.tipoIva = dataTipoIva.descripcion;
        item.porcentajeIva = dataTipoIva.porcentaje;

        const precioVenta = pricingCalculateUtil.calculatePriceSale(
          item.precioConIva,
          item.porcentajeIva,
        );
        const precioConIva = pricingCalculateUtil.calculatePriceWithVat(
          precioVenta,
          item.porcentajeIva,
        );

        const porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(
          precioVenta,
          this.data.precioCosto,
        );
        const utilidad = pricingCalculateUtil.getValueUtility(precioVenta, this.data.precioCosto);

        item.precioVenta = roundNumber(precioVenta, this.decimal.nroPrecio);

        item.precioConIva = roundNumber(precioConIva, this.decimal.nroPrecio);

        item.porcentajeUtilidad = porcentajeUtilidad;
        item.utilidad = utilidad;
      }
    } catch (error) {
      this.tS.show({
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
    if ([null, undefined, '', 0].includes(this.data.precioCosto) || isNaN(this.data.precioCosto)) {
      cell.setValue(oldValue);
      this.tS.show({
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
        precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, porcentajeIva);

        porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(
          precioVenta,
          this.data.precioCosto,
        );

        break;

      case 'precioConIva':
        precioVenta = pricingCalculateUtil.calculatePriceSale(precioConIva, porcentajeIva);
        porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(
          precioVenta,
          this.data.precioCosto,
        );

        break;
      case 'porcentajeUtilidad':
        precioVenta = pricingCalculateUtil.calculatePriceSaleOfValuePercentageUtility(
          this.data.precioCosto,
          porcentajeUtilidad,
        );
        precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, porcentajeIva);
        break;
    }

    const utilidad = pricingCalculateUtil.getValueUtility(precioVenta, this.data.precioCosto);
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

  onSelected($event: any) {
    this.selectedFile.set($event);
    if (this.isUpdate()) {
      this.uploadImage();
    }
  }

  private uploadImage() {
    if (this.data.productPhotoId > 0 && this.selectedFile()) {
      this.$productPhotoService
        .put({
          productId: this.params.id,
          id: this.data.productPhotoId,
          data: JSON.stringify({
            id: this.data.productPhotoId,
            s3ObjectKey: null,
            s3ObjectUrl: null,
          }),
          file: this.selectedFile(),
        })
        .subscribe((response) => {
          if (response.code == '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code == '1') {
            this.tS.show({
              type: 'success',
              message: response.message,
            });
          }
        });
    }
    if (this.isUpdate() && this.data.productPhotoId == 0 && this.selectedFile()) {
      this.$productPhotoService
        .post({
          productId: this.params.id,
          file: this.selectedFile(),
        })
        .subscribe((response) => {
          if (response.code == '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code == '1') {
            this.tS.show({
              type: 'success',
              message: response.message,
            });
          }
        });
    }
  }

  private isValidForm() {
    const showWarning = (message: string) => {
      this.tS.show({
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
      if (isFieldInvalid(this.data.descripcion, 'Ingrese la Descripción del Articulo')) return;
      if (isFieldInvalid(this.data.codigoBarra, 'Ingrese el Código de Barra del Articulo')) return;
      if (isIdInvalid(this.data.idTipoArticulo, 'Seleccione el Tipo Articulo')) return;
      if (isIdInvalid(this.data.idMedida, 'Seleccione la Medida')) return;

      if (
        isFieldInvalid(this.data.precioCosto, 'Ingrese el precio costo') ||
        isNaN(this.data.precioCosto)
      ) {
        showWarning('El precio costo tiene que ser un número');
        return;
      }

      if (this.data.datosAdicionales && isIdInvalid(this.data.idEtiqueta, 'Seleccione la Etiqueta'))
        return;
    }

    // Validaciones comunes para agregar o actualizar un artículo
    if (this.isAdd() || this.isUpdate()) {
      if (isFieldInvalid(this.data.descripcion, 'Ingrese la Descripción del Articulo')) return;
      if (isIdInvalid(this.data.idSubFamilia, 'Seleccione la Sub Familia del Articulo')) return;
      if (isFieldInvalid(this.data.codigo, 'Ingrese el Código del Articulo')) return;
      if (isIdInvalid(this.data.idTipoArticulo, 'Seleccione el Tipo Articulo')) return;
      if (isIdInvalid(this.data.idMedida, 'Seleccione la Medida')) return;

      if (
        this.data.caducidad &&
        isFieldInvalid(this.data.fechaCaducidad, 'Ingrese la fecha de Caducidad del Articulo')
      )
        return;

      if (this.data.datosLote) {
        if (isFieldInvalid(this.data.lote, 'Ingrese el Lote')) return;
        if (isFieldInvalid(this.data.fechaCreacion, 'Ingrese la fecha de Creación')) return;
        if (isFieldInvalid(this.data.fechaCaducidadLote, 'Ingrese la fecha de Caducidad del Lote'))
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

    const senData = {
      id: this.params.id,
      data: structuredClone(this.data),
      dataPvp: structuredClone(this.productTarifa),
      dataUbicacion: structuredClone(this.dataUbicacion),
      file: this.selectedFile(),
    };

    if (this.isAdd()) {
      this.$productService.post(senData).subscribe((response) => {
        if (response.code === '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code === '1') {
          this.tS.show({
            type: 'success',
            message: response.message,
          });
          if (response.payload) {
            this.verificarProductoFraccionado(response.payload);
          }
        }
      });
    }

    if (this.isUpdate()) {
      this.$productService.put(this.params.id, senData).subscribe((response) => {
        if (response.code === '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code === '1') {
          this.tS.show({
            type: 'success',
            message: response.message,
          });
          this.dialogRef.close(response.payload);
        }
      });
    }
  }

  private verificarProductoFraccionado(response: any) {
    if (this.isAdd() && this.data.productoFraccionable) {
      Swal.fire({
        icon: 'warning',
        html: `<small>¿Deseas fraccionar este articulo ahora?</small>`,
        confirmButtonText: 'Sí',
        showDenyButton: true,
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.params.id = response.idArticulo;
          this.loadDataForm();

          setTimeout(() => {
            this.selectedTab.set(4);
          }, 1000);
        } else {
          this.setResponse(response);
        }
      });
    } else {
      this.setResponse(response);
    }
  }

  private setResponse(response: any) {
    const etiquetas = (response.etiquetas || []).map((item: any) => {
      return {
        ...item,
        etiquetas: item.etiquetas.split(';'),
      };
    });

    const data = {
      idArticulo: response.idArticulo,
      idMedida: response.idMedida,
      codigoPrincipal: response.codigo,
      codigoAuxiliar: response.codigoAuxiliar,
      codigoBarra: response.codigoBarra,
      etiquetas,
    };
    this.dialogRef.close(data);
  }

  onChangeEstab() {
    const dataEstab = this.estabs().find(
      (estab) => estab.idEstablecimiento === this.dataUbicacion.idEstablecimiento,
    );
    if (dataEstab) {
      this.bodegas = dataEstab.bodegas;
      const dataBodega = this.bodegas.find((b) => b.defaultBodega);
      if (dataBodega) {
        this.dataUbicacion.idBodega = dataBodega.idBodega;
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}

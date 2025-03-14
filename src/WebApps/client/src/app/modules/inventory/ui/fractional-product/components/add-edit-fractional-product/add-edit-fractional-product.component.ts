import {Component, inject, input, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {ProductSearchComponent} from "@inventory/ui/product/components/product-search/product-search.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import { MatIconModule} from "@angular/material/icon";
import {MatButtonModule } from "@angular/material/button";
import {  MatSelectModule} from "@angular/material/select";
import {MeasureAddEditDirective} from "@inventory/ui/directives/measure-add-edit.directive";
import {FormsModule} from "@angular/forms";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {TabulatorComponent} from "@core/components/tabulator/tabulator.component";
import {pricingCalculateUtil} from "@core/utils/pricing-calculate.util";
import {roundNumber} from "@core/utils/round-number.utils";
import {ToasterService} from "@core/services/toaster.service";
import {ProductDataFormUseCase} from "@inventory/domain/usecases/product/product-data-form.use-case";
import {DECIMALS} from "@core/constants/global.constants";
import {getValidId} from "@core/utils/utils";
import {ProductGetIdUseCase} from "@inventory/domain/usecases/product/product-get-id.use-case";

@Component({
  selector: 'app-add-edit-fractional-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCustomDialogComponent,
    ProductSearchComponent,
    ThemeButtonComponent,
    MeasureAddEditDirective,
    TabulatorComponent
  ],
  templateUrl: './add-edit-fractional-product.component.html',
  styles: ``
})
export class AddEditFractionalProductComponent {
  readonly dialogRef = inject(MatDialogRef<AddEditFractionalProductComponent>);
  readonly params = inject<{
    id: number;
    productId : number
    isCalledFromProductModal : boolean;
  }>(MAT_DIALOG_DATA);

  private $productDataFormUseCase = inject(ProductDataFormUseCase)
  private $productGetIdUseCase = inject(ProductGetIdUseCase)
  private tS = inject(ToasterService)



  title = 'Nuevo'
  btnText = 'Guardar';

  medidas = signal<any[]>([])

  data = {
    idMedida: 0,
    precioCosto: 0,
    precioCostoFraccionado: 0,
    conversion: 0,
    gestionVenta: false,
    descripcion: '',
    codigo: '',
    nombreMedida: ''
  }

  columnNames = [
    {
      title: 'Tarifa',
      field: 'nomTarifa',
      headerSort: false,
      width:140, responsive:0
    },
    {
      title: 'Tipo Iva',
      field: 'porcentajeIva',
      headerSort: false,
      width:100, responsive:0
    },
    {
      title: 'P. Venta',
      field: 'precioVenta',
      headerSort: false,
      editor: 'input',
      validator: ['required', 'min:0', 'numeric'],
      width:100, responsive:0,
    },
    {
      title: 'P. IVA',
      field: 'precioConIva',
      headerSort: false,

      editor: true,
      validator: ['required', 'min:0', 'numeric'],
      width:100, responsive:0
    },
    {
      title: '% Utilidad',
      field: 'porcentajeUtilidad',
      headerSort: false,

      editor: true,
      validator: ['required', 'min:0', 'numeric'],
      width:100, responsive:0
    },
    {
      title: 'Utilidad',
      field: 'utilidad',
      headerSort: false,
      width:100, responsive:0
    },
    {
      title: 'Estado',
      field: 'nomEstado',
      headerSort: false,
      width:100, responsive:0
    },
  ];

  tabulatorOptions = {
    columns: this.columnNames,
    layout:"fitDataFill",
    reactiveData: true,
    height: null, // Elimina la altura fija para que sea auto
  };

  productTarifa: any[] = [];
  tarifas = [] as any[]
private decimal = {
  nroPrecio: DECIMALS.GENERAL
}
  isUpdate(){
    return true;
  }

  isAdd(){
    return !(this.params.id > 0)
  }


  resultModalMedida($event:MouseEvent){
    $event.stopPropagation()
  }
  refreshMedida($event:MouseEvent){
    $event.stopPropagation()
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


  ngOnInit(){

  this.$productDataFormUseCase.execute().subscribe(response=>{
    this.medidas.set(response.medidas);
    this.data.idMedida = this.medidas().length > 0 ? this.medidas()[0].idMedida : 0;

    this.tarifas = response.tarifas;

    if(this.params.isCalledFromProductModal && this.params.productId>0){
      this.selectProduct(this.params.productId);
    }
  })
  }


  onChangeConversion (){
    if(this.data.conversion>0){
      let precioCostoFraccionado = Number(this.data.conversion) * this.data.precioCosto;
      this.data.precioCostoFraccionado =roundNumber(precioCostoFraccionado, 3)
    }

  }


  handleSelectProduct(item: any){
    this.selectProduct(item.data.idArticulo);
  }

  private  selectProduct (idArticulo: number) {

    try {
      this.$productGetIdUseCase.execute( idArticulo).subscribe((response) => {
        if(response.payload){
          this.data = response.payload.data
          this.productTarifa = structuredClone(response.payload.productPvps).map((item) => {
            item.precioVenta = 0;
            item.precioConIva = 0;
            item.porcentajeUtilidad = 0;
            item.ganancia = 0;
            return item;
          });
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  recalculateTarifaAdd   () {
    if (this.productTarifa.length === 0) return;

    const precioCosto = this.data.precioCostoFraccionado;
    const porcentajeIva = this.productTarifa[0].porcentajeIva;
    if (!getValidId(precioCosto)) {
      this.tS.toastr({
        type: 'warning',
        message:  "Ingrese un número válido"
      })
      return;
    }
    if (precioCosto === 0) {
      this.tS.toastr({
        type: 'warning',
        message: "El valor mínimo en el precio de costo es 0.01"
      })
      return;
    }


    try {
      let index = 0;
      for (let val of this.productTarifa) {
        val.porcentajeIva = porcentajeIva;

        let precioVenta = pricingCalculateUtil.calculatePriceSale(
          val.precioConIva,
          val.porcentajeIva
        );
        val.precioVenta =  roundNumber(
          precioVenta,
         this.decimal.nroPrecio
        );

        let precioConIva = pricingCalculateUtil.calculatePriceWithVat(
          val.precioVenta,
          val.porcentajeIva
        );
        val.precioConIva =  roundNumber(
          precioConIva,
          this.decimal.nroPrecio
        );

        let porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(
          precioVenta,
          precioCosto,
        );
        val.porcentajeUtilidad =  roundNumber(
          porcentajeUtilidad,
          DECIMALS.GENERAL
        );

        let ganancia = pricingCalculateUtil.getValueUtility(
          val.precioVenta,
          precioCosto
        );
        val.ganancia =  roundNumber(ganancia, DECIMALS.GENERAL);
        index++;
      }
    } catch (error) {
      console.log(error)
    }
  }




  save(){

  }

  close(){
    this.dialogRef.close()
  }
}

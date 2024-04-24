import { Component, inject, Input } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { TAX_RATE_CODE } from '@core/constants/global.constants';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SubCategoryModalDirective } from '@inventory/directives/sub-category.directive'
import { TipoIvaSelectHtmlOnly } from '@modules/inventory/models/tipo-iva.model';
import { ProductService } from '@modules/inventory/services/product.service';
import { MeasureAddEditDirective } from '@modules/inventory/shared/directives/measure-add-edit.directive';
import { TarifaSelectHtmlOnly } from '@modules/inventory/shared/models/tarifa.model';
import { NgbActiveModal, NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';

interface ProductTarifa {
  tipoIva: string
  tarifa: string
  precioVenta: number
  precioConIva: number
  porcentajeUtilidad: number

}
@Component({
  selector: 'app-product-add-edit-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgbNavModule,
    FontAwesomeModule,
    SubCategoryModalDirective,
    MeasureAddEditDirective,
    TabulatorComponent,
    ToUpperCaseDirective
  ],
  templateUrl: './product-add-edit-modal.component.html'
})

export class ProductAddEditModalComponent {
  @Input() params: any = {}

  //Inject Services
  private activeModal = inject(NgbActiveModal);

  private productSvc = inject(ProductService)
  activeTab = 1;

  titleModal = 'Nuevo Producto';
  btnText = 'Guardar';


  categorias = [];
  decimal = {};
  estabs: GroupedEstab[] = [];
  etiquetas = [];
  marcas = [];
  medidas:any = [];
  modelos = [];
  subCategorias = [];
  tarifas: TarifaSelectHtmlOnly[] = [];
  tiposArticulo:any = [];
  tiposIce = [];
  tiposIva: TipoIvaSelectHtmlOnly[] = [];

  bodegas: GroupedEstabBodega[] = []

  data ={
    descripcion: '',
    idSubFamilia: 0,
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
    fraccionable: false
  }
  columnNames =  [
    {
      title: "Tarifa",
      field: "tarifa",
      width: "9px",
      headerSort: false,
    },
    {
      title: "Tipo Iva",
      field: "tipoIva",
      width: "9px",
      headerSort: false,
    },
    {
      title: "P. Venta",
      field: "precioVenta",
      width: "9px",
      headerSort: false,
    },
    {
      title: "P. IVA",
      field: "precioConIva",
      width: "8px",
      headerSort: false,

    },
    {
      title: "% Utilidad",
      field: "porcentajeUtilidad",
      width: 100,
      headerSort: false,

    },
    {
      title: "Utilidad",
      field: "utilidad",
      width: 100,
      headerSort: false,

    },
    {
      title: "Estado",
      field: "estado",
      width: 100,
      headerSort: false,

    },
    ]

  tabOptions = {

    height: 0,
    layout: "fitDataStretch",
  }

  productTarifa: ProductTarifa[] = []

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
        this.tiposArticulo = tiposArticulo;
        this.medidas = medidas;
        this.tiposIva = tiposIva;
        this.tarifas = tarifas;

        this.drawProductTarifa()
      },
    })
  }

  drawProductTarifa(){
    let dataTarifaImpuesto = this.tiposIva.find(ti=>ti.codigo===TAX_RATE_CODE.FIFTEEN_PERCENT)
    console.log(dataTarifaImpuesto)
    let dataTemp:any = [];
    if(dataTarifaImpuesto){
      for(let tarifa  of this.tarifas){
         dataTemp.push({
          tipoIva:dataTarifaImpuesto.descripcion,
          tarifa: tarifa.descripcion,
           precioVenta : 0,
           precioConIva : 0,
           porcentajeUtilidad : 0,
         })
      }
    }
    this.productTarifa = dataTemp;
  }


  closeModal() {
    this.activeModal.close();
  }
}

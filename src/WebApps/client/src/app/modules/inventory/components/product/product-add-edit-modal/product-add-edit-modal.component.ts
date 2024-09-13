import { ColumnDefinition, Options } from 'tabulator-tables';
import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, signal, WritableSignal } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TabulatorTableComponent } from '@core/components/tabulator-table/tabulator-table.component';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { TAX_RATE_CODE } from '@core/constants/global.constants';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SubCategoryModalDirective } from '@inventory/directives/sub-category.directive'
import { MeasureAddEditDirective } from '@modules/inventory/directives/measure-add-edit.directive';
import { GroupedSubFamilia } from '@modules/inventory/models/sub-category.model';
import { TarifaSelectHtmlOnly } from '@modules/inventory/models/tarifa.model';
import { TipoIvaSelectHtmlOnly } from '@modules/inventory/models/tipo-iva.model';
import { ProductService } from '@modules/inventory/services/product.service';
import { NgbActiveModal, NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { Observable } from 'rxjs';

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
    ReactiveFormsModule,
    NgbNavModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    SubCategoryModalDirective,
    MeasureAddEditDirective,
    TabulatorComponent,
    ToUpperCaseDirective,
    AsyncPipe,
    TabulatorTableComponent
  ],
  templateUrl: './product-add-edit-modal.component.html'
})

export class ProductAddEditModalComponent {
  @Input() params: any = {}

  //Inject Services
  private activeModal = inject(NgbActiveModal);

  private productSvc = inject(ProductService)

  private _formBuilder = inject(FormBuilder)



  selectedTab = signal(0);

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
    fraccionable: false
  }

  subCategoriesGroupOptions!: Observable<any[]>;
  subCategoryForm = this._formBuilder.group({
    subCategoryGroup: '',
  });

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


  // Declaración de señales reactivas en el componente padre
  tableColumns: WritableSignal<ColumnDefinition[]> = signal([
    { title: "Name", field: "name", sorter: "string" },
    { title: "Age", field: "age", sorter: "number" },
    { title: "Gender", field: "gender" }
  ]);

  tableData: WritableSignal<any[]> = signal([
    { id: 1, name: "John Doe", age: 29, gender: "Male" },
    { id: 2, name: "Jane Smith", age: 34, gender: "Female" },
  ]);

  tableOptions: WritableSignal<Options> = signal({
    layout: "fitColumns",
    paginationSize: 5,
  });


  // Métodos para actualizar señales dinámicamente
  updateTableData() {
    this.tableData.set([
      { id: 3, name: "New User", age: 25, gender: "Non-binary" }
    ]);
  }

  updateTableColumns() {
    this.tableColumns.set([
      { title: "Name", field: "name", sorter: "string" },
      { title: "Occupation", field: "occupation" },
    ]);
  }

  updateTableOptions() {
    this.tableOptions.set({
      paginationSize: 10,
      movableColumns: true,
    });
  }


  tabOptions = {

    height: 0,
    layout: "fitDataStretch",
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
        console.log(response)
   //     this.subCategoriesGroupOptions = response.subCategoriesGroupOptions;
        this.tiposArticulo = tiposArticulo;
        this.medidas = medidas;
        this.tiposIva = tiposIva;
        this.tarifas = tarifas;

        this.drawProductTarifa()
      },
    })
  }


  // updateData() {
  //   this.tabulatorTable.setData([
  //     { id: 3, name: "New Person", age: 25, gender: "Non-binary" }
  //   ]);
  // }

  // updateColumns() {
  //   this.tabulatorTable.setColumns([
  //     { title: "Name", field: "name", sorter: "string" },
  //     { title: "Age", field: "age", sorter: "number" },
  //     { title: "Occupation", field: "occupation" }
  //   ]);
  // }

   selectTab(index: number) {
    this.selectedTab.set(index)
  }

  onKeyupSubCategory(value:string){

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

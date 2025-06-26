import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { InventoryAdjustmentListUseCase } from '@inventory/inventory-adjustment/application/use-cases/inventory-adjustment-list.use-case';
import { InventoryAdjustmentFormDataUseCase } from '@inventory/inventory-adjustment/application/use-cases/inventory-adjustment-form-data.use-case';
import { PageEvent } from '@angular/material/paginator';
import { getValidId, isValidField, ValidatorUtils } from '@core/utils/utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {GroupedEstab, GroupedEstabPuntoEmision} from "@core/models/estab.model";
import {DateRangeSelectionComponent} from "@core/components/date-range-selection/date-range-selection.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {
  InventoryAdjustmentFormDataResponse,
  InventoryAdjustmentList
} from "@inventory/inventory-adjustment/domain/inventory-adjustment.entity";
import {DialogService} from "@core/services/dialog.service";
import {
  InventoryAdjustmentAddEditComponent
} from "@inventory/inventory-adjustment/presentation/inventory-adjustment-add-edit/inventory-adjustment-add-edit.component";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {
  InventoryAdjustmentDetailComponent
} from "@inventory/inventory-adjustment/presentation/inventory-adjustment-detail/inventory-adjustment-detail.component";
import {InventoryAdjustmentStore} from "@inventory/inventory-adjustment/application/store/inventory-adjustment.store";
import {
  ProductSearchBarComponent
} from "@inventory/product/presentation/components/product-search-bar/product-search-bar.component";

@Component({
  selector: 'app-inventory-adjustment',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatDynamicTableComponent,
    FormsModule,
    DateRangeSelectionComponent,
    ThemeButtonComponent,
    MatIconButton,
    MatIcon,
    MatMenuModule,
    ProductSearchBarComponent
  ],
  templateUrl: './inventory-adjustment.component.html',
  styles: ``,
})
export class InventoryAdjustmentComponent   {
  private $listUseCase = inject(InventoryAdjustmentListUseCase);
  private $formDataUseCase = inject(InventoryAdjustmentFormDataUseCase);
  private _tS = inject(ToastrNotificationService);
  private _dialogSvc = inject(DialogService);
  private $inventoryAdjustmentStore  = inject(InventoryAdjustmentStore)
  dataSource = signal<InventoryAdjustmentList[]>([]);
  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'tipoDocNombre', label: 'Tipo Documento', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'nroDoc', label: 'Nro. Documento', type: 'string' },
    { key: 'estadoNombre', label: 'Estado', type: 'string' },
    { key: 'observacion', label: 'Observación', type: 'string' },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'usuarioNombre', label: 'Usuario', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new MatPagination());

  tiposDoc = signal<any[]>([])
  estabs = signal<GroupedEstab[]>([])
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([])

  dataFilter = {
    text: '',
    useFilterDate: true,
    estabId: 0,
    tipoDocId: 0,
    serie: '',
    startDate: formatDateToString(new Date()),
    endDate: formatDateToString(new Date()),
  };

  private mainFormData = signal({} as InventoryAdjustmentFormDataResponse)

  refresh() {
    this.getList()
  }

  private getDataParams() {
    let useFilterDate = this.dataFilter.useFilterDate;
    let serie = null;
    if (isValidField(this.dataFilter.serie)) {
      serie = ValidatorUtils.validAndFormatedRangeSequential(
        this.dataFilter.serie
      );
      if (!serie) {
        this._tS.warning({
          message:
            'Define correctamente el número de secuencial o el rango de número secuencial!',
        });
        return;
      }
      useFilterDate = false;
      this._tS.info({
        message: 'Buscando por número secuencial',
      });
    }
    return {
      pageIndex: this.pagination().pageIndex+1,
      pageSize: this.pagination().pageSize,
      useFilterDate,
      startDate: this.dataFilter.startDate,
      endDate: this.dataFilter.endDate,
      serie,
      tipoDocId: getValidId(this.dataFilter.tipoDocId),
      textSearch: isValidField(this.dataFilter.text),
    };
  }

  private getList() {
    const params = this.getDataParams();
    if (!params) return;
    this.$listUseCase.execute(params).subscribe(response => {
      this.dataSource.set(response.data);
      this.pagination.update(pag=>({
        ...pag,
        totalRecords: response.totalRecords,
      }))
    })
  }

  // ngOnInit() {
  //   this.$formDataUseCase.execute().subscribe((response) => {
  //     this.$inventoryAdjustmentStore.setMainFormData(response)
  //     this.tiposDoc.set(response.tiposDoc);
  //     this.estabs.set(response.estabs);
  //     const dataEstab = this.estabs().find(e=>e.defaultEstab);
  //     if(dataEstab) {
  //       this.dataFilter.estabId = dataEstab.idEstablecimiento;
  //     }
  //      this.refresh()
  //   });
  // }

  addEdit(item?: InventoryAdjustmentList){
    const ref = this._dialogSvc.open(InventoryAdjustmentAddEditComponent, {
      size: 'xxl',
      data: {

      }
    })
    ref.subscribe(res => {
      if(res && typeof res  == 'object'){
        this.refresh()
      }
    })
  }

  openDetail(item: InventoryAdjustmentList){
    this._dialogSvc.open(InventoryAdjustmentDetailComponent, {
      size: 'xxl',
      data: {
        id: item.id
      }
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
    this.refresh();
  }





  title = "Auto-Complete using Angular "  ;
  keyword = "name";
  public countries = [
    { id: 1, name: "Twiyo" },
    { id: 2, name: "Demimbu" },
    { id: 3, name: "Jaxworks" },
    { id: 4, name: "Skajo" },
    { id: 5, name: "Shufflebeat" },
    { id: 6, name: "Thoughtmix" },
    { id: 7, name: "Mycat" },
    { id: 8, name: "Photobug" },
    { id: 9, name: "Zazio" },
    { id: 10, name: "Vitz" },
    { id: 11, name: "Dablist" },
    { id: 12, name: "Ntag" },
    { id: 13, name: "Kwinu" },
    { id: 14, name: "Trudoo" },
    { id: 15, name: "Yodoo" },
    { id: 16, name: "Demimbu" },
    { id: 17, name: "Thoughtstorm" },
    { id: 18, name: "Trudeo" },
    { id: 19, name: "Tambee" },
    { id: 20, name: "Eayo" },
    { id: 21, name: "Linkbuzz" },
    { id: 22, name: "Avaveo" },
    { id: 23, name: "Twitterlist" },
    { id: 24, name: "Oyoyo" },
    { id: 25, name: "Wordify" },
    { id: 26, name: "Zoomzone" },
    { id: 27, name: "Flashpoint" },
    { id: 28, name: "Katz" },
    { id: 29, name: "Blogpad" },
    { id: 30, name: "Fliptune" },
    { id: 31, name: "Agimba" },
    { id: 32, name: "Mydo" },
    { id: 33, name: "Geba" },
    { id: 34, name: "Katz" },
    { id: 35, name: "Ozu" },
    { id: 36, name: "Photolist" },
    { id: 37, name: "Browsecat" },
    { id: 38, name: "Mydo" },
    { id: 39, name: "Gabvine" },
    { id: 40, name: "Twimm" },
    { id: 41, name: "Buzzshare" },
    { id: 42, name: "Aivee" },
    { id: 43, name: "Jaxbean" },
    { id: 44, name: "Demivee" },
    { id: 45, name: "Dynava" },
    { id: 46, name: "Skyble" },
    { id: 47, name: "Feedfire" },
    { id: 48, name: "Edgepulse" },
    { id: 49, name: "Browsecat" },
    { id: 50, name: "Flashspan" },
    { id: 51, name: "Yotz" },
    { id: 52, name: "Tagchat" },
    { id: 53, name: "DabZ" },
    { id: 54, name: "Skidoo" },
    { id: 55, name: "Skipstorm" },
    { id: 56, name: "Dynabox" },
    { id: 57, name: "Feedfire" },
    { id: 58, name: "Jabbertype" },
    { id: 59, name: "Livepath" },
    { id: 60, name: "Oyoloo" },
    { id: 61, name: "Wordify" },
    { id: 62, name: "Topicshots" },
    { id: 63, name: "Youspan" },
    { id: 64, name: "Voomm" },
    { id: 65, name: "Voomm" },
    { id: 66, name: "InnoZ" },
    { id: 67, name: "Linkbridge" },
    { id: 68, name: "Fatz" },
    { id: 69, name: "Photobug" },
    { id: 70, name: "Mymm" },
    { id: 71, name: "Skyble" },
    { id: 72, name: "Rhynyx" },
    { id: 73, name: "Fadeo" },
    { id: 74, name: "Riffwire" },
    { id: 75, name: "Buzzshare" },
    { id: 76, name: "Abata" },
    { id: 77, name: "Oyoloo" },
    { id: 78, name: "Photolist" },
    { id: 79, name: "Quire" },
    { id: 80, name: "Meejo" },
    { id: 81, name: "Dabjam" },
    { id: 82, name: "Gigaclub" },
    { id: 83, name: "Kwilith" },
    { id: 84, name: "Lajo" },
    { id: 85, name: "Ozu" },
    { id: 86, name: "Livetube" },
    { id: 87, name: "Yombu" },
    { id: 88, name: "Feedfish" },
    { id: 89, name: "Meejo" },
    { id: 90, name: "Agimba" },
    { id: 91, name: "Edgeblab" },
    { id: 92, name: "Linktype" },
    { id: 93, name: "Buzzshare" },
    { id: 94, name: "Yodo" },
    { id: 95, name: "Flashpoint" },
    { id: 96, name: "Oyoloo" },
    { id: 97, name: "Photofeed" },
    { id: 98, name: "Jaxbean" },
    { id: 99, name: "Tagcat" },
    { id: 100, name: "Realpoint" }
  ];

  selectEvent(item:any) {
    // do something with selected item
    console.log(item);
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val);
  }

  onFocused(e:any) {
    // do something when input is focused
    console.log(e);
  }


}

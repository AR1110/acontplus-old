import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {Dialog, DialogRef} from "@angular/cdk/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatSelectModule} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {provideNativeDateAdapter} from "@angular/material/core";
import {DialogService} from "@core/services/dialog.service";
import {
  WarehouseTransferFilterAdvanced
} from "@inventory/ui/warehouse-transfer/warehouse-transfer-add-edit/warehouse-transfer-filter-advanced/warehouse-transfer-filter-advanced";
import {WarehouseTransferDataFormUseCase} from "@inventory/domain/usecases/warehouse-transfer.use-case";
import {GroupedEstab, GroupedEstabBodega, GroupedEstabPuntoEmision} from "@core/models/estab.model";
import {ToastrNotificationService} from "@core/services/toastr-notification.service";
import Swal from "sweetalert2";
import {
  ProductSearchOverlayComponent
} from "@inventory/product/presentation/components/product-search-overlay/product-search-overlay.component";
import {
  ProductSearchPopupComponent
} from "@inventory/product/presentation/components/product-search-popup/product-search-popup.component";
import {UniversalSearch} from "@inventory/product/presentation/components/universal-search/universal-search.component";
import {
  SearchInputTrigger
} from "@inventory/product/presentation/components/search-input-trigger/search-input-trigger.component";
import {SearchDialogService} from "@inventory/product/presentation/components/search-dialog";


interface CommonType  {id:number, code: string, name:string}

@Component({
  selector: 'app-warehouse-transfer-add-edit',
  imports: [
    MatSelectModule,
    MatInput,
    MatCustomDialogComponent,
    ThemeButtonComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    ReactiveFormsModule,
    FormsModule,
    ProductSearchOverlayComponent,
    UniversalSearch,
    SearchInputTrigger
  ],
  templateUrl: './warehouse-transfer-add-edit.html',
  styleUrl: './warehouse-transfer-add-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class WarehouseTransferAddEdit {
  private dgSvc = inject(DialogService);
  private dg = inject(Dialog)
  private dataFormUseCase = inject(WarehouseTransferDataFormUseCase);
  private notiSvc = inject(ToastrNotificationService);
  private searchService = inject(SearchDialogService)

  private dialogRef  = inject(DialogRef<WarehouseTransferAddEdit>);
  private params = inject<{id: number}>(MAT_DIALOG_DATA);

  title = signal('Nueva Transferencia')
  btnText = signal('Guardar');
  btnIcon = signal('save');

  sourceEstablishments = signal<GroupedEstab[]>([]);
  destinationEstablishments = signal<GroupedEstab[]>([]);
  sourceWarehouses = signal<GroupedEstabBodega[]>([]);
  destinationWarehouses = signal<GroupedEstabBodega[]>([]);
  emissionPoints = signal<GroupedEstabPuntoEmision[]>([]);

  transactionTypes = signal<CommonType[]>([])
  documentTypes = signal<CommonType[]>([])
  subFamilies = signal<CommonType[]>([])

  subCategories = signal([]);

  dataForm = {
    sourceEstablishmentId: 0,
    destinationEstablishmentId: 0,

    puntoEmisionId: 0,
    issueDate: new Date(),
    sourceWarehouseId: 0,
    destinationWarehouseId: 0,
    obs: null,
  }

  cloneSourceEstablishmentId = signal(0);

  details = signal<any[]>([])

  isAdd (){
    return this.params.id === 0;
  }
  isEdit (){
    return this.params.id > 0;
  }

  openFilterAdvanced (){
    this.dgSvc.open(WarehouseTransferFilterAdvanced, {
      size: 'xl'
      }
    ).subscribe(result => {
      console.log(result);
    })
  }

  loadDataForm(){
    this.dataFormUseCase.execute().subscribe(response => {
      this.sourceEstablishments.set(response.establishments);
      this.destinationEstablishments.set(response.establishments);
      this.transactionTypes.set(response.transactionTypes);
      this.documentTypes.set(response.documentTypes);
      this.subFamilies.set(response.subFamilies);

      if (this.sourceEstablishments().length === 0) {
        this.notiSvc.warning({
          message: 'No tienes asignado ningún Establecimiento',
        })
        throw new Error('No tienes asignado ningún Establecimiento');
      }

      if(this.isAdd()){
        this.setDataAdd();
      }

      if(this.isEdit()){

      }
    })
  }

  setDataAdd(){
    this.title.set('Nueva Transferencia');
    this.btnText.set('Guardar');
    this.btnIcon.set('save');

    const dataEstab = this.sourceEstablishments().find(estab => (estab.defaultEstab));
    if(!dataEstab){
      this.notiSvc.warning({
        message: 'No se encontró Estblecimiento por defecto',
      })
      throw new Error('No se encontró Estblecimiento por defecto');
    }
    this.emissionPoints.set(dataEstab.puntosEmision);
    this.sourceWarehouses.set(dataEstab.bodegas);
    //Codigo Establecimiento
    this.dataForm.sourceEstablishmentId = dataEstab.id ??0;
    this.cloneSourceEstablishmentId.set(dataEstab.id ??0);

    if (this.emissionPoints().length > 0) {
      this.dataForm.puntoEmisionId = this.emissionPoints().find(ptoEmi => (ptoEmi.defaultPtoEmi))?.idPuntoEmision ?? 0;
    } else {
      this.notiSvc.warning({
        message: 'No tienes asignado ningún Punto de Emisión',
      })
    }
    if (this.sourceWarehouses().length > 0) {
      this.dataForm.sourceWarehouseId = this.sourceWarehouses().find(bodega => (bodega.defaultBodega))?.idBodega ?? 0;
    } else {
      this.notiSvc.warning({
        message: 'No tienes asignado ninguna Bodega',
      })
    }
  }

  ngOnInit(){
    this.loadDataForm()

    const items: any[] = [
      { title: 'Dashboard', description: 'Open main dashboard' },
      { title: 'Users', description: 'Manage users & permissions' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
      { title: 'Reports', description: 'View analytics & metrics' },
    ];
    this.searchService.setItems(items);
  }


  async changeEstabSource () {
      const { isConfirmed } = await Swal.fire({
        title: '<small>Cambiar Establecimiento?</small>',
        html: "<small>Esta seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si!',
        cancelButtonText: 'No!',
        reverseButtons: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      })

      if(!isConfirmed){
        this.dataForm.sourceEstablishmentId = this.cloneSourceEstablishmentId();
        return
      }

        const dataEstab = this.sourceEstablishments().find(estab => estab.id === this.dataForm.sourceEstablishmentId);
      if (dataEstab) {
        this.cloneSourceEstablishmentId.set(dataEstab.id ?? 0);
        this.emissionPoints.set(dataEstab.puntosEmision);
        this.sourceWarehouses.set(dataEstab.bodegas);
      }

        if (this.emissionPoints().length > 0) {
          this.dataForm.puntoEmisionId = this.emissionPoints().find(ptoEmi => (ptoEmi.defaultPtoEmi))?.idPuntoEmision ?? 0;
        } else {
          this.notiSvc.warning({
            message: 'No tienes asignado ningún Punto de Emisión a este Establecimiento',
          })
        }
        if (this.sourceWarehouses().length > 0) {
          this.dataForm.sourceWarehouseId = this.sourceWarehouses().find(bodega => (bodega.defaultBodega))?.idBodega ?? 0;
        } else {
          this.notiSvc.warning({
            message: 'No tienes asignado ninguna Bodega a este Establecimiento',
          })
        }
        this.dataForm.sourceEstablishmentId = 0;
        this.dataForm.sourceWarehouseId = 0;
        this.details.set(this.details().map(item => ({...item, cantidad: 0})))
  }


  changeEstabDestination(){
    const dataEstab = this.destinationEstablishments().find(item => item.id === this.dataForm.destinationEstablishmentId);
    if(dataEstab){
      this.destinationWarehouses.set(structuredClone(dataEstab.bodegas).filter(item=>{
        return item.idBodega !== this.dataForm.sourceWarehouseId;
      }));
    }
    this.dataForm.destinationWarehouseId = 0;
    if (this.destinationWarehouses().length === 0) {
      this.notiSvc.warning({
        message: 'No tienes asignado ninguna Bodega',
      })
    }

  }

  selectProduct($event:any){


  }



  searchProduct(): void {
    const dialogRef = this.dgSvc.open(ProductSearchPopupComponent, {
      size: 'lg',

      data: {
        textSearch: '',
        searchPurchase: false,
        searchSale: true
      }
    });


  }




  close(){

    this.dialogRef.close();
  }
}

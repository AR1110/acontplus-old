import {Component, inject, signal} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {ActionAddDirective} from "@shared/directives/permission/action-add.directive";
import { MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {
  ListElectronicSignatureUseCase
} from "@modules/config/application/use-cases/electronic-signature/list-electronic-signature.use-case";
import {ElectronicSignatureList} from "@modules/config/domain/models/electronic-signature.model";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {DialogService} from "@core/services/dialog.service";
import {
  AddEditElectronicSignatureComponent
} from "@modules/config/ui/electronic-signature/add-edit-electronic-signature/add-edit-electronic-signature.component";
import Swal from "sweetalert2";
import {getValidId} from "@core/utils/utils";
import {
  UpdateSignatureElectronicSignatureUseCase
} from "@modules/config/application/use-cases/electronic-signature/update-signature-electronic-signature.use-case";
import {ApiResponse} from "@core/models/api-response";
import {SvgIconComponent} from "@shared/components/svg-icon/svg-icon.component";

@Component({
  selector: 'app-electronic-signature',
  imports: [
    BreadcrumbComponent,
    MatDynamicCardComponent,
    ActionAddDirective,
    MatButtonModule,
    MatIconModule,
    MatDynamicTableComponent,
    ThemeButtonComponent,
    SvgIconComponent
  ],
  templateUrl: './electronic-signature.component.html',
  styles: ``
})
export class ElectronicSignatureComponent {

  private $listUseCase = inject(ListElectronicSignatureUseCase)
  private $updateSignature = inject(UpdateSignatureElectronicSignatureUseCase)
  private _dialogSvc = inject(DialogService)

  dataSource = signal<ElectronicSignatureList[]>([])

  columnsDefs: ColumnDefinition[] = [

    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nomEntidad', label: 'Entidad', type: 'string' },
    { key: 'contrasenia', label: 'Contraseña', type: 'string' },
    { key: 'nombreArchivo', label: 'Nombre Archivo', type: 'string' },
    { key: 'mimeType', label: 'Mime Type', type: 'string' },
    { key: 'fechaCaducidad', label: 'Fecha Caducidad', type: 'string' },
  ];


  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)


  openModalAddUpdate(item?: ElectronicSignatureList) {
    const ref = this._dialogSvc.open(AddEditElectronicSignatureComponent,{
      data: structuredClone(item) || {}
    })
    ref.subscribe(result=>{
      if(result && typeof result==='object'){
        this.refresh()
      }
    })
  }

  refresh(){
    this.getList()
  }

  private  getList(){
    this.$listUseCase.execute().subscribe(response=>{
      this.dataSource.set(response.data)
    })
  }

  ngOnInit(){
    this.refresh()
  }



  async updateSignature(item:ElectronicSignatureList){
      const { value: file } = await Swal.fire({
        title: 'Seleccione el arhivo',
        input: 'file',
        inputAttributes: {
          'accept': '.p12',
          'aria-label': 'Update Signature'
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
      })

      if(!file) return;

      if(!getValidId(item.idFirmaElectronica)){
        Swal.fire({
          icon: 'warning',
          text:  'El id es:'  + item.idFirmaElectronica
        })
        return
      }

     this.$updateSignature.execute({
       idFirmaElectronica: item.idFirmaElectronica,
       file
     }).subscribe(this.successResponse)

  }

  successResponse = (response:ApiResponse)=>{
    if(response.code==="0"){
      Swal.fire({
        icon: 'warning',
        text: response.message
      })
    }
    if(response.code==="1"){
      Swal.fire({
        icon: 'success',
        text: response.message,
        timer: 1000
      })
      this.refresh()
    }
  }
}

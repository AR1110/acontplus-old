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

@Component({
  selector: 'app-electronic-signature',
  imports: [
    BreadcrumbComponent,
    MatDynamicCardComponent,
    ActionAddDirective,
    MatButtonModule,
    MatIconModule,
    MatDynamicTableComponent,
    ThemeButtonComponent
  ],
  templateUrl: './electronic-signature.component.html',
  styles: ``
})
export class ElectronicSignatureComponent {

  private $listUseCase = inject(ListElectronicSignatureUseCase)
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
      console.log(response)
      this.dataSource.set(response.data)
    })
  }

  ngOnInit(){
    this.refresh()
  }
}

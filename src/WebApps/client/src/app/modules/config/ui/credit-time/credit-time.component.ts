import {Component, inject, signal} from '@angular/core';
import {ListCreditTimeUseCase} from "@modules/config/application/use-cases/credit-time/list-credit-time.use-case";
import {CreditTimeList} from "@modules/config/domain/models/tiempo-credito.model";
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {SvgIconComponent} from "@shared/components/svg-icon/svg-icon.component";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {DialogService} from "@core/services/dialog.service";
import {
  AddEditCreditTimeComponent
} from "@modules/config/ui/credit-time/add-edit-credit-time/add-edit-credit-time.component";

@Component({
  selector: 'app-credit-time',
  imports: [
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    MatDynamicTableComponent,
    SvgIconComponent
  ],
  templateUrl: './credit-time.component.html',
  styles: ``
})
export class CreditTimeComponent {
  private $listUseCase = inject(ListCreditTimeUseCase);
  private _dialogSvc = inject(DialogService)

  dataSource = signal<CreditTimeList[]>([])


  columnsDefs: ColumnDefinition[] = [

    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'diasCredito', label: 'Día Crédito', type: 'string' },
    { key: 'nroCuota', label: 'Nro. Cuota', type: 'string' },
    { key: 'entrada', label: 'Entrada', type: 'string' },
    { key: 'fechaCaducidad', label: 'Modulo', type: 'string' },
    { key: 'tipoCredito', label: 'Tipo Crédito', type: 'string' },
    { key: 'nombreEstado', label: 'Estado', type: 'string' },
  ];


  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  private getList(){
    this.$listUseCase.execute({}).subscribe(response => {
      this.dataSource.set(response.data)
    })
  }

  refresh(){

  }

  openModalAddUpdate(item?:CreditTimeList){
    const ref = this._dialogSvc.open(AddEditCreditTimeComponent, {
      data: structuredClone(item) || {}
    })
    ref.subscribe(result=>{
      if(result && typeof result==='object'){
        this.refresh()
      }
    })
  }

  ngOnInit(){
    this.refresh();
  }
}

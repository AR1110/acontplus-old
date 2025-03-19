import {Component, inject, signal, TemplateRef, ViewChild} from '@angular/core';
import {
  ListAsignacionEstabUseCase
} from "@modules/config/domain/use-cases/asignacion-estab/list-asignacion-estab.use-case";
import {UserCustomerStore} from "@modules/config/ui/store/user-customer.store";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatPagination} from "@shared/models/pagination.model";
import {AsignacionEstabList} from "@modules/config/domain/models/user-customer/asignacion-estab.model";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem} from "@angular/material/menu";

@Component({
  selector: 'app-list-asignacion-estab',
  imports: [
    MatSlideToggleModule,
    MatDynamicTableComponent,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './list-asignacion-estab.component.html',
  styles: ``
})
export class ListAsignacionEstabComponent {
  private $listAsignacionEstabUseCase = inject(ListAsignacionEstabUseCase)
  private $userCustomerStore = inject(UserCustomerStore);
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  $loading = signal(false)

  dataSource = signal<AsignacionEstabList[]>([])

  columnsDefs: ColumnDefinition[] = [

    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'estab', label: 'Nro. Estab', type: 'string' },
    { key: 'nombreComercial', label: 'Nombre Comercial', type: 'string' },
    { key: 'predeterminado', label: 'Predeterminado', type: 'template' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  pagination = signal(new MatPagination());

  ngOnInit(){

    this.$listAsignacionEstabUseCase.execute({
      userRoleId: this.$userCustomerStore.userRoleId()
    }).subscribe(response=>{
      console.log(response)
      this.dataSource.set(response.data)
    })
  }

  ngAfterViewInit(): void {
    // Asignar el template después de que la vista se haya inicializado
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.statusTemplate;
      }
    });
  }

}

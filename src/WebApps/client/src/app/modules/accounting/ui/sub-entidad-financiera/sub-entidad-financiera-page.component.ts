
import {Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SubEntidadFinancieraRead } from "@accounting/core/domain/subentidad-financiera.model";
import { SubEntidadFinancieraModalComponent } from "@accounting/ui/sub-entidad-financiera/sub-entidad-financiera-modal/sub-entidad-financiera-modal.component";

import Swal from "sweetalert2";
import { ToasterService } from "@core/services/toaster.service";
import {EntidadFinanciera} from "@accounting/core/domain/entidad-financiera.interface";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SubEntidadFinancieraUseCase} from "@accounting/core/use-cases/sub-entidad-financiera.use-case";
import {DialogService} from "@core/services/dialog.service";



@Component({
    selector: 'app-sub-entidad-financiera-page',
    imports: [
      MatCardModule,
      MatExpansionModule,
        FontAwesomeModule,
        FormsModule,
      MatIconModule,
      MatButtonModule,
        BreadcrumbComponent,
      MatDynamicTableComponent
    ],
    templateUrl: './sub-entidad-financiera-page.component.html'
})
export class SubEntidadFinancieraPageComponent {
  private readonly _dialogSvc = inject(DialogService);
  private readonly tS = inject(ToasterService)
  private useCase = inject(SubEntidadFinancieraUseCase)

  entidadesFinanciera: Array<EntidadFinanciera> = [];
  cloneSubEntidadesFinanciera: Array<SubEntidadFinancieraRead> = [];

  subEntidadesFinanciera = new MatTableDataSource<SubEntidadFinancieraRead>();

  dataEntidadFinanciera = {} as EntidadFinanciera

  columnsDefs: ColumnDefinition[] = [

    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'codigo', label: 'Código', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  getData() {

      this.useCase.getAll().subscribe(data => {
        this.entidadesFinanciera = structuredClone(data.entidadesFinancieras);
        this.cloneSubEntidadesFinanciera = structuredClone(data.subEntidadesFinancieras);
        if (this.dataEntidadFinanciera.idEntidadFinanciera > 0) {
          this.showAcordeon(this.dataEntidadFinanciera)
        }
    })

  }


  showAcordeon(dataEntidadFinanciera: EntidadFinanciera) {
    this.dataEntidadFinanciera = dataEntidadFinanciera;
    this.subEntidadesFinanciera.data = [];

    let subEntidadFiltered  = this.cloneSubEntidadesFinanciera.filter(e => e.idEntidadFinanciera === dataEntidadFinanciera.idEntidadFinanciera);

    this.subEntidadesFinanciera = new MatTableDataSource(structuredClone(subEntidadFiltered))
  }


  ngOnInit() {
    this.getData();
  }

  openModal(data?: SubEntidadFinancieraRead) {

    let params = {
      idEntidadFinanciera: this.dataEntidadFinanciera?.idEntidadFinanciera,
      nameEntidadFinanciera: this.dataEntidadFinanciera?.descripcion,
    }

    params = data ? { ...params, ...data } : params

    const modalRef = this._dialogSvc.open(SubEntidadFinancieraModalComponent, {
      size: 'md',
      data: params
    })

    modalRef.subscribe(result => {
      if (result !== null && typeof result === 'object') {
        this.getData();
      }
    })
  }

  askToDelete(data: SubEntidadFinancieraRead) {
    try {
      Swal.fire({
        icon: 'warning',
        html: '<small>Esta seguro/a de eliminar este registro ahora?</small>',
        showDenyButton: true,
        confirmButtonText: `Si, eliminar`,
        denyButtonText: `No, cancelar`,
        allowOutsideClick: false
      }).then(result => {
        if (result.isConfirmed) {
          this.useCase.delete(data.idSubEntidadFinanciera).subscribe((value) => {
                if (value.code === "0") {
                  this.tS.toastr({
                    type: 'warning',
                    message: value.message
                  })
                }
                if (value.code === "1") {
                  this.tS.toastr({
                    type: 'success',
                    message: value.message
                  })
                  this.getData();
                }
          })
        };
      });
    } catch (error) {
      console.log(error)
    }
  }
}

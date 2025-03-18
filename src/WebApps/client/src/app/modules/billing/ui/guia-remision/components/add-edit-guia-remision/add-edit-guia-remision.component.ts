import {Component, inject, signal} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {DialogService} from "@core/services/dialog.service";
import {
  DocsGuiaRemisionComponent
} from "@billing/ui/guia-remision/components/docs-guia-remision/docs-guia-remision.component";
import {
  GetGuiaRemisionFormDataUseCase
} from "@billing/domain/use-cases/guia-remision/get-guia-remision-form-data.use-case.";
import {GroupedEstab, GroupedEstabPuntoEmision} from "@core/models/estab.model";
import {TipoDoc} from "@core/models/tipo-doc.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-edit-guia-remision',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatCustomDialogComponent,
    ThemeButtonComponent
  ],
  templateUrl: './add-edit-guia-remision.component.html',
  styles: ``
})
export class AddEditGuiaRemisionComponent {
  readonly dialogRef = inject(MatDialogRef<AddEditGuiaRemisionComponent>);
   private _dialogSvc = inject(DialogService)

  private $getGuiaRemisionFormDataUseCase = inject(GetGuiaRemisionFormDataUseCase)
  title = 'Nuevo Guía Remisión';

   estabs = signal<GroupedEstab[]>([])
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([])
  tiposDoc = signal<TipoDoc[]>([])

  dataForm = {
     codEstab: "",
    idPuntoEmision: 0,

  }

  dataFormClone = {
     codEstab: "",
  }

   protected openDocs(){
     let ref = this._dialogSvc.open(DocsGuiaRemisionComponent, {
       size: 'lg'
     })
   }


   ngOnInit(){
     this.$getGuiaRemisionFormDataUseCase.execute().subscribe(response=>{
       this.estabs.set(response.estabs);
       let dataEstab = this.estabs().find(item=>item.defaultEstab);

       if (dataEstab) {
         this.dataForm.codEstab = dataEstab.codEstab;
         this.dataFormClone.codEstab = dataEstab.codEstab;

         this.puntosEmision.set(dataEstab.puntosEmision);
         let dataPuntoEmision = this.puntosEmision().find(ptoEmi => ptoEmi.defaultPtoEmi);
         if (dataPuntoEmision) {
          this.dataForm.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
         }
       }

     })
   }



  close(){
    this.dialogRef.close()
  }
}

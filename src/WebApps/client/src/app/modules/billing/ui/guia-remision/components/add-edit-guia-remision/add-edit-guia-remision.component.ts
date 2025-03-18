import {Component, inject} from '@angular/core';
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

@Component({
  selector: 'app-add-edit-guia-remision',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCustomDialogComponent,
    ThemeButtonComponent
  ],
  templateUrl: './add-edit-guia-remision.component.html',
  styles: ``
})
export class AddEditGuiaRemisionComponent {
  readonly dialogRef = inject(MatDialogRef<AddEditGuiaRemisionComponent>);
   private _dialogSvc = inject(DialogService)
title = 'Nuevo Guía Remisión';


   protected openDocs(){
     let ref = this._dialogSvc.open(DocsGuiaRemisionComponent, {
       size: 'lg'
     })
   }
  close(){
    this.dialogRef.close()
  }
}

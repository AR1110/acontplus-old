import {Component, inject, signal} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {SubCategoryModalDirective} from "@inventory/ui/directives/sub-category.directive";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TipoIvaSelectHtmlOnly} from "@inventory/domain/models/tipo-iva.model";
@Component({
  selector: 'app-add-edit-product-dialog',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,

    FormsModule,

    MatCustomDialogComponent,

    //Directives
    SubCategoryModalDirective,
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-product-dialog.component.html',
  styles: ``
})
export class AddEditProductDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddEditProductDialogComponent>);

  subCategories = signal<any[]>([])
  subCategoriesGroup = signal<any[]>([])
  medidas = signal<any[]>([]);
  tiposArticulo = signal<any[]>([]);

  tiposIva = signal<TipoIvaSelectHtmlOnly[]>([]);


  data = {
    idArticulo: 0,
    idEtiqueta: 0,
    descripcion: '',
    idSubFamilia: 0,
    subCategoriaName: null,
    codigo: '',
    codigoBarra: '',
    codigoAuxiliar: '',
    idMedida: 0,
    idTipoArticulo: 0,
    idTipoIva: 0,
    precioCosto: 0.1,
    precioSinSubsidio: 0,
    llevaInventario: false,
    datosAdicionales: false,
    productoFraccionable: false,
    fraccionable: false,
    caducidad: false,
    fechaCaducidad: null,

    datosLote: false,
    lote: null,
    fechaCreacion: null,
    fechaCaducidadLote: null
  }



  onChangeTipoIva(){

  }
  onChangePrecioCosto(){

  }

  close(){
    this.dialogRef.close();
  }
}

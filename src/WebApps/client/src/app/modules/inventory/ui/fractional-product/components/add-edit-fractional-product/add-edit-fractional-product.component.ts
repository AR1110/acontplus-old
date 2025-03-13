import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {ProductSearchComponent} from "@inventory/ui/product/components/product-search/product-search.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-add-edit-fractional-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCustomDialogComponent,
    ProductSearchComponent,
    ThemeButtonComponent
  ],
  templateUrl: './add-edit-fractional-product.component.html',
  styles: ``
})
export class AddEditFractionalProductComponent {
  readonly dialogRef = inject(MatDialogRef<AddEditFractionalProductComponent>);
  readonly params = inject(MAT_DIALOG_DATA);

  title = 'Nuevo'
  btnText = 'Guardar';

  isUpdate(){
    return true;
  }

  save(){

  }

  close(){
    this.dialogRef.close()
  }
}

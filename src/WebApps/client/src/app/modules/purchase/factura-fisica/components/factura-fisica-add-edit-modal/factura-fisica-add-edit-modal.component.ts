import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomContainerDialogComponent } from '@core/components/custom-container-dialog/custom-container-dialog.component';
import { SupplierSearchMatComponent } from '@modules/customer/supplier/components/supplier-search-mat/supplier-search-mat.component';
import { FacturaFisicaService } from '../../factura-fisica.service';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-factura-fisica-add-edit-modal',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    CustomContainerDialogComponent,
    SupplierSearchMatComponent
  ],
  templateUrl: './factura-fisica-add-edit-modal.component.html',
  styles: ``
})
export class FacturaFisicaAddEditModalComponent {

  readonly dialogRef = inject(MatDialogRef<FacturaFisicaAddEditModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private facturaFisicaSvc = inject(FacturaFisicaService)


  title = signal('Nueva Factura Física')


  loading = signal(false);

  sustentosTributario = signal<any[]>([])

  ngOnInit(){

    this.loading.set(true)
    this.facturaFisicaSvc.getDataForm()
    .pipe(finalize(()=>this.loading.set(false)))
    .subscribe(response=>{
        this.sustentosTributario.set(response.sustentosTributario)
    })

  }

  close(){

    this.dialogRef.close()

  }
}

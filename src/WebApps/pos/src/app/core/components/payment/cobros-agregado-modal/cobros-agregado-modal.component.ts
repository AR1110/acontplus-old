import { CustomContainerDialogComponent } from '@/core/components/custom-container-dialog/custom-container-dialog.component';
import { Component, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cobros-agregado-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    CustomContainerDialogComponent,
    CustomTableContainerComponent
  ],
  templateUrl: './cobros-agregado-modal.component.html',
  styleUrl: './cobros-agregado-modal.component.scss'
})
export class CobrosAgregadoModalComponent {
  readonly dialogRef = inject(MatDialogRef<CobrosAgregadoModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);


  displayedColumns: string[] = ['index', 'op', 'fechaEmision', 'entidadFinanciera', 'valor', 'abono'];


  dataSource = signal([])
  ngOnInit(){
    this.dataSource.set(this.data)
    console.log(this.dataSource())
  }

  async deleteRow(event:any){
    let { isConfirmed } = await Swal.fire({
      html: `<small>¿Esta seguro/a de eliminar este Abono ahora?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })

    if(isConfirmed){
      this.dialogRef.close(event)
    }
  }

  closeDialog() {
    this.dialogRef.close()
  }
}

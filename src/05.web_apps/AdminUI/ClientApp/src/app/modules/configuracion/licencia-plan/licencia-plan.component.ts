import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LicenciaPlan } from '@app/models/config/licencia-plan.model';
import { LicenciaPlanService } from '@services/config/licencia-plan.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AddUpdateLicenciaPlanComponent } from './add-update-licencia-plan/add-update-licencia-plan.component';

@Component({
  selector: 'app-licencia-plan',
  templateUrl: './licencia-plan.component.html',
  styleUrls: ['./licencia-plan.component.css']
})
export class LicenciaPlanComponent implements OnInit {
  displayedColumns:string[]=['index', 'aplicacion', 'licencia', 'costo', 'impuesto', 'descuento', 'estado', 'op']
  dataSource!:MatTableDataSource<LicenciaPlan>
  licenciaPlanes:LicenciaPlan[]=[];

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private dialog:MatDialog,
    private _lPlan:LicenciaPlanService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this._lPlan.getAll().subscribe(({payload})=>{
      this.dataSource = new MatTableDataSource(JSON.parse(payload));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  openModalAdd(){
    const dialogRef = this.dialog.open(AddUpdateLicenciaPlanComponent, {
      width:'50%'
    });
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1){
        this.getAll();
      }
    })
  }

  openModalUpdate(data:any){
    const dialogRef = this.dialog.open(AddUpdateLicenciaPlanComponent, {
      width:'50%',
      data
    });
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===2){
        this.getAll();
      }
    })
  }

  async swalFireDelete(data:any){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar este Licencia Plan ahora?</small>`,
      confirmButtonText:'Sí, eliminar',
      showDenyButton:true,
      denyButtonText:'No, cancelar',
      allowEscapeKey:false,
      allowOutsideClick:false
    });
    if(isConfirmed){
      this._lPlan.delete(data.idLicenciaPlan).subscribe(({payload})=>{
        const parseResponse = JSON.parse(payload)[0];
        if(parseResponse.code==="-2"){
          this.toast.warning(parseResponse.message);
          return
        }
        if(parseResponse.code==="0"){
          this.getAll();
          this.toast.success(parseResponse.message);
          return
        }
      })
    }
  }

}

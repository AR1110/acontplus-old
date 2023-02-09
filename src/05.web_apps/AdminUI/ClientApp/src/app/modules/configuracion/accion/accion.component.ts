import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { Accion } from '@models/config/accion.model';
import { AccionService } from '@services/config/accion.service';
import Swal from 'sweetalert2';
import { AddUpdateAccionComponent } from './add-update-accion/add-update-accion.component';

@Component({
  selector: 'app-accion',
  templateUrl: './accion.component.html',
  styleUrls: ['./accion.component.css']
})
export class AccionComponent implements OnInit {
  response:any={}
  displayedColumns=['index','idAccion', 'codigo', 'descripcion', 'estado', 'op'];
  dataSource!: MatTableDataSource<Accion>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private _aSvc:AccionService,
    private toast: ToastrService,
    private dialog:MatDialog
    ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this._aSvc.getAll().subscribe({
      next:response=>{
        this.dataSource = new MatTableDataSource(JSON.parse(response.payload));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort      = this.sort;
      },error: error=>{
        console.log(error)
       // this.toast.error(error.message, error.status)
      },
    })
  }

  ngAfterViewInit(): void {  }

  openModalAdd(){
    const dialogRef = this.dialog.open(AddUpdateAccionComponent,{
      width:'30%'
    });
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1){
        this.getAll();
      }
    })
  }

  openModalUpdate(data:any){
    const dialogRef = this.dialog.open(AddUpdateAccionComponent, {
      width:'30%',
      data
    });
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===2){
        this.getAll();
      }
    })
  }

  async askToDelete(data:Accion){
    const {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar esta accion?</small>`,
      showDenyButton:true,
      confirmButtonText:'Si, Eliminar',
      denyButtonText:'No, cancelar',
      allowOutsideClick:false
    });

    if(isConfirmed){
      this._aSvc.delete(data.idAccion).subscribe({
        next:response=>{
          let parseResponse = JSON.parse(response.payload)[0];
          if(parseResponse.code==="0"){
            this.getAll();
            this.toast.success(parseResponse.message);
            return
          }
          if(parseResponse.code==="-2"){
            this.toast.warning(parseResponse.message);
            return
          }

        },error:error=>{
          this.toast.error(error.status)
        }
      })
    }
  }

}

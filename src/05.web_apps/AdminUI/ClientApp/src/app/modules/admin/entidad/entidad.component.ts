import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EntidadService } from '@services/admin/entidad.service';
import { Entidad } from '@models/admin/entidad.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AddUpdateEntidadComponent } from './add-update-entidad/add-update-entidad.component';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.css']
})
export class EntidadComponent implements OnInit {
  displayedColumns:string[]=['index', 'ruc', 'razonSocial', 'nombreComercial', 'correo', 'direccion',  'estado', 'op'];
  dataSource!: MatTableDataSource<Entidad>

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private _dialog:MatDialog,
    private _eSvc: EntidadService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  entidadFilter(e:Event){
    const txtFilter = (e.target as HTMLInputElement).value;
    this.dataSource.filter = txtFilter;
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  getAll(){
    this._eSvc.getAll().subscribe(response=>{
      this.dataSource = new MatTableDataSource(JSON.parse(response.data));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  openModalAdd(){
    const dialogRef = this._dialog.open(AddUpdateEntidadComponent, {width:'50%'})
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro==1){
        this.getAll();
      }
    })
  }

  openModalUpdate(data:any){
    const dialogRef = this._dialog.open(AddUpdateEntidadComponent, {width:'50%', data})
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro==2){
        this.getAll();
      }
    })
  }


  async swalFireDelete(data:any){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar esta <strong>Entidad</strong> ahora?</small>`,
      confirmButtonText:'Sí, eliminar',
      showDenyButton:true,
      denyButtonText:'No, cancelar',
      allowEscapeKey:false,
      allowOutsideClick:false
    });
    if(isConfirmed){
      this._eSvc.delete(data.idEntidad).subscribe(response=>{
        if(response.id==='0'){
          this._toastr.warning(response.message, response.titleSms)
        }

        if(response.id==="1"){
          this.getAll();
          this._toastr.success(response.message)
        }
      })
    }
  }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


import { UsuarioRolService } from '@services/admin/usuario-rol.service';
import { UsuarioRol } from '@models/admin/usuario-rol.model';
import { AddUpdateUsuarioRolComponent } from './add-update-usuario-rol/add-update-usuario-rol.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AccesoMenuComponent } from '../acceso-menu/acceso-menu.component';



@Component({
  selector: 'app-usuario-rol',
  templateUrl: './usuario-rol.component.html',
  styleUrls: ['./usuario-rol.component.css']
})
export class UsuarioRolComponent implements OnInit {
  displayedColumns:string[]=['index','usuario', 'ruc', 'entidad', 'codRol', 'estado', 'op'];
  dataSource!:MatTableDataSource<UsuarioRol>;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private _dialog:MatDialog,
    private _uRSvc:UsuarioRolService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  usuarioRolFilter(e:Event){
    const txtFilter = (e.target as HTMLInputElement).value;
    this.dataSource.filter = txtFilter;
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  getAll(){
    this._uRSvc.getAll().subscribe(response=>{
      this.dataSource = new MatTableDataSource(response || []);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  openModalAdd(){
    const dialogRef = this._dialog.open(AddUpdateUsuarioRolComponent, {width:'50%'});
    dialogRef.afterClosed().subscribe(tipo=>{
      if(tipo===1){
        this.getAll();
      }
    })
  }

  openModalUpdate(data:any){
    const dialogRef = this._dialog.open(AddUpdateUsuarioRolComponent, {width:'50%', data});
    dialogRef.afterClosed().subscribe(tipo=>{
      if(tipo===2){
        this.getAll();
      }
    })
  }

  async swalFireDelete(data:any){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar este  Registro ahora?</small>`,
      confirmButtonText:'Sí, eliminar',
      showDenyButton:true,
      denyButtonText:'No, cancelar',
      allowEscapeKey:false,
      allowOutsideClick:false
    })

    if(isConfirmed){
      this._uRSvc.delete(data.idUsuarioRol).subscribe(response=>{
        if(response.id==="0"){
          this._toastr.warning(response.message);
        }
        if(response.id==="1"){
          this.getAll();
          this._toastr.success(response.message)
        }
      })
    }

  }


  openModalAcceso(data:any){
    this._dialog.open(AccesoMenuComponent, {width:'60%', data})
  }


}

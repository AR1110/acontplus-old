import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from '@app/services/admin/usuario.service';
import { Usuario } from '@models/admin/usuario.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { UpdateUsuarioComponent } from './update-usuario/update-usuario.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  displayedColumns:string[]=['index', 'nroIdentificacion', 'nombreCompleto', 'correo', 'usuario', 'estado','op'];
  dataSource!:MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private _uSvc: UsuarioService,
    private _dialog: MatDialog,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  usuarioFilter(e:Event){
    const txtFilter = (e.target as HTMLInputElement).value;
    this.dataSource.filter = txtFilter;
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  getAll(){
    this._uSvc.getAll().subscribe(response=>{
      this.dataSource = new MatTableDataSource(JSON.parse(response.data));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  openModalAdd(){
    const dialogRef = this._dialog.open(AddUsuarioComponent, {width:'50%'});
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1){
        this.getAll();
      }
    })
  }

  openModalUpdate(data:any){
    const dialogRef = this._dialog.open(UpdateUsuarioComponent, {
      width:'50%',
      data
    });
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1){
        this.getAll();
      }
    })
  }

  async swalFireDelete(data:any){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar este Usuario ahora?</small>`,
      confirmButtonText:'Sí, eliminar',
      showDenyButton:true,
      denyButtonText:'No, cancelar',
      allowEscapeKey:false,
      allowOutsideClick:false
    });
    if(isConfirmed){
      this._uSvc.delete(data.idUsuario).subscribe(response=>{
        if(response.id==='0'){
          this._toastr.warning(response.message, response.titleSms)
        }

        if(response.id==="1"){
          this._toastr.success(response.message, response.titleSms)
         this.getAll();
        }
      })
    }
  }



}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AplicacionMenu } from '@models/config/aplicacion-menu.model';
import { AplicacionMenuService } from '@services/config/aplicacion-menu.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AddUpdateAplicacionMenuComponent } from './add-update-aplicacion-menu/add-update-aplicacion-menu.component';

@Component({
  selector: 'app-aplicacion-menu',
  templateUrl: './aplicacion-menu.component.html',
  styleUrls: ['./aplicacion-menu.component.css']
})
export class AplicacionMenuComponent implements OnInit {
  displayedColumns:string[]=['index', 'aplicacion', 'menu', 'subMenu', 'estado', 'op'];
  dataSource!:MatTableDataSource<AplicacionMenu>;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private dialog:MatDialog,
    private _aMSvc:AplicacionMenuService,
    private toast:ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this._aMSvc.getAll().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })
  }

  aplicacionMenuFilter(e:Event){
    const textFilter = (e.target as HTMLInputElement).value;
    this.dataSource.filter = textFilter;
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }


  openModalAdd(){
    const dialoRef = this.dialog.open(AddUpdateAplicacionMenuComponent, {
      width:'40%'
    });
    dialoRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1){
        this.getAll();
      }
    })
  }

  openModalUpdate(data:any){
    const dialoRef = this.dialog.open(AddUpdateAplicacionMenuComponent, {
      width:'40%',
      data
    });
    dialoRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===2){
        this.getAll();
      }
    })
  }

  async swalFireDelete(data:any){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar este Aplicación Menpu ahora?</small>`,
      confirmButtonText:'Si, eliminar',
      showDenyButton:true,
      denyButtonText:'No, cancelar',
      allowEscapeKey:false,
      allowOutsideClick:false
    });
    if(isConfirmed){
      this._aMSvc.delete(data.idAplicacionMenu).subscribe(res=>{
        if(res.code==="-2"){
          this.toast.warning(res.message);
          return
        }
        if(res.code==="0"){
          this.toast.success(res.message);
          this.getAll();
          return
        }
      })
    }
  }

}

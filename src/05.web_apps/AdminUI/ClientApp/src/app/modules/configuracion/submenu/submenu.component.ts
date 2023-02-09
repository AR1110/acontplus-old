import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { Menu } from '@models/config/menu.model';
import { Submenu } from '@models/config/submenu.model';
import { SubmenuService } from '@services/config/submenu.service';
import Swal from 'sweetalert2';
import { AddUpdateSubmenuComponent } from './add-update-submenu/add-update-submenu.component';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent implements OnInit {
  response:any={};
  displayedColumns: string[]=['index','idSubMenu', 'codigo', 'descripcion', 'urlSubMenu', 'estado', 'op'];
  dataSource!:MatTableDataSource<Submenu>
  menus:Menu[]=[];

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private dialog: MatDialog,
    private subMenuSvc: SubmenuService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.subMenuSvc.getAll().subscribe(response=>{
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }



  openModalAdd(){
    const dialogRef =  this.dialog.open(AddUpdateSubmenuComponent,{
      width:'35%',
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1){
        this.getAll();
      }
    });
  }

  openModalUpdate(data:any){
    const dialogRef = this.dialog.open(AddUpdateSubmenuComponent, {
      width:'35%',
      hasBackdrop: true,
      data
    });
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===2){
        this.getAll();
      }
    })
  };

  async askToDelete(item:any){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar este <b>SubMenu</b></small>`,
      showDenyButton: true,
      confirmButtonText: `Si, eliminar`,
      denyButtonText: `No, cancelar`,
      allowOutsideClick: false
    });

    if(isConfirmed){
      this.subMenuSvc.delete(item.idSubMenu).subscribe(response=>{
        let parseResponse = JSON.parse(response.payload)[0];
        if(parseResponse.code==="0"){
          this.toast.success(parseResponse.message);
          this.getAll();
          return
        }
        if(parseResponse.code==="-2"){
          this.toast.warning(parseResponse.message);
          return
        }
      })
    }
  }
}

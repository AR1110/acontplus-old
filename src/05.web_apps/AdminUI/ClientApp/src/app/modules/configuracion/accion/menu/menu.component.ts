import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '@services/config/menu.service';
import {Menu} from '@models/config/menu.model';
import { AddUpdateMenuComponent } from './add-update-menu/add-update-menu.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  response:any;
  displayedColumns: string[]=['index','idMenu', 'codigo', 'urlMenu', 'icono', 'descripcion','op'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog : MatDialog,
    private _mS: MenuService,
    private _toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this._mS.getAll().subscribe({
      next: response=>{
        this.dataSource = new MatTableDataSource(response);
        console.log(response)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  openModalAdd(){
    this.dialog.open(AddUpdateMenuComponent, {
      width:'30%'
    }).afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1) this.getAll();
    })
  }

  save(){

  }

  update(data:any){
    this.dialog.open(AddUpdateMenuComponent, {
      width:'30%',
      data: data
    }).afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===2){
        this.getAll();
      }
    })
  }

  async delete(data:any){
    let {isConfirmed} = await Swal.fire({
      icon: 'warning',
      html: 'Esta seguro/a de eliminar este <b>Menu</b> ahora?',
      showDenyButton: true,
      confirmButtonText: `Si, eliminar`,
      denyButtonText: `No, cancelar`,
      allowOutsideClick: false
    });
    if(isConfirmed){
      this._mS.delete(data.idMenu).subscribe(response=>{
        if(response.code==="-2"){
          this._toastr.warning(response.message);
          return
        }
        if(response.code==="0"){
          this.getAll();
          this._toastr.success(response.message);
        }
      })
    }
  }
}

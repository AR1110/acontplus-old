import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMenu } from '../../domain/models/menu.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalMenuComponent } from './modal-menu/modal-menu.component';
import { MenuService } from '../../data/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit  {

  displayedColumns: string[]=['index','idMenu', 'codigo', 'urlMenu', 'icono', 'descripcion','op'];
  dataSource!: MatTableDataSource<IMenu>

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(private _dialog: MatDialog, private _menuSvc: MenuService){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAll()
  }

  getAll(){
    this._menuSvc.getAll().subscribe(response=>{
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  openModalNew(){
    let modalRef = this._dialog.open(ModalMenuComponent, {width:'30%'})
    console.log(modalRef)
    modalRef.afterClosed().subscribe(res=>{

    })
  }


  openModalEdit(data:IMenu){
    let modalRef = this._dialog.open(ModalMenuComponent, {width:'30%', data})
    
  }



  askToDelete(data:IMenu){
    Swal.fire({
      title: '<small>Estas seguro?</small>',
      html: "<small>¡No podrás revertir esto!</small>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._menuSvc.delete(data.idMenu).subscribe(response=>{
          console.log(response)
        })
      }
    })
  }


}

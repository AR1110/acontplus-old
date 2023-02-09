import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Asignacion } from '@models/config/asignacion.model';
import { AsignacionService } from '@services/config/asignacion.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AddUpdateAsignacionComponent } from './add-update-asignacion/add-update-asignacion.component';


@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html'
})
export class AsignacionComponent implements OnInit {
  displayedColumns:string[]=['index', 'menu', 'subMenu', 'accion', 'estado', 'op'];
  dataSource!:MatTableDataSource<Asignacion>;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;


  constructor(
    private _asigSvc: AsignacionService,
    private _dialog:MatDialog,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this._asigSvc.getAll().subscribe(response=>{
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  asignacionFilter(e:Event){
    const txtFilter = (e.target as HTMLInputElement).value;
    this.dataSource.filter = txtFilter;
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  openModalAdd(){
    this._dialog.open(AddUpdateAsignacionComponent, {width:'50%'}).afterClosed().subscribe(tipo=>{
      if(tipo===1){
        this.getAll();
      }
    })
  }

  openModalUpdate(data:any){
    this._dialog.open(AddUpdateAsignacionComponent, {width:'50%', data}).afterClosed().subscribe(tipo=>{
      if(tipo===2){
        this.getAll();
      }
    })
  }

  async swalFireDelete(data:any){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar esta Asignación ahora?</small>`,
      confirmButtonText:'Sí, eliminar',
      showDenyButton:true,
      denyButtonText:'No, cancelar',
    });
    if(isConfirmed){
      this._asigSvc.delete(data.idAsignacion).subscribe(response=>{
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

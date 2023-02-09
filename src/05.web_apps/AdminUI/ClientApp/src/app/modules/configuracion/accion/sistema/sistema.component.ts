import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sistema } from '@app/models/config/sistema.model';
import { SistemaService } from '@services/config/sistema.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AddUpdateSistemaComponent } from './add-update-sistema/add-update-sistema.component';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.css']
})
export class SistemaComponent implements OnInit {
  displayedColumns:string[]=['index','descripcion', 'urlSistema', 'hostApp', 'connectionStrings', 'estado', 'op'];

  dataSource!:MatTableDataSource<Sistema>;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort

  constructor(
    private _sistemaSvc:SistemaService,
    private _toast: ToastrService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  sistemaFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue;
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  getAll(){
    this._sistemaSvc.getAll().subscribe(({payload})=>{
      this.dataSource = new MatTableDataSource(JSON.parse(payload));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  openModalAdd(){
    const dialogRef = this._dialog.open(AddUpdateSistemaComponent, {
      width:'50%'
    });
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      this.getAll();
    })
  }

  openModalUpdate(data:any){
    const dialogRef = this._dialog.open(AddUpdateSistemaComponent, {
      width:'50%',
      data
    });
    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      this.getAll();
    })
  }

  async swalAlertDelete(id:number){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar este sistema ahora?</small>`,
      showDenyButton:true,
      confirmButtonText:'Si, eliminar',
      denyButtonText:'No, cancelar',
      allowOutsideClick:false
    });
    if(isConfirmed){
      this._sistemaSvc.delete(id).subscribe(({payload})=>{
        const parseResponse = JSON.parse(payload)[0];
        if(parseResponse.code==="0"){
          this.getAll();
          this._toast.success(parseResponse.message);
          return
        }
        if(parseResponse.code==="-2"){
          this._toast.warning(parseResponse.message);
          return
        }
      })
    }
  }
}

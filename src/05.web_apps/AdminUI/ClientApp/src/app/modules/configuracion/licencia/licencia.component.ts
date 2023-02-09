import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Licencia } from '@app/models/config/licencia.model';
import { LicenciaService } from '@app/services/config/licencia.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AddUpdateLicenciaComponent } from './add-update-licencia/add-update-licencia.component';

@Component({
  selector: 'app-licencia',
  templateUrl: './licencia.component.html',
  styleUrls: ['./licencia.component.css']
})
export class LicenciaComponent implements OnInit {
  displayedColumns: string[]=['index', 'codigo', 'titulo', 'descripcion', 'estado', 'op']
  dataSource!:MatTableDataSource<Licencia>

  @ViewChild(MatPaginator) paginator!:MatPaginator
  @ViewChild(MatSort) sort!:MatSort

  constructor(
    private _lSvc:LicenciaService,
    private modalDialog: MatDialog,
    private toast:ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  licenciaFilter(e:Event){
    const txtFilter = (e.target as HTMLInputElement).value;
    this.dataSource.filter = txtFilter;
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
  getAll(){
    this._lSvc.getAll().subscribe(response=>{
      this.dataSource = new MatTableDataSource(JSON.parse(response.payload));
    })
  }

  openModalAdd(){
    const modalRef = this.modalDialog.open(AddUpdateLicenciaComponent,{
      width:'40%'
    });
    modalRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1){
        this.getAll();
      }
    })
  }

  openModalUpdate(data:any){
    const modalRef = this.modalDialog.open(AddUpdateLicenciaComponent, {
      width:'40%',
      data
    });
    modalRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===2){
        this.getAll();
      }
    })
  }

  async swalFireDelete(data:any){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar esta Licencia ahora?</small>`,
      confirmButtonText:'Si, eliminar',
      showDenyButton:true,
      denyButtonText:'No, cancelar',
      allowEscapeKey:false,
      allowOutsideClick:false
    });
    if(isConfirmed){
      this._lSvc.delete(data.idLicencia).subscribe(({payload})=>{
        const parseResponse = JSON.parse(payload)[0];
        if(parseResponse.code==="0"){
          this.getAll();
          this.toast.success(parseResponse.message);
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

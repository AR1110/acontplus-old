import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AplicacionService } from '@services/config/aplicacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddUpdateAplicacionComponent } from './add-update-aplicacion/add-update-aplicacion.component';
import { Aplicacion } from '@models/config/aplicacion.model';


@Component({
  selector: 'app-aplicacion',
  templateUrl: './aplicacion.component.html',
  styleUrls: ['./aplicacion.component.css']
})
export class AplicacionComponent implements OnInit {
  response:any={};

  displayedColumns: string[]=['index','codigo', 'descripcion', 'estado','op'];
  dataSource!:MatTableDataSource<Aplicacion>

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private aplicacionSvc: AplicacionService,
    private dialog: MatDialog,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  aplicacionFilter(e:Event){
    const txtFilter = (e.target as HTMLInputElement).value;
    this.dataSource.filter = txtFilter;
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  getAll(){
    this.aplicacionSvc.getAll({tipo:'G'}).subscribe({
      next: response=>{
        this.response = response;
        this.dataSource = new MatTableDataSource(JSON.parse(this.response.payload));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },error:error=>{
        console.log(error)
      }
    })
  }



  openModalAdd(){
    const dialogRef = this.dialog.open(AddUpdateAplicacionComponent, {
      width:'50%'
    });

    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1){
        this.getAll();
      }
    })
  }

  openModalUpdate(item:Aplicacion){
    const dialogRef = this.dialog.open(AddUpdateAplicacionComponent, {
      width:'50%',
      data: item
    });

    dialogRef.afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===2){
        this.getAll();
      }
    })
  }


  async delete(id:number){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar esta Aplicación ahora?</small>`,
      confirmButtonText:'Si, eliminar',
      showDenyButton:true,
      denyButtonText:'No, cancelar',
      allowOutsideClick:false
    });
    if(isConfirmed){
      this.aplicacionSvc.delete(id).subscribe(({payload})=>{
        const parseRes = JSON.parse(payload)[0];
        if(parseRes.code==="-2"){
          this.toast.warning(parseRes.message);
          return
        }
        if(parseRes.code==="0"){
          this.toast.success(parseRes.message);
          this.getAll();
          return
        }
      })
    }
  }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { SuscripcionService } from '@app/services/config/suscripcion.service';
import { ToastrService } from 'ngx-toastr';

import {Suscripcion} from '@app/models/config/suscripcion.model';
import { AddUpdateSuscripcionComponent } from './add-update-suscripcion/add-update-suscripcion.component';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css']
})


export class SuscripcionComponent implements OnInit {
  response:any ={};
  displayedColumns: string[] = ['index','idSuscripcion', 'codigo', 'descripcion', 'cantidad', 'tiempo', 'estado', 'op'];
  dataSource!:MatTableDataSource<any>;




  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private dialog: MatDialog,
    private suscripcionSvc: SuscripcionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.suscripcionSvc.getAll().subscribe({
      next: data=>{
        this.response = data;
        this.dataSource = new MatTableDataSource(JSON.parse(this.response.payload));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error: error =>{
        console.log(error)
      }
    })
  }

  openModalAdd(){
    this.dialog.open(AddUpdateSuscripcionComponent, {
      width:'30%'
    }).afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===1){
        this.getAll();
      }
    })
  }

  editSuscripcion(item:{}){
    this.dialog.open(AddUpdateSuscripcionComponent, {
      width:'30%',
      data: item
    }).afterClosed().subscribe(tipoRegistro=>{
      if(tipoRegistro===2){
        this.getAll();
      }
    })
  };

  deleteSuscripcion(data:Suscripcion){
    Swal.fire({
        icon: 'warning',
        //title: 'Insumos',
        html: 'Esta seguro/a de eliminar esta <b>suscripción</b> ahora?',
        showDenyButton: true,
        confirmButtonText: `Si, eliminar`,
        denyButtonText: `No, cancelar`,
        allowOutsideClick: false
    }).then(response => {
        if (response.isConfirmed) {
          this.suscripcionSvc.delete(data.idSuscripcion).subscribe({
            next: response=>{
              console.log(response)
            },error:error=>{

            }
          })
          return;
        };
    });
  }

}

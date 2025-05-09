import {Component, inject, model, signal} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {
  GetFormDataImportacionUseCase
} from "@modules/config/domain/use-cases/importacion/get-form-data-importacion.use-case";
import {MatInput} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import {read, utils, WorkBook, WorkSheet} from "xlsx";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
@Component({
  selector: 'app-importacion',
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatIconModule,
    MatButtonModule,
    MatInput,
    MatDivider,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './importacion.component.html',
  styles: `
    mat-header-cell {
      white-space: normal !important;    /* permite saltos de línea */
      word-wrap: break-word;
      word-break: break-word;
      font-weight: bold;                 /* para que luzca más como encabezado */
      text-align: center;                /* opcional: para alinear los títulos */
      padding: 12px 8px;
    }


  `
})
export class ImportacionComponent {
  private $getFormData = inject(GetFormDataImportacionUseCase)
  modules = signal<any[]>([])

  urlFile!:string;
  data = model({
    codeModule: '',
    nameModule: ''
  })

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  // ngOnInit(){
  //   this.$getFormData.execute().subscribe(response=>{
  //     this.modules.set(response.modules)
  //   })
  // }

  handleChangeModule(){
    const dataModule = this.modules().find(item=>item.codigo===this.data().codeModule);
    this.data.update(item=>{
      return {
        nameModule: dataModule.descripcion,
        codeModule: dataModule.codigo
      }
    })
  }

  onFileSelected(ev: any): void {
    const target: DataTransfer = <DataTransfer>(ev.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const ab: ArrayBuffer = e.target.result;
      const wb: WorkBook = read(ab, {type: 'binary', cellDates: true});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data:any =(utils.sheet_to_json(ws, {header: 1}));

      console.log(data)

      const [headers, ...rows] = data;

      this.displayedColumns = headers;
      this.dataSource.data = rows.map((row:any) => {
        const obj: any = {};
        headers.forEach((header: string, i: number) => {
          obj[header] = row[i];
        });
        return obj;
      });

      console.log( this.dataSource.data)
    };
    reader.readAsArrayBuffer(target.files[0]);
  }


  convertToExcel(){
    console.log()
  }

}

import {Component, inject, model, signal} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {
  GetFormDataExcelImportUseCase
} from "@modules/config/application/use-cases/excel-import/get-form-data-excel-import.use-case";
import {MatInput} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {FormsModule} from "@angular/forms";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {ExcelImportService} from "@modules/config/application/services/excel-import.service";
import Swal from "sweetalert2";
import {
  ValidateImportedDataUseCase
} from "@modules/config/application/use-cases/excel-import/validate-imported-data.use-case";
import {finalize} from "rxjs/operators";
import {isValidField} from "@core/utils/utils";
import {SaveExcelImportUseCase} from "@modules/config/application/use-cases/excel-import/save-excel-import.use-case";
@Component({
  selector: 'app-excel-import',
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
    MatTableModule,
  ],
  templateUrl: './excel-import.component.html',
  styles: `
    //mat-header-cell {
    //  white-space: normal !important;
    //  word-wrap: break-word;
    //  word-break: break-word;
    //  font-weight: bold;
    //  text-align: center;
    //  padding: 12px 8px;
    //}

    .table-container {
      width: 100%;
      overflow-x: auto; /* permite scroll horizontal si hay muchas columnas */
    }

    .full-width-table {
      width: 100%;
      min-width: 600px; /* puedes ajustar este valor según tus columnas */
    }

    .column-header,
    .column-cell {
      padding: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 120px; /* fuerza una anchura mínima por columna */
      max-width: 300px; /* opcional, si deseas limitar el ancho */
      flex: 1;
      box-sizing: border-box;
    }


  `
})
export class ExcelImportComponent {
  private $getFormData = inject(GetFormDataExcelImportUseCase);
  private $validateImportedData = inject(ValidateImportedDataUseCase)
  private $saveUseCase = inject(SaveExcelImportUseCase)
  private _excelImportSvc = inject(ExcelImportService)
  modules = signal<any[]>([])

  urlFile!:string;
  data = model({
    codeModule: '',
    nameModule: ''
  })

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  tempArrayFiles: any[] = [];

  selected = signal([])
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

  async onFileSelected(ev: any) {
    const target: DataTransfer = <DataTransfer>(ev.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    try {
      const rawData = await this._excelImportSvc.parseExcelFile(target.files[0]);
      this.displayedColumns = Object.keys(rawData[0]).map(c => c.trim());
      this.tempArrayFiles = this._excelImportSvc.mapItems(rawData, this.displayedColumns).map(row =>
        this._excelImportSvc.cleanRow(row, this.displayedColumns, this.data().codeModule)
      );
      this.validateImport();
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }

    // const reader: FileReader = new FileReader();
    // reader.onload = (e: any) => {
    //
    //   const ab: ArrayBuffer = e.target.result;
    //   const wb: WorkBook = read(ab, {type: 'binary', cellDates: true});
    //
    //
    //   const wsname: string = wb.SheetNames[0];
    //   const ws: WorkSheet = wb.Sheets[wsname];
    //
    //   /* save data */
    //   const data:any =(utils.sheet_to_json(ws, {header: 1}));
    //
    //   console.log(data)
    //
    //   const [headers, ...rows] = data;
    //
    //   this.displayedColumns = headers;
    //   const tempArrayFiles = this._excelImportSvc.mapItems(rows, this.displayedColumns).map(row =>
    //     this._excelImportSvc.cleanRow(row, this.displayedColumns, this.data().codeModule)
    //   );
    //
    //
    //   this.tempArrayFiles.set(tempArrayFiles);
    //   this.validateImport()
    // };
    // reader.readAsArrayBuffer(target.files[0]);
  }


  async validateImport(){
    Swal.fire({
      title: '<small>Espere por favor...</small>',
      html: 'Validando datos...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

      this.$validateImportedData.execute({
        code: this.data().codeModule,
        data: {
          jsonParams: JSON.stringify(this.tempArrayFiles)
        }
      })
        .pipe(
          finalize(() => Swal.close())
        )
        .subscribe(response=>{
          if (response.code === '0') {
            Swal.fire({ icon: 'warning', html: `<small>${response.message}</small>` });
          } else if (response.code === '1') {
            Swal.close();
            const payload = JSON.parse(response.payload as string);
            this.dataSource.data = payload;
            this.displayedColumns = Object.keys(payload[0]).filter(item=>!["idArticulo", "idMedida", "idSubFamilia", "idTipoIva"].includes(item))

          }
      })
  }


  showSwalFire(campo: string){
    Swal.fire({
      icon:'warning',
      html:`Ingrese campo ${campo}`
    })
  }

  private isValidForm(){
    let isComplete = false;
    for(let item of this.dataSource.data){
      if(item.hasOwnProperty("codigo") && !isValidField(item.codigo)){
        this.showSwalFire('codigo')
        return
      }

      //Cliente/Proveedor
      if(item.hasOwnProperty("codContribuyente") && !isValidField(item.codContribuyente)){
        this.showSwalFire('codContribuyente')
        return
      }

      if(item.hasOwnProperty("codIdentificacion") && !isValidField(item.codIdentificacion)){
        this.showSwalFire('codIdentificacion')
        return
      }

      if(item.hasOwnProperty("nombreComercial") && !isValidField(item.nombreComercial)){
        this.showSwalFire('nombreComercial')
        return
      }

      if(item.hasOwnProperty("nombreFiscal") && !isValidField(item.nombreFiscal)){
        this.showSwalFire('nombreFiscal')
        return
      }

      isComplete = true;
    }

    if(isComplete){
      this.save();
    }

  }

  save(){
    Swal.fire({
      icon: 'warning',
      html: `
      ¿Está seguro de guardar la importación de
      <b><h3>${this.selected().length}</h3></b>
      ítems del módulo <b>${this.data().nameModule}</b>?`,
      showDenyButton: true,
      confirmButtonText: 'Sí, guardar',
      denyButtonText: 'No, cancelar',
      allowOutsideClick: false,
    }).then(result=>{
      const sendData = {
        code: this.data().codeModule,
        data:   {
          jsonParams: JSON.stringify(this.selected())
        }
      }

      this.$saveUseCase.execute(sendData)
        .pipe(finalize(() => Swal.close()))
        .subscribe(response=>{
        if(response.code==="0"){
          Swal.fire({
            icon:'warning',
            html:`<small>${response.message}</small>`
          })
        }
        if(response.code==="1"){
          const timer = 1000;
          Swal.fire({
            icon:'success',
            html:`<small>${response.message}</small>`,
            timer
          })

          setTimeout(()=>{
            this.data.set({
              codeModule: '',
              nameModule: ''
            })
          },timer )
          this.selected.set([]);
          this.displayedColumns = [];
          this.dataSource.data = [];
        }
      })


    })
  }

}

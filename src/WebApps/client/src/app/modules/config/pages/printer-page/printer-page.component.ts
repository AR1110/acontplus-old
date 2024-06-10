import {Component, inject} from '@angular/core';
import {PrinterService} from "@modules/config/services/printer.service";
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {PrinterRead} from "@modules/config/models/printer.model";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {ModalService} from "@core/services/modal.service";
import {
  PrinterAddEditModalComponent
} from "@modules/config/pages/printer-page/components/printer-add-edit-modal/printer-add-edit-modal.component";
import {isApiResponse} from "@core/models/api-response";
import {ToasterService} from "@core/services/toaster.service";
import Swal from "sweetalert2";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-printer-page',
  standalone: true,
  imports: [
    FormsModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    FontAwesomeModule
  ],
  templateUrl: './printer-page.component.html',
  styles: ``
})
export class PrinterPageComponent {
  private printerSvc = inject(PrinterService)
  private modalSvc = inject(ModalService)
  private tS = inject(ToasterService)

  printers:PrinterRead[]=[]

  openModalNewOrEdit(item?:PrinterRead){
    let modalRef = this.modalSvc.open(PrinterAddEditModalComponent, {
      backdrop: 'static',
      size: 'xl'
    })

    let data = {};
    if(item){
      data = item;
    }
    console.log(data)
    modalRef.componentInstance.params = {
      data,
      printers: structuredClone(this.printers)
    }
    modalRef.result.then(result=>{
      if(result && typeof  result==='object'){
        this.getPrinters()
      }
    })
  }

  getPrinters(){
    this.printers = []
    this.printerSvc.getPrinters().subscribe(response=>{
      this.printers = response.printers;
    })
  }

  ngOnInit(){
    this.getPrinters()
  }

  successResponse = (response:unknown)=>{
    this.getPrinters()
    if(isApiResponse(response)){
      if(response.code==="0"){
        this.tS.toastr({
          type: 'warning',
          message: response.message
        })
      }
      if(response.code==="1"){
        this.tS.toastr({
          type: 'success',
          message: response.message
        })

      }
    }
  }
  async askToDelete(item:PrinterRead){
    let { isConfirmed } = await Swal.fire({
      title: '¿Está seguro de eliminar esta impresora?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar',
      allowOutsideClick: false
    })
    if (isConfirmed) {
      this.printerSvc.removePrinter(item.id).subscribe(this.successResponse)
    }
  }

  updateStatus(item:PrinterRead){
    this.printerSvc.updateStatus(item.id, item).subscribe(this.successResponse)
  }
}

import {Component, inject, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PrinterService} from "@modules/config/services/printer.service";
import {forkJoin} from "rxjs";
import {ToasterService} from "@core/services/toaster.service";
import {EstablecimientoSelectHtmlOnly} from "@core/models/estab.model";
import {PrinterRead, PrinterTypeSelectHtmlOnly} from "@modules/config/models/printer.model";
import {FormsModule} from "@angular/forms";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {PrinterDocService} from "@modules/config/services/printer-doc.service";
import {isApiResponse} from "@core/models/api-response";
import {isValidField} from "@core/utils/utils";
import {DOC_TYPE} from "@core/constants/global.constants";

@Component({
    selector: 'app-printer-add-edit-modal',
    imports: [
        FormsModule,
        MatSlideToggleModule
    ],
    templateUrl: './printer-add-edit-modal.component.html',
    styles: ``
})
export class PrinterAddEditModalComponent {
  @Input() params = {
    data: {} as any,
    printers: [] as PrinterRead[]
  }
  modal = inject(NgbActiveModal)
  printerSvc = inject(PrinterService);
  tS = inject(ToasterService)
  printerDocSvc = inject(PrinterDocService)

  modalTitle='Nueva Impresora';
  btnText = 'Guardar';


  localPrinters:any[] = []

  estabs: EstablecimientoSelectHtmlOnly[]=[]
  documents:any[]=[]
  printerTypes:PrinterTypeSelectHtmlOnly[]=[]

  data = {
    machine: '',
    establecimientoId: 0,
    ipAddress: '',
    printerTypeId: 0,
    name: '',
    serverDevice: '',
    macAddress:'',
    isDefault: false
  }

  successResponsePrinterDoc =(response:unknown)=>{
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
        this.getDataEdit(false)
      }
    }
  }

  successResponse =(response:unknown)=>{
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
        this.modal.close(response)
      }
    }
  }

  getDataForm(isRegister: boolean){
    this.printerSvc.getDataForm().subscribe(response=>{

      this.estabs =response.estabs;
      this.printerTypes = response.printerTypes;

      if(isRegister){
        this.documents = response.documents.map((item:any) => {
          item.copies = 1
          return item
        })

        if (this.estabs.length > 0) {
          this.data.establecimientoId = this.estabs.find(e=>e.predeterminado)?.idEstablecimiento ??0;
        }
      }
      if(this.estabs.length===0){
        this.tS.toastr({
          type: 'warning',
          message: 'No tienes asignado los establecimientos'
        })
      }

    })

  }

  getLocalPrinters(){
    this.printerSvc.getLocalPrinters().subscribe({
      next: (response)=>{
        this.localPrinters = response.localPrinters;
        this.data.machine = this.localPrinters[0]?.machine
      },
      error:(err)=>{
        console.log(err)
        this.tS.toastr({
          type: 'warning',
          message:  'Por favor instale el programa Acontplus Print, para obtener el listado de impresoras'
        })
      }
    })
  }

  getDataEdit(isReload: boolean){
    this.printerSvc.getDataEdit(this.params.data.id).subscribe(response=>{
      if(isReload){
        console.log(response.data)
        this.data = response.data;
      }
      this.documents = response.documents;
    })
  }

  async ngOnInit(){
    if(this.params.data.id>0){
      this.modalTitle='Editar Impresora';
      this.btnText = 'Actualizar';


      this.getDataForm(false)
      await this.getDataEdit(true);
      this.getLocalPrinters();

    }else{
      if (this.params.printers.every(item => !item.isDefault)) {
        this.data.isDefault = true;
      }
      if(this.params.printers.length>0){
       this.data.ipAddress = this.params.printers[0].ipAddress
      }else{
        this.data.ipAddress = 'acontplusprint.com'
      }

      this.getDataForm(true)
      this.getLocalPrinters()
    }


  }



  async updateDocument (data:any)  {
    if (!data.enabled) {
      data.copies = 1;
    }
    if (this.params.data.id>0) {

      if (data.id > 0) {
        !data.enabled ? data.labelEnabled = 'Inactiva' : 'Activa';

        this.printerDocSvc.put(data.id, data).subscribe(this.successResponsePrinterDoc)

      }

      if(!(data.id>0)) {
        let params = {
          ...data,
          printerId: this.params.data.id
        }
        this.printerDocSvc.post(params).subscribe(this.successResponsePrinterDoc)
      }
    }
  }


  saveEdit(){
    if (!(this.data.establecimientoId >0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Establecimiento'
      })
      return
    }
    if (!isValidField(this.data.name)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Se necesita ingresar el nombre de la Impresora'
      })
      return
    }
    if (!(this.data.printerTypeId >0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el Tipo Impresora'
      })
      return
    }
    if (this.data.serverDevice && (!this.data.macAddress || this.data.macAddress.length == 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingreso la dirección Mac del equipo'
      })
      return
    }
    if (!isValidField(this.data.ipAddress)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese el Ip de la máquina'
      })
      return
    }
    if (this.documents.every((item) => !item.enabled)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione al menos un documento'
      })
      return
    }


    let codDoc = "";
    if (this.documents.some(item => item.codDoc === DOC_TYPE.FV  && item.enabled)) {
      codDoc = "FV"
    }
    if (this.documents.some(item => item.codDoc === DOC_TYPE.NE && item.enabled)) {
      codDoc = "NE";
    }
    if (this.documents.every(item => item.enabled)) {
      codDoc = "A";

    }

    let params = {
      ...this.data,
      codDoc,
      documents: this.documents.filter(x => x.enabled)
    }

    if(this.params.data.id>0){
      this.printerSvc.put(this.params.data.id, params).subscribe(this.successResponse)

    }

    if(!(this.params.data.id>0)){
      this.printerSvc.post(params).subscribe(this.successResponse)
    }

  }








}

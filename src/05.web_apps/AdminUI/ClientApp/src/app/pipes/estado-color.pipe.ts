import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'estadoColor'
})

export class EstadoColorPipe implements PipeTransform {
  constructor(
    private _sanitizer: DomSanitizer
  ){}
  transform(estado: boolean, args?: any): SafeHtml {
    if(estado){
      return this._sanitizer.bypassSecurityTrustHtml('<span class="bg-info text-white rounded font-12 p-l-5 p-r-5">Activo</span>')
    }else{
      return this._sanitizer.bypassSecurityTrustHtml('<span class="bg-danger text-white rounded font-12 p-l-5 p-r-5">Inactivo</span>')
    }
  }

}

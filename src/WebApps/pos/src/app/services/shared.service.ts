import {DOC_TYPE, PATHS, PATHS_API, STRING_SPLIT_REGEX} from '@/enums/main.enum';
import {ApiResponse} from '@/models/api-response';
import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import FileSaver from 'file-saver';
import {map, Observable} from 'rxjs';
import Swal from 'sweetalert2';

import {ToasterService} from './toaster.service';
import {getCustomUrlContext} from "@core/interceptors/inject-session.interceptor";

type ParamsPrint = { id: number, documentoId: number, tipo: 1 | 2 | 3 | 4 }

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private http = inject(HttpClient)
  private tS = inject(ToasterService)

  constructor() {
  }


  askToPrint(obj: ParamsPrint) {
    Swal.fire({
      icon: 'warning',
      html: `<small>Desea Imprimir este comprobante?</small>`,
      confirmButtonText: '<icon class="mdi mdi-cloud-print-outline"></icon> Sí, imprimir',
      showDenyButton: true,
      denyButtonText: 'No, cancelar',
      allowOutsideClick: false
    }).then(result => {

      if (result.isConfirmed) {
        this.getPrinter(obj)
      }
    })
  }

  getPrinter(obj: ParamsPrint) {

    let json = JSON.stringify(obj);
    this.http.get<ApiResponse>(`${PATHS_API.RESTAURANT}${PATHS.ORDER}Print/${json}`).subscribe({
      next: response => {
        if (response.code === "0") {
          this.tS.toastr({
            type: 'warning',
            message: response.message
          })
        }
        if (response.code === "1") {
          let mainData = JSON.parse(response.payload as string);
          this.print(mainData);

        }
      },
      error: err => {
        console.log(err)
      }
    })
  }

  print<T extends { urlPrinter: string }>(params: T[]) {
    for (const param of params) {
      this.http.post<ApiResponse>(`${param.urlPrinter}`, param, {context: getCustomUrlContext()}).subscribe({
        next: response => {
          if (response.code === "0") {
            this.tS.toastr({
              type: 'warning',
              message: response.message
            })
          }
          if (response.code === "1") {
            this.tS.toastr({
              type: 'success',
              message: response.message
            })
          }
        },
        error: err => {
          console.log(err)
        }
      })

    }
  }

  getPrinterOrder(id: number) {
    this.getPrinter({
      id,
      documentoId: 0,
      tipo: 2
    })
  }

  getPrinterFactura(id: number, documentoId: number) {
    this.getPrinter({
      id,
      documentoId,
      tipo: 3
    })
  }

  getPrinterNotaEntrega(id: number, documentoId: number) {
    this.getPrinter({
      id,
      documentoId,
      tipo: 4
    })
  }


  printerDoc(data: any, codDoc: string) {
    if (data.printerAutomatic) {
      if (codDoc === DOC_TYPE.FV) {
        this.getPrinterFactura(data.orderId, data.idDocumento)
      }
      if (codDoc === DOC_TYPE.NE) {
        this.getPrinterNotaEntrega(data.orderId, data.idDocumento)
      }
    }
  }


  getFileName(response: any) {
    let contentDisposition = response.headers.get('content-disposition');
    let fileName = contentDisposition
      ?.split(';')[1]
      .split('filename')[1]
      .split('=')[1]
      .trim();
    fileName = fileName?.replaceAll('+', ' ');
    return fileName;
  }

  saveFile(response: any, format?: string, downloadOnly: boolean = false) {
    let fileName = this.getFileName(response)

    if (format === 'pdf') {
      const ieEDGE = navigator.userAgent.match(/Edge/g);
      const ie = navigator.userAgent.match(/.NET/g); // IE 11+
      const oldIE = navigator.userAgent.match(/MSIE/g);
      if (response.body) {
        if (ie || oldIE || ieEDGE || downloadOnly) {
          FileSaver.saveAs(response.body, fileName);
        } else {
          const fileURL = URL.createObjectURL(response.body);
          window.open(fileURL, fileName);
        }
      }
    } else {
      if (response.body) {
        let serverData = new Blob([response.body], {
          type: response.body.type,
        });
        FileSaver.saveAs(serverData, fileName);
      }
    }
  }

  /**
   * Genera y descarga o retorna un reporte en formato PDF o Excel.
   *
   * @template T Tipo de los datos que se envían para generar el reporte.
   * @param data Datos necesarios para la generación del reporte.
   * @param format Formato del reporte (pdf | excel), por defecto 'pdf'.
   * @param isOldVersion Define si se usa la versión antigua del reporte.
   * @param downloadOnly Si es verdadero, solo descarga el archivo sin abrirlo.
   * @param isReturnData Si es verdadero, retorna el blob en lugar de descargarlo.
   * @returns Observable si `isReturnData` es verdadero, de lo contrario void.
   */
  getReport<T>({
                 data,
                 format = 'pdf',
                 isOldVersion = false,
                 downloadOnly = false,
                 isReturnData = false
               }: {
    data: T;
    format?: 'pdf' | 'excel';
    isOldVersion?: boolean;
    downloadOnly?: boolean;
    isReturnData?: boolean;
  }): Observable<any> | void {  // <- Retorna Observable si isReturnData es true, de lo contrario void
    const reportVersionPath = isOldVersion ? PATHS.REPORT_V1 : PATHS.REPORT_V2;
    const fullPath = `${PATHS_API.REPORT}${reportVersionPath}Download`;

    // Configuración de la petición
    const requestOptions = {
      observe: 'response' as const,
      responseType: 'blob' as const,
    };

    // Si se debe retornar el blob en lugar de descargar
    if (isReturnData) {
      return this.http.post(fullPath, data, requestOptions);  // Retorna Observable
    }

    // Si solo se descarga el archivo
    this.http.post(fullPath, data, requestOptions).subscribe({
      next: (response) => this.saveFile(response, format, downloadOnly),
      error: (err) => {
        console.error('Error al descargar el reporte:', err);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });

    return;  // <- Devuelve void en caso de que no se use isReturnData
  }


}

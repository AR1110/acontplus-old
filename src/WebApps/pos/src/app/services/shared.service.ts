import { DOC_TYPE, PATHS, PATHS_API, STRING_SPLIT_REGEX } from '@/enums/main.enum';
import { ApiResponse } from '@/models/api-response';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import FileSaver from 'file-saver';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

import { ToasterService } from './toaster.service';

type ParamsPrint = { id: number, documentoId: number, tipo: 1 | 2 | 3 | 4 }

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private http = inject(HttpClient)
  private tS = inject(ToasterService)

  constructor() { }


  async askToPrint(obj: ParamsPrint) {
    const {
      isConfirmed
    } = await Swal.fire({
      icon: 'warning',
      html: `<small>Desea Imprimir este comprobante?</small>`,
      confirmButtonText: '<icon class="mdi mdi-cloud-print-outline"></icon> Sí, imprimir',
      showDenyButton: true,
      denyButtonText: 'No, cancelar',
      allowOutsideClick: false
    })
    if (isConfirmed) {
      this.getPrinter(obj)
    }
  }

  async getPrinter(obj: ParamsPrint) {

    let json = JSON.stringify(obj);
    return this.http.get<ApiResponse>(`${PATHS_API.RESTAURANT}${PATHS.ORDER}Print/${json}`).pipe(
      map(response => {
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
      })
    )
  }
  async print<T extends { urlPrinter: string }>(params: T[]) {
    for (const param of params) {
      this.http.post<ApiResponse>(`${param.urlPrinter}`, JSON.stringify(param)).pipe(
        map(response => {
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
        })
      )
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



  saveFile(response: any, format?: string, downloadOnly: boolean = false) {
    let contentDisposition = response.headers.get('content-disposition');
    let fileName = contentDisposition
      ?.split(';')[1]
      .split('filename')[1]
      .split('=')[1]
      .trim();
    fileName = fileName?.replaceAll('+', ' ');

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
   *
   * @param data
   * @param format pdf | excel
   * @param isOldVersion
   */
  getReport<T>({
    data,
    format = 'pdf',
    isOldVersion = false,
    downloadOnly = false,
  }: {
    data: T;
    format?: string;
    isOldVersion?: boolean;
    downloadOnly?: boolean;
  }) {
    const path = isOldVersion
      ? `${PATHS.REPORT_V1}`
      : `${PATHS.REPORT_V2}`;
    this.http
      .post(`${PATHS_API.REPORT}${path}Download`, data, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe((response) => {
        this.saveFile(response, format, downloadOnly);
      });
  }



 


}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS, PATHS_API } from '@core/constants/global.constants';
import { customUrl } from '@core/interceptors/inject-session.interceptor';
import { isApiResponse } from '@core/models/api-response';

import FileSaver from 'file-saver';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from './toastr-notification.service';
import * as XLSX from 'xlsx';
import { isInIframe } from '@core/utils/utils';

interface ReportParams<T> {
  data: T;
  format?: string;
  isOldVersion?: boolean;
  downloadOnly?: boolean;
  openInModal?: boolean;
}

interface ParamsPrint {
  id: number;
  //tipo: 1 | 2 | 3 | 4 | 5 | 6;
  codDoc: string;
  codEstab?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private http = inject(HttpClient);
  private tS = inject(ToastrNotificationService);

  saveFile(response: any, format?: string, downloadOnly = false) {
    const contentDisposition = response.headers.get('content-disposition');
    let fileName = 'download';

    if (contentDisposition) {
      // Extract filename safely using regex
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch?.[1]) {
        fileName = filenameMatch[1].replace(/['"]/g, '');

        // Decode URL encoded characters
        fileName = decodeURIComponent(fileName);

        // Replace problematic characters
        fileName = fileName.replaceAll('+', ' ');

        // Additional sanitization if needed
        fileName = fileName.replace(/[\/\?<>\\:\*\|"]/g, '_');
      }
    }
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
        const serverData = new Blob([response.body], {
          type: response.body.type,
        });
        FileSaver.saveAs(serverData, fileName);
      }
    }
  }

  /**
   *
   * @param obj
   */
  getReport<T>(obj: ReportParams<T>) {
    const { data, format = 'pdf', isOldVersion = false, downloadOnly = false, openInModal } = obj;

    const path = isOldVersion ? PATHS.DOWNLOAD_V1 : PATHS.DOWNLOAD;

    this.http
      .post(`${PATHS_API.REPORT}${path}`, data, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe(response => {
        if (format === 'pdf' && openInModal && response.body) {
          // this.openPdfInModal(response.body)
        } else {
          this.saveFile(response, format, downloadOnly);
        }
      });
  }

  async askToPrint(obj: ParamsPrint) {
        // If running inside iframe, delegate print to parent window (AngularJS app)
      // This bypasses Private Network Access restrictions for iframe context
      if (isInIframe() && window.parent) {
        window.parent.postMessage(
          {
            type: 'ACONTPLUS_PRINT_REQUEST',
            payload: {
              parameters: JSON.stringify(obj),
            },
          },
          'https://app.acontplus.com'
        );
        this.tS.show({
          type: 'info',
          message: 'Solicitud de impresión enviada...',
        });
        return;
      }
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: `<small>Desea Imprimir este comprobante?</small>`,
      confirmButtonText: '<icon class="mdi mdi-cloud-print-outline"></icon> Sí, imprimir',
      showDenyButton: true,
      denyButtonText: 'No, cancelar',
      allowOutsideClick: false,
    });
    if (isConfirmed) {

      this.getPrintConfig(obj);

    }
  }

  getPrintConfig(obj: ParamsPrint) {
    const json = JSON.stringify({
      codDoc: obj.codDoc,
      getUrlPrintServer: true,
      id: obj.id,
      codEstab: obj.codEstab,
    });
    this.http.get<any>(`${PATHS_API.CONFIG}Print/?json=${json}`).subscribe({
      next: response => {
        if (isApiResponse(response)) {
          if (response.code === '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code === '1') {
            this.print(response.payload as string, obj);
          }
        }
      },
      error: err => {
        console.log(err);
      },
    });
  }

  print(urlPrinter: string, paramsToPrint: ParamsPrint) {
    this.http
      .post<any>(`${urlPrinter}/Print`, paramsToPrint, {
        context: customUrl(),
      })
      .subscribe({
        next: response => {
          if (isApiResponse(response)) {
            this.tS.show({
              type: response.code === '1' ? 'success' : 'warning',
              message: response.message,
            });
          }
        },
        error: err => {
          console.log(err);
        },
      });
  }

  // createInvoicePrint(id: number, documentoId: number) {
  //   this.getPrintConfig({
  //     id,
  //     documentoId,
  //     tipo: 3,
  //     codDoc: 'FV', // Debería usar DOC_TYPE.FV pero para evitar errores de importación lo dejo literal o verifico enums
  //   });
  // }

  // createNotaEntregaPrint(id: number, documentoId: number) {
  //   this.getPrintConfig({
  //     id,
  //     documentoId,
  //     tipo: 4,
  //     codDoc: 'NE',
  //   });
  // }

  // printerDoc(data: any, codDoc: string) {
  //   if (data.printerAutomatic) {
  //     if (codDoc === 'FV') {
  //       this.createInvoicePrint(data.orderId, data.idDocumento);
  //     }
  //     if (codDoc === 'NE') {
  //       this.createNotaEntregaPrint(data.orderId, data.idDocumento);
  //     }
  //   }
  // }

  // getPrinter<T>(parameters: T) {
  //   try {
  //     const url = `${PATHS_API.CONFIG}${PATHS.PRINT}?json=${parameters}`;
  //     this.http.get(url).subscribe({
  //       next: response => {
  //         if (isApiResponse(response)) {
  //           if (response.code === '0') {
  //             this.tS.show({
  //               type: 'warning',
  //               message: response.message,
  //             });
  //           }
  //           if (response.code === '1') {
  //             this.print(response.payload as string, parameters);
  //           }
  //         }
  //       },
  //       error(err) {
  //         console.log(err);
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     this.tS.show({
  //       type: 'warning',
  //       message: error as string,
  //     });
  //   }
  // }

  // async print<
  //   T extends {
  //     urlPrinter: string;
  //     rdlcProps: string;
  //     dataSources: string;
  //     rdlcParams: string;
  //   },
  // >(params: T[]) {
  //   try {
  //     const urlPrinter = `${params[0].urlPrinter}?rdlcProps=${
  //       params[0].rdlcProps
  //     }&dataSources=${encodeURIComponent(params[0].dataSources)}&rdlcParams=${
  //       params[0].rdlcParams
  //     }`;

  //     this.http.post(urlPrinter, null).subscribe({
  //       next: response => {
  //         if (isApiResponse(response)) {
  //           if (response.code === '1') {
  //             this.tS.show({
  //               type: 'success',
  //               message: response.message,
  //             });
  //           } else {
  //             this.tS.show({
  //               type: 'warning',
  //               message: response.message,
  //             });
  //           }
  //         }
  //       },
  //       error(err) {
  //         console.log('Hubo un problema al imprimir:' + err?.message);
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  getEstabAsign() {
    return this.http.get<any>('Config/EstabAsig/?json=' + JSON.stringify({ tipo: 1 })).pipe(
      map(response => {
        let estabs: any[] = [];
        let results: any[] = [];
        if (isApiResponse(response)) {
          if (response.code === '1') {
            estabs = JSON.parse(response.payload as string);
            results = estabs.map((estab: any) => {
              return {
                idEstablecimiento: estab.idEstablecimiento,
                codEstab: estab.codEstab,
                nombreComercial: estab.nombreComercial,
                predeterminado: estab.predeterminado,
                estab: estab.estab,
              };
            });
          }
        }
        return results;
      }),
    );
  }

  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}

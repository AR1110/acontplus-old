import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS, PATHS_API } from '@core/constants/global.constants';
import { customUrl } from '@core/interceptors/inject-session.interceptor';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import { SendMailModalComponent } from '@shared/components/send-mail-modal/send-mail-modal.component';
import FileSaver from 'file-saver';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

import { ModalService } from './modal.service';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private http = inject(HttpClient);
  private tS = inject(ToasterService);
  private modalSvc = inject(ModalService);

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
  getReport<T>(
    data: T,
    format: string = 'pdf',
    isOldVersion: boolean = false,
    downloadOnly: boolean = false,
  ) {
    const path = isOldVersion ? PATHS.DOWNLOAD_V1 : PATHS.DOWNLOAD;
    this.http
      .post(`${PATHS_API.REPORT}${path}`, data, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe((response) => {
        this.saveFile(response, format, downloadOnly);
      });
  }

  appNotificacionInsert<T>(data: T) {
    const url = `${PATHS_API.COMMON}${PATHS.APP_NOTIFICATION}`;
    return this.http.post(`${url}?json=${JSON.stringify(data)}`, '');
  }

  async askToPrint<T extends { parameters: string }>(obj: T) {
    const { parameters } = obj;
    let { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: `<small>Desea Imprimir este comprobante?</small>`,
      confirmButtonText:
        '<icon class="mdi mdi-cloud-print-outline"></icon> Sí, imprimir',
      showDenyButton: true,
      denyButtonText: 'No, cancelar',
      allowOutsideClick: false,
    });
    if (isConfirmed) {
      let url = `${PATHS_API.PRINT_SERVER}${PATHS.PRINT}`;
      console.log(parameters);
      showLoader();
      this.http
        .post(url, JSON.parse(parameters), {
          context: customUrl(),
        })
        .subscribe({
          next: (response) => {
            hideLoader();
            if (isApiResponse(response)) {
              if (response.code === '1') {
                this.tS.toastr({
                  type: 'success',
                  message: response.message,
                });
              } else {
                this.tS.toastr({
                  type: 'warning',
                  message: response.message,
                });
              }
            }
          },
          error(err) {
            hideLoader();
            console.log('Hubo un problema al imprimir:' + err?.message);
          },
        });
      //this.getPrinter(parameters)
    }
  }

  getPrinter<T>(parameters: T) {
    try {
      let url = `${PATHS_API.CONFIG}${PATHS.PRINT}?json=${parameters}`;
      this.http.get(url).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            if (response.code === '0') {
              this.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code === '1') {
              this.print(JSON.parse(response.payload as string));
            }
          }
        },
        error(err) {
          console.log(err);
        },
      });
    } catch (error) {
      console.log(error);
      this.tS.toastr({
        type: 'warning',
        message: error as string,
      });
    }
  }

  async print<
    T extends {
      urlPrinter: string;
      rdlcProps: string;
      dataSources: string;
      rdlcParams: string;
    },
  >(params: T[]) {
    try {
      let urlPrinter = `${params[0].urlPrinter}?rdlcProps=${
        params[0].rdlcProps
      }&dataSources=${encodeURIComponent(params[0].dataSources)}&rdlcParams=${
        params[0].rdlcParams
      }`;

      showLoader();
      this.http.post(urlPrinter, null).subscribe({
        next: (response) => {
          hideLoader();
          if (isApiResponse(response)) {
            if (response.code === '1') {
              this.tS.toastr({
                type: 'success',
                message: response.message,
              });
            } else {
              this.tS.toastr({
                type: 'warning',
                message: response.message,
              });
            }
          }
        },
        error(err) {
          hideLoader();
          console.log('Hubo un problema al imprimir:' + err?.message);
        },
      });
    } catch (error) {
      hideLoader();
      console.log(error);
    }
  }

  getEstabAsign() {
    return this.http
      .get('Config/EstabAsig/?json=' + JSON.stringify({ tipo: 1 }))
      .pipe(
        map((response) => {
          let estabs = (response as []) || [];
          let results = estabs.map((estab: any) => {
            return {
              codEstab: estab.codEstab,
              nombreComercial: estab.nombreComercial,
              predeterminado: estab.predeterminado,
            };
          });
          return results;
        }),
      );
  }

  async openModalSendMail<T>(params: T) {
    const modalRef = this.modalSvc.openModalCustom(SendMailModalComponent);
    modalRef.componentInstance.params = params || {};
  }
}

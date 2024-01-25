import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PATHS, PATHS_API } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { hideLoader, showLoader } from '@core/utils/loader';
import FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  private http = inject(HttpClient);
  private tS = inject(ToasterService)

  getReport<T>(data: T, format: 'pdf' | 'excel', isOldVersion: boolean = false) {

    const path = isOldVersion ? PATHS.DOWNLOAD_V1 : PATHS.DOWNLOAD
    showLoader()
    this.http.post(`${PATHS_API.REPORT}${path}`, data, {
      observe: 'response',
      responseType: 'blob',
    }).subscribe({
      next(response) {
        hideLoader()
        let contentDisposition = response.headers.get('content-disposition');
        let fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim();
        fileName = fileName?.replaceAll('+', " ");

        if (format === 'pdf') {
          const ieEDGE = navigator.userAgent.match(/Edge/g);
          const ie = navigator.userAgent.match(/.NET/g); // IE 11+
          const oldIE = navigator.userAgent.match(/MSIE/g);
          // const blob = response.body;
          if (response.body) {
            if (ie || oldIE || ieEDGE) {
              FileSaver.saveAs(response.body, fileName);
            } else {
              const fileURL = URL.createObjectURL(response.body);
              window.open(fileURL, fileName);
            }
          }
        } else {
          console.log('excel')
          if (response.body) {
            console.log(response)
            let serverData = new Blob([response.body], {
              type: response.body.type
            });
            FileSaver.saveAs(serverData, fileName);
          }
        }


      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }

  appNotificacionInsert<T>(data: T) {
    const url = `${PATHS_API.COMMON}${PATHS.APP_NOTIFICATION}`
    return this.http.post(`${url}?json=${JSON.stringify(data)}`, '');
  }



  async askToPrint<T extends { parameters: string }>(obj: T) {
    const {
      parameters
    } = obj;
    let {
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
      this.getPrinter(parameters)
    }
  }

  getPrinter<T>(parameters: T) {
    try {
      let url = `${PATHS_API.CONFIG}${PATHS.PRINT}?json=${parameters}`;
      this.http.get(url).subscribe({
        next: (response) => {
          if (isApiResponse(response)) {
            if (response.code === "0") {
              this.tS.toastr({
                type: 'warning',
                message: response.message
              })
            }
            if (response.code === '1') {
              this.print(JSON.parse(response.payload as string))
            }
          }
        },
        error(err) {
          console.log(err)
        },
      })
    } catch (error) {
      console.log(error)
      this.tS.toastr({
        type: 'warning',
        message: error as string
      })
    }
  }

  async print<T extends { urlPrinter: string, rdlcProps: string, dataSources: string, rdlcParams: string }>(params: T[]) {
    try {
      let urlPrinter = `${params[0].urlPrinter}?rdlcProps=${params[0].rdlcProps}&dataSources=${encodeURIComponent(params[0].dataSources)}&rdlcParams=${params[0].rdlcParams}`;

      showLoader()
      this.http.post(urlPrinter, null).subscribe({
        next: (response) => {
          hideLoader()
          if (isApiResponse(response)) {

            if (response.code === "1") {
              this.tS.toastr({
                type: 'success',
                message: response.message
              })
            }else{
              this.tS.toastr({
                type: 'warning',
                message: response.message
              })
            }
          }
        },
        error(err) {
          hideLoader()
          console.log('Hubo un problema al imprimir:' + err?.message);
        },
      })

    } catch (error) {
      hideLoader()
      console.log(error)
    }
  }

}

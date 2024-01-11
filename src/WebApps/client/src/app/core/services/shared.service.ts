import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PATHS, PATHS_API } from '@core/constants/global.constants';
import { hideLoader, showLoader } from '@core/utils';
import FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  http = inject(HttpClient);

  getReport<T>(data: T, format: 'pdf' | 'excel', isOldVersion:boolean = false) {

    const path = isOldVersion? PATHS.DOWNLOAD_V1 : PATHS.DOWNLOAD
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
          if (response.body) {
            FileSaver.saveAs(response.body, fileName);
          }
        }


      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }




  appNotificacionInsert<T>(data: T){
    const url = `${PATHS_API.COMMON}${PATHS.APP_NOTIFICATION}`
    return this.http.post(`${url}?json=${JSON.stringify(data)}`, '');
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PATHS, PATHS_API } from '@core/constants/global.constants';
import { hideLoader } from '@core/utils';
import FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  http = inject(HttpClient);

  getReport<T>(data: T) {
    this.http.post(`${PATHS_API.REPORT}${PATHS.DOWNLOAD}`, data, {
      observe: 'response',
      responseType: 'blob',
    }).subscribe({
      next(response) {
        hideLoader()
        let contentDisposition = response.headers.get('content-disposition');
        let fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim();
        fileName = fileName?.replaceAll('+', " ")

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
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  }


}

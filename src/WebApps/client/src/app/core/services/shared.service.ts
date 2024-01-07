import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PATHS, PATHS_API } from '@core/constants/constants';
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
        console.log(response)
        var contentDisposition = response.headers.get('content-disposition');
        var fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim();
        fileName = fileName?.replaceAll('+', " ")
        console.log(fileName);
        const ieEDGE = navigator.userAgent.match(/Edge/g);
        const ie = navigator.userAgent.match(/.NET/g); // IE 11+
        const oldIE = navigator.userAgent.match(/MSIE/g);
       // const blob = response.body;
       if(response.body){

        //  const blob = new window.Blob([response.body], {
        //    type: response.type,
        //  });
         // let fileName = resultAxios.headers["content-disposition"]
         //   .split(";")[1]
         //   .split("=")[1]
         //   .replace('"', "");
         //fileName = fileName.replace('"', "");
         if (ie || oldIE || ieEDGE) {
           FileSaver.saveAs(response.body, fileName);
         } else {
           const fileURL = URL.createObjectURL(response.body);
           window.open(fileURL, fileName);
         }
       }
      },
    })
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ReportRepository} from "@modules/api/reports/domain/report.repository";
import {PATHS, PATHS_API} from "@core/constants/global.constants";
import {ReportParams} from "@modules/api/reports/domain/report.entity";
import FileSaver from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class ReportApiRepository implements ReportRepository {
  private readonly apiUrl = `${PATHS_API.REPORT}`

  constructor(private http: HttpClient) {}

  generateReport(payload: ReportParams)  {
    const {
      data,
      format = 'pdf',
      isOldVersion = false,
      downloadOnly = false,
      openInModal,
    } = payload;
    const path = isOldVersion ? PATHS.DOWNLOAD_V1 : PATHS.DOWNLOAD;
    this.http
      .post(`${this.apiUrl}${path}`, data, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe((response) => {
        if (format === 'pdf' && openInModal && response.body) {
          // this.openPdfInModal(response.body)
        } else {
          this.saveFile(response, format, downloadOnly);
        }
      });
  }


  private saveFile(response: any, format?: string, downloadOnly = false) {
    const contentDisposition = response.headers.get('content-disposition');
    let fileName = 'download';

    if (contentDisposition) {
      // Extract filename safely using regex
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
      );
      if (filenameMatch && filenameMatch[1]) {
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
}

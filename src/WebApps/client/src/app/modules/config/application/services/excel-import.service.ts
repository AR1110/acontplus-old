import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelImportService {

  async parseExcelFile(file: File): Promise<any[]> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array', cellDates: true });

    const result: any[] = [];
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      result.push(...rows);
    });

    return result;
  }

  mapItems(rows: any[], columns: string[]): any[] {
    return rows.map(row => {
      const cleanedRow: any = {};
      columns.forEach(col => {
        let value = row[col];
        if (["", null, undefined].includes(value)) value = "";
        cleanedRow[col] = typeof value === 'string' ? value.trim() : value;
      });
      return cleanedRow;
    });
  }

  cleanRow(row: any, columns: string[], codImportacion: string): any {
    for (const col of columns) {
      if (typeof row[col] === 'string') {
        row[col] = this.removeAccents(row[col]);
      }

      if (['codigo', 'codigoAuxiliar', 'codigoBarra'].includes(col) && !row[col]) {
        row[col] = this.generateIdUnique(row['descripcion']);
      }
    }

    if (codImportacion === 'AR') {
      if (!row.codBarras) row.codBarras = row.codigo;
      row.precioCosto ??= 0;
      row.stock ??= 0;
    }

    if (['CL', 'PR'].includes(codImportacion)) {
      if (row.codIdentificacion) {
        row.codIdentificacion = row.codIdentificacion.substring(0, 2);
      }
      if (!row.nombreFiscal) {
        row.nombreFiscal = row.nombreComercial;
      }
    }

    return row;
  }

  removeAccents(text: string = ''): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  generateIdUnique(text: string = ''): string {
    return text.charAt(0) + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

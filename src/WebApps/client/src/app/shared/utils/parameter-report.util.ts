import { PURCHASE_CODE_REPORT } from '@purchases/purchases.const';
import { REPORT_FORMAT } from '@core/constants/global.constants';

interface Params {
  dataParams: string;
  hasService: boolean;
  reportParams: string;
}

interface Options {
  id: number;
  codEstab: string;
}

class DataParams {
  constructor(
    public id: number,
    public tipo = 1, // Valor predeterminado de 1
  ) {}
}

class ReportParams {
  constructor(
    public hasParams: boolean, // Indica si el reporte requiere parámetros adicionales
    public codigo: string, // Código del reporte
    public format: string, // Formato del reporte
    public aditionalParams: unknown[] = [], // Parámetros adicionales opcionales
  ) {}
}

export class ParameterReportUtil {
  static getParams(codDoc: string, options: Options): Params | undefined {
    const params: Record<string, Params> = {
      DH: {
        // Compras no habitual
        dataParams: JSON.stringify(new DataParams(options.id)),
        hasService: true,
        reportParams: JSON.stringify(
          new ReportParams(true, PURCHASE_CODE_REPORT.RCNH, REPORT_FORMAT.PDF),
        ),
      },
      '03': {
        // Otro tipo de compra
        dataParams: JSON.stringify(new DataParams(options.id)),
        hasService: true,
        reportParams: JSON.stringify(
          new ReportParams(false, PURCHASE_CODE_REPORT.RLC, REPORT_FORMAT.PDF),
        ),
      },
    };

    // Retorna el valor correspondiente a codDoc o undefined si no se encuentra
    return params[codDoc] ?? undefined;
  }
}

import { PURCHASE_CODE_REPORT } from "@purchase/core/enums/purchase.constants";
import { REPORT_FORMAT } from "@core/constants/global.constants";
import { ACCOUNTING_CODE_REPORT } from "@accounting/core/enums/accounting.constants";

export interface ReportOptions {
  id: number;
  codEstab: string;
  tipo?: number;
}

export interface ReportParameters {
  dataParams: string;
  hasService: boolean;
  reportParams: string;
}

export interface ReportConfig {
  hasParams: boolean;
  reportCode: string;
  format: string;
  hasService: boolean;
}

export class ReportParamsBuilder {

  private static readonly reportConfigs: Record<string, ReportConfig> = {
    "DH": {
      hasParams: true,
      reportCode: PURCHASE_CODE_REPORT.RCNH,
      format: REPORT_FORMAT.PDF,
      hasService: true,
    },
    "03": {
      hasParams: false,
      reportCode: PURCHASE_CODE_REPORT.RLC,
      format: REPORT_FORMAT.PDF,
      hasService: true,
    },
    [ACCOUNTING_CODE_REPORT.RCEGR]: {
      hasParams: false,
      reportCode: ACCOUNTING_CODE_REPORT.RCEGR,
      format: REPORT_FORMAT.PDF,
      hasService: true,
    },
  };

  /**
   * Obtiene parámetros para enviar a la BD para generación de reportes
   * @param codDoc Código del documento/reporte
   * @param options Opciones necesarias (id, codEstab, tipo opcional)
   * @returns Parámetros formateados o undefined si no existe configuración
   */
  static getReportParameters(codDoc: string, options: ReportOptions): ReportParameters | undefined {
    const config = this.reportConfigs[codDoc];
    if (!config) return undefined;

    // Construye los parámetros de datos
    const dataParams = {
      id: options.id,
      tipo: options.tipo ?? 1,
      codEstab: options.codEstab
    };

    // Construye los parámetros del reporte
    const reportParams = {
      hasParams: config.hasParams,
      codigo: config.reportCode,
      format: config.format,
      additionalParams: []
    };

    return {
      dataParams: JSON.stringify(dataParams),
      hasService: config.hasService,
      reportParams: JSON.stringify(reportParams)
    };
  }

  /**
   * Agrega o actualiza una configuración de reporte
   * @param codDoc Código del documento
   * @param config Configuración del reporte
   */
  static addReportConfig(codDoc: string, config: ReportConfig): void {
    this.reportConfigs[codDoc] = config;
  }

  /**
   * Verifica si existe una configuración para un código de documento
   * @param codDoc Código del documento
   */
  static hasConfig(codDoc: string): boolean {
    return codDoc in this.reportConfigs;
  }
}

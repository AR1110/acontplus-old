import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { GeneralConfigResponse } from '@modules/config/data/models/general-config.model';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';

export class ListGeneralConfigMapper {
  static toJson<T>(parameters: any) {
    return JSON.stringify({
      codConfig: parameters,
    });
  }

  static fromJson(response: ApiResponseLegacy, code: string): GeneralConfigResponse {
    const mainDataForm = new GeneralConfigResponse();
    if (response.code !== '1') {
      return mainDataForm;
    }
    const { data, formasPagoSri, metodosValoracion, notificaciones } = JSON.parse(
      response.payload as string,
    );

    switch (code) {
      case 'CV':
        const { nombreFiscal, numeroIdentificacion, descripcion, cc, ...restData } = data[0];
        mainDataForm.configVenta = {
          ...restData,
          razonSocialComprador: nombreFiscal,
          numeroIdentificacionComprador: numeroIdentificacion,
          nombreArticulo: descripcion,
          cc: cc ? cc.split(SEPARATOR_KEY_CODE.SLASH) : [],
        };
        mainDataForm.formasPagoSri = formasPagoSri;
        break;

      case 'CI':
        mainDataForm.configInventario = data[0];
        mainDataForm.metodosValoracion = metodosValoracion;
        break;

      case 'CD':
        mainDataForm.decimalAlmacen = data.find((item: any) => item.codTransaccion === 'AL');
        mainDataForm.decimalVenta = data.find((item: any) => item.codTransaccion === 'V');
        mainDataForm.decimalCompra = data.find((item: any) => item.codTransaccion === 'C');
        break;

      case 'CS':
        mainDataForm.notificaciones = notificaciones;
        break;
    }
    return mainDataForm;
  }
}

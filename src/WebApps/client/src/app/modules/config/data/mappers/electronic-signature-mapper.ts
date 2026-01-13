import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ElectronicSignatureListResponse } from '@modules/config/data/models/electronic-signature.model';
import { formatDateToString } from '@core/utils/date.util';

export class ElectronicSignatureMapper {
  static fromJson(response: ApiResponseLegacy): ElectronicSignatureListResponse {
    const result = new ElectronicSignatureListResponse();
    if (response.code === '1') {
      const { electronicSignatures } = JSON.parse(response.payload as any);
      result.data = electronicSignatures.map((item: any, index: number) => {
        return {
          index: index + 1,
          idFirmaElectronica: item.idFirmaElectronica,
          nomEntidad: item.razonSocial,
          contrasenia: item.contrasenia,
          nombreArchivo: item.nombreArchivo,
          mimeType: item.mimeType,
          fechaCaducidad: formatDateToString(new Date(item.fechaCaducidad)),
          firma: item.firma,
        };
      });
    }

    return result;
  }
}

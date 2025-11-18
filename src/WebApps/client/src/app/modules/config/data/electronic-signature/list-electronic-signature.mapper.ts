import { ApiResponse } from '@core/models/api-response';
import { ElectronicSignatureListResponse } from '@modules/config/domain/models/electronic-signature.model';
import { formatDateToString } from '@core/utils/date.util';

export class ListElectronicSignatureMapper {
  static fromJson(response: ApiResponse): ElectronicSignatureListResponse {
    const result = new ElectronicSignatureListResponse();
    if (response.code === '1') {
     // const {electronicSignatures}= JSON.parse(response.payload as any);
      const [electronicSignatures]= JSON.parse(response.payload as any);
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

import { FormDataCompanyCustomerResponse } from '@company-customer/domain/entities/company-customer.entity';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export class GetFormDataCompanyCustomerMapper {
  static toJson() {
    return JSON.stringify({
      tipo: 2,
    });
  }

  static fromJson(response: ApiResponseLegacy): FormDataCompanyCustomerResponse {
    const result = new FormDataCompanyCustomerResponse();
    if (response.code === '1') {
      const mainData = JSON.parse(response.payload as string);
      console.log(mainData);
      result.tipoIdentificacion = mainData[0];
      result.tipoContribuyentes = mainData[1];
      result.tiempoCreditos = mainData[2] || [];
      const ciudades = mainData[3];

      result.ciudades = ciudades.reduce((acc: any, ciudade: any) => {
        const dataExists = acc.find((c: any) => c.idProvincia === ciudade.idProvincia);
        if (!dataExists) {
          acc.push({
            idProvincia: ciudade.idProvincia,
            nombre: ciudade.provincia,
            ciudades: [
              {
                idCiudad: ciudade.idCiudad,
                nombre: ciudade.ciudad,
              },
            ],
          });
        } else {
          dataExists.ciudades.push({
            idCiudad: ciudade.idCiudad,
            nombre: ciudade.ciudad,
          });
        }
        return acc;
      }, [] as any);

      result.tiposCliente = mainData[4] || [];
      result.empresas = mainData[5] || [];
      result.cargos = mainData[6] || [];
      result.formasPagoSri = mainData[7] || [];
      result.housingTypes = mainData[8] || [];
      result.maritalStatuses = mainData[9] || [];
      result.employees = mainData[10] || [];
    }
    return result;
  }
}

import { SuscripcionDetalle } from '../models/suscripcion-detalle';

export function mapListSuscripcionDetalleFromApi(
  data: any[]
): SuscripcionDetalle[] {
  const emptyList: SuscripcionDetalle[] = [];

  data.forEach((item) => {
    let suscripcionDetalle: SuscripcionDetalle = {
      id: item.id ?? 0,
      licenseTypeName: item.licenseName,
      licenciaDetalleId: item.licenciaDetalleId,
      suscripcionId: item.suscripcionId ?? 0,
      startDate: item.startDate ?? '',
      endDate: item.endDate ?? '',
      maxPaymentDate: item.maxPaymentDate ?? '',
      name: item.applicationName,
      cost: item.cost ?? 0.0,
      tax: item.tax ?? 0.0,
      discount: item.discount ?? 0.0,
      total: item.total ?? 0.0,
      paid: item.paid ?? false,
      uuid: item.uuid ?? null,
    };
    emptyList.push(suscripcionDetalle);
  });
  return emptyList;
}

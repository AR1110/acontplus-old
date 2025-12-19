import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { InventoryAdjustmentFormDataDto } from '@inventory/data/dtos/inventory-adjustment.dto';

class InventoryAdjustmentState {
  mainFormData: InventoryAdjustmentFormDataDto = {
    decimal: {},
    estabs: [],
    subFamilias: [],
    tiposDoc: [],
    tiposTransaccion: [],
  };
}

export const InventoryAdjustmentStore = signalStore(
  { providedIn: 'root' },
  withState(new InventoryAdjustmentState()),
  withMethods((store) => ({
    setMainFormData(params: InventoryAdjustmentFormDataDto) {
      console.log(params);
      patchState(store, {
        mainFormData: params,
      });
    },
  })),
  withHooks({
    onInit(store) {
      store.setMainFormData({
        estabs: [
          {
            idEstablecimiento: 553,
            nombreComercial: 'ACONTPLUS S.A.S.',
            nombreEstab: 'ACONTPLUS S.A.S.',
            codEstab: 'ESTAB-000000216',
            defaultEstab: true,
            correo: 'zaratec@acontplus.com.ec|jhonyjdvla@gmail.com',
            puntosEmision: [
              {
                idPuntoEmision: 225,
                ptoEmi: '001',
                defaultPtoEmi: true,
              },
            ],
            bodegas: [
              {
                idBodega: 229,
                descripcion: 'PRINCIPAL',
                defaultBodega: true,
                idEstablecimiento: 553,
              },
            ],
          },
        ],
        subFamilias: [
          {
            id: 2459,
            name: 'SERVICIOS',
          },
          {
            id: 2650,
            name: 'PUNTOS DE VENTA',
          },
          {
            id: 2651,
            name: 'DISCOS DUROS',
          },
          {
            id: 3521,
            name: 'REPUESTOS',
          },
          {
            id: 3522,
            name: 'SOFTWARE',
          },
          {
            id: 3523,
            name: 'ACCESORIOS',
          },
          {
            id: 3524,
            name: 'MONITORES',
          },
          {
            id: 3525,
            name: 'ENERGIA',
          },
          {
            id: 3528,
            name: 'EQUIPOS',
          },
          {
            id: 3546,
            name: 'REDES',
          },
          {
            id: 3612,
            name: 'SUMINISTROS',
          },
          {
            id: 5176,
            name: 'IMPRESORAS',
          },
          {
            id: 5216,
            name: 'DISCOS SOLIDOS',
          },
          {
            id: 5362,
            name: 'CCTV',
          },
          {
            id: 5385,
            name: 'PRENDAS DE HOMBRE',
          },
          {
            id: 5535,
            name: 'AUDIO Y VIDEO',
          },
          {
            id: 6018,
            name: 'ADHESIVOS',
          },
          {
            id: 8925,
            name: 'CELULARES',
          },
        ],
        decimal: {
          idSistema: 739,
          idEntidad: 195,
          codTrasaccion: 'AL',
          codTransaccion: 'AL',
          nroPrecio: 5,
          nroCantidad: 2,
          nroIva: 2,
          nroDescuentoDetalle: 2,
          nroTotalDetalle: 2,
          nroTotalSubTotal: 2,
          nroDescuento: 2,
          importeTotal: 2,
          nroIce: 2,
        },
        tiposDoc: [
          {
            idTipoDocumento: 7,
            codigo: 'CI',
            descripcion: 'Consolidación',
          },
          {
            idTipoDocumento: 10,
            codigo: 'BI',
            descripcion: 'Baja de Inventario',
          },
          {
            idTipoDocumento: 11,
            codigo: 'EI',
            descripcion: 'Entrada de Inventario',
          },
        ],
        tiposTransaccion: [
          {
            idTipoTransaccion: 1,
            codigo: 'E',
            descripcion: 'Entrada',
          },
          {
            idTipoTransaccion: 2,
            codigo: 'S',
            descripcion: 'Salida',
          },
          {
            idTipoTransaccion: 4,
            codigo: 'A',
            descripcion: 'Ajustes',
          },
        ],
      });
    },
  }),
);

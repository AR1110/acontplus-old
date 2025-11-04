export const PERMISSION_ACTIONS = {
  // Acciones principales (usando 'name' de la API)
  leer: 'leer',
  crear: 'crear',
  editar: 'editar',
  eliminar: 'eliminar',
  reporte: 'reporte',
  anular: 'anular',

  // Acciones específicas
  enviarCorreo: 'enviarCorreo',
  cobroPago: 'cobroPago',
  enviarSri: 'enviarSri',
  historialFinanciero: 'historialFinanciero',
  cuota: 'cuota',
  impuesto: 'impuesto',
  kardex: 'kardex',
  imagen: 'imagen',
  acceso: 'acceso',
  aperturarCaja: 'aperturarCaja',
  cerrarCaja: 'cerrarCaja',
  generarDocumento: 'generarDocumento',
  movimiento: 'movimiento',
  anularComprobanteIngresoDoc: 'anularComprobanteIngresoDoc',
} as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS];

// Alias comunes para mejor legibilidad en el código
export const ACTION_ALIASES = {
  READ: PERMISSION_ACTIONS.leer,
  CREATE: PERMISSION_ACTIONS.crear,
  EDIT: PERMISSION_ACTIONS.editar,
  DELETE: PERMISSION_ACTIONS.eliminar,
  REPORT: PERMISSION_ACTIONS.reporte,
  CANCEL: PERMISSION_ACTIONS.anular,
  SEND_EMAIL: PERMISSION_ACTIONS.enviarCorreo,
  SEND_SRI: PERMISSION_ACTIONS.enviarSri,
  PAYMENT: PERMISSION_ACTIONS.cobroPago,
  FINANCIAL_HISTORY: PERMISSION_ACTIONS.historialFinanciero,
  OPEN_CASHBOX: PERMISSION_ACTIONS.aperturarCaja,
  CLOSE_CASHBOX: PERMISSION_ACTIONS.cerrarCaja,
  KARDEX: PERMISSION_ACTIONS.kardex,
} as const;

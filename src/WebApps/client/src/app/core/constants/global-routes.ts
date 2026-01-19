export enum GlobalRoutes {
  ComprasReportes = 'purchase/reports',
  ComprasReportesRecepcion = 'purchase/reception-reports',

  //Configuration Start
  ConfigDocConfig = 'config/doc-config-page',
  ConfigEstablishment = 'config/establishment',
  ConfigGeneralConfig = 'config/general-config',
  ConfigUserProfile = 'config/user-profile-page',
  ConfigUser = 'config/user',
  ConfigUserRequest = 'config/solicitud-autorizacion',
  ConfigImportacion = 'config/excel-import',
  FirmaElectronica = 'config/electronic-signature',
  TiempoCredito = 'config/credit-time',
  //Configuration End

  //Facturación start
  FactElectAts = 'billing/ats',
  FactElectGuiaRemision = 'billing/guia-remision',
  //Facturacion end

  InventarioImpuestoMasivo = 'inventory/massive-tax-page',
  InventarioLotPrice = 'inventory/lot-price-page',
  InventarioMeasure = 'inventory/measure',
  MechanicalLayout = 'mechanical/layout',
  MechanicalVehicle = 'mechanical/vehicle-page',
  RestaurantReports = 'restaurant/item-report',
  RestaurantInfrastructure = 'restaurant/infrastructure',
  RestaurantProducts = 'restaurant/products',
  RestaurantConfigTpv = 'restaurant/meal-schedule-setting',
  RestaurantConsumoTpv = 'restaurant/meal-consumption-list',
  TechnicalSupport = 'technical-support/technical-support-page',
  TechnicalSupportBrand = 'technical-support/brand-page',
  TechnicalSupportCategory = 'technical-support/category-page',
  TechnicalSupportDevice = 'technical-support/device-page',
  TechnicalSupportModelo = 'technical-support/modelo-page',
  VentasReportRentabilidad = 'sale/reports/rentabilidad-page',
  VetBreed = 'vet/breed-page',
  VetPet = 'vet/pet-page',
  VetMedicalHistory = 'vet/medical-history-page',
  VetStats = 'vet/stats-page',
  ConfigCompany = 'config/company',
  ConfigPrinter = 'config/printer',
  ConfigWizardConfig = 'config/wizard-config',
  ConfigTiempoCredito = 'config/tiempo-credito',
  InventarioReporte = 'inventory/report',
  VentasReportVentaReporte = 'sale/reports/sale-report',
  FactElectReport = 'billing/fact-elect-report',

  //Inventarios
  Articulo = 'inventory/product',
  InventarioSubFamilia = 'inventory/subcategory',
  InventarioMedida = 'inventory/measure',
  InventarioMarca = 'inventory/brand',
  InventarioModelo = 'inventory/model',
  InventarioTarifa = 'inventory/tarifa',
  Etiqueta = 'inventory/tags',
  ArticuloFraccionado = 'inventory/fracc-product',
  TransferenciaBodega = 'inventory/transferencia-bodega',
  Bodega = 'inventory/warehouse',

  //**Recepcion**//
  ComprasDocumentoRecibido = 'purchase/documento-recibido',

  //VENTAS
  Proforma = 'sale/proforma',
  NotaEntrega = 'sale/nota-entrega',

  //COMMON
  CommonUserManual = 'common/user-manual',

  //Facturación
  FactElectDocumentoElectronico = 'billing/doc-elect',
  Factura = 'billing/invoice',
  FactElectRetencionAts = 'purchase/retencion-ats',

  //Contabilidad
  ContabilidadCuentaPorPagar = 'accounting/cuenta-por-pagar',
  Cobro = 'accounting/cobro-page',
  ContabilidadCuentaPorCobrar = 'accounting/cuenta-por-cobrar',
  ContabilidadCategory = 'accounting/category',
  ContabilidadMovimientoCaja = 'accounting/movimiento-caja-page',
  ContabilidadReporteCobros = 'accounting/reports/reporte-cobros',
  ContabilidadSubcategory = 'accounting/subcategory',
  ContabilidadSubEntidadFinanciera = 'accounting/sub-entidad-financiera-page',
  ContabilidadCaja = 'accounting/cashboxes',
  ContabilidadCarteraProveedor = 'accounting/reports/supplier-accounts',
  ContabilidadAccountingSummary = 'accounting/reports/resumen-contable',
  ContabilidadMovimientoCajaReport = 'accounting/reports/movimiento-caja-report',
  ContabilidadComprobanteEgreso = 'accounting/comprobante-egreso',
  ContabilidadCarteraCliente = 'accounting/reports/cartera-cliente',
  ContabilidadPaymentsReport = 'accounting/reports/payments',

  //COMPRAS
  ComprasFacturaCompra = 'purchase/factura-fisica',

  //Customer
  Cliente = 'customer/company-customer-page',
  CommonEmailQueue = 'common/email-queue',

  //BarberShop
  BarberShopSeat = 'barber-shop/seat',
  BarberShopTicket = 'barber-shop/ticket',
}

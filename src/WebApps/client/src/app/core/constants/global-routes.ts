export enum GlobalRoutes {
  ComprasReportes = 'purchase/reports',
  ComprasReportesRecepcion = 'purchase/reception-reports',
  ConfigDocConfig = 'config/doc-config-page',
  ConfigEstablishment = 'config/establishment',
  ConfigGeneralConfig = 'config/general-config-page',
  ConfigUserProfile = 'config/user-profile-page',
  ConfigUserCustomer = 'config/user-customer-page',
  ConfigUserCustomerRequest = 'config/user-customer-request-page',

  FactElectAts = 'billing/ats-page',
  InventarioImpuestoMasivo = 'inventory/massive-tax-page',
  InventarioLotPrice = 'inventory/lot-price-page',
  InventarioMeasure = 'inventory/measure',
  MechanicalLayout = 'mechanical/layout',
  MechanicalVehicle = 'mechanical/vehicle-page',
  RestaurantReports = 'restaurant/item-report',
  RestaurantInfrastructure = 'restaurant/infrastructure-page',
  RestaurantProducts = 'restaurant/products-page',
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
  ContabilidadCarteraCliente = 'accounting/cartera-cliente',
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

  //Contabilidad
  ContabilidadCuentaPorPagar = 'accounting/cuenta-por-pagar',
  Cobro = 'accounting/cobro-page',
  ContabilidadCuentaPorCobrar = 'accounting/cuenta-por-cobrar',
  ContabilidadCategory = 'accounting/category',
  ContabilidadMovimientoCaja = 'accounting/movimiento-caja-page',
  ContabilidadReporteCobros = 'accounting/reports/reporte-cobros',
  ContabilidadSubcategory = 'accounting/subcategory',
  ContabilidadSubEntidadFinanciera = 'accounting/sub-entidad-financiera-page',
  ContabilidadCaja = 'accounting/cashbox-page',
  ContabilidadCarteraProveedor = 'accounting/reports/supplier-accounts',
  ContabilidadAccountingSummary = 'accounting/resumen-contable',
  ContabilidadMovimientoCajaReport = 'accounting/movimiento-caja-report',

  //COMPRAS
  ComprasFacturaCompra = 'purchase/factura-fisica',

  //Customer
  Cliente = 'customer/company-customer',
  CommonEmailQueue = 'common/email-queue',
}

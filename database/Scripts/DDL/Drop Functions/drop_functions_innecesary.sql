use [AcontPlus]
go

DROP FUNCTION IF EXISTS [dbo].[AFTConverJsonManejoArticulo]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConverJsonManejoArticuloDetalle]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTManejoArticuloXml]
GO

-- Alexis Ramirez || fecha 8/8/2023 AL 8/8/2023

DROP FUNCTION IF EXISTS [dbo].[AFTCalculoInteresMora]
GO 
DROP FUNCTION IF EXISTS [dbo].[AFTDateDiffDay]
GO 
DROP FUNCTION IF EXISTS [Ingresos].[ComprobanteIngresoDetalle_Get]
GO
DROP FUNCTION IF EXISTS [dbo].[afnCarteraCliente]
GO
DROP FUNCTION IF EXISTS [Egresos].[ComprobanteEgresoDetalle_Get]
GO 
--
DROP FUNCTION IF EXISTS  [dbo].[afnCarteraProveedor]
GO
DROP FUNCTION IF EXISTS [dbo].[afnQueryCobroDocumento]
GO 
DROP FUNCTION IF EXISTS [dbo].[afnQueryConvertDocument]
GO
DROP FUNCTION IF EXISTS [dbo].[afnQueryPagoDocumento]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTAdministracionCaja]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTAmontKardex]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTArticuloSearch]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTCarteraIngreso]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTClaveAccesoFactura]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTCobroAbono]
GO 
--
DROP FUNCTION IF EXISTS [dbo].[AFTConsultaComprobante]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonArticulo]
GO 
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonArticuloPvP]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonAsigBodega]
GO 
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonAsigPtoEmision]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonCobro]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonCobroDetalle]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonCuotaXCobrar]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonCuotaXPagar]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonDocuments]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonFacturaPaymenthMethod]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonNotaVenta]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonNotaVentaDetalle]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonPago]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTConvertJsonPagoDetalle]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTDocumentoForPayment]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTDocVentaGestion]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTEntidadDataXml]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTEstadoPagoUpdateVen]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTExistsRetencionCompra]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTFacturaCobroCuota]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTGenerarNroDocumentoDc]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTKardexMovimiento]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTManejoArticuloVenta]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTMergeCuota]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTMergeCuotaCompra]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTMovimientoCobro]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTMovimientoFactura]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTMovimientoNotaEntrega]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTRetencionCompraList]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTRetencionVentaList]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTTipoDocumento]
GO
DROP FUNCTION IF EXISTS [FactElect].[F_Comprobante_07]
GO
DROP FUNCTION IF EXISTS [GestFinanc].[F_Cheque_Get]
GO
DROP FUNCTION IF EXISTS [Gestion].[F_GetDay]
GO
--
DROP FUNCTION IF EXISTS [dbo].[afnDayExpiration]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTAbonoDocumentCompra]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTAbonoDocumentCompraPosfechado]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTCalculoInteresMora]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTClearString]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTCodigoEstadoPago]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTCuotaXCobrarAbonoPosfechado]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTCuotaXCobrarSaldos]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTCuotaXPagarAbonoPosfechado]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTCuotaXPagarSaldos]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTCuotaXCobrarAbonos]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTEstadoAdicionalTemporal]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTEstadoCobro]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTIdConfiguracionDocumento]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTidMedidaArticulo]
GO
--
DROP FUNCTION IF EXISTS [dbo].[AFTidMedidaArticulo]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTMaxNroCuota]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTStockArticulo]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTStockBodega]
GO
DROP FUNCTION IF EXISTS [Gestion].[F_NroDocument]
GO
--
DROP FUNCTION IF EXISTS [dbo].[afnPaymentDocument]
GO
DROP FUNCTION IF EXISTS [dbo].[AFTAbonoDocumentPosfechado]
GO
DROP FUNCTION IF EXISTS [Gestion].[F_AbonoPosfechado]
GO
DROP FUNCTION IF EXISTS [dbo].[afnStatusPaying]
GO
DROP FUNCTION IF EXISTS [dbo].[afnStatusPayment]
GO


USE AcontPlus
GO

DROP PROCEDURE IF EXISTS ASPReporteGetToPrint
GO
DROP PROCEDURE IF EXISTS ASPReporteParametroGetByCode
GO
DROP PROCEDURE IF EXISTS [ApiPrinter].[Impresora_Get_Documemt] 
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPReportParamsGet]
GO
DROP PROCEDURE IF EXISTS [Compra].[IngresoBodega_Delete]
GO
--
DROP PROCEDURE IF EXISTS [Compra].[IngresoBodega_Get]
GO
DROP PROCEDURE IF EXISTS [Compra].[IngresoBodega_Get_Id]
GO
DROP PROCEDURE IF EXISTS [Compra].[IngresoBodega_GetId]
GO
DROP PROCEDURE IF EXISTS [Compra].[IngresoBodega_Insert]
GO
DROP PROCEDURE IF EXISTS [Compra].[IngresoBodega_Update]
GO
--
DROP PROCEDURE IF EXISTS [Ventas].[Proforma_ConvertFactura]
GO
DROP PROCEDURE IF EXISTS [Ventas].[Proforma_ConvertNotaEntrega]
GO
DROP PROCEDURE IF EXISTS [Config].[GestionSistema_Get]
GO
DROP PROCEDURE IF EXISTS [Config].[GestionSistema_Update]
GO
DROP PROCEDURE IF EXISTS Sistema.Configuracion_Get_Data_Form
GO
--
DROP PROCEDURE IF EXISTS [Compra].[NotaCredito_Delete]
GO
DROP PROCEDURE IF EXISTS [Compra].[NotaCredito_Get]
GO 
DROP PROCEDURE IF EXISTS [Compra].[NotaCredito_Get_Id]
GO 
DROP PROCEDURE IF EXISTS [Compra].[NotaCredito_GetId]
GO 
DROP PROCEDURE IF EXISTS [Compra].[NotaCredito_Insert]
GO 
--
DROP PROCEDURE IF EXISTS [Compra].[NotaCredito_Update]
GO 
DROP PROCEDURE IF EXISTS [Recepcion].[Factura_Insert]
GO 
DROP PROCEDURE IF EXISTS [Ventas].[NotaEntrega_Convert]
GO
DROP PROCEDURE IF EXISTS [Ventas].[NotaEntrega_Delete]
GO
DROP PROCEDURE IF EXISTS [Ventas].[NotaEntrega_Detele]
GO
--
DROP PROCEDURE IF EXISTS [Config].[CantidadDecimal_Get]
GO
DROP PROCEDURE IF EXISTS [Config].[CantidadDecimal_Update]
GO
DROP PROCEDURE IF EXISTS [ReporteCompras].[Factura_Detalle]
GO
DROP PROCEDURE IF EXISTS ReporteCompras.IngresoBodega
GO
DROP PROCEDURE IF EXISTS [Config].[EntidadNotificacion_Get]
GO
--
DROP PROCEDURE IF EXISTS [Administrador].[ActividadEtiqueta_Delete]
GO
DROP PROCEDURE IF EXISTS [Administrador].[ActividadEtiqueta_Get]
GO
DROP PROCEDURE IF EXISTS [Administrador].[ActividadEtiqueta_Insert]
GO
DROP PROCEDURE IF EXISTS [Administrador].[ActividadEtiqueta_Update]
GO
DROP PROCEDURE IF EXISTS [dbo].[aspManejoArticuloByDocument]
GO
--
DROP PROCEDURE IF EXISTS [Administrador].[Etiqueta_Get]
GO
DROP PROCEDURE IF EXISTS [Administrador].[Etiqueta_Insert]
GO
DROP PROCEDURE IF EXISTS [dbo].[aspManejoArticuloUpdate]
GO
DROP PROCEDURE IF EXISTS [dbo].[aspManejoArticuloInsert]
GO
DROP PROCEDURE IF EXISTS [Almacen].[Articulo_Search]
GO
--
DROP PROCEDURE IF EXISTS [dbo].[ASPArticuloSearchFilter]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPArticuloSearchFraccFilter]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPCategoriaCompraOption]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPCobroDetalleByCobro]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPCobroDetalleByDocument]
GO
--
DROP PROCEDURE IF EXISTS [dbo].[ASPContraPartidaCajaRead]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPContraPartidaCreate]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPContraPartidaRead]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPContraPartidaUpdate]
GO
DROP PROCEDURE IF EXISTS [dbo].[aspControlCajaClose]
GO
--
DROP PROCEDURE IF EXISTS [dbo].[aspControlCajaMovement]
GO
DROP PROCEDURE IF EXISTS [dbo].[aspControlCajaOpen]
GO
DROP PROCEDURE IF EXISTS [dbo].[aspCuotaXCobrarByCobro]
GO
DROP PROCEDURE IF EXISTS [aspCuotaXCobrarByDocument]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPCuotaxCobrarInsert]
GO
--
DROP PROCEDURE IF EXISTS [dbo].[ASPCuotaxCobrarUpdate]
GO
DROP PROCEDURE IF EXISTS [aspCuotaXPagarByDocument]
GO
DROP PROCEDURE IF EXISTS [dbo].[aspCuotaXPagarByPago]
GO
DROP PROCEDURE IF EXISTS [dbo].[aspCuotaxPagarInsert]
GO
DROP PROCEDURE IF EXISTS [aspCuotaxPagarUpdate]
GO
-- // 1
DROP PROCEDURE IF EXISTS [dbo].[aspActividadEmpresaBySucursal]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspActividadEmpresaGet]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspActividadEmpresaGetAll]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspAnioFiscalCreate]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspAnioFiscalDelete]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspAnioFiscalGetBy]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspAnioFiscalRead]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspAnioFiscalUpdate]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspArticuloHistoryEntrada]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPBancoByOption]
GO

-- // 2
DROP PROCEDURE IF EXISTS [dbo].[ASPCobroByComprobante]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPCobroByDocument]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPComposicionArticuloCreate]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPComposicionArticuloDelete]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPComposicionArticuloDetalleCreate]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPComposicionArticuloDetalleDelete]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPComposicionArticuloDetalleRead]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPComposicionArticuloDetalleUpdate]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPComposicionArticuloRead]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPComposicionArticuloUpdate]
GO

-- // 3
DROP PROCEDURE IF EXISTS [dbo].[ASPConfigPorcentajeGet]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPConfigPorcentajeUpdate]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPConfiguracionMoraCreate]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPConfiguracionMoraDelete]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPConfiguracionMoraRead]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPConfiguracionMoraUpdate]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPContraPartidaDelete]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPContraPartidaEFRead]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPControlStockGet]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspConvertDocumentGetId]
GO


-- // 4
DROP PROCEDURE IF EXISTS [dbo].[aspDocumentsCharge]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspDocumentsForCharge]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspDocumentsPay]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPHelperNewFechaCuota]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPHelperNewFechaCuotaCompra]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPImpuestoArticuloDelete]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPImpuestoArticuloGetId]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPImpuestoArticuloInsert]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPImpuestoArticuloListaInsert]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPImpuestoArticuloUpdate]
GO

-- // 5
DROP PROCEDURE IF EXISTS [dbo].[ASPKardexGet]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspKardexReporteGeneral]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPKardexTotalesGet]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPNotaVentaDelete]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPNotaVentaGet]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPNotaVentaGetId]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPNotaVentaInsert]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPNotaVentaUpdate]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPPersonaSearch]
GO

DROP PROCEDURE IF EXISTS [dbo].[aspStockUpdate]
GO

--6 //

DROP PROCEDURE IF EXISTS [Inventario].[Control_Stock_Serv_Delete]
GO

DROP PROCEDURE IF EXISTS [Inventario].[Control_Stock_Serv_Get]
GO

DROP PROCEDURE IF EXISTS [Inventario].[Control_Stock_Serv_Get_Document]
GO

DROP PROCEDURE IF EXISTS [Inventario].[Control_Stock_Serv_Update_Stock]
GO


DROP PROCEDURE IF EXISTS [GestFinanc].[ComprobanteIngreso_Delete]
GO

DROP PROCEDURE IF EXISTS [GestFinanc].[ComprobanteIngreso_Get]
GO

DROP PROCEDURE IF EXISTS [GestFinanc].[ComprobanteIngreso_Get_ByDocument]
GO

DROP PROCEDURE IF EXISTS [GestFinanc].[ComprobanteIngreso_Insert_Fast]
GO

 -------
DROP PROCEDURE IF EXISTS [DocumentoTributario].[FirmaElectronica_Insert]
GO


DROP PROCEDURE IF EXISTS [DocumentoTributario].[FirmaElectronica_Update]
GO


DROP PROCEDURE IF EXISTS [dbo].[ASPFirmaElectronicaDelete]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPFirmaElectronicaGet]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPFirmaElectronicaInsert]
GO

DROP PROCEDURE IF EXISTS [dbo].[ASPFirmaElectronicaUpdate]
GO

--REPORTES 

DROP PROCEDURE IF EXISTS [ReporteInventario].[Articulo_Global]
GO

DROP PROCEDURE IF EXISTS [ReporteInventario].[Articulo_Tarifa]
GO

DROP PROCEDURE IF EXISTS [ReporteInventario].[Articulo_Valoracion]
GO

DROP PROCEDURE IF EXISTS [Inventario].[Articulo_Report_Movement]
GO

DROP PROCEDURE if EXISTS Almacen.Articulo_Insert
GO

DROP PROCEDURE if exists Almacen.Articulo_Update
GO

-- Alexis Ramirez || fecha 8/8/2023 AL 8/8/2023

DROP PROCEDURE IF EXISTS [dbo].[aspEntidadInsert] 
GO 
DROP PROCEDURE IF EXISTS [Config].[GestionGeneral_Get]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPFacturaCxCGetIdPay]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPAsigBodegaGetByAsig]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPAsigBodegaGetId]
GO 
--
DROP PROCEDURE IF EXISTS [dbo].[ASPAsignacionInsert]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPGuiaRemisionReport]
GO 
DROP PROCEDURE IF EXISTS [Config].[Sri_Get]
GO 
DROP PROCEDURE IF EXISTS [Config].[Sri_Update]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPRetencionCompraReport]
GO 
--
DROP PROCEDURE IF EXISTS [Ingresos].[CompronteIngreso_Report]
GO 
DROP PROCEDURE IF EXISTS [Almacen].[GestionGeneral_Get]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPAsigPtoEmisionGetByAsig]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPAsigPtoEmisionGetId]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPEstadoFinacieroDv]
GO 
--
DROP PROCEDURE IF EXISTS [dbo].[ASPEstadoFinacieroDv]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPSucursalByAccess]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPSucursalByEntidad]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPSucursalByRolGet]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPSucursalOption]
GO 
--
DROP PROCEDURE IF EXISTS [dbo].[DeleteAsync]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPSucursalOption]
GO 
DROP PROCEDURE IF EXISTS [App].[aspEntidad_GetId]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPDocumentoLoteGet]
GO 
DROP PROCEDURE IF EXISTS [dbo].[ASPDocumentoLoteInsert]
GO 
--
DROP PROCEDURE IF EXISTS [dbo].[ASPPuntoEmisionByRolGet]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPComprobanteNoAutorizadoInsert]
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPComprobanteAutorizadoInsert]
GO

--
DROP PROCEDURE IF EXISTS Almacen.SubFamilia_Insert
GO

-- ALEXIS RAMIREZ -- FECHA 8/11/2023
DROP PROCEDURE IF EXISTS [Inventario].[Control_Stock_Serv_Get]
GO

DROP PROCEDURE IF EXISTS FactElect.Config_Comprob_Elect_Update
GO

--- DANIS MANCHU - FECHA: 8/12/2023
DROP PROCEDURE IF EXISTS [Almacen].[Familia_For_Select]
GO



--- RAMIREZ ALEXIS - FECHA: 10/9/2023
DROP PROCEDURE IF EXISTS [dbo].[aspEntidadOption]
GO

-- RAMIREZ ALEXIS - FECHA :10/26/2023
DROP PROCEDURE IF EXISTS [Ventas].[Factura_Get_v2]
GO 

DROP PROCEDURE IF EXISTS [Ventas].[Factura_Insert_v2]
GO 

DROP PROCEDURE IF EXISTS [Ventas].[Factura_Get_Data_Form]
GO 

DROP PROCEDURE IF EXISTS [Ventas].[NotaEntrega_SendEmail]
GO 

DROP PROCEDURE IF EXISTS [Ventas].[Proforma_SendEmail]
GO
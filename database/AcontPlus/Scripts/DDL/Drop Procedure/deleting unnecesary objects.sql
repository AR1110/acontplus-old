
USE AcontPlus
GO
DROP PROCEDURE IF EXISTS ASPReporteGetToPrint
GO
DROP PROCEDURE IF EXISTS ASPReporteParametroGetByCode
GO
DROP PROCEDURE IF EXISTS [ApiPrinter].[Impresora_Get_Documemt] 
GO
DROP PROCEDURE IF EXISTS [dbo].[ASPReportParamsGet]

DROP PROCEDURE IF EXISTS [Compra].[IngresoBodega_Delete]
GO

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

DROP PROCEDURE IF EXISTS [Config].[EntidadNotificacion_Update]
GO
--OJO SOLO DESPUES DE MIGRAR TODO
--GO
--DROP TABLE ReporteDataSource
--GO
--DROP TABLE ReporteParametro
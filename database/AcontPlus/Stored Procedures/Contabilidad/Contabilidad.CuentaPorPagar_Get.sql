-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 03/14/2023
-- Description:	SP para lisatar las cuentas por pagar.
-- =============================================
IF OBJECT_ID(N'Contabilidad.CuentaPorPagar_Get', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorPagar_Get
GO
CREATE PROCEDURE Contabilidad.CuentaPorPagar_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT TOP 50
		 pp.idCuentaPorPagar
		,idTiempoCredito = ISNULL(pp.idTiempoCredito,0)
		,identificacion = p.numeroIdentificacion
		,nombreFiscal = p.nombreFiscal
		,pp.codDoc
		,pp.serieComprobante
		,fechaEmision = Format(pp.fechaEmision, 'yyyy-MM-dd hh:mm') 
		,importeTotal 
		,abono = ISNULL(abono,0)
		,saldo = ISNULL(saldo,0)
		,diasCredito = ISNULL(tc.diasCredito,0)
		,estado = ep.descripcion
		,codPago = ep.codigo
	FROM Contabilidad.CuentaPorPagar pp WITH (NOLOCK)
	INNER JOIN dbo.Proveedor      p WITH (NOLOCK) ON p.idProveedor      = pp.idProveedor
	INNER JOIN dbo.TiempoCredito tc WITH (NOLOCK) ON tc.idTiempoCredito = pp.idTiempoCredito
	INNER JOIN dbo.EstadoPago    ep WITH (NOLOCK) ON ep.idEstadoPago    = pp.idEstadoPago
	WHERE pp.idEntidad = @idEntidad
END
GO

USE [AcontPlus]
GO
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Contabilidad.CuentaPorPagar_Update_Status', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorPagar_Update_Status
GO
CREATE PROCEDURE Contabilidad.CuentaPorPagar_Update_Status @idCuentaPorPagar INT, @importeTotal NUMERIC(18,5)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @posfechado NUMERIC(18,5)
	DECLARE @abono NUMERIC(18,5)
	DECLARE @idEstadoPago INT
	DECLARE @residuo AS NUMERIC(18,5)

	SELECT @posfechado = SUM(pd.abono)
	FROM dbo.PagoDetalle pd WITH (NOLOCK)
	INNER JOIN Contabilidad.CuotaPorPagar pp WITH (NOLOCK) ON pp.idCuotaPorPagar = pd.idCuotaPorPagar
	INNER JOIN dbo.Pago pa WITH (NOLOCK) ON pa.idPago = pd.idPago
	INNER JOIN dbo.ComprobanteEgreso ce WITH (NOLOCK) ON ce.idComprobanteEgreso = pa.idComprobanteEgreso
	WHERE pp.idCuentaPorPagar = @idCuentaPorPagar  AND ce.estado = 1 AND cobro = 0
	
	SELECT @abono = SUM(abono) FROM Contabilidad.CuotaPorPagar WHERE idCuentaPorPagar = @idCuentaPorPagar AND estado = 1

	SELECT @residuo = ISNULL(@importeTotal,0) - ISNULL(@abono,0)

	IF ISNULL(@posfechado,0) > 0
		BEGIN
			SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PFC'
		END

	IF ISNULL(@posfechado,0) <= 0
		BEGIN 
			IF @residuo = 0  
				BEGIN
					SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PA'
				END 

			IF @residuo > 0 
				BEGIN
					SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PP'
				END

			IF ISNULL(@abono,0) = 0 
				BEGIN
					SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'
				END 
		END

	UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = @idEstadoPago, abono = ISNULL(@abono,0) WHERE idCuentaPorPagar = @idCuentaPorPagar
END
GO

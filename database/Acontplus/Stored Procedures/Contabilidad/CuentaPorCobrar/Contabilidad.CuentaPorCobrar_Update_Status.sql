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
IF OBJECT_ID(N'Contabilidad.CuentaPorCobrar_Update_Status', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorCobrar_Update_Status
GO
CREATE PROCEDURE Contabilidad.CuentaPorCobrar_Update_Status @idCuentaPorCobrar INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @importeTotal AS NUMERIC (18,5) 
	DECLARE @abono AS NUMERIC(18,5)
	DECLARE @idEstadoPago AS INT
	DECLARE @residuo AS NUMERIC(18,5)
	DECLARE @idTipoDocumento AS INT 
	DECLARE @posfechado NUMERIC(18,5)
	

	SELECT @posfechado = SUM(cd.abono) 
	FROM dbo.CobroDetalle                  cd WITH (NOLOCK)
	INNER JOIN Contabilidad.CuotaPorCobrar cc WITH (NOLOCK) ON cc.idCuotaPorCobrar     = cd.idCuotaPorCobrar
	INNER JOIN dbo.Cobro                   co WITH (NOLOCK) ON co.idCobro              = cd.idCobro
	INNER JOIN dbo.ComprobanteIngreso      ci WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
	WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar AND co.cobro = 0 AND ci.estado = 1

	SELECT @abono =  SUM(abono) FROM Contabilidad.CuotaPorCobrar WITH (NOLOCK) WHERE idCuentaPorCobrar = @idCuentaPorCobrar AND estado = 1

	SELECT TOP 1 @importeTotal = importeTotal + mora FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE idCuentaPorCobrar = @idCuentaPorCobrar

	SELECT @residuo = ISNULL(@importeTotal,0) - ISNULL(@abono,0)

	IF ISNULL(@posfechado,0) > 0
		BEGIN
			SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PFC'
		END

	IF ISNULL(@posfechado,0) <= 0
		BEGIN 
			IF @residuo <= 0  
				BEGIN
					SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'CBR'
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

	UPDATE Contabilidad.CuentaPorCobrar SET idEstadoPago = @idEstadoPago, abono = ISNULL(@abono,0) WHERE idCuentaPorCobrar = @idCuentaPorCobrar
		

END
GO

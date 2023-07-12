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
IF OBJECT_ID(N'Contabilidad.CuotaPorPagar_Update', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuotaPorPagar_Update
GO
CREATE PROCEDURE Contabilidad.CuotaPorPagar_Update @idCuotaPorPagar INT, @cuota NUMERIC(18,5)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @abono NUMERIC (18,5)
	DECLARE @idEstadoPago INT
	DECLARE @residuo AS NUMERIC(18,5)

	SELECT @abono = SUM(pd.abono) 
	FROM dbo.PagoDetalle pd WITH (NOLOCK)	
    INNER JOIN dbo.Pago pa WITH (NOLOCK) on pa.idPago = pd.idPago  
	INNER JOIN dbo.ComprobanteEgreso ce WITH (NOLOCK) ON ce.idComprobanteEgreso = pa.idComprobanteEgreso
	WHERE pd.idCuotaPorPagar = @idCuotaPorPagar AND pa.cobro = 1 AND ce.estado = 1

	SELECT @residuo = ISNULL(@cuota,0) - ISNULL(@abono,0)

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


	UPDATE Contabilidad.CuotaPorPagar SET abono = ISNULL(@abono,0), idEstadoPago = @idEstadoPago WHERE idCuotaPorPagar = @idCuotaPorpagar 
END
GO

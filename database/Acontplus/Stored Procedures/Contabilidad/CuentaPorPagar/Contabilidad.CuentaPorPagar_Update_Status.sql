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
CREATE OR ALTER PROCEDURE Contabilidad.CuentaPorPagar_Update_Status @idCuentaPorPagar INT, @importeTotal NUMERIC(18,5)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @posfechado NUMERIC(18,5)
	DECLARE @abono NUMERIC(18,5)
	DECLARE @idEstadoPago INT
	DECLARE @residuo AS NUMERIC(18,5)

    SELECT @posfechado = SUM(hp.abono) 
    FROM dbo.ComprobanteEgreso ce WITH (NOLOCK) 
    INNER JOIN Contabilidad.Historial_Pago hp ON ce.idComprobanteEgreso = hp.idComprobanteEgreso
    INNER JOIN dbo.Pago                    pa ON pa.idPago              = hp.idPago
    WHERE ce.estado = 1
      AND hp.idCuentaPorPagar = @idCuentaPorPagar
      AND pa.posfechado = 1
      AND pa.cobro = 0

    SELECT @abono = SUM(hp.abono) 
    FROM dbo.ComprobanteEgreso ce WITH (NOLOCK) 
    INNER JOIN Contabilidad.Historial_Pago hp ON ce.idComprobanteEgreso = hp.idComprobanteEgreso
    INNER JOIN dbo.Pago                    pa ON pa.idPago              = hp.idPago
    WHERE ce.estado = 1
      AND hp.idCuentaPorPagar = @idCuentaPorPagar
      AND pa.cobro = 1

	SELECT @residuo = ISNULL(@importeTotal,0) - ISNULL(@abono,0)

	IF ISNULL(@posfechado,0) > 0
		BEGIN
			SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PFC'
		END

	IF ISNULL(@posfechado,0) <= 0
		BEGIN 
			IF @residuo <= 0  
				BEGIN
					SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PA'

                    IF @residuo < 0 
                        BEGIN
                            SET @abono = @importeTotal
                        END 
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

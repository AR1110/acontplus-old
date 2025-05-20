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
CREATE OR ALTER PROCEDURE Contabilidad.CuotaPorCobrar_Update_Status @idCuotaPorCobrar AS INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @cuota NUMERIC (18,5) 
	       ,@abono NUMERIC(18,5)
	       ,@idEstadoPago INT
	       ,@residuo NUMERIC(18,5)
           ,@mora NUMERIC(18,5)
           ,@diasMora NUMERIC(18,5)

	SELECT @cuota = cuota  FROM Contabilidad.CuotaPorCobrar WHERE idCuotaPorCobrar = @idCuotaPorCobrar

	SELECT @abono    = SUM(cd.abono)
          ,@mora     = SUM(cd.mora)
          ,@diasMora = SUM(cd.diasMora)
	FROM dbo.CobroDetalle             cd WITH (NOLOCK)
	INNER JOIN dbo.Cobro              co WITH (NOLOCK) ON co.idCobro = cd.idCobro
	INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
	WHERE cd.idCuotaPorCobrar = @idCuotaPorCobrar 
      AND ci.estado = 1 
      AND co.cobro = 1

	SELECT @residuo = (ISNULL(@cuota,0) + ISNULL(@mora,0)) - ISNULL(@abono,0)


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

	UPDATE Contabilidad.CuotaPorCobrar 
        SET idEstadoPago = @idEstadoPago
           ,abono        = ISNULL(@abono,0)
           ,mora         = ISNULL(@mora,0)
           ,diasMora     = ISNULL(@diasMora,0)
    WHERE idCuotaPorCobrar = @idCuotaPorCobrar
END
GO

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
-- Author:		Alexis Ramirez
-- Create date: 5/01/2023
-- Description: SP para actualizar los precios de costo segun el tipo de valoracion
-- =============================================
IF OBJECT_ID(N'Inventario.Metodo_Valoracion_Update', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Metodo_Valoracion_Update
GO
CREATE PROCEDURE Inventario.Metodo_Valoracion_Update @idTransaccion AS INT,@idArticulo AS INT ,@codMetodoValoracion AS VARCHAR(5)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF @codMetodoValoracion = 'UEPS'
		BEGIN
			DECLARE @precioCostoActual AS NUMERIC(18,5)
			DECLARE @precioCosto AS NUMERIC(18,5)
			DECLARE @precioTransaccion AS NUMERIC(18,5)
			DECLARE @porcentajeUtilidad AS NUMERIC(18,5)

			DECLARE @table AS TABLE (
			 	 fecha DATETIME NOT NULL
				,precioCosto NUMERIC(18,5) NOT NULL
			)
			INSERT INTO @table (fecha,precioCosto)
			SELECT TOP 1 fechaRegistro = MAX(fechaRegistro),precioUnitario FROM v_InventarioTransaccion 
			WHERE idArticulo = @idArticulo 
			  AND codTransaccion = 'E'
			  AND estado = 1 
			GROUP BY precioUnitario 
			ORDER BY MAX(fechaRegistro) DESC


			SELECT @precioCostoActual = precioCosto FROM @table

			SELECT TOP 1 @precioCosto = precioCosto FROM dbo.Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo

			SELECT TOP 1 @precioTransaccion = precioUnitario FROM Inventario.Transaccion WITH (NOLOCK) WHERE idTransaccion = @idTransaccion
			

			UPDATE Inventario.Transaccion SET precioCosto = @precioTransaccion WHERE idTransaccion = @idTransaccion

			UPDATE dbo.Articulo SET precioCosto = @precioCostoActual WHERE idArticulo = @idArticulo

			UPDATE dbo.ArticuloPvP SET porcentajeUtilidad = ((precioVenta / @precioCostoActual) * 100) - 100 WHERE idArticulo = @idArticulo

		END 
END
GO

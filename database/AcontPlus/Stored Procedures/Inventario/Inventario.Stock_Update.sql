USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Inventario].[Articulo_Update_Stock]    Script Date: 11/28/2022 12:22:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Inventario.Stock_Update', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Stock_Update
GO
CREATE PROCEDURE Inventario.Stock_Update @idArticulo AS INT ,@idBodega AS INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	SET DEADLOCK_PRIORITY HIGH;

	DECLARE @cantidadActual AS NUMERIC(18,5)
	DECLARE @stock AS NUMERIC(15,5)
	DECLARE @fechaEmision AS DATETIME
	
	SELECT TOP 1 @fechaEmision =  fechaRegistro, @cantidadActual =  cantidadEntrada 
	FROM v_InventarioTransaccion WITH (NOLOCK)
	WHERE codTransaccion = 'A' AND idArticulo = @idArticulo AND idBodega = @idBodega AND estado = 1
	ORDER BY fechaRegistro DESC

	 
	IF @fechaEmision IS NOT NULL
		BEGIN
			SELECT @cantidadActual = @cantidadActual + ISNULL(sum(cantidadEntrada - cantidadSalida),0)
			FROM v_InventarioTransaccion WITH (NOLOCK)
			WHERE idBodega = @idbodega 
			  AND idArticulo = @idarticulo
			  AND estado = 1 
			  AND codTransaccion in ('E','S')
			  AND fechaRegistro >= @fechaEmision
		END 

	ELSE   
		BEGIN	
			SELECT @cantidadActual = ISNULL(sum(cantidadEntrada - cantidadSalida),0)
			FROM v_InventarioTransaccion WITH (NOLOCK)
			WHERE idBodega = @idbodega 
			  AND idArticulo = @idarticulo 
			  AND estado = 1 
			  AND codTransaccion in ('E','S')
		END

	UPDATE Inventario.Stock WITH(ROWLOCK) SET cantidad = ISNULL(@cantidadActual,0) WHERE idArticulo = @idArticulo AND idBodega = @idBodega

	SELECT @stock = SUM(cantidad) FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @idArticulo 

	UPDATE dbo.Articulo WITH(ROWLOCK) SET stock = ISNULL(@stock,0) WHERE idArticulo = @idArticulo
	
		
END

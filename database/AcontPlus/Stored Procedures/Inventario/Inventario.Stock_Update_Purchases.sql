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
-- Test : exec Inventario.Stock_Update_Input 38, '[{"cantidad":5,"idArticulo":1,"fechaEmision":"2022-05-05T13:52:17.833","idBodega":1}]'
IF OBJECT_ID(N'Inventario.Stock_Update_Purchases', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Stock_Update_Purchases
GO
CREATE PROCEDURE Inventario.Stock_Update_Purchases 
    @cantidad AS NUMERIC(15,5)
   ,@idArticulo AS INT 
   ,@idBodega AS INT
   ,@fechaEmision AS DATETIME
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @stock DECIMAL(15,5)
	DECLARE @cantidadActual AS NUMERIC(18,5)
	

	DECLARE @ajustes AS TABLE (
	     idAjuste INT NOT NULL
	    ,fechaEmision DATETIME NOT NULL
	)
		  
	INSERT INTO @ajustes (idAjuste,fechaEmision)
	SELECT tt.idTransaccion, MAX(tt.fechaRegistro) 
	FROM Inventario.Transaccion tt WITH (NOLOCK) 
	INNER JOIN Inventario.TipoTransaccion ti WITH (NOLOCK) ON ti.idTipoTransaccion = tt.idTipoTransaccion 
	WHERE ti.codigo = 'A' AND tt.idArticulo = @idArticulo AND tt.idBodega = @idBodega AND tt.estado = 1  
	GROUP BY tt.idTransaccion

	SELECT TOP 1 @cantidadActual = cantidad FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idBodega = @idBodega

	IF (SELECT COUNT(*) FROM @ajustes) > 0 
		BEGIN
			IF (SELECT COUNT(*) FROM @ajustes WHERE fechaEmision >= @fechaEmision) > 0 
				BEGIN 
					SET @cantidadActual = @cantidadActual + @cantidad
				END 
		END 

	IF (SELECT COUNT(*) FROM @ajustes) = 0  
		BEGIN
			SET @cantidadActual = @cantidadActual + @cantidad
		END

			
	UPDATE Inventario.Stock SET cantidad = @cantidadActual WHERE idArticulo = @idArticulo AND idBodega = @idBodega

	SELECT @stock = SUM(cantidad) FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @idArticulo 

	UPDATE dbo.Articulo SET stock = ISNULL(@stock,0) WHERE idArticulo = @idArticulo

END

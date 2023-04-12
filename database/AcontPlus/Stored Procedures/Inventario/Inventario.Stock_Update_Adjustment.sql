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
IF OBJECT_ID(N'Inventario.Stock_Update_Adjustment', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Stock_Update_Adjustment
GO
CREATE PROCEDURE Inventario.Stock_Update_Adjustment @idUsuarioRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @codMovement AS VARCHAR(5) 
	DECLARE @idArticulo AS INT 
	DECLARE @idBodega AS INT
	DECLARE @fechaEmision AS DATETIME
	DECLARE @stock AS NUMERIC(18,2)
	DECLARE @cantidadActual AS NUMERIC(18,5)
	DECLARE @cantidad AS NUMERIC(18,5)
	DECLARE @table AS TABLE(
		 codMovement VARCHAR(5) NOT NULL 
		,idArticulo INT NOT NULL
		,idBodega INT NOT NULL
		,fechaEmision DATETIME NOT NULL
		,cantidad NUMERIC(18,5) NOT NULL
	)

	BEGIN TRY

		INSERT INTO @table 
		      (codMovement,idArticulo,idBodega,fechaEmision,cantidad)
		SELECT codMovement,idArticulo,idBodega,fechaEmision,cantidad
		FROM OPENJSON(@json) 
		WITH (codMovement VARCHAR(5) '$.codMovement'
		     ,idArticulo INT '$.idArticulo'
			 ,idBodega INT '$.idBodega'
			 ,fechaEmision DATETIME '$.fechaEmision'
			 ,cantidad NUMERIC(18,5) '$.cantidad'
			 ) as dt 

		SELECT @idArticulo = idArticulo, @idBodega = idBodega,@codMovement = codMovement , @fechaEmision = fechaEmision FROM @table 

		IF EXISTS (SELECT 1 FROM dbo.Articulo WHERE idArticulo = @idArticulo AND llevaInventario = 0)
			BEGIN
				SELECT '0'code,'Este articulo es un servicio' as 'message'
				RETURN 
			END

		BEGIN TRAN 
			--==================================================AJUSTES============================================================================
		   IF @codMovement = 'A'
				BEGIN
					DECLARE @salidas AS NUMERIC(18,5)
					DECLARE @entradas AS NUMERIC(18,5)
					DECLARE @saldo AS NUMERIC(18,5)

					SELECT @entradas = ISNULL(SUM(tr.cantidad),0) 
					FROM Inventario.Transaccion tr WITH (NOLOCK)
					INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
					WHERE tt.codigo = 'E' 
					  AND tr.estado = 1
					  AND tr.fechaRegistro <= @fechaEmision 
					  AND tr.idArticulo = @idArticulo 
					  AND tr.idBodega = @idBodega
					 

					SELECT @salidas = ISNULL(SUM(tr.cantidad),0) 
					FROM Inventario.Transaccion tr WITH (NOLOCK)
					INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
					WHERE tt.codigo = 'S' 
					  AND tr.estado = 1
					  AND tr.fechaRegistro <= @fechaEmision 
					  AND tr.idArticulo = @idArticulo 
					  AND tr.idBodega = @idBodega
					   
					SET @saldo =  @entradas - @salidas

					SET @cantidadActual = @saldo - @cantidad

					UPDATE Inventario.Stock SET cantidad = @cantidadActual WHERE idArticulo = @idArticulo AND idBodega = @idBodega

				END 
		   
		   SELECT @stock = SUM(cantidad) FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @idArticulo

		   UPDATE dbo.Articulo SET stock =  ISNULL(@stock,0) WHERE idArticulo = @idArticulo

		COMMIT TRAN
		SELECT '1'code,'Stock Actualizado Correctamente' as 'message'
		RETURN
	END TRY 

	BEGIN CATCH
		SELECT '0'code,'Error en el proceso almacenado: '+ERROR_MESSAGE() as 'message'
		RETURN 
	END CATCH
END

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

	DECLARE @salidas AS NUMERIC(18,5)
	DECLARE @entradas AS NUMERIC(18,5)
	DECLARE @saldo AS NUMERIC(18,5)

	DECLARE @ajustes AS TABLE (
	     idAjuste INT NOT NULL
	    ,fechaEmision DATETIME NOT NULL
		,cantidad NUMERIC(15,5) NOT NULL
	)

	INSERT INTO @ajustes (idAjuste,cantidad,fechaEmision)
	SELECT TOP 1 tt.idTransaccion, tt.cantidad,MAX(tt.fechaRegistro) 
	FROM Inventario.Transaccion           tt WITH (NOLOCK) 
	INNER JOIN Inventario.TipoTransaccion ti WITH (NOLOCK) ON ti.idTipoTransaccion = tt.idTipoTransaccion 
	WHERE ti.codigo = 'A' AND tt.idArticulo = @idArticulo AND tt.idBodega = @idBodega AND tt.estado = 1  
	GROUP BY tt.idTransaccion,cantidad
	ORDER BY MAX(tt.fechaRegistro) DESC

	IF (SELECT COUNT(*) FROM @ajustes) > 0 
		BEGIN

			SELECT @cantidadActual = cantidad, @fechaEmision = fechaEmision FROM @ajustes

			SELECT @entradas = ISNULL(SUM(tr.cantidad),0) 
			FROM Inventario.Transaccion           tr WITH (NOLOCK)
			INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
			WHERE tt.codigo = 'E' 
				AND tr.estado = 1
				AND tr.fechaRegistro >= @fechaEmision 
				AND tr.idArticulo = @idArticulo 
				AND tr.idBodega = @idBodega

			SELECT @salidas = ISNULL(SUM(tr.cantidad),0) 
			FROM Inventario.Transaccion           tr WITH (NOLOCK)
			INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
			WHERE tt.codigo = 'S' 
				AND tr.estado = 1
				AND tr.fechaRegistro >= @fechaEmision 
				AND tr.idArticulo = @idArticulo 
				AND tr.idBodega = @idBodega

			SET @cantidadActual = @cantidadActual + @entradas

			SET @cantidadActual = @cantidadActual - @salidas
			
		END 

	IF (SELECT COUNT(*) FROM @ajustes) = 0  
		BEGIN	
			
		SELECT @entradas = ISNULL(SUM(tr.cantidad),0) 
		FROM Inventario.Transaccion           tr WITH (NOLOCK)
		INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
		WHERE   tt.codigo     = 'E' 
			AND tr.estado     = 1
			AND tr.idArticulo = @idArticulo 
			AND tr.idBodega   = @idBodega

		SELECT @salidas = ISNULL(SUM(tr.cantidad),0) 
		FROM Inventario.Transaccion           tr WITH (NOLOCK)
		INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
		WHERE   tt.codigo     = 'S' 
			AND tr.estado     = 1 
			AND tr.idArticulo = @idArticulo 
			AND tr.idBodega   = @idBodega

		SET @cantidadActual = @entradas - @salidas

		END

	
	UPDATE Inventario.Stock WITH(ROWLOCK) SET cantidad = ISNULL(@cantidadActual,0) WHERE idArticulo = @idArticulo AND idBodega = @idBodega

	SELECT @stock = SUM(cantidad) FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @idArticulo 

	UPDATE dbo.Articulo WITH(ROWLOCK) SET stock = ISNULL(@stock,0) WHERE idArticulo = @idArticulo
	
		
END

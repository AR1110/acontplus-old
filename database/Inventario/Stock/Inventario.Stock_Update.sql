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
CREATE OR ALTER PROCEDURE Inventario.Stock_Update @idArticulo AS INT ,@idBodega AS INT
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
	
	--> Calculate and update final stock
    SELECT TOP 1 @fechaEmision = tr.fechaEmision, @cantidadActual = td.cantidadTransaccion
    FROM Inventario.Stock                    st 
    INNER JOIN Inventario.TransaccionDetalle td ON td.idTransaccionDetalle = st.idTransaccionDetalle
    INNER JOIN Inventario.Transaccion        tr ON tr.idTransaccion        = td.idTransaccion
    WHERE st.idArticulo = @idArticulo
        AND st.idBodega = @idBodega
        AND st.estado = 1

    IF @fechaEmision IS NOT NULL
		BEGIN
            SELECT @cantidadActual = @cantidadActual + ISNULL(sum(cantidadTransaccion),0)
            FROM Inventario.TransaccionDetalle    td
            INNER JOIN Inventario.Transaccion     tr ON tr.idTransaccion     = td.idTransaccion
            INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
			WHERE td.idBodega = @idBodega 
			    AND td.idArticulo = @idArticulo
			    AND td.estado = 1 
			    AND tt.codigo IN ('E','S')
			    AND tr.fechaRegistro >= @fechaEmision
		END 

	ELSE   
		BEGIN	
			SELECT @cantidadActual = ISNULL(sum(cantidadTransaccion),0)
			FROM Inventario.TransaccionDetalle    td
            INNER JOIN Inventario.Transaccion     tr ON tr.idTransaccion     = td.idTransaccion
            INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
			WHERE td.idBodega = @idBodega 
			    AND td.idArticulo = @idArticulo
			    AND td.estado = 1 
			    AND tt.codigo IN ('E','S')
		END

    UPDATE Inventario.Stock WITH (ROWLOCK) SET cantidad = ISNULL(@cantidadActual,0) WHERE idBodega = @idBodega AND idArticulo = @idArticulo

	SELECT @stock = SUM(cantidad) 
    FROM Inventario.Stock s WITH (NOLOCK)
    INNER JOIN dbo.Bodega b WITH (NOLOCK) ON b.idBodega = s.idBodega
    WHERE idArticulo = @idArticulo AND b.estado = 1

	UPDATE dbo.Articulo WITH(ROWLOCK) SET stock = ISNULL(@stock,0) WHERE idArticulo = @idArticulo
	
		
END

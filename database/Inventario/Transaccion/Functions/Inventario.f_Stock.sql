USE [Acontplus]
GO 
-- ================================================
-- Template generated from Template Explorer using:
-- Create Scalar Function (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the function.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE OR ALTER FUNCTION Inventario.f_Stock
(
	@idArticulo AS INT 
   ,@idBodega AS INT
)
RETURNS NUMERIC(18,5)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @cantidadActual AS NUMERIC(18,5)
	DECLARE @stock AS NUMERIC(15,5)
	DECLARE @fechaEmision AS DATETIME
	
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
			  AND tt.codigo in ('E','S')
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
			  AND tt.codigo in ('E','S')
		END

	RETURN ISNULL(@cantidadActual,0)

END
GO


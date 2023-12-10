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
	
	SELECT TOP 1 @fechaEmision =  fechaConsolidacion, @cantidadActual =  consolidacion FROM Inventario.Stock WITH (NOLOCK) sWHERE idArticulo = @idArticulo AND idBodega = @idBodega AND estado = 1

	IF @fechaEmision IS NOT NULL
		BEGIN
			SELECT @cantidadActual = @cantidadActual + ISNULL(sum(cantidadEntrada - cantidadSalida),0)
			FROM Inventario.v_Articulo_Transaccion WITH (NOLOCK)
			WHERE idBodega = @idBodega 
			  AND idArticulo = @idArticulo
			  AND estado = 1 
			  AND codTransaccion in ('E','S')
			  AND fechaRegistro >= @fechaEmision
		END 

	ELSE   
		BEGIN	
			SELECT @cantidadActual = ISNULL(sum(cantidadEntrada - cantidadSalida),0)
			FROM Inventario.v_Articulo_Transaccion WITH (NOLOCK)
			WHERE idBodega = @idBodega 
			  AND idArticulo = @idArticulo 
			  AND estado = 1 
			  AND codTransaccion in ('E','S')
		END

	RETURN ISNULL(@cantidadActual,0)

END
GO


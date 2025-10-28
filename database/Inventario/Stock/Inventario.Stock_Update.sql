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

    SET @cantidadActual = Inventario.f_Stock(@idArticulo,@idBodega)

    UPDATE Inventario.Stock WITH (ROWLOCK) SET cantidad = ISNULL(@cantidadActual,0) WHERE idBodega = @idBodega AND idArticulo = @idArticulo

	SELECT @stock = SUM(cantidad) 
    FROM Inventario.Stock s WITH (NOLOCK)
    INNER JOIN dbo.Bodega b WITH (NOLOCK) ON b.idBodega = s.idBodega
    WHERE idArticulo = @idArticulo AND b.estado = 1

	UPDATE dbo.Articulo WITH(ROWLOCK) SET stock = ISNULL(@stock,0) WHERE idArticulo = @idArticulo
	
		
END

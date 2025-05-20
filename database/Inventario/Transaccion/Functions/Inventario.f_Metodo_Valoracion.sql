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
CREATE OR ALTER FUNCTION Inventario.f_Metodo_Valoracion
(
	@idArticulo INT 
   ,@idBodega INT
   ,@codMetodoValoracion VARCHAR(5)
)
RETURNS NUMERIC(18,5)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @precioCostoActual NUMERIC(18,5),@stock AS NUMERIC(15,5),@fechaEmision DATETIME2 
           ,@precioCosto NUMERIC(18,5)

	IF @codMetodoValoracion = 'UEPS'
		BEGIN
			
			SELECT TOP 1 @precioCostoActual = precioUnitario 
			FROM Inventario.v_Articulo_Transaccion WITH (NOLOCK)
			WHERE idArticulo = @idArticulo 
				AND codTransaccion = 'E'
				AND estado = 1 
			ORDER BY fechaRegistro DESC

            SELECT TOP 1 @precioCosto = precioCosto FROM dbo.Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo

            IF @precioCostoActual >= (@precioCosto / 2)
                BEGIN
                    
                END

		END 
	
	RETURN @precioCostoActual

END
GO


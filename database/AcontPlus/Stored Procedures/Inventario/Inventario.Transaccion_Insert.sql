USE [AcontPlus] 
go
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-04-03
-- Description: SP FOR INSERT INVENTARIO
-- =============================================
IF OBJECT_ID(N'Inventario.Transaccion_Insert', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Transaccion_Insert
GO
CREATE PROCEDURE Inventario.Transaccion_Insert 
	 @codTran AS VARCHAR(2)
	,@codDoc AS VARCHAR(2)
	,@fechaRegistro AS DATETIME
	,@idDocumento AS INT
	,@idArticulo AS INT
	,@idBodega AS INT
	,@idMedida AS INT 
	,@idTarifa AS INT = NULL
	,@cantidad AS NUMERIC(15,5)
	,@precioUnitario AS NUMERIC(18,5)
	,@precioCosto AS NUMERIC(18,5)
	,@total AS NUMERIC(18,5)
	,@idUsuario AS INT = NULL
	,@estado AS BIT = 1 
AS
BEGIN
	SET NOCOUNT ON; 
	SET DEADLOCK_PRIORITY LOW;

	DECLARE @idTipoTransaccion INT 
	DECLARE @idTipoDocumento INT
	DECLARE @fraccion AS NUMERIC(18,5)
	DECLARE @cantidadFinal AS NUMERIC(18,5)
	DECLARE @codMetodoValoradion AS VARCHAR(5)
	DECLARE @idEntidad AS INT 
	DECLARE @idTransaccion AS INT

	SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = @codTran
	
	SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = @codDoc

	SELECT TOP 1 @fraccion = conversion FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idMedida = @idMedida

	SELECT TOP 1 @idEntidad = idEntidad FROM dbo.Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo

	SELECT TOP 1 @codMetodoValoradion = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.codMetodoValoracion') FROM Config.Sistema WHERE idEntidad = @idEntidad AND codConfig = 'CI'

	SET @cantidadFinal = @cantidad * ISNULL(@fraccion,1)

	--REGISTRAR LAS TRANSACCIONES DEL ARTICULO 
	IF @estado = 1 
		BEGIN 
			INSERT INTO Inventario.Transaccion
				   (idTipoTransaccion, idArticulo, idBodega, idTipoDocumento, idDocumento, idMedida, idTarifa, cantidad, precioCosto, precioUnitario, total,fechaRegistro, idUsuario)
			SELECT @idTipoTransaccion,@idArticulo,@idBodega,@idTipoDocumento,@idDocumento,@idMedida,@idTarifa,@cantidadFinal,@precioCosto,@precioUnitario,@total,@fechaRegistro,@idUsuario
			
			SET @idTransaccion = @@IDENTITY

		END

	--ACTUALIZAR LOS STOCK DE LOS ARTICULOS 
	EXEC Inventario.Stock_Update @idArticulo,@idBodega

	--ACTUALIZAR EL PRECIO CONEL METODO DE VALORACION
	IF @codTran = 'E'
		BEGIN 
			EXEC Inventario.Metodo_Valoracion_Update @idTransaccion,@idArticulo,@idMedida,@codMetodoValoradion
		END
END
GO

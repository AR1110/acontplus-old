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
	DECLARE @idTipoTransaccion INT 
	DECLARE @idTipoDocumento INT

	SET @idTipoTransaccion = (SELECT TOP 1 idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = @codTran)
	
	SET @idTipoDocumento = (SELECT TOP 1 idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = @codDoc)

	IF @estado = 1 
		BEGIN 
			INSERT INTO Inventario.Transaccion
				   (idTipoTransaccion, idArticulo, idBodega, idTipoDocumento, idDocumento, idMedida, idTarifa, cantidad, precioCosto, precioUnitario, total,fechaRegistro, idUsuario)
			SELECT @idTipoTransaccion,@idArticulo,@idBodega,@idTipoDocumento,@idDocumento,@idMedida,@idTarifa,@cantidad,@precioCosto,@precioUnitario,@total,@fechaRegistro,@idUsuario
		END

	EXEC Inventario.Stock_Update @idArticulo,@idBodega
	
END
GO

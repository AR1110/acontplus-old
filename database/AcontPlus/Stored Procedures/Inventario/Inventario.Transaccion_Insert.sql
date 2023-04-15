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
CREATE PROCEDURE Inventario.Transaccion_Insert @codTran VARCHAR(2)
,@codDoc VARCHAR(2)
,@fechaRegistro DATETIME
,@idDocumento INT
,@idArticulo INT
,@idBodega INT
,@cantidad INT
,@precioCosto NUMERIC(18,5)
,@precioVenta  NUMERIC(18,5)
,@idUsuario INT = NULL
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @idTipoTransaccion INT 
	DECLARE @idTipoDocumento INT
	DECLARE @stock AS NUMERIC(15,5)

	SET @idTipoTransaccion = (SELECT idTipoTransaccion FROM Inventario.TipoTransaccion WHERE codigo = @codTran)
	SET @idTipoDocumento = (SELECT idTipoDocumento FROM Inventario.TipoDocumento WHERE codigo = @codDoc)


	INSERT INTO Inventario.Transaccion(idTipoTransaccion, idArticulo, idBodega, idTipoDocumento, idDocumento, cantidad, precioCosto, precioVenta, fechaRegistro, idUsuario)
	SELECT @idTipoTransaccion, @idArticulo, @idBodega, @idTipoDocumento, @idDocumento, @cantidad, @precioCosto, @precioVenta, @fechaRegistro, @idUsuario
		
	EXEC Inventario.Stock_Update @idArticulo,@idBodega
	
END
GO

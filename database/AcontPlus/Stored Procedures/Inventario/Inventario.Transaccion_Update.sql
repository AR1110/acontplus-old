USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Inventario].[Transaccion_Insert]    Script Date: 4/15/2023 8:48:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'Inventario.Transaccion_Update', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Transaccion_Update
GO
CREATE PROCEDURE Inventario.Transaccion_Update @codTran VARCHAR(5),@codDoc VARCHAR(5),@idDocumento INT,@estado  INT
AS
BEGIN
	SET NOCOUNT ON; 
	SET DEADLOCK_PRIORITY LOW;

	DECLARE @idTipoDocumento INT
	DECLARE @idTipoTransaccion INT

	SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = @codDoc

	SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = @codTran
		
	IF @codTran = 'T'
		BEGIN
			UPDATE Inventario.Transaccion WITH(ROWLOCK) SET estado = @estado WHERE idDocumento = @idDocumento AND idTipoDocumento = @idTipoDocumento 
		END

	ELSE 
		BEGIN
			UPDATE Inventario.Transaccion WITH(ROWLOCK) SET estado = @estado WHERE idDocumento = @idDocumento AND idTipoDocumento = @idTipoDocumento AND idTipoTransaccion = @idTipoTransaccion
		END 

	
END

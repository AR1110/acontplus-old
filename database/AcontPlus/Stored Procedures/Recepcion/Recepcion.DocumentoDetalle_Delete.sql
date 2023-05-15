USE AcontPlus
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-03-09
-- Description:	 SP FOR DELETE DETAIL
-- =============================================
IF OBJECT_ID(N'Recepcion.DocumentoDetalle_Delete', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.DocumentoDetalle_Delete 
GO
CREATE PROCEDURE Recepcion.DocumentoDetalle_Delete	@idUsuarioRol INT,@id INT 
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @idEntidad AS INT
	DECLARE @idUsuario AS INT
	DECLARE @idDocumento AS INT 
	DECLARE @idArticulo AS INT 
	DECLARE @idBodega AS INT 
	DECLARE @inventory AS VARCHAR(5)

	BEGIN TRY
		
		SELECT TOP 1 @idDocumento = idDocumento, @idArticulo = idArticulo, @idBodega = idBodega FROM Recepcion.DocumentoDetalle WITH (NOLOCK) WHERE idDocumentoDetalle = @id

		SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @inventory = llevaInventario FROM Config.GestionSistema WITH (NOLOCK) WHERE idEntidad = @idEntidad

		--SELECT TOP 1 @inventory = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.llevaInventario') FROM Config.Sistema WHERE idEntidad = @idEntidad AND codConfig = 'CI'


		BEGIN TRAN

			DELETE FROM Recepcion.Doc_Detalle_Impuesto WHERE idDocumentoDetalle = @id
			
			DELETE FROM Recepcion.DocumentoDetalle WHERE idDocumentoDetalle = @id
			
			IF NOT EXISTS(SELECT 1 FROM Recepcion.DocumentoDetalle WHERE idDocumento = @idDocumento)
				BEGIN
					UPDATE Recepcion.DocumentoRecibido SET complete = 0 WHERE idDocumento = @idDocumento
				END

			IF @inventory = 'SI'
				BEGIN
					DECLARE @codDoc AS VARCHAR(2)
					DECLARE @codDocInv VARCHAR(2)
					DECLARE @idTipoDocumento INT
					DECLARE @idTipoTransaccion INT

					SELECT TOP 1 @codDoc = codDoc FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento

					SELECT @codDocInv =  CASE WHEN @codDoc = '01' THEN 'FE' WHEN @codDoc = '04' THEN 'NC' END

					SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo  = @codDocInv

					SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo  = 'E'

					UPDATE Inventario.Transaccion SET estado = 0 WHERE idDocumento = @idDocumento AND idTipoDocumento = @idTipoDocumento AND idTipoTransaccion = @idTipoTransaccion AND idArticulo = @idArticulo
					
					EXEC Inventario.Stock_Update @idArticulo, @idBodega
				END 

		COMMIT TRAN
		SELECT '1' code, 'Articulo eliminado exitosamente del stock' as 'message'
	END TRY

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoDetalle/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH

END
GO

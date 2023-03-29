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
CREATE PROCEDURE Recepcion.DocumentoDetalle_Delete	@idUsuarioRol INT
,@id INT 
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @idUsuario INT
	,@idDocumento INT 

	SET @idDocumento = (SELECT idDocumento FROM Recepcion.DocumentoDetalle WHERE idDocumentoDetalle = @id)
	BEGIN TRY
		BEGIN TRAN
			DELETE FROM Recepcion.Doc_Detalle_Impuesto WHERE idDocumentoDetalle = @id
			DELETE FROM Recepcion.DocumentoDetalle WHERE idDocumentoDetalle = @id
			
			IF NOT EXISTS(SELECT 1 FROM Recepcion.DocumentoDetalle WHERE idDocumento = @idDocumento)
				BEGIN
					UPDATE Recepcion.DocumentoRecibido SET complete = 0 WHERE idDocumento = @idDocumento
				END
			SELECT '1' code, 'Articulo eliminado exitosamente del stock' as 'message'
		COMMIT TRAN 
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

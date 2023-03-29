USE AcontPlus
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-10-31
-- Description:	SP PARA ELIMINAR LOS COMPROBANTES ELECTRONICOS DEL SRI
-- =============================================
IF OBJECT_ID(N'Recepcion.Documento_Delete', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Documento_Delete 
GO
CREATE PROCEDURE Recepcion.Documento_Delete @idRol INT
,@idDocumento INT
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT 

	SET @idUsuario = (SELECT idUsuario FROM dbo.Rol WHERE idRol = @idRol)
		IF EXISTS(SELECT 1 FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento AND complete = 1)
			 BEGIN
				SELECT '0' code, 'Imposible eliminar, este archivo ya ha sido importado' as 'message'
				RETURN
			 END
	BEGIN TRY
		BEGIN TRAN
			 DELETE FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento
			SELECT '1' code, 'Eliminado Exitosamente' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		DECLARE @method VARCHAR(200)
		SET @method = (SELECT method FROM OPENJSON(@backendInfo) WITH(method VARCHAR(200) '$.methodName'))
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), @method, ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END

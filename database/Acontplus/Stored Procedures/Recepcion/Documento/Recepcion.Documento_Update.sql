USE AcontPlus
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA ACTUALIZAR LOS COMPROBANTES ELECTRONICOS DEL SRI
-- =============================================

CREATE OR ALTER PROCEDURE [Recepcion].Documento_Update @idRol INT
,@idDocumento INT
,@tipo INT
,@xmlDoc XML
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	,@xmlComp as XML
	,@codDoc VARCHAR(2)

	SELECT @idUsuario = idUsuario FROM AFTDataRol(@idRol)
	

	IF EXISTS(SELECT * FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento AND xmlCompressed IS NOT NULL)
		BEGIN
			SELECT '0' code, 'El xml ya ha sido actualizado' as 'message'
			RETURN
		END

	BEGIN TRY
		BEGIN TRAN
			IF (@tipo = 1)
				BEGIN
					UPDATE Recepcion.DocumentoRecibido SET downloaded = 'ND'
					WHERE idDocumento = @idDocumento
				END
			ELSE
				BEGIN

					SELECT @xmlComp = ( X.Y.value('(autorizaciones/autorizacion/comprobante)[1]', 'VARCHAR(MAX)'))
					FROM  @xmlDoc.nodes('//RespuestaAutorizacionComprobante') as X(Y) 

					SELECT @codDoc = ( X.Y.value('(codDoc)[1]', 'VARCHAR(2)'))
					FROM  @xmlComp.nodes('infoTributaria') as X(Y)

					UPDATE Recepcion.DocumentoRecibido SET codDoc = @codDoc
                        ,xmlCompressed = COMPRESS(CONVERT(VARBINARY(MAX), @xmlDoc))
					WHERE idDocumento = @idDocumento
				END
			SELECT '1' code, 'Xml Guardado Exitosamente' as 'message'
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

USE AcontPlus
GO
/****** Object:  StoredProcedure [FactElect].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA ACTUALIZAR LOS COMPROBANTES ELECTRONICOS DEL SRI
-- =============================================
IF OBJECT_ID(N'FactElect.ComprobanteImportacionUpdate ', N'P') IS NOT NULL
DROP PROCEDURE FactElect.ComprobanteImportacionUpdate
GO
CREATE PROCEDURE [FactElect].[ComprobanteImportacionUpdate] @idRol INT
,@uniqueId UNIQUEIDENTIFIER
,@codDoc VARCHAr(2)
,@xmlDoc XML
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT

	SELECT @idUsuario = idUsuario FROM AFTDataRol(@idRol)
	--SET @codDoc = (SELECT x.xm.query('./codDoc').value('.', 'NVARCHAR(2)') 
	--FROM @jsonDoc.nodes('/comprobante') AS x(xm))

	IF EXISTS(SELECT * FROM FactElect.ComprobanteImportacion WHERE uniqueId = @uniqueId AND xmlDoc IS NOT NULL)
		BEGIN
			SELECT '0' code, 'El xml ya ha sido actualizado' as 'message'
			RETURN
		END

	BEGIN TRY
		BEGIN TRAN
			
			UPDATE factElect.ComprobanteImportacion SET codDoc = @codDoc, xmlDoc = @xmlDoc
			WHERE uniqueId = @uniqueId

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

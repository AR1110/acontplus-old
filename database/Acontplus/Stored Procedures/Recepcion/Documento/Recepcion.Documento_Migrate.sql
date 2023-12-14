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
IF OBJECT_ID(N'Recepcion.Documento_Migrate', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Documento_Migrate
GO
CREATE PROCEDURE [Recepcion].Documento_Migrate @idUsuarioRol INT 
,@json VARCHAR(MAX)
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	,@xmlComp as XML
	,@codDoc VARCHAR(2)
	,@jsonData NVARCHAR(MAX)
	,@codEstab VARCHAR(50)

	DECLARE @tblMain AS TABLE (jsonData NVARCHAR(3000))

	DECLARE @tbl AS TABLE (idDocumento INT)

	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol
	--insert into @tblMain
	SELECT @jsonData =  jsonData, @codEstab = codEstab FROM OPENJSON(@json) WITH (codEstab VARCHAR(50), [jsonData] NVARCHAR(MAX) '$.jsonData' as json)
	
	INSERT INTO @tbl
	SELECT idDocumento FROM OPENJSON(@jsonData) WITH (idDocumento INT '$.idDocumento')

	BEGIN TRY
		BEGIN TRAN
			UPDATE dr SET dr.codEstab = @codEstab
			FROM Recepcion.DocumentoRecibido dr
			JOIN (SELECT idDocumento FROM @tbl) as t ON dr.idDocumento = t.idDocumento
			WHERE dr.complete = 0
			SELECT '1' code, 'Migración Exitosa' as 'message'
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

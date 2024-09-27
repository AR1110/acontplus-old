USE AcontPlus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA ACTUALIZAR LOS COMPROBANTES ELECTRONICOS DEL SRI
-- =============================================

CREATE OR ALTER PROCEDURE [Recepcion].Documento_Migrate @idUsuarioRol INT 
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	    ,@xmlComp as XML
	    ,@codDoc VARCHAR(2)
	    ,@jsonData NVARCHAR(MAX)
	    ,@codEstab VARCHAR(50)
        ,@idEstablecimiento INT

	DECLARE @tblMain AS TABLE (jsonData NVARCHAR(3000))

	DECLARE @tbl AS TABLE (idDocumento INT)



	BEGIN TRY
        	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol
	        SELECT @jsonData =  jsonData
                ,@codEstab = codEstab 
            FROM OPENJSON(@json) WITH (codEstab VARCHAR(50), [jsonData] NVARCHAR(MAX) '$.jsonData' as json)
	
            SET @idEstablecimiento = (SELECT idEstablecimiento FROM Sri.Establecimiento WITH(NOLOCK) WHERE codEstab = @codEstab)

	        INSERT INTO @tbl
	        SELECT idDocumento FROM OPENJSON(@jsonData) WITH (idDocumento INT '$.idDocumento')
		BEGIN TRAN
			UPDATE dr SET dr.idEstablecimiento = @idEstablecimiento
			FROM Recepcion.DocumentoRecibido dr
			JOIN (SELECT idDocumento FROM @tbl) as t ON dr.idDocumento = t.idDocumento
			WHERE dr.complete = 0
		COMMIT TRAN
        SELECT '1' code, 'Migración Exitosa' as 'message'
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN

		INSERT INTO ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES ('DocumentoRecibido/Migrate', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END

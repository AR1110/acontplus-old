USE AcontPlus
GO 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA ACTUALIZAR LA SUBCATEGORIA
-- =============================================

CREATE OR ALTER PROCEDURE Recepcion.Documento_Update_Subcategory @userRoleId INT
	,@json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT,
		@subcategoryId INT,
		@docsJson VARCHAR(MAX),
		@rowsAffected INT,
		@code VARCHAR(1),
		@message VARCHAR(300)

	DECLARE @docsTable AS TABLE (
		idDocumento INT NOT NULL
	)

	BEGIN TRY 
		SELECT @subcategoryId = subcategoryId, @docsJson = docs FROM OPENJSON (@json) WITH (subcategoryId INT, docs VARCHAR(MAX))
        
		INSERT INTO @docsTable(idDocumento)
		SELECT idDocumento FROM OPENJSON (@docsJson) WITH (idDocumento INT) 

		SELECT @idUsuario = idUsuario FROM v_usuario where idusuariorol = @userRoleId

		BEGIN TRAN
            
            UPDATE dr SET dr.subcategoryId = @subcategoryId
            FROM Recepcion.DocumentoRecibido dr WITH (ROWLOCK)
			    INNER JOIN @docsTable dt ON dr.idDocumento = dt.idDocumento

            UPDATE cpp SET cpp.subcategoryId = @subcategoryId
            FROM Contabilidad.CuentaPorPagar cpp WITH (ROWLOCK)
                INNER JOIN Recepcion.DocumentoRecibido dr WITH (NOLOCK) ON cpp.uniqueId = dr.claveAcceso 
			    INNER JOIN @docsTable dt ON dr.idDocumento = dt.idDocumento

			SET @rowsAffected = @@ROWCOUNT
				IF (@rowsAffected > 0)
					BEGIN
						SELECT @code = '1', @message = 'Actualizada exitosamente'
					END
				ELSE
					BEGIN
						SELECT @code = '0', @message = 'No se actualizo'
					END
		COMMIT TRAN
		SELECT @code as code, @message as 'message'
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos'  as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN 
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoRecibido/PutSubcategory', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END

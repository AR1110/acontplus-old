USE AcontPlus
GO

--- Ventas.Cliente_Update_App 28, 62801, '{"razonSocial":"MANCHU TUMINK DANIS IGNACIO","idClient":62801,"identificacionComprador":"1450130008001","direccionComprador":"Sto Domingo","email":"dani.manchu1998@gmail.com", "telefono": "0961203321"}'
CREATE OR ALTER PROC Ventas.Cliente_Update_App
@idUsuarioRol INT
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
SET NOCOUNT ON;
DECLARE @identificacionComprador VARCHAR(13)
		,@direccionComprador VARCHAR(500)
		,@email VARCHAR(150)
		,@telefono VARCHAR(10)


	BEGIN TRY
		SELECT * 		
		INTO #JsonGet
		FROM OPENJSON(@json)
		WITH(
			idCliente				INT '$.idCliente'
			,numeroIdentificacion	VARCHAR(13)	'$.numeroIdentificacion'
			,direccion			VARCHAR(500)'$.direccion'
			,correo						VARCHAR(150)'$.correo'	
			,telefono					VARCHAR(10)	'$.telefono'
		)

		
		BEGIN TRAN
			IF EXISTS(SELECT TOP 1 1 FROM dbo.Cliente WHERE idCliente = @id)
				BEGIN
					UPDATE cl
					SET cl.correo = j1.correo
						,cl.direccion = j1.direccion
						,cl.telefono  = j1.telefono
					FROM dbo.Cliente cl
					INNER JOIN #JsonGet j1 ON j1.idCliente = cl.idCliente
					WHERE cl.idCliente = @id
				END
		COMMIT TRAN
		SELECT '1' code,'Actualizado Exitosamente' as 'message';
	END TRY 
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN;
		END

		SELECT '0' code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() AS 'message'

		INSERT INTO ErroresSistema (
			token
			,method
			,errorNumber
			,errorSeverity
			,errorState
			,errorProcedure
			,errorLine
			,errorMessage
			,errorDate
			,idUsuario
			)
		VALUES (
			NEWID()
			,'/Cliente/UpdateForApp'
			,ERROR_NUMBER()
			,ERROR_SEVERITY()
			,ERROR_STATE()
			,ERROR_PROCEDURE()
			,ERROR_LINE()
			,ERROR_MESSAGE()
			,GETDATE()
			,@idUsuarioRol
			)
	END CATCH	
END
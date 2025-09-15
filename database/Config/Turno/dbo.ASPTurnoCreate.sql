SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-09-23
-- Description:	SP para registrar turnos y horarios 
-- =============================================
CREATE OR ALTER  PROCEDURE [dbo].[ASPTurnoCreate]
	 @userRoleId INT
	,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	-- Declaración de variables
	DECLARE @idEntidad INT, @idUsuario INT, @idTurno INT, @descripcion NVARCHAR(100), @horarios NVARCHAR(MAX)

	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM AFTDataRol(@userRoleId)

	SELECT @descripcion = descripcion
			, @horarios = horarios
	FROM OPENJSON(@json)
	WITH (
		descripcion NVARCHAR(100) '$.descripcion',
		horarios NVARCHAR(MAX) '$.horarios'
	)

	IF EXISTS (SELECT 1 FROM Turno WHERE descripcion LIKE LTRIM(RTRIM(@descripcion)) AND idEntidad = @idEntidad)
		BEGIN
			SELECT '0', 'Ya se encuentra registrada un Turno con la descripcion: '+@descripcion,''
			RETURN
		END

	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Turno (descripcion, idEntidad , idUsuario)
			SELECT LTRIM(RTRIM(@descripcion)), @idEntidad,@idUsuario

			SET @idTurno = @@IDENTITY

			INSERT INTO Horario
				(idTurno
				,idDia
				,apertura
				,cierre
				,estado)
			SELECT 
				 @idTurno
				,idDia
				,apertura
				,cierre
				,estado
			FROM OPENJSON(@horarios)
			WITH(idDia int '$.idDia'
				,estado bit '$.estado'
				,apertura time '$.apertura'
				,cierre time '$.cierre')
			as jsonValues

		COMMIT TRAN
		SELECT '1','Registrado correctamente',''
		RETURN
	END TRY
	
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN;
		END
		SELECT '0','Error en el procedimiento de agregar' + ERROR_MESSAGE(), 'Turno'
		INSERT INTO ErroresSistema
								   (token
								   ,method
								   ,errorNumber
								   ,errorSeverity 
								   ,errorState
								   ,errorProcedure
								   ,errorLine
								   ,errorMessage
								   ,errorDate
								   ,idUsuario)
							VALUES
									(NEWID()
									,'/TurnoDao/CreateTurnoAsync'
									,ERROR_NUMBER()
									,ERROR_SEVERITY()
									,ERROR_STATE()
									,ERROR_PROCEDURE()
									,ERROR_LINE()
									,ERROR_MESSAGE()
									,GETDATE(), 
									@idUsuario)
	END CATCH 


END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-09-24
-- Description:	SP para actualizar los horarios 
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ASPTurnoUpdate]
	 @userRoleId INT
	 ,@idTurno INT
	 ,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idUsuario INT, @idEntidad INT, @descripcion NVARCHAR(100), @estado BIT, @horarios NVARCHAR(MAX)

	SELECT @idUsuario = idUsuario, @idEntidad = idEntidad FROM AFTDataRol(@userRoleId)

	SELECT @descripcion = descripcion, @estado = estado, @horarios = horarios
	FROM OPENJSON(@json)
	WITH (
		descripcion NVARCHAR(100) '$.descripcion',
		estado BIT '$.estado',
		horarios NVARCHAR(MAX) '$.horarios'
	)

	IF EXISTS (SELECT 1 FROM Turno WHERE descripcion = @descripcion AND idTurno != @idTurno AND idEntidad = @idEntidad)
		BEGIN
			SELECT '0','El Turno: '+@descripcion+' ya se encuentra registrado',''
			RETURN
		END

	BEGIN TRY

		BEGIN TRAN
			 UPDATE Turno SET descripcion = @descripcion, estado = @estado WHERE idTurno = @idTurno

			 UPDATE h SET
				 h.apertura = ja.apertura
				,h.cierre = ja.cierre
				,h.estado = ja.estado
			 FROM Horario h
			 JOIN OPENJSON(@horarios)
			 WITH ( idHorario INT '$.idHorario'
			       ,apertura TIME '$.apertura'
				   ,cierre TIME '$.cierre'
				   ,estado BIT '$.estado')ja
			 ON ja.idHorario = h.idHorario

		COMMIT TRAN
		SELECT '1','Actualizado correctamente', 'Turno'
		RETURN
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN;
		END
		SELECT '0','Error en el procedimiento de actualizar ' + ERROR_MESSAGE(), 'Turno'
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
									,'/Turno/Update'
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

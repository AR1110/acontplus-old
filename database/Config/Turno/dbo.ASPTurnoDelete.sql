SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez - Ignacio Manchu
-- Create date: 2021-09-25
-- Description:	SP para eliminar turno
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[ASPTurnoDelete]
	 @userRoleId INT
	,@idTurno INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH ;
	DECLARE @idUsuario int = (SELECT idUsuario FROM AFTDataRol(@userRoleId))

	IF EXISTS(SELECT 1 FROM Turno WHERE idTurno = @idTurno and estado = 1 )
		BEGIN
			SELECT '0','El Turno se encuentra activo no puede ser eliminado',''
			RETURN
		END 

	BEGIN TRY 
		BEGIN TRAN 
			DELETE FROM Turno WHERE idTurno = @idTurno
		COMMIT TRAN 
		SELECT '1','Eliminado Correctamente',''
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0','Info: Error en el procedimiento de eliminar ' + ERROR_MESSAGE(), 'Turno'
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
									,'/Turno/Delete'
									,ERROR_NUMBER()
									,ERROR_SEVERITY()
									,ERROR_STATE()
									,ERROR_PROCEDURE()
									,ERROR_LINE()
									,ERROR_MESSAGE()
									,GETDATE() 
									,@idUsuario)
	END CATCH 
END
GO

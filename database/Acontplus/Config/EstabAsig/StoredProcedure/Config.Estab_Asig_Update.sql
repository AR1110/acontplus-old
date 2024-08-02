USE [Acontplus]
GO 

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Config.Estab_Asig_Update @userRoleId INT,@id INT 
	
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuarioRol INT,
        @idUsuario INT

	BEGIN TRY
		SELECT @idUsuarioRol = idUsuarioRol FROM Config.Estab_Asig WHERE idEstab_Asig = @id

        SET @idUsuario = (SELECT TOP 1 idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

		BEGIN TRAN 
			UPDATE Config.Estab_Asig SET predeterminado = 0 WHERE idUsuarioRol = @idUsuarioRol

			UPDATE Config.Estab_Asig SET predeterminado = 1 WHERE idEstab_Asig = @id
		COMMIT TRAN 
		SELECT '1' code, 'Actualizado Correctamente' as 'message' 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
        INSERT INTO ErroresSistema
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/EstabAsign/Put',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
		SELECT '0' code, 'Info: Error en el procedimiento' as 'message'
    END CATCH
END
GO

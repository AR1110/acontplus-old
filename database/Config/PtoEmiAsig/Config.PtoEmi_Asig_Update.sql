USE [AcontPlus]
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
CREATE OR ALTER PROCEDURE Config.PtoEmi_Asig_Update @userRoleId INT,@id INT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @codEstab_Asig VARCHAR(150),
         @userId INT;
	
	BEGIN TRY 

		SELECT @codEstab_Asig = codEstab_Asig FROM Config.Bodeg_Asig WITH(NOLOCK) WHERE idBodeg_Asig = @id
        SET @userId = (SELECT TOP 1 idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

		BEGIN TRAN 
			UPDATE Config.PtoEmi_Asig SET predeterminado = 0 WHERE codEstab_Asig = @codEstab_Asig
			UPDATE Config.PtoEmi_Asig SET predeterminado = 1 WHERE idPtoEmi_Asig = @id
		COMMIT TRAN  
        SELECT '1' code,'Actualizada Correctamente' as 'message'
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
          INSERT INTO ErroresSistema
                      (method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,idUsuario)
		  SELECT '/PtoEmi_Asig/Put',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),@userId
		  SELECT '0' code, 'Error en el procedimiento' as 'message' 
	END CATCH
END
GO

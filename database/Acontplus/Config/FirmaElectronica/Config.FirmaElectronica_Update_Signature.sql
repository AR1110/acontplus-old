USE [AcontPlus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2021-11-05
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Config.FirmaElectronica_Update_Signature @userRoleId INT
	,@id INT 
	,@fileName VARCHAR(300)
	,@firma VARBINARY(MAX)
	,@contentType VARCHAR(50)  
AS
BEGIN
	SET NOCOUNT ON; 
    SET XACT_ABORT ON;
    
    DECLARE @userId INT;

	BEGIN TRY
        SET @userId = (SELECT TOP 1 idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId);

		BEGIN TRAN  
			UPDATE dbo.FirmaElectronica SET  
				 nombreArchivo  = @fileName
				,mimeType       = @contentType
				,firma          = @firma
                ,idUsuario      = @userId
			WHERE idFirmaElectronica = @id
		COMMIT TRAN
        SELECT '1'code,'Actualizada exitosamente' as 'message'
	END TRY 

	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
		    ROLLBACK TRAN;  

        INSERT INTO dbo.ErroresSistema
             (method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,idUsuario)
	    SELECT '/FirmaElectronica/PutFile',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(), @userId
	    SELECT '0' code, 'Error en el procedimiento' as 'message'
	END CATCH 
	
END

USE [Acontplus]
GO 
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 8/15/2023
-- Description:	for the management of all data related to the vehicle.
-- =============================================
CREATE OR ALTER PROCEDURE Mechanical.Support_Delete @userRoleId INT ,@id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    --> Global  
	DECLARE @tipo INT ,@CompanyId INT ,@userId INT

    --> Support
    DECLARE @SupportStatusId INT

	BEGIN TRY 
        
        --> Variables Globales
        SELECT TOP 1 @userId = idUsuario ,@CompanyId = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @SupportStatusId = Id from Mechanical.SupportStatus WITH (NOLOCK) WHERE Code = 'PE'

        IF EXISTS (SELECT 1 FROM Mechanical.v_Support WHERE Id = @id AND codeStatus NOT IN ('PE'))
            BEGIN
                SELECT '0' as code, 'El soporte no puede ser editado' as 'message'
                RETURN 
            END 

        BEGIN TRAN 
            
            UPDATE Mechanical.Support WITH (ROWLOCK)
               SET [SupportStatusId] = @SupportStatusId
                  ,UpdatedAt = GETDATE()
            WHERE Id = @id

        COMMIT TRAN 
        SELECT '1' as code, 'Éxitos al Anular' as 'message'
	END TRY 

	BEGIN CATCH
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Support/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT '0' as code, 'Error en el procedimiento' as 'message'
    END CATCH  
END
GO

